// status: what the studio skill shows (ticket 38). Read-only: writes nothing, needs no mmdc, runs no git.
//   status [<repo-root> | <enterprise-dir>] [--who <name>] [--now <ISO time>]   → one line per Engagement
//   status <engagement-dir>                 [--who <name>] [--now <ISO time>]   → that Engagement in full
// --who marks the lock and claims held by that name `yours`; --now fixes the clock (tests).
// Engagement lines, `|`-separated, in this order:
//   engagement | <ent>/<slug> | <title>
//   lock | none   or   lock | <who> | <skill> | <since> | <age>[ | yours]
//   next | draft | claimed | blocked | resolved   (as `module frontier`; claimed + `since <date> | <age>`)
//   gap | <P> | <what is missing>                 (resolved Module without its Prototype)
//   input | <path> | not in the Source register
//   oi | open | … · oi | not asked | … · oi | chased | <OI>: <note> · oi | waiting | …
//   hold | <P> | <who> | <map Note>              (reply answers kept for a claimed Module's holder)
//   brd | <released versions> · brd | preview | <path>
//   release | ready | … / release | blocked | … / release | error | [cls] msg
//   signoff | v<N> | ready / blocked | <why>      (latest released, unsigned)
//   signoff | next | ready / blocked | <why>      (current markdown: what a release now would carry)
//   step | <skill> | <why>                        (next steps; only the six user skills)
// Exit 0; 2 = bad arguments.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, basename, dirname, relative, sep } from "node:path";
import { tables, column, list, sections, bullets, firstHeading, isEmpty } from "./markdown.mjs";
import { parse, usage, readLock } from "./ingest.mjs";
import { frontierReport } from "./modules.mjs";
import { validateEngagement, versionsOf } from "./build-brd.mjs";
import { changeLog } from "./brd/changelog.mjs";
import { signOffBlockers } from "./brd/signoff.mjs";

const USE = "status [<repo-root> | <enterprise-dir> | <engagement-dir>] [--who <name>] [--now <ISO time>]";
export const USER_SKILLS = ["studio", "ingest", "review-draft", "resolve-module", "questionnaire", "build-brd"];
const MAX_ERRORS = 5;

export function status(args) {
  const { pos, opts, problem } = parse(args, ["who", "now"]);
  if (problem) return usage(problem, USE);
  if (pos.length > 1) return usage(`status: one folder at most (got ${pos.length})`, USE);
  const now = opts.now ? Date.parse(opts.now) : Date.now();
  if (Number.isNaN(now)) return usage(`status: --now "${opts.now}" is not a time`, USE);
  const ctx = { who: opts.who?.trim() || null, now, out: [] };
  const dir = resolve(pos[0] ?? process.cwd());
  if (existsSync(join(dir, "_agent", "map.md"))) engagement(ctx, dir);
  else if (existsSync(join(dir, "enterprises"))) overview(ctx, readdirs(join(dir, "enterprises")).map((e) => join(dir, "enterprises", e)));
  else if (existsSync(join(dir, "engagements")) || existsSync(join(dir, "_agent", "sources.md"))) overview(ctx, [dir]);
  else return usage(`status: ${dir} is not the repo root, an Enterprise or an Engagement folder`, USE);
  for (const l of ctx.out) console.log(l);
  return 0;
}

const line = (ctx, ...cells) => ctx.out.push(cells.filter((c) => c !== null && c !== undefined && c !== "").join(" | "));
const step = (ctx, skill, why) => {
  if (!USER_SKILLS.includes(skill)) throw new Error(`status: step names "${skill}", not a user skill`);
  line(ctx, "step", skill, why);
};
const readdirs = (d) => (existsSync(d) ? readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort() : []);
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

