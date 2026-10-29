// BRD diagrams: BRD data file → Mermaid text → pinned mmdc → static SVG.
// Mermaid text is derived here on every build, never stored.
// One mmdc run (one headless Chrome) renders every diagram of a build from a markdown file.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Same exact version as @mermaid-js/mermaid-cli in the repo package.json (a test keeps them equal).
export const MERMAID_CLI_PIN = "12.0.0";

const here = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = join(here, "..", "..", "reference", "fonts");
// Placeholder SVG id from mmdc; replaced per diagram (and per screen / print copy) so ids never clash.
const SVG_ID = "neome-diagram";

// BRD tokens (page.css): Neome blue borders, grey lines, orange for open, grey for externals.
const T = {
  ink: "#1C1C1E", ink500: "#595959", ink400: "#8A8A8E", ink300: "#C7C7C5",
  line: "#D8D8D4", base: "#F7F7F7", card: "#FFFFFF", neome: "#1877D5", accent: "#F47100",
  extFill: "#F2F2F0", openFill: "#FFFBF6",
};
const FONT = "'Schibsted Grotesk', system-ui, sans-serif";

export const MERMAID_CONFIG = {
  theme: "base",
  look: "classic",
  deterministicIds: true,
  deterministicIDSeed: "neome-brd",
  securityLevel: "strict",
  themeVariables: {
    fontFamily: FONT,
    fontSize: "13px",
    background: T.card,
    primaryColor: T.card,
    primaryBorderColor: T.neome,
    primaryTextColor: T.ink,
    secondaryColor: T.base,
    tertiaryColor: T.base,
    lineColor: T.ink400,
    textColor: T.ink,
    clusterBkg: T.base,
    clusterBorder: T.line,
    titleColor: T.ink500,
    edgeLabelBackground: T.card,
    labelBackgroundColor: T.card,
    stateBkg: T.card,
    stateLabelColor: T.ink,
    stateBorder: T.neome,
    transitionColor: T.ink400,
    transitionLabelColor: T.ink500,
    compositeBackground: T.base,
  },
  flowchart: { curve: "basis", padding: 12, nodeSpacing: 30, rankSpacing: 40 },
  state: { padding: 8 },
};

const OPEN = `fill:${T.openFill},stroke:${T.accent},stroke-dasharray:5 3,color:${T.accent}`;
const EXT = `fill:${T.extFill},stroke:${T.ink300},color:${T.ink500}`;

// ---------- Mermaid text ----------

