// Reads an Engagement's _agent/ markdown (+ Enterprise Source register and glossary)
// into the BRD data file shape. Format problems are returned as parse errors, never thrown.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import {
  frontMatter, firstHeading, sections, tables, column, bullets, idList, oiList, list,
  provenance, isProposedCell, isEmpty, unique, normHeader,
} from "../markdown.mjs";

export const SPEC_SECTIONS = [
  "purpose and kpis", "roles", "process", "records and data", "statuses", "rules and notifications",
  "exceptions", "reports", "integrations", "volumes and nfrs", "requirements", "neome mapping", "open items",
];

export function readEngagement(engagementDir, { schemaVersion, date }) {
  const errors = [];
  const fail = (file, msg) => errors.push({ cls: "parse", msg: `${file}: ${msg}` });
  const dir = resolve(engagementDir);
  const slug = basename(dir);
  const entDir = dirname(dirname(dir));
  const agent = join(dir, "_agent");
  const entAgent = join(entDir, "_agent");

  const read = (path, label, required = true) => {
    if (!existsSync(path)) {
      if (required) fail(label, "file missing");
      return null;
    }
    return readFileSync(path, "utf8");
  };

  const mapText = read(join(agent, "map.md"), "map.md");
  const title = mapText ? (firstHeading(mapText) ?? "").replace(/^map:\s*/i, "") : "";
  if (mapText && !title) fail("map.md", "needs a `# <Engagement title>` heading");

  const glossaryText = read(join(entAgent, "GLOSSARY.md"), "Enterprise GLOSSARY.md");
  const entName = glossaryText ? firstHeading(glossaryText) : null;
  if (glossaryText && !entName) fail("Enterprise GLOSSARY.md", "needs a `# <Enterprise name>` heading");

  const register = readSources(read(join(entAgent, "sources.md"), "Enterprise sources.md"), fail);
  const glossary = glossaryText ? readGlossary(glossaryText, slug, fail) : [];
  const openItems = readOpenItems(read(join(agent, "open-items.md"), "open-items.md"), fail);
  const process = readProcess(read(join(agent, "process.md"), "process.md"), fail);
  const { modules, meta } = readModules(join(agent, "modules"), mapText ?? "", fail);
  const general = readGeneral(read(join(agent, "general.md"), "general.md", false), fail);
  const planText = read(join(agent, "plan.md"), "plan.md", false);

  const data = {
    schemaVersion,
    enterprise: { id: basename(entDir), name: entName ?? "" },
    engagement: { slug, title, version: null, status: "working-draft", date },
    sources: [],
    glossary,
    process,
    modules,
    general,
    ...(planText === null ? {} : { plan: readPlan(planText, fail) }),
    openItems,
    changelog: [],
  };
  // Only this Engagement's Sources: ingested for it, or cited anywhere in it.
  const cited = new Set(citedSources(data));
  data.sources = register.filter((s) => s.engagements.includes(slug) || cited.has(s.id));
  return { data, meta, register, errors };
}

// The Enterprise Source register only (Sign-off checks its evidence Source there).
export function readRegister(engagementDir) {
  const errors = [];
  const file = join(dirname(dirname(resolve(engagementDir))), "_agent", "sources.md");
  if (!existsSync(file)) return { register: [], errors: [{ cls: "parse", msg: "Enterprise sources.md: file missing" }] };
  const register = readSources(readFileSync(file, "utf8"), (f, msg) => errors.push({ cls: "parse", msg: `${f}: ${msg}` }));
  return { register, errors };
}

// ---- Enterprise files ----

function readSources(text, fail) {
  if (text === null) return [];
  const t = tables(text).find((t) => column(t, "id") && column(t, "title"));
  if (!t) {
    fail("sources.md", "no register table (ID | type | title | date | file | engagement(s) | notes)");
    return [];
  }
  const c = cols(t, { id: ["id"], type: ["type"], title: ["title"], date: ["date"], file: ["file"], eng: ["engagement"] });
  return t.rows.map((r) => {
    const file = r[c.file] ?? "";
    return {
      id: r[c.id],
      type: r[c.type] ?? "",
      title: r[c.title],
      date: isEmpty(r[c.date]) ? null : r[c.date],
      file,
      engagements: list(r[c.eng]),
      confidential: /(^|\/)confidential\//.test(file),
    };
  });
}

