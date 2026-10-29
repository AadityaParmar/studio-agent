// build-brd <engagement-dir> [--mode preview|release|sign-off] [--summary "..."]
//   [--signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>"] [--evidence <SourceID>]
// Builds the BRD data file from an Engagement's _agent/ markdown and validates it,
// then renders the page (with static diagram SVGs from the pinned mmdc) from that data only.
// Preview: writes _agent/brd/brd-data.json and brd/preview.html (unnumbered working draft).
// Release: freezes the next integer version: _agent/brd/versions/v<N>.json + brd/v<N>.html,
// with the change log diffed from v<N-1> and the Consultant's summary line.
// Sign-off: stamps the latest released v<N> once (Enterprise signer, Neomenta signer, evidence Source),
// re-renders it, and from then on it never changes. Preview and release builds after a Sign-off clear
// `proposed` on every item the latest signed version accepted (if unchanged since).
// --check: dry run of any mode: read + validate, print problems, write nothing, no mmdc needed.
//   preview (ingest and other skills use it); release (summary optional): also lists the change-log lines
//   v<N> would get and notes what would block its Sign-off; sign-off (signers / evidence optional):
//   checks the latest released version against the Sign-off preconditions (and the evidence Source if given).
// Nothing is written when there are errors. A missing or wrong-version mmdc fails before anything is read or written.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readEngagement, readRegister, citedSources } from "./brd/read-engagement.mjs";
import { schemaErrors, crossRefErrors, completeness, releaseWarnings, glossaryWarnings, SCHEMA_VERSION } from "./brd/validate.mjs";
import { renderBrdHtml } from "./brd/render-html.mjs";
import { findMmdc, checkMmdc, diagramSources, renderDiagrams, MERMAID_CLI_PIN } from "./brd/diagrams.mjs";
import { changeLog } from "./brd/changelog.mjs";
import { signOffBlockers, signOffBlock, applySignedOff, proposedItems } from "./brd/signoff.mjs";

const MODES = ["preview", "release", "sign-off"];
const USAGE =
  'Usage: build-brd <engagement-dir> [--mode preview|release|sign-off] [--check] [--summary "..."]\n' +
  '       [--signers "<name> | <role> | <YYYY-MM-DD>" "<name> | <role> | <YYYY-MM-DD>"] [--evidence <SourceID>]\n' +
  "       (sign-off: Enterprise signer first, then Neomenta signer)";

