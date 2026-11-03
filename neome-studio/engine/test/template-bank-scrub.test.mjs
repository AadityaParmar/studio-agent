// Template bank slice 2: scrub (maintainer/template-bank/scrub.mjs). Runs right after digest, before any model.
// Synthetic fixture only (made-up "Acme Widgets").
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { digestBuild, parseBuild } from "../../maintainer/template-bank/digest.mjs";
import { findLeaks, MSG, parseWordList, scrubFiles, scrubText, seedWordList } from "../../maintainer/template-bank/scrub.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const tb = join(here, "..", "..", "maintainer", "template-bank");
const fixture = join(here, "fixtures", "template-bank", "acme-build.json");
const text = readFileSync(fixture, "utf8");
const ABOUT = parseBuild(text).details.about;
const box = () => mkdtempSync(join(tmpdir(), "neome-tb-scrub-"));
const node = (script, args) => {
  const r = spawnSync(process.execPath, [join(tb, script), ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const terms = (extra = []) => ({ name: "Acme Widgets", about: ABOUT, words: parseWordList(seedWordList({ name: "Acme Widgets", about: ABOUT })).concat(extra) });

test("seed word list: Build name + its words + proper names from about; comments ignored", () => {
  const seed = seedWordList({ name: "Acme Widgets", about: ABOUT });
  assert.match(seed, /^# /m, "explains itself");
  const words = parseWordList(seed);
  assert.deepEqual(words, ["Acme Widgets", "Acme", "Widgets", "Zorbia"]);
  assert.deepEqual(parseWordList("# c\n\n  Bob Smith  \nBob\n#x\n"), ["Bob Smith", "Bob"]);
  assert.deepEqual(parseWordList(seedWordList({ name: "HR App", about: "—" })), ["HR App"], "short / generic words not seeded");
});

test("scrubText: Build name, about, listed words, phone, email gone; message bodies → «msg»; sheet/field names kept", () => {
  const t = terms(["Bob Smith"]);
  const s = scrubText([
    "# Build digest: Acme Widgets",
    `about: ${ABOUT} · version 7`,
    "### Customer — insert@Sales Rep",
    "  - Details: AcmeCode:text, Owner:text, Bob Smith:text",
    "- sendMessageToUsers \"Tell rep\" [msg \"Hi `Bob` order approved\"; to Curr.Approver]",
    "  vanmsg[\"sendMessageToUsers 'Tell rep'  msg 'Hi `Bob` order app…\"]",
    "  vanx[\"sendEmail  msg 'Dear Zorbia team'; to x \"]",
    "call +91 98765 43210 or (555) 010-9999, mail bob.smith@zorbia.example now",
    "- Total = Amount * 1.1 · version 7 · 25 sheets · 1.2 KB",
    "  - logic (1): formula Due = (Start)-86400000 + 1700000000000; on 2026-11-03 call 9876543210",
  ].join("\n"), t);
  const lines = s.split("\n");
  assert.equal(lines[0], "# Build digest: «build»");
  assert.equal(lines[1], "about: «about» · version 7");
  assert.equal(lines[2], "### Customer — insert@Sales Rep", "plain sheet/field names kept");
  assert.equal(lines[3], "  - Details: «name»Code:text, Owner:text, «name»:text", "names holding a listed word lose that word");
  assert.equal(lines[4], `- sendMessageToUsers "Tell rep" [msg ${MSG}; to Curr.Approver]`);
  assert.equal(lines[5], `  vanmsg["sendMessageToUsers 'Tell rep'  msg ${MSG}"]`, "cut Mermaid message too");
  assert.equal(lines[6], `  vanx["sendEmail  msg ${MSG}; to x "]`);
  assert.equal(lines[7], "call «phone» or «phone», mail «email» now");
  assert.equal(lines[8], "- Total = Amount * 1.1 · version 7 · 25 sheets · 1.2 KB", "plain numbers kept");
  assert.equal(lines[9], "  - logic (1): formula Due = (Start)-86400000 + 1700000000000; on 2026-11-03 call «phone»", "constants, epoch ms, dates kept; bare 10-digit mobile gone");
  assert.deepEqual(findLeaks({ "x.md": s }, t), []);
});

test("scrubFiles: whole digest clean, file names scrubbed with links still matching", () => {
  const ent = parseBuild(text);
  ent.groupMap.map["mgp-sales"].details.name = "Acme Sales";
  const d = digestBuild(ent);
  assert.ok("acme-sales.md" in d.files);
  const t = terms();
  const out = scrubFiles(d.files, t);
  assert.ok(!Object.keys(out).some((n) => /acme/i.test(n)));
  assert.ok("«name»-sales.md" in out);
  assert.match(out["overview.md"], /\[«name» Sales\]\(«name»-sales\.md\)/);
  const all = Object.values(out).join("\n");
  for (const w of ["Acme", "Zorbia", "555", "ops@"]) assert.ok(!all.includes(w), `${w} survived`);
  assert.match(all, /msg «msg»/);
  assert.match(out["«name»-sales.md"], /### Order Line \(placed by workflow\)/, "sheet names kept");
  assert.deepEqual(findLeaks(out, t), []);
});

test("HARD FAIL: findLeaks catches a listed word that replace missed (accents, zero-width), message bodies, contacts", () => {
  const t = terms(["Bob Smith"]);
  const leaks = findLeaks({
    "a.md": "ok line\nÁcme Wid​gets builds", // accent + zero-width slip past replace
    "b.mmd": "x msg 'hello'",
    "c.md": "mail me@x.example or +44 20 7946 0958",
    "bob-smith.md": "",
  }, t);
  assert.deepEqual(leaks.map((l) => `${l.file}:${l.line} ${l.what}`), [
    "a.md:2 Build name", "a.md:2 word #1", "a.md:2 word #2", "a.md:2 word #3",
    "b.mmd:1 message body",
    "c.md:1 email", "c.md:1 phone",
    "bob-smith.md:0 word #5",
  ]);
  assert.ok(!leaks.some((l) => /acme|bob/i.test(l.what)), "leak lines name the word by number, not the word");
});

test("CLI: digest → scrub writes raw/scrubbed/<NB-NN>, seeds word list, hard-fails and removes output on a leak", () => {
  const raw = join(box(), "raw");
  const inputs = box();
  writeFileSync(join(inputs, "b.json"), text);
  assert.equal(node("digest.mjs", ["--raw", raw, join(inputs, "b.json")]).code, 0);
  const r = node("scrub.mjs", ["--raw", raw]);
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /^seeded \| NB-01 \| .*scrub\/NB-01\.txt/m);
  assert.match(r.out, /^scrub \| NB-01 \| 10 files clean$/m);
  assert.doesNotMatch(r.out, /Acme|Zorbia/);
  const list = join(raw, "scrub", "NB-01.txt");
  assert.deepEqual(parseWordList(readFileSync(list, "utf8")), ["Acme Widgets", "Acme", "Widgets", "Zorbia"]);
  const out = join(raw, "scrubbed", "NB-01");
  const files = readdirSync(out);
  assert.equal(files.length, 10);
  assert.ok(!files.includes("meta.json"));
  for (const f of files) assert.doesNotMatch(readFileSync(join(out, f), "utf8"), /acme|zorbia/i, f);

  // maintainer adds a word that the digest holds only in an accented spelling → replace misses → hard fail
  const ent = parseBuild(text);
  ent.spreadsheetMap.map["mss-prod"].details.name = "Ünicorn Parts";
  const inp2 = join(inputs, "b.json");
  writeFileSync(inp2, JSON.stringify({ type: "ent", payload: { studioEnt: ent } }));
  assert.equal(node("digest.mjs", ["--raw", raw, inp2]).code, 0);
  writeFileSync(list, readFileSync(list, "utf8") + "Unicorn\n");
  const bad = node("scrub.mjs", ["--raw", raw, "NB-01"]);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /^leak \| NB-01 \| \S+:\d+ \| word #5$/m);
  assert.doesNotMatch(bad.out, /nicorn/);
  assert.ok(!existsSync(out), "leaky output removed");

  assert.equal(node("scrub.mjs", ["--raw", raw, "NB-09"]).code, 1, "unknown Build code");
  assert.equal(node("scrub.mjs", ["--bad"]).code, 2);
});