function readGlossary(text, slug, fail) {
  const terms = [];
  let cur = null;
  const finish = () => {
    if (!cur) return;
    const t = cur;
    cur = null;
    if (!t.usedIn.includes(slug)) return;
    if (!["proposed", "agreed"].includes(t.status)) {
      fail("Enterprise GLOSSARY.md", `term "${t.term}" needs _Status_: proposed or agreed`);
    }
    const term = {
      term: t.term,
      definition: t.def.join(" ").trim(),
      avoid: t.avoid,
      sources: unique(t.sources),
      proposed: t.status !== "agreed",
    };
    // `_Disputed_: <slug>/OI-NN` marks the term disputed only in that Engagement (OI IDs are per Engagement).
    if (t.disputed && (!t.disputedIn || t.disputedIn === slug)) term.disputed = t.disputed;
    terms.push(term);
  };
  for (const line of text.split(/\r?\n/)) {
    const head = line.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
    if (head) {
      finish();
      cur = { term: head[1].trim(), def: head[2] ? [head[2]] : [], avoid: [], sources: [], status: "", usedIn: [], disputed: null, disputedIn: null };
      continue;
    }
    if (!cur) continue;
    if (/^#/.test(line)) { finish(); continue; }
    const avoid = line.match(/^_Avoid_:\s*(.*)$/);
    if (avoid) { cur.avoid = list(avoid[1]); continue; }
    if (/^_Source_:/.test(line) || /_Status_:/.test(line) || /_Used in_:/.test(line)) {
      for (const part of line.split("·")) {
        const m = part.trim().match(/^_(.+?)_:\s*(.*)$/);
        if (!m) continue;
        const key = m[1].toLowerCase();
        if (key === "source") cur.sources = idList(m[2]);
        else if (key === "status") cur.status = m[2].trim().toLowerCase();
        else if (key === "used in") cur.usedIn = list(m[2]);
        else if (key === "disputed") {
          const d = m[2].trim().match(/^(?:([a-z0-9-]+)\/)?(.*)$/);
          cur.disputedIn = d[1] ?? null;
          cur.disputed = oiList(d[2])[0] ?? d[2].trim();
        }
      }
      continue;
    }
    if (line.trim()) cur.def.push(line.trim());
  }
  finish();
  return terms;
}

// ---- Engagement registers ----

function readOpenItems(text, fail) {
  if (text === null) return [];
  const t = tables(text).find((t) => column(t, "id") && column(t, "question"));
  if (!t) {
    if (/OI-\d/.test(text)) fail("open-items.md", "no register table (ID | question | Module(s) | owner | ...)");
    return [];
  }
  const c = cols(t, {
    id: ["id"], question: ["question"], modules: ["module"], owner: ["owner"], askTo: ["ask to"],
    suggested: ["suggested"], status: ["status"], askedIn: ["asked in"], answerSource: ["answer source"],
    raisedIn: ["raised in"],
  });
  c.answer = t.headers.find((h) => h === "answer") ?? null;
  return t.rows.map((r) => {
    const oi = {
      id: r[c.id],
      question: r[c.question],
      modules: list(r[c.modules]),
      owner: (r[c.owner] ?? "").toLowerCase(),
      status: (r[c.status] ?? "").toLowerCase(),
      askedIn: list(r[c.askedIn]).map((q) => q.replace(/\.md$/, "")),
    };
    for (const k of ["answer", "suggested", "askTo"]) if (c[k] && !isEmpty(r[c[k]])) oi[k] = r[c[k]];
    for (const k of ["answerSource", "raisedIn"]) if (c[k] && !isEmpty(r[c[k]])) oi[k] = r[c[k]].replace(/[[\]]/g, "");
    return oi;
  });
}

function readProcess(text, fail) {
  const out = { lanes: [], steps: [], edges: [] };
  if (text === null) return out;
  for (const t of tables(text)) {
    if (column(t, "who")) {
      const c = cols(t, { id: ["id"], name: ["name"], who: ["who"], kind: ["kind"], oi: ["oi", "open"], src: ["source"] });
      for (const r of t.rows) out.lanes.push(withOi(fact(r, c, { id: r[c.id], name: r[c.name], who: r[c.who] ?? "", kind: low(r[c.kind]) }), r[c.oi]));
    } else if (column(t, "lane")) {
      const c = cols(t, { id: ["id"], lane: ["lane"], module: ["module"], label: ["label"], note: ["note"], kind: ["kind"], oi: ["oi", "open"], src: ["source"] });
      for (const r of t.rows) {
        out.steps.push(withOi(fact(r, c, {
          id: r[c.id], lane: r[c.lane], module: isEmpty(r[c.module]) ? null : r[c.module],
          label: r[c.label], note: r[c.note] ?? "", kind: low(r[c.kind]) || "step",
        }), r[c.oi]));
      }
    } else if (column(t, "from") && column(t, "to")) {
      const c = cols(t, { from: ["from"], to: ["to"], label: ["label"], alt: ["alternate"], src: ["source"] });
      for (const r of t.rows) {
        out.edges.push(fact(r, c, { from: r[c.from], to: r[c.to], label: r[c.label] ?? "", alternate: yes(r[c.alt]) }));
      }
    } else {
      fail("process.md", `table with columns "${t.headers.join(" | ")}" is not a lanes, steps or edges table`);
    }
  }
  return out;
}

// ---- Modules ----

function readModules(modulesDir, mapText, fail) {
  const modules = [];
  const meta = new Map();
  if (!existsSync(modulesDir)) return { modules, meta };
  const folders = readdirSync(modulesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  for (const folder of folders) {
    const label = `modules/${folder}`;
    const ticketText = existsSync(join(modulesDir, folder, "ticket.md")) ? readFileSync(join(modulesDir, folder, "ticket.md"), "utf8") : null;
    if (ticketText === null) {
      fail(label, "ticket.md missing");
      continue;
    }
    let fm, ticketBody;
    try {
      ({ fm, body: ticketBody } = frontMatter(ticketText));
    } catch {
      fail(`${label}/ticket.md`, "front-matter is not valid YAML");
      continue;
    }
    if (!fm) {
      fail(`${label}/ticket.md`, "front-matter missing (status, prefix, ...)");
      continue;
    }
    const prefix = String(fm.prefix ?? "");
    if (!folder.startsWith(prefix + "-") && folder !== prefix) {
      fail(`${label}/ticket.md`, `prefix "${prefix}" does not match folder name`);
    }
    const specPath = join(modulesDir, folder, "spec.md");
    const hasSpec = existsSync(specPath);
    const doc = hasSpec ? readFileSync(specPath, "utf8") : ticketBody;
    const docLabel = hasSpec ? `${label}/spec.md` : `${label}/ticket.md`;
    const m = readModuleDoc(doc, docLabel, fail);
    const name = header(doc, "name") ?? fm.name ?? null;
    if (!name) fail(docLabel, "Module name missing (`Name:` line)");
    const status = String(fm.status ?? "").replace(/^merged-into\s+/, "merged-into:");
    const mod = { prefix, name: name ?? "", status };
    if (!isEmpty(fm.formerly)) mod.formerly = String(fm.formerly);
    Object.assign(mod, m.data);
    modules.push(mod);
    meta.set(mod, { hasSpec, missingSections: m.missing, emptySections: m.empty });
  }
  // BRD order: as listed in the map's Modules index, then the rest by folder.
  const index = mapModuleOrder(mapText);
  const rank = (p) => (index.indexOf(p) === -1 ? Infinity : index.indexOf(p));
  modules.sort((a, b) => rank(a.prefix) - rank(b.prefix));
  return { modules, meta };
}

function mapModuleOrder(mapText) {
  const sec = sections(mapText, 2).find((s) => /modules/i.test(s.title));
  return sec ? [...sec.body.matchAll(/\b[A-Z]{2,5}\b/g)].map((m) => m[0]) : [];
}

const header = (doc, key) => {
  const top = doc.split(/^##\s/m)[0];
  const m = top.match(new RegExp(`^\\s*(?:[-*]\\s+)?\\**${key}\\**:\\s*(.+)$`, "im"));
  return m ? m[1].trim() : null;
};

function readModuleDoc(doc, label, fail) {
  const found = new Map();
  for (const s of sections(doc, 2)) {
    const key = normHeader(s.title.replace(/^\d+[.)]?\s*/, ""));
    if (SPEC_SECTIONS.includes(key)) found.set(key, s.body);
  }
  const missing = SPEC_SECTIONS.filter((k) => !found.has(k));
  const empty = SPEC_SECTIONS.filter((k) => found.has(k) && !found.get(k).trim());
  const body = (k) => {
    const b = found.get(k) ?? "";
    return /^N\/A\b/i.test(b.trim()) ? "" : b;
  };
  const data = {
    ...readPurpose(body("purpose and kpis")),
    asIs: factBullets(body("process")).filter((b) => !/process\.md/i.test(b)).map(textFact),
    roles: rows(body("roles"), label, "Roles", { role: ["role"], does: ["does"], headcount: ["headcount"] }, (r, c) => ({
      role: r[c.role], does: r[c.does] ?? "", headcount: r[c.headcount] ?? "",
    }), fail),
    records: readRecords(body("records and data"), label, fail),
    ...readStatuses(body("statuses"), label, fail),
    rules: rows(body("rules and notifications"), label, "Rules", { rule: ["rule"], when: ["when"], action: ["action", "notify"] }, (r, c) => ({
      rule: r[c.rule], when: r[c.when] ?? "", action: r[c.action] ?? "",
    }), fail),
    exceptions: factBullets(body("exceptions")).map(textFact),
    reports: rows(body("reports"), label, "Reports", { name: ["name"], audience: ["audience"], measures: ["measures", "filters"] }, (r, c) => ({
      name: r[c.name], audience: r[c.audience] ?? "", measures: r[c.measures] ?? "",
    }), fail),
    integrations: rows(body("integrations"), label, "Integrations", { system: ["system"], direction: ["direction"], data: ["data"], owner: ["owner"] }, (r, c) => ({
      system: r[c.system], direction: r[c.direction] ?? "", data: r[c.data] ?? "", owner: r[c.owner] ?? "",
    }), fail),
    volumes: factBullets(body("volumes and nfrs")).map(textFact),
    requirements: readRequirements(body("requirements"), label, fail),
    mapping: readMapping(body("neome mapping")),
    oiRefs: unique(bullets(body("open items")).flatMap((b) => oiList(b).slice(0, 1))),
  };
  return { data, missing, empty };
}

// Bullets of a bullet section, minus `OI-NN: gist` bullets (a topic still open; the section counts as filled).
const factBullets = (text) => bullets(text).filter((b) => !/^OI-\d+\s*:/.test(b));

function readPurpose(text) {
  let purpose = null;
  const kpis = [];
  for (const b of factBullets(text)) {
    const m = b.match(/^\**purpose\**:\s*(.*)$/i);
    if (m) purpose = textFact(m[1]);
    else kpis.push(textFact(b.replace(/^\**kpis?\**:\s*/i, "")));
  }
  if (!purpose) {
    const para = text.split(/\r?\n/).filter((l) => l.trim() && !/^[-*]\s/.test(l) && !/^\s/.test(l)).join(" ").trim();
    if (para) purpose = textFact(para.replace(/^\**purpose\**:\s*/i, ""));
  }
  return { purpose, kpis };
}

function readRecords(text, label, fail) {
  const byEntity = new Map();
  const fields = rows(text, label, "Records and data", {
    entity: ["entity"], field: ["field"], type: ["type"], required: ["required"], notes: ["notes"],
  }, (r, c) => {
    const notes = r[c.notes] ?? "";
    const f = { entity: r[c.entity], name: r[c.field], type: low(r[c.type]), required: yes(r[c.required]), notes };
    const values = notes.match(/Values:\s*([^.;]+?)(?:[.;]|$)/i);
    if (values) f.choices = values[1].split("/").map((v) => v.trim()).filter(Boolean);
    const link = notes.match(/Links to:\s*([^.;,]+?)(?:[.;,]|$)/i);
    if (link) f.linkTo = link[1].trim();
    if (!["yes", "no", "y", "n", "true", "false"].includes(low(r[c.required]))) {
      fail(label, `Records and data: field "${r[c.field]}" required must be yes or no`);
    }
    return f;
  }, fail);
  for (const { entity, ...field } of fields) {
    if (!byEntity.has(entity)) byEntity.set(entity, { entity, fields: [] });
    byEntity.get(entity).fields.push(field);
  }
  return [...byEntity.values()];
}

function readStatuses(text, label, fail) {
  const statuses = [];
  const transitions = [];
  for (const t of tables(text)) {
    if (column(t, "trigger") || (column(t, "from") && column(t, "to"))) {
      const c = cols(t, { from: ["from"], to: ["to"], trigger: ["trigger"], src: ["source"] });
      for (const r of t.rows) transitions.push(fact(r, c, { from: r[c.from], to: r[c.to], trigger: r[c.trigger] ?? "" }));
    } else if (column(t, "id")) {
      const c = cols(t, { id: ["id"], se: ["start"], oi: ["open", "oi"], src: ["source"] });
      for (const r of t.rows) {
        const se = low(r[c.se]);
        statuses.push(withOi(fact(r, c, { id: r[c.id], start: /start/.test(se), end: /end/.test(se) }), r[c.oi]));
      }
    } else {
      fail(label, `Statuses: table "${t.headers.join(" | ")}" is not a states or transitions table`);
    }
  }
  return { statuses, transitions };
}

function readMapping(text) {
  if (!text.trim()) return null;
  const get = (k) => {
    const m = text.match(new RegExp(`^\\s*(?:[-*]\\s+)?\\**${k}\\**:\\s*(.*)$`, "im"));
    return m ? m[1].trim() : null;
  };
  const app = get("neome app");
  const delivery = get("delivery");
  if (app === null && delivery === null) return null;
  const tick = app?.match(/`([^`]+)`/);
  const appValue = tick ? tick[1] : (app ?? "").trim();
  const noApp = isEmpty(appValue) || /^(null|no app|no app fits)\b/i.test(appValue);
  return {
    neomeApp: noApp ? null : appValue,
    delivery: deliveryValue(delivery),
    how: provenance(get("how") ?? "").text,
    indicative: true,
  };
}

const deliveryValue = (v) => low(v).replace(/\s*module$/, "").replace(/\(.*\)/, "").trim();

const REQ_KEYS = {
  statement: "statement", acceptance: "acceptance", "acceptance criteria": "acceptance", priority: "priority",
  scope: "scope", "scope tag": "scope", source: "sources", sources: "sources", oi: "ois", ois: "ois",
  "open items": "ois", proposed: "proposed", delivery: "delivery", withdrawn: "withdrawn",
};
const SCOPES = {
  neome: "neome", "neome tbc": "neome-tbc", "neome-tbc": "neome-tbc", "third-party": "third-party",
  "third-party system": "third-party", "third party": "third-party", "third party system": "third-party",
  enterprise: "enterprise", "out of scope": "out-of-scope", "out-of-scope": "out-of-scope", open: "open",
};
const PRIORITIES = { must: "Must", should: "Should", could: "Could", "won't": "Won't", wont: "Won't", tbc: "TBC" };

function readRequirements(text, label, fail) {
  return sections(text, 3).map(({ title, body }) => {
    const h = title.match(/^([A-Z]{2,5}-\d+)\s*(?:[—–:-]\s*)?(.*)$/);
    if (!h) fail(label, `Requirement heading "${title}" must start with its ID (e.g. QUO-01)`);
    const fields = {};
    let key = null;
    for (const line of body.split(/\r?\n/)) {
      const m = line.match(/^\s*(?:[-*]\s+)?\**([A-Za-z ]+?)\**:\s*(.*)$/);
      const k = m && REQ_KEYS[m[1].trim().toLowerCase()];
      if (k) {
        key = k;
        fields[k] = m[2] ? [m[2]] : [];
      } else if (key && line.trim()) {
        fields[key].push(line);
      }
    }
    const one = (k) => (fields[k] ?? []).join(" ").trim();
    const stmt = provenance(one("statement"));
    const accText = (fields.acceptance ?? []).join("\n");
    const accItems = bullets(accText).length ? bullets(accText) : [accText.trim()];
    const acceptance = accItems.map((a) => provenance(a)).filter((a) => a.text && !isEmpty(a.text));
    const proposed = stmt.proposed || acceptance.some((a) => a.proposed) || yes(one("proposed")) || /proposed/i.test(one("sources"))
      || /\(proposed, to confirm\)/i.test(body);
    const req = {
      id: h ? h[1] : title,
      title: provenance(h ? h[2] : title).text,
      statement: stmt.text,
      acceptance: acceptance.map((a) => a.text),
      sources: unique([...idList(one("sources")), ...stmt.sources, ...acceptance.flatMap((a) => a.sources)]),
      ois: unique(oiList(one("ois"))),
      proposed,
    };
    const priority = one("priority");
    if (priority) req.priority = PRIORITIES[priority.toLowerCase().replace(/[’`]/g, "'")] ?? priority;
    const scope = one("scope");
    if (scope) req.scope = SCOPES[scope.toLowerCase()] ?? scope;
    if (!isEmpty(one("delivery"))) req.delivery = deliveryValue(one("delivery"));
    if (!isEmpty(one("withdrawn"))) {
      const w = provenance(one("withdrawn"));
      req.withdrawn = w.text;
      req.sources = unique([...req.sources, ...w.sources]);
    }
    return req;
  });
}

