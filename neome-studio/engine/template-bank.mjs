// TEMP stub for slice 5; slice 1 owns this file and replaces it at merge.
// Only what slice 5 imports: BANK_DIR, loadBank, replacedBy, checkTemplateRef. No checkBank.
// CHANGELOG line shape (as slice 1's fixture): `- YYYY-MM-DD | <change> | <ids>[ -> <ids>] | <reason>`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { frontMatter } from "./markdown.mjs";

export const BANK_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "reference", "template-bank");
const FOLDERS = { templates: "template", "template-modules": "template-module", patterns: "pattern" };
const ids = (s) => String(s ?? "").split(",").map((x) => x.trim()).filter(Boolean);

export function loadBank(bankDir = BANK_DIR) {
  const entries = [];
  for (const [folder, kind] of Object.entries(FOLDERS)) {
    const d = join(bankDir, folder);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((n) => n.endsWith(".md")).sort()) {
      const file = join(d, f);
      const { fm, body } = frontMatter(readFileSync(file, "utf8"));
      entries.push({ id: String(fm?.id ?? basename(f, ".md")), kind, fm: fm ?? {}, body, file });
    }
  }
  const changelog = [];
  const log = join(bankDir, "CHANGELOG.md");
  let fenced = false;
  for (const line of existsSync(log) ? readFileSync(log, "utf8").split(/\r?\n/) : []) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    const m = !fenced && line.match(/^- (\d{4}-\d{2}-\d{2}) \| (\w+) \| ([^|]+?)\s*(?:\||$)/);
    if (!m) continue;
    const [from, to] = m[3].split("->");
    changelog.push({ date: m[1], change: m[2], ids: ids(from), replacedBy: ids(to) });
  }
  return { entries, changelog };
}

// Live IDs that replace a gone ID, following merge / split / rename chains. null = none.
export function replacedBy(bankDir, id) {
  const { entries, changelog } = loadBank(bankDir);
  const live = new Set(entries.map((e) => e.id));
  const out = [];
  const seen = new Set();
  const walk = (x) => {
    if (seen.has(x)) return;
    seen.add(x);
    if (live.has(x) && x !== id) return void out.push(x);
    const row = changelog.filter((c) => c.ids.includes(x) && c.replacedBy.length).at(-1);
    for (const y of row?.replacedBy ?? []) walk(y);
  };
  walk(id);
  return out.length ? [...new Set(out)] : null;
}

export function checkTemplateRef(bankDir, id) {
  if (loadBank(bankDir).entries.some((e) => e.id === id)) return { ok: true };
  const suggest = replacedBy(bankDir, id) ?? [];
  const tail = suggest.length ? `; replaced by ${suggest.join(", ")}` : "";
  return { ok: false, level: "warning", message: `${id} is not in the Template bank${tail}`, suggest };
}
