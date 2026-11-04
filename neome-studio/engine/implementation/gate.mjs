// Implementation gate (build-phase spec §2): Implementation may start when every Module is resolved (or merged)
// and every live Requirement is cleared: not proposed, and no open Open Item on its OIs line.
// Engagement-wide Requirements count too. Pure: takes BRD data (as validateEngagement builds it).
// Returns [{ cls: "implementation", msg }], Modules first, then Requirements in data order.
export function implementationBlockers(data) {
  const out = [];
  const block = (msg) => out.push({ cls: "implementation", msg });
  const merged = (m) => String(m.status).startsWith("merged-into:");
  for (const m of data.modules) {
    if (m.status !== "resolved" && !merged(m)) block(`Module ${m.prefix} is ${m.status}; every Module must be resolved or merged`);
  }
  const ois = new Map((data.openItems ?? []).map((o) => [o.id, o.status]));
  const live = [...data.modules.filter((m) => !merged(m)).flatMap((m) => m.requirements), ...(data.general?.requirements ?? [])].filter((r) => !r.withdrawn);
  for (const r of live) {
    if (r.proposed) block(`${r.id}: still (proposed, to confirm)`);
    for (const id of r.ois ?? []) {
      if (!ois.has(id)) block(`${r.id}: Open Item ${id} is not in the register`);
      else if (ois.get(id) === "open") block(`${r.id}: Open Item ${id} is open`);
    }
  }
  return out;
}