function age(ms) {
  if (!(ms >= 0)) return "age unknown";
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

// ---- every Engagement, one line each ----

function overview(ctx, entDirs) {
  let engagements = 0;
  let fresh = 0;
  for (const ent of entDirs) {
    const slugs = readdirs(join(ent, "engagements")).filter((s) => existsSync(join(ent, "engagements", s, "_agent", "map.md")));
    const inputs = unregistered(ent);
    fresh += inputs.length;
    if (!slugs.length) line(ctx, "enterprise", basename(ent), "no Engagement yet", inputs.length ? `${inputs.length} Input(s) waiting` : null);
    else if (inputs.length) line(ctx, "enterprise", basename(ent), `${inputs.length} new Input(s) not registered yet`);
    if (!slugs.length) continue;
    for (const slug of slugs) {
      engagements++;
      const dir = join(ent, "engagements", slug);
      const mapText = read(join(dir, "_agent", "map.md"));
      const { lines } = frontierReport(dir);
      const count = (k) => lines.filter((l) => l.startsWith(`${k} |`)).length;
      const parts = ["next", "claimed", "draft", "blocked", "resolved"].map((k) => [k, count(k)]).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`);
      const lock = readLock(mapText);
      const open = openItems(dir).filter((o) => o.status === "open").length;
      line(
        ctx, "engagement", `${basename(ent)}/${slug}`, title(mapText),
        `Modules: ${parts.join(", ") || "none"}`, `${open} open Open Item(s)`,
        lock ? `lock: ${lock.who} · ${lock.skill} · ${lock.since}` : "no lock",
      );
    }
  }
  line(ctx, "status", `${engagements} Engagement(s)`);
  if (fresh) step(ctx, "ingest", `${fresh} Input(s) waiting to be registered`);
  else if (!engagements) step(ctx, "ingest", "first run: drop the Enterprise's Inputs in enterprises/<ent>/inputs/, then name the Enterprise and Engagement");
}

const title = (mapText) => (firstHeading(mapText) ?? "").replace(/^map:\s*/i, "");

// ---- one Engagement ----

function engagement(ctx, dir) {
  const agent = join(dir, "_agent");
  const ent = dirname(dirname(dir));
  const mapText = read(join(agent, "map.md"));
  line(ctx, "engagement", `${basename(ent)}/${basename(dir)}`, title(mapText));

  const lock = readLock(mapText);
  if (lock) line(ctx, "lock", lock.who, lock.skill, lock.since, age(ctx.now - Date.parse(lock.since)), lock.who === ctx.who ? "yours" : null);
  else line(ctx, "lock", "none");

  // Modules: frontier view, claims with since (from the map change log), Prototype gaps.
  const { lines, modules } = frontierReport(dir);
  const log = sections(mapText, 2).find((s) => /^change log/i.test(s.title))?.body ?? "";
  for (const l of lines) {
    const claimed = l.match(/^claimed \| ([A-Z]{2,5}) \| .* \| by (.+)$/);
    if (!claimed) {
      line(ctx, l);
      continue;
    }
    const dates = [...log.matchAll(new RegExp(`^- (\\d{4}-\\d{2}-\\d{2}): resolve-module: ${claimed[1]} claimed by `, "gm"))].map((m) => m[1]);
    const since = dates.pop();
    line(ctx, l, since ? `since ${since}` : "since unknown", since ? age(ctx.now - Date.parse(`${since}T00:00Z`)) : null, claimed[2] === ctx.who ? "yours" : null);
  }
  for (const m of modules.filter((m) => m.fm.status === "resolved")) {
    const missing = [!m.hasData && `modules/${m.folder}/prototype-data.json`, !m.hasView && `prototypes/${m.folder}.html`].filter(Boolean);
    if (missing.length) line(ctx, "gap", m.prefix, `resolved without its Prototype: ${missing.join(", ")} missing`);
  }

  // Inputs dropped since the last ingest.
  const inputs = unregistered(ent);
  for (const p of inputs) line(ctx, "input", p, "not in the Source register");

  // Open Items.
  const ois = openItems(dir).filter((o) => o.status === "open");
  const enterprise = ois.filter((o) => o.owner === "enterprise");
  const notAsked = enterprise.filter((o) => !o.askedIn.length);
  const chased = enterprise.filter((o) => o.askedIn.length && o.note);
  const waiting = enterprise.filter((o) => o.askedIn.length && !o.note);
  line(ctx, "oi", "open", `${ois.length} (Enterprise ${enterprise.length}, Neomenta ${ois.length - enterprise.length})`);
  if (notAsked.length) line(ctx, "oi", "not asked", notAsked.map((o) => o.id).join(", "));
  for (const o of chased) line(ctx, "oi", "chased", `${o.id}: ${o.note}`);
  if (waiting.length) line(ctx, "oi", "waiting", `${waiting.map((o) => o.id).join(", ")} (asked in ${[...new Set(waiting.flatMap((o) => o.askedIn))].join(", ")})`);

  // Reply answers held for a claimed Module's holder (ingest reply loop).
  const notes = sections(mapText, 2).find((s) => /^notes/i.test(s.title))?.body ?? "";
  for (const b of bullets(notes)) {
    const h = b.match(/^QA-\d+ answers OI-\d+ \(([A-Z]{2,5}), claimed by ([^)]+)\)/);
    if (!h) continue;
    const st = modules.find((m) => m.prefix === h[1])?.fm.status;
    line(ctx, "hold", h[1], h[2], b, st && st !== "claimed" ? `(Module now ${st})` : null);
  }

  const brd = readiness(ctx, dir);
  steps(ctx, { lines, modules, inputs, notAsked, chased, brd });
}

// Open Items register rows, with the optional `note` column the reply loop writes.
function openItems(dir) {
  const t = tables(read(join(dir, "_agent", "open-items.md"))).find((t) => column(t, "id") && column(t, "question"));
  if (!t) return [];
  const c = (n) => column(t, n);
  return t.rows.map((r) => ({
    id: r[c("id")],
    owner: String(r[c("owner")] ?? "").trim().toLowerCase(),
    status: String(r[c("status")] ?? "").trim().toLowerCase(),
    askedIn: list(r[c("asked in")] ?? ""),
    note: t.headers.includes("note") && !isEmpty(r.note) ? r.note : "",
  }));
}

// Files in inputs/ and confidential/ that no Source register row points at.
function unregistered(ent) {
  const reg = tables(read(join(ent, "_agent", "sources.md"))).find((t) => column(t, "id") && column(t, "file"));
  const files = new Set((reg?.rows ?? []).map((r) => String(r[column(reg, "file")] ?? "").trim()).filter(Boolean));
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        const rel = relative(ent, p).split(sep).join("/");
        if (!files.has(rel)) out.push(rel);
      }
    }
  };
  walk(join(ent, "inputs"));
  walk(join(ent, "confidential"));
  return out.sort();
}

// BRD readiness: released versions, a release check of the current markdown, Sign-off preconditions.
function readiness(ctx, dir) {
  const v = versionsOf(dir);
  const snaps = [...v.nums].sort((a, b) => a - b).map((n) => ({ n, data: JSON.parse(read(v.file(n))) }));
  line(ctx, "brd", snaps.length ? snaps.map((s) => `v${s.n} ${s.data.engagement.status} ${s.data.engagement.date ?? ""}`.trim()).join(", ") : "no released version");
  if (existsSync(join(dir, "brd", "preview.html"))) line(ctx, "brd", "preview", "brd/preview.html");

  const latest = snaps.at(-1) ?? null;
  let latestBlockers = null;
  if (latest && latest.data.engagement.status !== "signed-off") {
    latestBlockers = signOffBlockers(latest.data);
    if (!latestBlockers.length) line(ctx, "signoff", `v${latest.n}`, "ready");
    for (const b of latestBlockers) line(ctx, "signoff", `v${latest.n}`, "blocked", b.msg);
  }

  const r = validateEngagement(dir, { release: true });
  const n = r.data.engagement.version;
  let changes = null;
  let blockers = null;
  if (r.errors.length) {
    line(ctx, "release", "blocked", `${r.errors.length} error(s), ${r.warnings.length} warning(s)`);
    for (const e of r.errors.slice(0, MAX_ERRORS)) line(ctx, "release", "error", `[${e.cls}] ${e.msg}`);
    if (r.errors.length > MAX_ERRORS) line(ctx, "release", "error", `${r.errors.length - MAX_ERRORS} more (build-brd lists all)`);
  } else {
    // After a Sign-off, items it accepted show as confirmed / agreed: logged, but not new work.
    const all = changeLog(r.prev, r.data);
    const accepted = r.prev?.engagement.status === "signed-off" ? all.filter((c) => c.fields?.length === 1 && c.fields[0] === "proposed").length : 0;
    changes = all.length - accepted;
    line(
      ctx, "release", "ready",
      `v${n} would log ${all.length} change(s) since ${r.prev ? `v${n - 1}` : "start"}${accepted ? ` (${accepted} only accepted at Sign-off)` : ""}`,
      `${r.warnings.length} warning(s)`,
    );
    blockers = signOffBlockers(r.data);
    if (!blockers.length) line(ctx, "signoff", "next", "ready");
    for (const b of blockers) line(ctx, "signoff", "next", "blocked", b.msg);
  }
  return { latest, latestBlockers, errors: r.errors.length, changes, blockers, n };
}

// Next steps, most urgent first. Only the six user skills.
function steps(ctx, { lines, modules, inputs, notAsked, chased, brd }) {
  const live = modules.filter((m) => !/^merged-into/.test(String(m.fm.status ?? "")));
  if (inputs.length) step(ctx, "ingest", `${inputs.length} new Input(s) not registered yet`);
  if (!live.length) {
    step(ctx, "ingest", "no Modules yet: drop Inputs in inputs/, then ingest drafts them");
    return;
  }
  const drafts = lines.filter((l) => l.startsWith("draft |")).map((l) => l.split(" | ")[1]);
  if (drafts.length) step(ctx, "review-draft", `draft Module(s) to confirm: ${drafts.join(", ")} (fresh session)`);
  const next = lines.filter((l) => l.startsWith("next |")).map((l) => {
    const [, p, , st] = l.split(" | ");
    return st === "needs-revisit" ? `${p} (revisit)` : p;
  });
  if (next.length) step(ctx, "resolve-module", `next: ${next.join(", ")} (one per session)`);
  if (notAsked.length || chased.length) {
    const parts = [notAsked.length && `${notAsked.length} not asked yet`, chased.length && `${chased.length} to chase`].filter(Boolean);
    step(ctx, "questionnaire", `Enterprise Open Items: ${parts.join(", ")}`);
  }
  const allResolved = live.every((m) => m.fm.status === "resolved" && m.fm.draft !== true);
  const signed = brd.latest?.data.engagement.status === "signed-off";
  if (brd.errors) step(ctx, "build-brd", `preview shows the ${brd.errors} error(s) to fix and which skill fixes each`);
  else if (allResolved && (!brd.latest || brd.changes > 0)) {
    step(ctx, "build-brd", `release v${brd.n}${brd.blockers.length ? ` (${brd.blockers.length} Sign-off blocker(s) to settle before signing)` : " (ready for Sign-off once released)"}`);
  } else if (brd.latest && !signed && brd.latestBlockers?.length === 0) {
    step(ctx, "build-brd", `sign-off v${brd.latest.n} once its signed copy is in inputs/ and ingested`);
  } else if (signed && brd.changes === 0) {
    line(ctx, "done", `v${brd.latest.n} signed off; nothing changed since`);
  } else {
    step(ctx, "build-brd", "preview any time to share progress");
  }
}
