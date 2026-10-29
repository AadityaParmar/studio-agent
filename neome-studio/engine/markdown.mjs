// Small markdown readers for the agent files: front-matter, headed sections, tables,
// bullets, `Key: value` lines and inline provenance (`[CE-1]`, `(proposed, to confirm)`).
import { parse } from "yaml";

export const SOURCE_ID = /^[A-Z]{2,4}(-\d+)?$/;
export const OI_ID = /^OI-\d{2,3}$/;
const PROPOSED = /\(?\s*proposed(?:\s+by\s+neomenta)?,\s*to\s+confirm\s*\)?/gi;
const CITATION = /\[([A-Z]{2,4}(?:-\d+)?(?:\s*,\s*[A-Z]{2,4}(?:-\d+)?)*)\](?!\()/g;
const EMPTY = new Set(["", "-", "–", "—", "none", "n/a"]);

export const isEmpty = (s) => EMPTY.has(String(s ?? "").trim().toLowerCase());

// Splits YAML front-matter from the body. Throws on bad YAML.
export function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: null, body: text };
  return { fm: parse(m[1]) ?? {}, body: text.slice(m[0].length) };
}

export function firstHeading(text) {
  const m = text.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

// Sections under headings of one level: [{ title, body }]. Text before the first is dropped.
export function sections(text, level) {
  const marker = "#".repeat(level);
  const re = new RegExp(`^${marker}\\s+(.+?)\\s*#*\\s*$`);
  const out = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(re);
    if (m && !line.startsWith(marker + "#")) {
      current = { title: m[1].trim(), lines: [] };
      out.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return out.map(({ title, lines }) => ({ title, body: lines.join("\n").trim() }));
}

// Lowercase, drop "(s)" / "(OI)" style parts, squash spaces.
export const normHeader = (h) =>
  h.toLowerCase().replace(/\([^)]*\)/g, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

function splitRow(line) {
  const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
  return cells.map((c) => c.replace(/\\\|/g, "|").trim());
}

// Every markdown table in the text: [{ headers: [normalised], rows: [{ header: cell }] }].
export function tables(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith("|") || !/^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "")) continue;
    if (!(lines[i + 1] ?? "").includes("-")) continue;
    const headers = splitRow(lines[i]).map(normHeader);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      const cells = splitRow(lines[j]);
      rows.push(Object.fromEntries(headers.map((h, k) => [h, cells[k] ?? ""])));
    }
    out.push({ headers, rows });
    i = j - 1;
  }
  return out;
}

// Finds the column whose header starts with any of the names.
export function column(table, ...names) {
  return table.headers.find((h) => names.some((n) => h === n || h.startsWith(n))) ?? null;
}

// Top-level bullets ("- " or "* "), with indented continuation lines joined.
export function bullets(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^[-*]\s+(.*)$/);
    if (m) out.push(m[1].trim());
    else if (out.length && /^\s+\S/.test(line) && !/^\s+[-*]\s/.test(line)) out[out.length - 1] += " " + line.trim();
  }
  return out;
}

// "CE-1, QA-2" → ids that look like Source IDs (Open Item IDs are not Sources).
export function idList(text) {
  if (isEmpty(text)) return [];
  return [...String(text).matchAll(/\b[A-Z]{2,4}(?:-\d+)?\b/g)].map((m) => m[0]).filter((id) => !OI_ID.test(id));
}

export function oiList(text) {
  return [...String(text ?? "").matchAll(/\bOI-\d+\b/g)].map((m) => m[0]);
}

export function list(text) {
  if (isEmpty(text)) return [];
  return String(text).split(",").map((s) => s.trim()).filter((s) => !isEmpty(s));
}

// Pulls inline provenance out of a text: returns clean text, cited Source IDs, proposed flag.
export function provenance(text) {
  const s = String(text ?? "");
  const proposed = PROPOSED.test(s);
  PROPOSED.lastIndex = 0;
  const sources = [];
  const clean = s
    .replace(CITATION, (_, ids) => {
      const found = ids.split(",").map((x) => x.trim());
      if (found.some((id) => OI_ID.test(id))) return `[${ids}]`;
      sources.push(...found);
      return "";
    })
    .replace(PROPOSED, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
  PROPOSED.lastIndex = 0;
  return { text: clean, sources, proposed };
}

export const isProposedCell = (cell) => /proposed/i.test(String(cell ?? ""));

export const unique = (arr) => [...new Set(arr)];
