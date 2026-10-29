// Prototype page model (ticket 33): one Module's spec (as build-brd reads it) + the agent's prototype-data.json
// → the data object the fixed Prototype template renders. Checks every reference in prototype-data.json
// against the spec and runs the Prototype done check: every live Requirement shows in at least one tab,
// every transition is in at least one scenario. Derived values (notify roles, key roles, trace, step states)
// are computed here, never written by the agent.
const KEYS = ["entity", "roles", "fields", "transitions", "rules", "reports", "rows", "scenarios"];
const SCREENS = ["record", "sheet", "kanban", "chat", "report", "rules"];
const OPS = ["<", "<=", ">", ">=", "=", "!="];
const TONES = ["blue", "lav", "green", "pink", "amber"];
const DELIVERY = { standard: "Standard", configuration: "Configuration", custom: "Custom module" };
export const MIN_ROWS = 4;
export const MAX_ROWS = 8;

// data = BRD data (readEngagement), pd = parsed prototype-data.json, apps = catalog slug → name.
export function prototypeModel(data, prefix, pd, apps = {}) {
  const errors = [];
  const warnings = [];
  const err = (msg) => errors.push({ cls: "prototype", msg });
  const warn = (msg) => warnings.push({ cls: "prototype", msg });
  const mod = data.modules.find((m) => m.prefix === prefix);
  if (!mod) return { errors: [{ cls: "prototype", msg: `no Module ${prefix} in the build` }], warnings };
  if (!pd || typeof pd !== "object" || Array.isArray(pd)) {
    return { errors: [{ cls: "prototype", msg: "prototype-data.json must be one JSON object" }], warnings };
  }
  for (const k of Object.keys(pd)) if (!KEYS.includes(k)) err(`unknown key "${k}" (known: ${KEYS.join(", ")})`);

  const live = mod.requirements.filter((r) => !r.withdrawn);
  const liveIds = new Set(live.map((r) => r.id));
  const withdrawn = new Set(mod.requirements.filter((r) => r.withdrawn).map((r) => r.id));
  const oiById = new Map(data.openItems.map((o) => [o.id, o]));
  const isOpen = (id) => oiById.get(id)?.status === "open";
  const list = (v, where, what) => {
    if (v === undefined) return [];
    if (!Array.isArray(v)) {
      err(`${where}: ${what} must be a list`);
      return [];
    }
    return v;
  };
  const reqs = (v, where) => list(v, where, "reqs").filter((id) => {
    if (liveIds.has(id)) return true;
    err(`${where}: ${withdrawn.has(id) ? `${id} is withdrawn` : `unknown Requirement ${id} (not in ${prefix} section 11)`}`);
    return false;
  });
  // One OI on an element; closed ones are dropped with a warning (no orange chip for a closed OI).
  const oi = (v, where) => {
    if (v === undefined || v === null || v === "") return null;
    if (!oiById.has(v)) {
      err(`${where}: unknown Open Item ${v} (not in open-items.md)`);
      return null;
    }
    if (!isOpen(v)) {
      warn(`${where}: ${v} is closed; no OI chip shown (drop it from prototype-data.json)`);
      return null;
    }
    return v;
  };
  const text = (v) => (typeof v === "string" ? v : v === undefined || v === null ? "" : String(v));

  // ---- records ----
  if (!mod.records.length) err(`${prefix} spec section 4 has no records; nothing to show`);
  const entity = pd.entity ?? mod.records[0]?.entity;
  const main = mod.records.find((r) => r.entity === entity);
  if (mod.records.length && !main) err(`entity "${entity}" is not a record in ${prefix} spec section 4`);
  const overlay = new Map();
  for (const [i, f] of list(pd.fields, "fields", "fields").entries()) {
    const where = `fields[${i}]`;
    const rec = mod.records.find((r) => r.entity === f?.entity);
    if (!rec) err(`${where}: unknown entity "${f?.entity}"`);
    else if (!rec.fields.some((x) => x.name === f.name)) err(`${where}: no field "${f.name}" in ${f.entity}`);
    else if (overlay.has(`${f.entity}|${f.name}`)) err(`${where}: ${f.entity} › ${f.name} listed twice`);
    else overlay.set(`${f.entity}|${f.name}`, { reqs: reqs(f.reqs, `${where} ${f.name}`), oi: oi(f.oi, `${where} ${f.name}`) });
  }
  const records = mod.records.map((r) => ({
    entity: r.entity,
    fields: r.fields.map((f) => ({
      name: f.name, type: f.type, required: f.required, notes: f.notes ?? "", choices: f.choices ?? null,
      linkTo: f.linkTo ?? null, proposed: f.proposed, reqs: [], oi: null, ...overlay.get(`${r.entity}|${f.name}`),
    })),
  }));

  // ---- statuses ----
  const statuses = mod.statuses.map((s, i) => ({
    id: s.id, label: sentence(s.id), start: s.start, end: s.end, proposed: s.proposed,
    oi: s.oi && isOpen(s.oi) ? s.oi : null, tone: TONES[i % TONES.length],
  }));
  const statusIds = new Set(statuses.map((s) => s.id));

  // ---- roles ----
  const roleOverlay = new Map();
  for (const [i, r] of list(pd.roles, "roles", "roles").entries()) {
    const where = `roles[${i}]`;
    if (!mod.roles.some((x) => x.role === r?.role)) err(`${where}: unknown role "${r?.role}" (not in ${prefix} section 2)`);
    else if (roleOverlay.has(r.role)) err(`${where}: role "${r.role}" listed twice`);
    else roleOverlay.set(r.role, { person: text(r.person).trim() || r.role, reqs: reqs(r.reqs, `${where} ${r.role}`), oi: oi(r.oi, `${where} ${r.role}`) });
  }
  if (!mod.roles.length) err(`${prefix} spec section 2 has no roles; the role switcher needs at least one`);
  const roles = mod.roles.map((r) => ({
    role: r.role, does: r.does ?? "", proposed: r.proposed, person: r.role, reqs: [], oi: null, ...roleOverlay.get(r.role),
  }));
  const roleNames = new Set(roles.map((r) => r.role));

  // ---- rules, reports ----
  const named = (key, all, nameOf, sectionNo) => {
    const ov = new Map();
    for (const [i, x] of list(pd[key], key, key).entries()) {
      const n = x?.[key === "rules" ? "rule" : "name"];
      if (!all.some((a) => nameOf(a) === n)) err(`${key}[${i}]: unknown ${key === "rules" ? "rule" : "report"} "${n}" (not in ${prefix} section ${sectionNo})`);
      else ov.set(n, { reqs: reqs(x.reqs, `${key}[${i}] ${n}`) });
    }
    return ov;
  };
  const ruleOv = named("rules", mod.rules, (r) => r.rule, 6);
  const rules = mod.rules.map((r) => ({ rule: r.rule, when: r.when, action: r.action, proposed: r.proposed, reqs: ruleOv.get(r.rule)?.reqs ?? [] }));
  const repOv = named("reports", mod.reports, (r) => r.name, 8);
  const reports = mod.reports.map((r) => ({ name: r.name, audience: r.audience, measures: r.measures, proposed: r.proposed, reqs: repOv.get(r.name)?.reqs ?? [] }));

  // ---- transitions ----
  const tid = (from, to) => `${from}>${to}`;
  const tOverlay = new Map();
  for (const [i, t] of list(pd.transitions, "transitions", "transitions").entries()) {
    const where = `transitions[${i}] ${t?.from} → ${t?.to}`;
    if (!mod.transitions.some((x) => x.from === t?.from && x.to === t?.to)) {
      err(`${where}: no such transition in ${prefix} section 5`);
      continue;
    }
    if (tOverlay.has(tid(t.from, t.to))) {
      err(`${where}: listed twice`);
      continue;
    }
    if (!text(t.action).trim()) err(`${where}: "action" (button label) missing`);
    const by = list(t.by, where, "by");
    if (!by.length) err(`${where}: "by" needs at least one role (or "system")`);
    for (const b of by) if (b !== "system" && !roleNames.has(b)) err(`${where}: by "${b}" is not a role in section 2 (or "system")`);
    if (by.includes("system") && by.length > 1) err(`${where}: by "system" stands alone`);
    let notify = null;
    if (t.notify !== undefined) {
      notify = list(t.notify, where, "notify");
      for (const n of notify) if (!roleNames.has(n)) err(`${where}: notify "${n}" is not a role in section 2`);
    }
    const ruleNames = list(t.rules, where, "rules");
    for (const n of ruleNames) if (!mod.rules.some((r) => r.rule === n)) err(`${where}: unknown rule "${n}" (not in section 6)`);
    const guard = list(t.guard, where, "guard");
    for (const g of guard) {
      if (!main?.fields.some((f) => f.name === g?.field)) err(`${where}: guard field "${g?.field}" is not a field of ${entity}`);
      if (!OPS.includes(g?.op)) err(`${where}: guard op "${g?.op}" (use ${OPS.join(" ")})`);
      if (!["number", "string"].includes(typeof g?.value)) err(`${where}: guard value must be a number or text`);
    }
    tOverlay.set(tid(t.from, t.to), {
      action: text(t.action).trim(), by, notify, rules: ruleNames, guard,
      reqs: reqs(t.reqs, where), oi: oi(t.oi, where),
    });
  }
  for (const t of mod.transitions) {
    if (!tOverlay.has(tid(t.from, t.to))) err(`transition ${t.from} → ${t.to} has no entry in prototype-data.json transitions (action, by)`);
  }
  const actors = (from) => [...new Set(mod.transitions.filter((t) => t.from === from)
    .flatMap((t) => tOverlay.get(tid(t.from, t.to))?.by ?? []).filter((b) => b !== "system"))];
  const owners = [...new Set(statuses.filter((s) => s.start).flatMap((s) => actors(s.id)))];
  const transitions = mod.transitions.map((t) => {
    const ov = tOverlay.get(tid(t.from, t.to)) ?? { action: t.trigger, by: [], notify: null, rules: [], guard: [], reqs: [], oi: null };
    // Next role: who acts on the new status; at an end status, the owner (who acts at the start).
    // Never the role that just acted; nobody left = no message.
    const others = (list) => list.filter((r) => !ov.by.includes(r));
    const next = others(actors(t.to));
    const notify = ov.notify ?? (next.length ? next : others(owners));
    return { id: tid(t.from, t.to), from: t.from, to: t.to, trigger: t.trigger, proposed: t.proposed, ...ov, notify };
  });
  const tById = new Map(transitions.map((t) => [t.id, t]));
  const keyRoles = new Set(transitions.length
    ? transitions.flatMap((t) => [...t.by, ...t.notify]).filter((b) => b !== "system")
    : roles.map((r) => r.role));
  for (const r of roles) r.key = keyRoles.has(r.role);

  // ---- sample rows ----
  const rowsIn = list(pd.rows, "rows", "rows");
  const max = Math.max(MAX_ROWS, statuses.length);
  if (rowsIn.length < MIN_ROWS || rowsIn.length > max) err(`rows: ${rowsIn.length} sample rows; write ${MIN_ROWS}–${max}`);
  const rowIds = new Set();
  const rows = rowsIn.map((r, i) => {
    const where = `rows[${i}]${r?.id ? ` ${r.id}` : ""}`;
    const id = text(r?.id).trim();
    if (!id) err(`${where}: "id" missing`);
    else if (rowIds.has(id)) err(`${where}: id ${id} used twice`);
    rowIds.add(id);
    if (statuses.length && !statusIds.has(r?.status)) err(`${where}: status "${r?.status}" is not in section 5`);
    const values = r?.values ?? {};
    if (typeof values !== "object" || Array.isArray(values)) err(`${where}: "values" must be an object of field name → value`);
    else for (const k of Object.keys(values)) if (!main?.fields.some((f) => f.name === k)) err(`${where}: "${k}" is not a field of ${entity}`);
    const children = r?.children ?? {};
    for (const [ent, crs] of Object.entries(children)) {
      const rec = mod.records.find((x) => x.entity === ent);
      if (!rec || ent === entity) err(`${where}: children "${ent}" is not another record in section 4`);
      else for (const cr of list(crs, where, `children ${ent}`)) for (const k of Object.keys(cr ?? {})) {
        if (!rec.fields.some((f) => f.name === k)) err(`${where}: "${k}" is not a field of ${ent}`);
      }
    }
    const log = list(r?.log, where, "log");
    for (const l of log) if (!Array.isArray(l) || l.length !== 3) err(`${where}: each log entry is [when, who, what]`);
    return { id, status: statuses.length ? r?.status : null, values, children, log: log.map((l) => l.map(text)) };
  });
  const missing = statuses.filter((s) => !rows.some((r) => r.status === s.id)).map((s) => s.id);
  if (missing.length) err(`rows: no sample row in status ${missing.join(", ")} (spread rows over every status)`);

  // ---- scenarios ----
  const scIn = list(pd.scenarios, "scenarios", "scenarios");
  if (!scIn.length) err("scenarios: write at least one");
  const scenarios = scIn.map((sc, i) => {
    const where = `scenarios[${i}]`;
    if (!text(sc?.title).trim()) err(`${where}: "title" missing`);
    const stepsIn = list(sc?.steps, where, "steps");
    if (!stepsIn.length) err(`${where}: needs at least one step`);
    const state = new Map(rows.map((r) => [r.id, r.status]));
    const steps = stepsIn.map((s, k) => {
      const w = `${where} step ${k + 1}`;
      const actor = s?.actor;
      if (actor !== "system" && !roleNames.has(actor)) err(`${w}: actor "${actor}" is not a role in section 2 (or "system")`);
      if (!text(s?.action).trim()) err(`${w}: "action" (what they do) missing`);
      const screen = s?.screen ?? (s?.row ? "record" : "sheet");
      if (!SCREENS.includes(screen)) err(`${w}: screen "${screen}" (use ${SCREENS.join(", ")})`);
      if (screen === "report" && !mod.reports.some((r) => r.name === s?.report)) err(`${w}: screen report needs "report" = a report name from section 8`);
      const row = s?.row ?? null;
      if (row !== null && !rowIds.has(row)) err(`${w}: unknown row "${row}"`);
      if (row === null && ["record", "chat"].includes(screen)) err(`${w}: screen ${screen} needs a "row"`);
      let t = null;
      if (s?.transition !== undefined) {
        t = tById.get(tid(s.transition?.from, s.transition?.to)) ?? null;
        if (!t) err(`${w}: transition ${s.transition?.from} → ${s.transition?.to} is not in section 5`);
        else if (row === null) err(`${w}: a transition needs a "row"`);
        else {
          if (state.get(row) !== t.from) err(`${w}: ${row} is "${state.get(row)}" here, not "${t.from}"`);
          if (!t.by.includes(actor)) err(`${w}: actor "${actor}" does not do ${t.from} → ${t.to} (by: ${t.by.join(", ")})`);
          const values = rows.find((r) => r.id === row)?.values ?? {};
          for (const g of t.guard) if (!holds(g, values)) err(`${w}: ${row} fails guard ${g.field} ${g.op} ${g.value}`);
          state.set(row, t.to);
        }
      }
      return {
        actor, action: text(s?.action), screen, row, report: s?.report ?? null,
        transition: t?.id ?? null, status: row !== null ? state.get(row) : null, notify: t?.notify ?? [],
        proves: reqs(s?.proves, w), oi: oi(s?.oi, w),
      };
    });
    return { title: text(sc?.title), summary: text(sc?.summary), steps };
  });

  // ---- done check ----
  const inScenario = new Set(scenarios.flatMap((sc) => sc.steps.map((s) => s.transition)).filter(Boolean));
  for (const t of transitions) if (!inScenario.has(t.id)) err(`done check: transition ${t.from} → ${t.to} is in no scenario`);
  const trace = Object.fromEntries(live.map((r) => [r.id, []]));
  const place = (ids, where) => ids.forEach((id) => trace[id]?.push(where));
  for (const r of roles) place(r.reqs, { tab: "app", what: `Role switcher: ${r.role}` });
  for (const r of roles.filter((x) => x.key)) place(r.reqs, { tab: "mob", what: `Phones: ${r.role}`, role: r.role });
  for (const rec of records) for (const f of rec.fields) {
    place(f.reqs, { tab: "app", what: `Record: ${rec.entity} › ${f.name}` });
    if (rec.entity === entity) place(f.reqs, { tab: "mob", what: `Phone record: ${f.name}` });
  }
  for (const t of transitions) {
    place(t.reqs, { tab: "app", what: `Action: ${t.action} (${sentence(t.from)} → ${sentence(t.to)})` });
    const chatRole = t.by.find((b) => b !== "system");
    if (chatRole) place(t.reqs, { tab: "mob", what: `Bot chat: ${t.action} (${chatRole})`, role: chatRole });
  }
  for (const r of rules) place(r.reqs, { tab: "app", what: `Rules: ${r.rule}` });
  for (const r of reports) place(r.reqs, { tab: "app", what: `Report: ${r.name}` });
  scenarios.forEach((sc, i) => sc.steps.forEach((s, k) => place(s.proves, { tab: "scen", what: `Scenario ${i + 1}. ${sc.title}, step ${k + 1}`, sc: i, step: k })));
  for (const [id, where] of Object.entries(trace)) if (!where.length) err(`done check: ${id} shows in no tab (add it to a field, role, action, rule, report or scenario step)`);

  // ---- Open Items shown ----
  const shown = new Set([
    ...mod.oiRefs, ...live.flatMap((r) => r.ois),
    ...roles.map((r) => r.oi), ...records.flatMap((r) => r.fields.map((f) => f.oi)), ...statuses.map((s) => s.oi),
    ...transitions.map((t) => t.oi), ...scenarios.flatMap((sc) => sc.steps.map((s) => s.oi)),
  ].filter((id) => id && isOpen(id)));
  const ois = Object.fromEntries([...shown].sort().map((id) => [id, oiById.get(id).question]));

  const mapping = mod.mapping;
  const model = {
    enterprise: data.enterprise.name,
    engagement: data.engagement.title,
    prefix,
    name: mod.name,
    app: mapping ? (mapping.neomeApp ? apps[mapping.neomeApp] ?? mapping.neomeApp : null) : undefined,
    delivery: mapping ? DELIVERY[mapping.delivery] ?? mapping.delivery : null,
    entity,
    records,
    roles,
    statuses,
    transitions,
    rules,
    reports,
    requirements: live.map((r) => ({
      id: r.id, title: r.title, statement: r.statement, acceptance: r.acceptance, priority: r.priority,
      proposed: r.proposed, ois: r.ois.filter(isOpen),
    })),
    ois,
    rows,
    scenarios,
    others: data.modules.filter((m) => m.prefix !== prefix && !m.status.startsWith("merged-into:")).map((m) => m.name),
    trace,
  };
  return { model, errors, warnings };
}

// "waiting-approval" → "Waiting approval" (same rule as the BRD status diagrams).
export function sentence(id) {
  const s = String(id).replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function holds(g, values) {
  const raw = values[g.field];
  const num = typeof g.value === "number";
  const a = num ? Number(raw) : String(raw ?? "");
  const b = g.value;
  if (num && (raw === undefined || raw === null || raw === "" || Number.isNaN(a))) return false;
  switch (g.op) {
    case "<": return a < b;
    case "<=": return a <= b;
    case ">": return a > b;
    case ">=": return a >= b;
    case "=": return a === b;
    case "!=": return a !== b;
    default: return false;
  }
}