// ---- Engagement-wide Requirements (general.md) and Implementation plan (plan.md) ----

export const GENERAL_TOPICS = ["access", "localisation", "hosting", "migration", "training", "support", "other"];

// One H2 per topic; Requirements as H3 blocks (same format as a Module); a topic with nothing
// says `N/A: <reason> [Source]` or lists its Open Items as `- OI-NN: gist` bullets.
function readGeneral(text, fail) {
  const out = { requirements: [], na: [], oiRefs: [] };
  if (text === null) return out;
  const seen = new Set();
  for (const { title, body } of sections(text, 2)) {
    const key = normHeader(title).replace(/^localization/, "localisation");
    const topic = GENERAL_TOPICS.find((t) => key === t || key.startsWith(t + " "));
    if (!topic) {
      fail("general.md", `"${title}" is not a topic (${GENERAL_TOPICS.join(", ")})`);
      continue;
    }
    if (seen.has(topic)) fail("general.md", `topic "${topic}" has two sections`);
    seen.add(topic);
    const lead = body.split(/^###\s/m)[0];
    const reqs = readRequirements(body, "general.md", fail).map((r) => ({ ...r, topic }));
    const na = lead.trim().match(/^N\/A\b:?\s*([\s\S]*)$/i);
    if (na && reqs.length) fail("general.md", `topic "${topic}" says N/A but also has Requirements`);
    if (na) {
      const p = provenance(na[1].replace(/\s+/g, " "));
      out.na.push({ topic, ...(p.text ? { reason: p.text } : {}), sources: unique(p.sources) });
    }
    out.requirements.push(...reqs);
    for (const b of bullets(lead)) {
      const id = oiList(b)[0];
      if (id && b.startsWith(id)) out.oiRefs.push({ id, topic });
    }
  }
  return out;
}

// Phases table: id | name | week from | week to | covers | Modules | Source (row order = phase order).
// Not yet placed table: what | OIs | Modules | Source. Week numbers come only from the Consultant.
function readPlan(text, fail) {
  const out = { phases: [], notPlaced: [] };
  for (const t of tables(text)) {
    if (column(t, "week")) {
      const c = cols(t, { id: ["id"], name: ["name", "phase"], from: ["week from"], to: ["week to"], covers: ["covers", "what it covers"], modules: ["module"], src: ["source"] });
      const missing = ["id", "name", "from", "to"].filter((k) => !c[k]);
      if (missing.length) {
        fail("plan.md", `phases table missing column(s) ${missing.map((k) => ({ from: "week from", to: "week to" })[k] ?? k).join(", ")}`);
        continue;
      }
      for (const r of t.rows) {
        const week = (k, label) => {
          const v = (r[c[k]] ?? "").trim();
          if (isEmpty(v)) return null;
          if (/^\d+$/.test(v) && Number(v) >= 1) return Number(v);
          fail("plan.md", `phase ${r[c.id]}: ${label} "${v}" must be a whole number or empty`);
          return null;
        };
        const phase = fact(r, c, { id: r[c.id], name: r[c.name], covers: r[c.covers] ?? "" });
        const { sources, proposed, ...rest } = phase;
        out.phases.push({ ...rest, weekFrom: week("from", "week from"), weekTo: week("to", "week to"), modules: list(r[c.modules]), sources, proposed });
      }
    } else if (column(t, "what", "item", "text")) {
      const c = cols(t, { text: ["what", "item", "text"], ois: ["oi", "open"], modules: ["module"], src: ["source"] });
      for (const r of t.rows) {
        const { sources, proposed, ...rest } = fact(r, c, { text: r[c.text] });
        out.notPlaced.push({ ...rest, ois: unique(oiList(r[c.ois])), modules: list(r[c.modules]), sources, proposed });
      }
    } else {
      fail("plan.md", `table with columns "${t.headers.join(" | ")}" is not a phases or Not yet placed table`);
    }
  }
  return out;
}

// ---- helpers ----

const low = (s) => String(s ?? "").trim().toLowerCase();
const yes = (s) => ["yes", "y", "true"].includes(low(s));
const textFact = (s) => {
  const p = provenance(s);
  return { text: p.text, sources: unique(p.sources), proposed: p.proposed };
};

// Column names for one table; missing ones are null.
function cols(table, spec) {
  return Object.fromEntries(Object.entries(spec).map(([k, names]) => [k, column(table, ...names)]));
}

// Adds provenance from the Source column and any inline markers in other cells.
function fact(row, c, obj) {
  const srcCell = c.src ? row[c.src] : "";
  const sources = idList(srcCell);
  let proposed = isProposedCell(srcCell);
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== "string") continue;
    const p = provenance(v);
    obj[k] = p.text;
    sources.push(...p.sources);
    proposed ||= p.proposed;
  }
  return { ...obj, sources: unique(sources), proposed };
}

