// build-prototype <engagement-dir> <PREFIX>
// Renders one Module's Prototype: spec.md (as build-brd reads it) + the agent's
// _agent/modules/<PREFIX>-<slug>/prototype-data.json → <engagement>/prototypes/<PREFIX>-<slug>.html,
// from the fixed template in engine/prototype/ (no agent-written HTML). One offline file, no external JS,
// state in memory only. Fails, writing nothing, when the Engagement does not build, a reference in
// prototype-data.json is wrong, or the done check fails (every live Requirement in at least one tab,
// every transition in at least one scenario). Exit 0 = written, 1 = not written, 2 = bad arguments.
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readEngagement } from "./brd/read-engagement.mjs";
import { schemaErrors, crossRefErrors, SCHEMA_VERSION } from "./brd/validate.mjs";
import { prototypeModel } from "./prototype/model.mjs";
import { renderPrototypeHtml } from "./prototype/render.mjs";
import { frontMatter } from "./markdown.mjs";
import { parse, usage, today } from "./ingest.mjs";

const USE = "build-prototype <engagement-dir> <PREFIX>";
const pluginDir = join(dirname(fileURLToPath(import.meta.url)), "..");

export function buildPrototype(args) {
  const p = parse(args, []);
  if (p.problem) return usage(p.problem, USE);
  const [dir, prefix] = p.pos;
  if (!dir || !prefix || p.pos.length > 2) return usage("build-prototype needs <engagement-dir> and <PREFIX>", USE);
  if (!existsSync(join(dir, "_agent"))) return usage(`build-prototype: ${dir} is not an Engagement folder (no _agent/)`, USE);

  const fail = (msgs) => {
    for (const e of msgs) console.error(`error [${e.cls}] ${e.msg}`);
    console.error(`build-prototype: ${msgs.length} error(s); Prototype not written`);
    return 1;
  };
  const folder = moduleFolder(join(dir, "_agent", "modules"), prefix);
  if (!folder) return fail([{ cls: "prototype", msg: `no Module ${prefix} in ${join(dir, "_agent", "modules")}` }]);
  const modDir = join(dir, "_agent", "modules", folder.name);
  if (/^merged-into/.test(String(folder.fm.status ?? ""))) {
    return fail([{ cls: "prototype", msg: `Module ${prefix} is ${folder.fm.status}; it has no Prototype` }]);
  }
  if (!existsSync(join(modDir, "spec.md"))) {
    return fail([{ cls: "prototype", msg: `Module ${prefix}: spec.md missing (write-module-spec writes it first)` }]);
  }
  const dataPath = join(modDir, "prototype-data.json");
  if (!existsSync(dataPath)) {
    return fail([{ cls: "prototype", msg: `Module ${prefix}: prototype-data.json missing (build-prototype skill writes it)` }]);
  }
  let pd;
  try {
    pd = JSON.parse(readFileSync(dataPath, "utf8"));
  } catch (e) {
    return fail([{ cls: "prototype", msg: `Module ${prefix}: prototype-data.json is not valid JSON (${e.message})` }]);
  }

  // The spec must build: same reader and checks as build-brd.
  const { data, register, errors: parseErrors } = readEngagement(dir, { schemaVersion: SCHEMA_VERSION, date: today() });
  const errors = [...parseErrors, ...schemaErrors(data)];
  if (!errors.length) errors.push(...crossRefErrors(data, register));
  if (errors.length) return fail(errors);

  const { model, errors: protoErrors, warnings } = prototypeModel(data, prefix, pd, appNames());
  for (const w of warnings) console.error(`warning [${w.cls}] ${w.msg}`);
  if (protoErrors.length) return fail(protoErrors);

  const out = join(dir, "prototypes", `${folder.name}.html`);
  mkdirSync(join(dir, "prototypes"), { recursive: true });
  writeFileSync(out, renderPrototypeHtml(model));
  console.log(`build-prototype: wrote ${out} (${model.requirements.length} Requirements traced, ${model.transitions.length} transitions in scenarios, ${warnings.length} warning(s))`);
  return 0;
}

function moduleFolder(modulesDir, prefix) {
  if (!existsSync(modulesDir)) return null;
  for (const d of readdirSync(modulesDir, { withFileTypes: true })) {
    if (!d.isDirectory() || !(d.name === prefix || d.name.startsWith(prefix + "-"))) continue;
    const t = join(modulesDir, d.name, "ticket.md");
    if (!existsSync(t)) continue;
    try {
      const fm = frontMatter(readFileSync(t, "utf8")).fm ?? {};
      if (String(fm.prefix ?? "") === prefix) return { name: d.name, fm };
    } catch {
      // Bad front-matter: the build reports it.
    }
  }
  return null;
}

function appNames() {
  const file = join(pluginDir, "reference", "neome-app-catalog-slugs.json");
  return Object.fromEntries(JSON.parse(readFileSync(file, "utf8")).apps.map((a) => [a.slug, a.name]));
}