// Mermaid-safe label text: inline markdown markers dropped, special characters as Mermaid entities.
function label(s) {
  return String(s ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\*\*|`/g, "")
    .replace(/(^|\W)[*_]([^*_]+)[*_](?=\W|$)/g, "$1$2")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#"<>;:|{}[\]()]/g, (c) => `#${c.charCodeAt(0)};`)
    .trim();
}
const q = (s) => `"${s}"`;
const nid = (kind, id) => `${kind}_${id.replace(/-/g, "_")}`;
const humanize = (id) => id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");

// End-to-end process: flowchart TB, subgraph per lane, steps tagged with their Module prefix.
export function processMermaid(process) {
  const { lanes, steps, edges } = process;
  if (!steps.length) return null;
  const out = ["flowchart TB"];
  const laneIds = new Set(lanes.map((l) => l.id));
  const laneOf = [...lanes, ...[...new Set(steps.map((s) => s.lane))].filter((id) => !laneIds.has(id)).map((id) => ({ id, name: id }))];
  for (const lane of laneOf) {
    const own = steps.filter((s) => s.lane === lane.id);
    if (!own.length) continue;
    const title = label(lane.name) + (lane.oi ? ` · ${lane.oi}` : "");
    out.push(`  subgraph ${nid("lane", lane.id)}[${q(title)}]`, "    direction TB");
    for (const s of own) {
      const head = [s.module, label(s.label)].filter(Boolean).join(" · ") + (s.oi ? ` · ${s.oi}` : "");
      const text = q(s.note ? `${head}<br/><small>${label(s.note)}</small>` : head);
      out.push(`    ${nid("step", s.id)}${s.kind === "decision" ? `{${text}}` : `[${text}]`}`);
    }
    out.push("  end");
  }
  for (const e of edges) {
    const arrow = e.alternate ? "-.->" : "-->";
    out.push(`  ${nid("step", e.from)} ${arrow}${e.label ? `|${q(label(e.label))}|` : ""} ${nid("step", e.to)}`);
  }
  out.push(`  classDef ext ${EXT}`, `  classDef open ${OPEN}`);
  const ext = steps.filter((s) => s.kind === "external" && !s.oi).map((s) => nid("step", s.id));
  const open = steps.filter((s) => s.oi).map((s) => nid("step", s.id));
  if (ext.length) out.push(`  class ${ext.join(",")} ext`);
  if (open.length) out.push(`  class ${open.join(",")} open`);
  for (const lane of laneOf) {
    if (!steps.some((s) => s.lane === lane.id)) continue;
    if (lane.oi) out.push(`  style ${nid("lane", lane.id)} ${OPEN}`);
    else if (lane.kind === "external") out.push(`  style ${nid("lane", lane.id)} ${EXT}`);
  }
  return out.join("\n") + "\n";
}

// Per-Module status flow: stateDiagram-v2, direction LR, [*] start/end, triggers as labels.
export function statusMermaid(module) {
  const { statuses, transitions } = module;
  if (!statuses.length) return null;
  const out = ["stateDiagram-v2", "  direction LR"];
  for (const s of statuses) out.push(`  state ${q(label(humanize(s.id)) + (s.oi ? ` · ${s.oi}` : ""))} as ${nid("st", s.id)}`);
  for (const s of statuses.filter((x) => x.start)) out.push(`  [*] --> ${nid("st", s.id)}`);
  for (const t of transitions) out.push(`  ${nid("st", t.from)} --> ${nid("st", t.to)}${t.trigger ? ` : ${label(t.trigger)}` : ""}`);
  for (const s of statuses.filter((x) => x.end)) out.push(`  ${nid("st", s.id)} --> [*]`);
  out.push(`  classDef open ${OPEN}`);
  for (const s of statuses.filter((x) => x.oi)) out.push(`  class ${nid("st", s.id)} open`);
  return out.join("\n") + "\n";
}

// Every diagram of a BRD, in page order: [{key, title, mermaid}]. Merged Modules and empty ones skipped.
export function diagramSources(data) {
  const list = [];
  const proc = processMermaid(data.process);
  if (proc) list.push({ key: "process", mermaid: proc });
  for (const m of data.modules) {
    if (m.status.startsWith("merged-into:")) continue;
    const text = statusMermaid(m);
    if (text) list.push({ key: `mod-${m.prefix}`, mermaid: text });
  }
  return list;
}

// ---------- mmdc ----------

// Finds mmdc: NEOME_MMDC, else node_modules/.bin/mmdc above the Engagement, else above the engine.
export function findMmdc(fromDir, env = process.env) {
  if (env.NEOME_MMDC) return env.NEOME_MMDC;
  const name = process.platform === "win32" ? "mmdc.cmd" : "mmdc";
  for (const start of [fromDir, here].filter(Boolean)) {
    let dir = resolve(start);
    for (;;) {
      const bin = join(dir, "node_modules", ".bin", name);
      if (existsSync(bin)) return bin;
      const up = dirname(dir);
      if (up === dir) break;
      dir = up;
    }
  }
  return null;
}

// Missing or wrong-version mmdc → {cls, msg}; fine → null.
export function checkMmdc(bin) {
  const fix = "Run `npm ci` in the repo root to install the pinned Mermaid CLI.";
  if (!bin || !existsSync(bin)) {
    return { cls: "mmdc-missing", msg: `Mermaid CLI (mmdc) not found${bin ? ` at ${bin}` : ""}. ${fix}` };
  }
  const r = spawnSync(bin, ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
  if (r.error || r.status !== 0) {
    return { cls: "mmdc-missing", msg: `Mermaid CLI (mmdc) at ${bin} does not run (${r.error?.code ?? `exit ${r.status}`}). ${fix}` };
  }
  const version = r.stdout.trim().split(/\s+/).pop();
  if (version !== MERMAID_CLI_PIN) {
    return { cls: "mmdc-version", msg: `Mermaid CLI is ${version || "unknown"}, BRD needs ${MERMAID_CLI_PIN} (pinned) so diagrams match. ${fix}` };
  }
  return null;
}

// Renders every diagram with one mmdc run. Returns {svgs: {key: svg}} or {error: {cls, msg}}.
export function renderDiagrams(sources, bin) {
  if (!sources.length) return { svgs: {} };
  const dir = mkdtempSync(join(tmpdir(), "neome-diagrams-"));
  try {
    const input = join(dir, "diagrams.md");
    writeFileSync(input, sources.map((s) => "```mermaid\n" + s.mermaid + "```\n").join("\n"));
    writeFileSync(join(dir, "config.json"), JSON.stringify(MERMAID_CONFIG));
    // Page fonts loaded while Mermaid measures labels, so boxes fit the fonts the BRD shows. Stripped after.
    writeFileSync(join(dir, "fonts.css"), fontFaces());
    const args = ["-i", input, "-o", join(dir, "out.md"), "-c", join(dir, "config.json"), "-C", join(dir, "fonts.css"),
      "-I", SVG_ID, "-b", "transparent", "--no-font-embed", "-q"];
    if (process.platform === "linux") {
      // CI runners block Chrome's sandbox; input is our own generated Mermaid with securityLevel strict.
      writeFileSync(join(dir, "puppeteer.json"), JSON.stringify({ args: ["--no-sandbox"] }));
      args.push("-p", join(dir, "puppeteer.json"));
    }
    const r = spawnSync(bin, args, { encoding: "utf8", shell: process.platform === "win32" });
    if (r.error || r.status !== 0) {
      const why = (r.stderr || r.stdout || r.error?.message || "").trim().split("\n").slice(-3).join(" ");
      return { error: { cls: "mmdc-failed", msg: `Mermaid CLI failed to draw the diagrams: ${why}` } };
    }
    const svgs = {};
    sources.forEach((s, i) => {
      svgs[s.key] = cleanSvg(readFileSync(join(dir, `out-${i + 1}.svg`), "utf8"));
    });
    return { svgs };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// The page embeds the fonts once; drop the copies mmdc put in each SVG.
function cleanSvg(svg) {
  return svg.replace(/@font-face\s*\{[^}]*\}/g, "").trim();
}

// Gives one SVG copy its own id prefix so screen and print copies do not clash.
export function svgWithId(svg, id) {
  return svg.split(SVG_ID).join(id);
}

function fontFaces() {
  return ["SchibstedGrotesk-400", "SchibstedGrotesk-500", "SchibstedGrotesk-600"]
    .filter((f) => existsSync(join(FONT_DIR, `${f}.woff2`)))
    .map((f) => {
      const weight = f.split("-")[1];
      const b64 = readFileSync(join(FONT_DIR, `${f}.woff2`)).toString("base64");
      return `@font-face{font-family:'Schibsted Grotesk';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
    })
    .join("\n");
}