export function buildBrd(args) {
  const { dir, mode, summary, signers, evidence, checkOnly, problem } = parseArgs(args);
  if (problem) {
    console.error(`${problem}\n${USAGE}`);
    return 2;
  }
  if (!existsSync(join(dir, "_agent"))) {
    console.error(`build-brd: ${dir} is not an Engagement folder (no _agent/)`);
    return 2;
  }
  const mmdc = checkOnly ? null : findMmdc(dir);
  const setup = checkOnly ? null : checkMmdc(mmdc);
  if (setup) {
    console.error(`error [${setup.cls}] ${setup.msg}`);
    return 1;
  }
  if (mode === "sign-off") return signOff(dir, signers, evidence, mmdc, checkOnly);

  const release = mode === "release";
  const { data, meta, prev, cleared, signed, errors, warnings, exists } = validateEngagement(dir, { release, summary });
  if (cleared.length) console.log(`build-brd: v${signed.engagement.version} is signed off; ${cleared.length} item(s) accepted then are no longer proposed`);
  if (exists) {
    console.error(`build-brd: v${data.engagement.version} already exists; released versions never change`);
    return 1;
  }

  for (const w of warnings) console.error(`warning [${w.cls}] ${w.msg}`);
  for (const e of errors) console.error(`error [${e.cls}] ${e.msg}`);
  if (errors.length) {
    console.error(`build-brd: ${errors.length} error(s); ${checkOnly ? "check failed" : release ? "BRD version not released" : "BRD data file not written"}`);
    return 1;
  }
  if (checkOnly && release) return checkRelease(data, prev, warnings);
  if (checkOnly) {
    console.log(`build-brd: check passed (${warnings.length} warning(s)); nothing written`);
    return 0;
  }
  if (release) return writeRelease(dir, data, prev, mmdc, warnings);

  const out = join(dir, "_agent", "brd", "brd-data.json");
  mkdirSync(join(dir, "_agent", "brd"), { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
  console.log(`build-brd: wrote ${out} (${warnings.length} warning(s))`);

  // The page is rendered from the data file as written, never from the markdown.
  const written = JSON.parse(readFileSync(out, "utf8"));
  const drawn = renderDiagrams(diagramSources(written), mmdc);
  if (drawn.error) {
    console.error(`error [${drawn.error.cls}] ${drawn.error.msg}`);
    console.error("build-brd: BRD page not written");
    return 1;
  }
  const page = join(dir, "brd", "preview.html");
  mkdirSync(join(dir, "brd"), { recursive: true });
  writeFileSync(page, renderBrdHtml(written, drawn.svgs));
  console.log(`build-brd: wrote ${page}`);
  return 0;
}

// Reads the Engagement's _agent/ markdown and validates it as a build of that mode would: writes nothing,
// needs no mmdc. Release: the data gets the next version number and its change-log entry, `prev` = v<N-1>.
// Used by every build and by `status` (BRD readiness).
export function validateEngagement(dir, { release = false, summary = null } = {}) {
  const { data, meta, register, errors: parseErrors } = readEngagement(dir, {
    schemaVersion: SCHEMA_VERSION,
    date: today(),
  });
  // After a Sign-off, what the Enterprise accepted is no longer proposed.
  const signed = latestSigned(dir);
  let cleared = [];
  if (signed) {
    cleared = applySignedOff(data, signed);
    const cited = new Set(citedSources(data));
    data.sources = register.filter((s) => s.engagements.includes(data.engagement.slug) || cited.has(s.id));
  }
  let prev = null;
  let exists = false;
  if (release) {
    const v = versionsOf(dir);
    const n = v.latest + 1;
    if (v.latest) prev = JSON.parse(readFileSync(v.file(v.latest), "utf8"));
    exists = existsSync(v.file(n)) || existsSync(join(dir, "brd", `v${n}.html`));
    data.engagement.version = n;
    data.engagement.status = "draft-for-review";
    data.changelog = [
      ...(prev?.changelog ?? []),
      // A check may run before the Consultant has given the summary line.
      { version: n, date: data.engagement.date, status: "draft-for-review", summary: summary ?? "(summary at release)", changes: [] },
    ];
  }
  const errors = [...parseErrors, ...schemaErrors(data)];
  const warnings = [];
  // Cross-references and completeness need a well-formed file.
  if (errors.length === 0) {
    errors.push(...crossRefErrors(data, register));
    const c = completeness(data, meta, { release });
    errors.push(...c.errors);
    warnings.push(...c.warnings, ...glossaryWarnings(data));
    if (release) warnings.push(...releaseWarnings(data));
  }
  return { data, meta, register, prev, signed, cleared, errors, warnings, exists };
}

// Release: diff against v<N-1>, then write the frozen snapshot and page together.
// Diagrams are drawn first so a failed render leaves no half-released version.
function writeRelease(dir, data, prev, mmdc, warnings) {
  const n = data.engagement.version;
  data.changelog.at(-1).changes = changeLog(prev, data);
  const problems = schemaErrors(data);
  if (problems.length) {
    for (const e of problems) console.error(`error [${e.cls}] change log: ${e.msg}`);
    console.error("build-brd: BRD version not released");
    return 1;
  }
  const json = JSON.stringify(data, null, 2) + "\n";
  const frozen = JSON.parse(json);
  const drawn = renderDiagrams(diagramSources(frozen), mmdc);
  if (drawn.error) {
    console.error(`error [${drawn.error.cls}] ${drawn.error.msg}`);
    console.error("build-brd: BRD version not released");
    return 1;
  }
  const snapshot = join(dir, "_agent", "brd", "versions", `v${n}.json`);
  const page = join(dir, "brd", `v${n}.html`);
  mkdirSync(join(dir, "_agent", "brd", "versions"), { recursive: true });
  mkdirSync(join(dir, "brd"), { recursive: true });
  writeFileSync(snapshot, json);
  writeFileSync(page, renderBrdHtml(frozen, drawn.svgs));
  const changes = data.changelog.at(-1).changes.length;
  console.log(`build-brd: released v${n} (${changes} change(s) since ${prev ? `v${n - 1}` : "start"}, ${warnings.length} warning(s))`);
  console.log(`build-brd: wrote ${snapshot}`);
  console.log(`build-brd: wrote ${page}`);
  return 0;
}

// Release dry run: the change-log lines v<N> would get, and what would block its Sign-off (info only).
function checkRelease(data, prev, warnings) {
  const n = data.engagement.version;
  const changes = changeLog(prev, data);
  for (const c of changes) console.log(`change: ${c.text}`);
  for (const b of signOffBlockers(data)) console.log(`note [${b.cls}] ${b.msg}`);
  console.log(
    `build-brd: check passed: v${n} would have ${changes.length} change(s) since ${prev ? `v${n - 1}` : "start"} (${warnings.length} warning(s)); nothing written`,
  );
  return 0;
}

// Sign-off: stamp the latest released v<N> once, then it is frozen.
// Checks run on the snapshot (what the Enterprise read), not on the markdown.
// checkOnly: same checks (evidence only when given), nothing written.
function signOff(dir, signers, evidence, mmdc, checkOnly = false) {
  const v = versionsOf(dir);
  if (!v.latest) {
    console.error("build-brd: no released BRD version to sign off; release one first (--mode release)");
    return 1;
  }
  const n = v.latest;
  const data = JSON.parse(readFileSync(v.file(n), "utf8"));
  if (data.engagement.status === "signed-off") {
    console.error(`build-brd: v${n} is already signed off; signed versions never change. Put later changes in a new version (--mode release)`);
    return 1;
  }
  const { register, errors } = readRegister(dir);
  const source = register.find((s) => s.id === evidence);
  if (!errors.length && !source && !(checkOnly && !evidence)) {
    errors.push({ cls: "missing-source", msg: `evidence Source ${evidence} is not in the Source register (ingest the signed copy or approval first)` });
  }
  errors.push(...signOffBlockers(data));
  for (const e of errors) console.error(`error [${e.cls}] ${e.msg}`);
  if (errors.length) {
    console.error(`build-brd: ${errors.length} error(s); ${checkOnly ? `v${n} cannot be signed off` : `v${n} not signed off`}`);
    return 1;
  }
  if (checkOnly) {
    const open = data.openItems.filter((o) => o.status === "open").length;
    console.log(
      `build-brd: check passed: v${n} can be signed off (${open} Open Item(s) open, ${proposedItems(data).length} proposed item(s) would be accepted${evidence ? "" : "; evidence Source not checked"}); nothing written`,
    );
    return 0;
  }

  data.engagement.status = "signed-off";
  // The next release copies change-log entries as stored, so the signed entry carries its own status.
  const entry = data.changelog.find((c) => c.version === n);
  if (entry) entry.status = "signed-off";
  data.signOff = signOffBlock(data, { enterpriseSigner: signers[0], neomentaSigner: signers[1], evidence });
  if (!data.sources.some((s) => s.id === evidence)) data.sources.push(source);
  const problems = schemaErrors(data);
  if (problems.length) {
    for (const e of problems) console.error(`error [${e.cls}] sign-off: ${e.msg}`);
    console.error(`build-brd: v${n} not signed off`);
    return 1;
  }
  const json = JSON.stringify(data, null, 2) + "\n";
  const frozen = JSON.parse(json);
  const drawn = renderDiagrams(diagramSources(frozen), mmdc);
  if (drawn.error) {
    console.error(`error [${drawn.error.cls}] ${drawn.error.msg}`);
    console.error(`build-brd: v${n} not signed off`);
    return 1;
  }
  const page = join(dir, "brd", `v${n}.html`);
  mkdirSync(join(dir, "brd"), { recursive: true });
  writeFileSync(v.file(n), json);
  writeFileSync(page, renderBrdHtml(frozen, drawn.svgs));
  const s = data.signOff;
  console.log(`build-brd: signed off v${n} (${s.openAtSignOff.length} Open Item(s) open at sign-off, ${s.acceptedProposed.length} proposed item(s) accepted)`);
  console.log(`build-brd: wrote ${v.file(n)}`);
  console.log(`build-brd: wrote ${page}`);
  return 0;
}

// mmdc-check [<dir>]: is the pinned Mermaid CLI installed? Same lookup and message as a real build,
// so a skill can find a missing / wrong mmdc before it takes the Engagement lock. Reads and writes nothing else.
export function mmdcCheck(args) {
  if (args.length > 1) {
    console.error("Usage: mmdc-check [<dir>]");
    return 2;
  }
  const bin = findMmdc(args[0] ?? process.cwd());
  const problem = checkMmdc(bin);
  if (problem) {
    console.error(`error [${problem.cls}] ${problem.msg}`);
    return 1;
  }
  console.log(`mmdc-check: Mermaid CLI ${MERMAID_CLI_PIN} (pinned) at ${bin}`);
  return 0;
}

// Released versions = _agent/brd/versions/v<N>.json. latest = 0 when none.
export function versionsOf(dir) {
  const folder = join(dir, "_agent", "brd", "versions");
  const nums = existsSync(folder)
    ? readdirSync(folder).map((f) => f.match(/^v([1-9]\d*)\.json$/)).filter(Boolean).map((m) => Number(m[1]))
    : [];
  return { latest: nums.length ? Math.max(...nums) : 0, nums: nums.sort((a, b) => b - a), file: (k) => join(folder, `v${k}.json`) };
}

// Latest signed-off snapshot, or null.
export function latestSigned(dir) {
  const v = versionsOf(dir);
  for (const k of v.nums) {
    const snap = JSON.parse(readFileSync(v.file(k), "utf8"));
    if (snap.engagement?.status === "signed-off") return snap;
  }
  return null;
}

function parseArgs(args) {
  let dir = null;
  let mode = "preview";
  let summary = null;
  let signers = null;
  let evidence = null;
  let checkOnly = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--check") checkOnly = true;
    else if (args[i] === "--signers") signers = [args[++i], args[++i]];
    else if (args[i] === "--evidence") evidence = args[++i] ?? "";
    else if (args[i].startsWith("--evidence=")) evidence = args[i].slice(11);
    else if (args[i] === "--mode") mode = args[++i];
    else if (args[i].startsWith("--mode=")) mode = args[i].slice(7);
    else if (args[i] === "--summary") summary = args[++i] ?? "";
    else if (args[i].startsWith("--summary=")) summary = args[i].slice(10);
    else if (!dir) dir = args[i];
    else return { problem: `build-brd: unexpected argument "${args[i]}"` };
  }
  if (!dir) return { problem: "build-brd: engagement folder missing" };
  if (!MODES.includes(mode)) return { problem: `build-brd: unknown mode "${mode}"` };
  if (mode === "release" && !checkOnly && !summary?.trim()) return { problem: 'build-brd: release needs --summary "<one line: why this version>"' };
  if (mode !== "release" && summary !== null) return { problem: "build-brd: --summary is only for --mode release" };
  if (mode !== "sign-off" && (signers !== null || evidence !== null)) return { problem: "build-brd: --signers and --evidence are only for --mode sign-off" };
  if (mode === "release" && summary !== null && !summary.trim()) return { problem: 'build-brd: --summary is empty; give one line: why this version' };
  if (mode === "sign-off") {
    if (!signers && checkOnly) {
      if (evidence !== null && !evidence.trim()) return { problem: "build-brd: --evidence is empty" };
      return { dir, mode, checkOnly, signers: null, evidence: evidence?.trim() || null };
    }
    if (!signers) return { problem: "build-brd: sign-off needs --signers (Enterprise signer, then Neomenta signer)" };
    const parsed = signers.map(parseSigner);
    const bad = parsed.findIndex((s) => !s);
    if (bad >= 0) {
      return { problem: `build-brd: ${bad ? "Neomenta" : "Enterprise"} signer must be "<name> | <role> | <YYYY-MM-DD>" (got "${signers[bad] ?? ""}")` };
    }
    if (!evidence?.trim() && !checkOnly) return { problem: "build-brd: sign-off needs --evidence <SourceID> (the signed copy or approval, ingested as a Source)" };
    if (evidence !== null && !evidence.trim()) return { problem: "build-brd: --evidence is empty" };
    return { dir, mode, checkOnly, signers: parsed, evidence: evidence?.trim() || null };
  }
  return { dir, mode, checkOnly, summary: summary?.trim().replace(/\s+/g, " ") ?? null };
}

// "Asha Rao | Sales head | 2026-10-28" → { name, role, date }, or null.
function parseSigner(text) {
  const parts = (text ?? "").split("|").map((x) => x.trim().replace(/\s+/g, " "));
  if (parts.length !== 3 || !parts[0] || !parts[1] || !isDate(parts[2])) return null;
  return { name: parts[0], role: parts[1], date: parts[2] };
}

function isDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
