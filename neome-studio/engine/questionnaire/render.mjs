// Questionnaire views from the master (export-questionnaire). Same master in → byte-identical files out.
// HTML: Neome product look (Prototype tokens), one A4-printable page, no script, no external files
// (Roboto if installed, else system fonts). TXT: for WhatsApp / email, numbered items, no tables.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CSS = readFileSync(join(here, "qn.css"), "utf8");

const HOW = [
  "Reply Yes if the suggested answer is right, Edit with the right answer, or Don't know.",
  "Keep the OI number with your reply.",
  'Pass a question to the person in "For" if they know better.',
];

const count = (q) => q.sections.reduce((a, s) => a + s.items.length, 0);
const toLine = (h) => h.to;
const where = (h) => [h.enterprise, (h.engagement ?? "").replace(/\s*\([a-z0-9-]+\)$/, "")].filter(Boolean).join(" · ");
const again = (it) => (it.askedIn.length ? `asked before (${it.askedIn.join(", ")})` : "");

export function renderQuestionnaireTxt(q) {
  const h = q.head;
  const n = count(q);
  const out = [`*Questionnaire ${h.id}*`, `To: ${toLine(h)}`];
  if (h.from) out.push(`From: ${h.from}`);
  out.push(`${where(h)} · ${h.date ?? ""}`.replace(/ · $/, ""), `${n} question${n === 1 ? "" : "s"}.`, "", `How to reply: ${HOW.join(" ")}`);
  let i = 0;
  for (const s of q.sections) {
    out.push("", `*${s.key} · ${s.name}*`);
    for (const it of s.items) {
      i++;
      out.push("", `${i}. ${[it.id, it.askTo ? `For: ${it.askTo}` : "", again(it)].filter(Boolean).join(" · ")}`, it.question);
      if (it.suggested) out.push(`Suggested: ${it.suggested}`);
      out.push(it.suggested ? "Reply: Yes / Edit: ___ / Don't know" : "Reply: Answer: ___ / Don't know");
    }
  }
  return out.join("\n") + "\n";
}

export function renderQuestionnaireHtml(q) {
  const h = q.head;
  const n = count(q);
  const title = `Questionnaire ${h.id} · ${where(h)}`;
  const meta = [
    ["To", toLine(h)],
    ...(h.from ? [["From", h.from]] : []),
    ["About", where(h)],
    ["Date", h.date ?? ""],
    ["Questions", String(n)],
  ];
  let i = 0;
  const sections = q.sections.map((s) => {
    const items = s.items.map((it) => {
      i++;
      const reply = it.suggested
        ? `<span class="opt"><span class="box"></span>Yes</span><span class="opt grow"><span class="box"></span>Edit:<span class="fill"></span></span><span class="opt"><span class="box"></span>Don't know</span>`
        : `<span class="opt grow"><span class="box"></span>Answer:<span class="fill"></span></span><span class="opt"><span class="box"></span>Don't know</span>`;
      return `<article class="item" id="${esc(it.id)}">
<div class="ihead"><span class="n">${i}</span><span class="oi">${esc(it.id)}</span>${it.askTo ? `<span class="for">For: <b>${esc(it.askTo)}</b></span>` : ""}${again(it) ? `<span class="again">${esc(again(it))}</span>` : ""}</div>
<p class="q">${esc(it.question)}</p>
${it.suggested ? `<p class="sug"><span class="lbl">Suggested</span>${esc(it.suggested)}</p>\n` : ""}<div class="reply"><span class="lbl">Reply</span>${reply}</div>
</article>`;
    }).join("\n");
    return `<section class="mod">
<h2><span class="key">${esc(s.key)}</span>${esc(s.name)}<span class="cnt">${s.items.length}</span></h2>
${items}
</section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="neome-studio export-questionnaire">
<title>${esc(title)}</title>
<style>
${CSS}
@page{@bottom-center{content:"${cssStr(`${h.id} · page `)}" counter(page) " / " counter(pages);font:9pt Roboto,'Helvetica Neue',Arial,sans-serif;color:#9E9E9E}}
</style>
</head>
<body>
<header class="bar"><span class="brand">Neomenta</span><span class="doc">Questionnaire</span><span class="id">${esc(h.id)}</span></header>
<main>
<section class="top">
<h1>Questions for ${esc(h.to.replace(/\s*\(.*\)$/, ""))}</h1>
<dl class="meta">${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
<div class="how"><b>How to reply</b><ul>${HOW.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>
</section>
${sections}
</main>
</body>
</html>
`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const cssStr = (s) => String(s).replace(/["\\\n<]/g, "");