function withOi(obj, cell) {
  const oi = oiList(cell)[0];
  return oi ? { ...obj, oi } : obj;
}

// Parses the first table in a section into fact objects; required columns must exist.
function rows(text, label, section, spec, build, fail) {
  const t = tables(text)[0];
  if (!t) {
    if (text.trim() && !bullets(text).every((b) => /^OI-\d+/.test(b))) fail(label, `${section}: expected a table`);
    return [];
  }
  const c = cols(t, { ...spec, src: ["source"] });
  const missing = Object.keys(spec).filter((k) => !c[k]);
  if (missing.length) {
    fail(label, `${section}: table missing column(s) ${missing.map((k) => spec[k][0]).join(", ")}`);
    return [];
  }
  return t.rows.map((r) => {
    const built = build(r, c);
    const { entity, ...rest } = built;
    const f = fact(r, c, rest);
    return entity === undefined ? f : { entity, ...f };
  });
}

// Every Source ID cited anywhere in the data (facts, OI answers, glossary).
export function citedSources(data) {
  const out = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      if (Array.isArray(v.sources)) out.push(...v.sources.filter((s) => typeof s === "string"));
      for (const [k, x] of Object.entries(v)) if (k !== "sources") walk(x);
    }
  };
  walk({ glossary: data.glossary, process: data.process, modules: data.modules, general: data.general, plan: data.plan });
  for (const oi of data.openItems ?? []) {
    if (oi.answerSource) out.push(oi.answerSource);
    if (oi.raisedIn) out.push(oi.raisedIn);
  }
  return unique(out);
}
