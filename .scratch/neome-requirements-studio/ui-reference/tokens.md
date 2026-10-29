# Neome UI tokens

Two looks (ticket 14):
- **Prototype** (Module app mock) = **Neome product** look below.
- **BRD** = **Vendorgate** look below. BRD is a Neomenta document, not an app screen.

## Neome product (Prototype look) — from example/crm-screenshots/ (CRM demo video)

Material-style UI. Hex sampled from frames (video compression, ±2).

- font: Roboto (fallback Helvetica Neue, Arial, system-ui)
- primary #1976D2, primary dark #1565C0, primary soft #E3F2FD (FAB, active tab, links, text buttons)
- device frame border #466686, 2px, radius 6. Role title above frame: "<Name> (<Role>)" in #1565C0, 20px
- title bar #E8E8E8, 58px, avatar circle + title + subtitle ("Total rows: N") + icons (refresh, filter, more)
- left panel #F6F6F6; search pill white, radius 22, "Search messages or data"
- launcher tiles, 3 per row, radius 6, label bottom-left:
  - data entity: bg #E2F6E4, icon #2E7D32
  - report/dashboard: bg #E0F2FA, icon #1565C0
  - master data: bg #E6ECEE, icon #37474F
  - selected: bg #CFE6FA, border #90CAF9
- text #212121, secondary #5F6368, hint #9E9E9E; lines #E0E0E0; outline #C4C4C4
- kanban column tints (one per status): blue #DEF0FA, lavender #E6E0F2, green #E2F6E4, pink #F6E2E2, amber #FBEFD9; column title = status name + (count), centred, coloured
- kanban card: white, radius 4, light shadow, "Label: value" lines (label #3F6A90, value #5F6368), footer 💬 + time
- status shown as coloured text, not a pill: blue #1565C0, purple #6A1B9A, green #2E7D32, red #C62828, amber #A15C00
- sheet: columns Action (› ⋯) + Sr No. + fields; header filter glyphs; pager "1–N of N"
- record = right drawer over dimmed list (rgba(0,0,0,.32)), ~400px; header "› <Entity>" + 🗑; tabs DETAILS / ACTIVITY (uppercase, blue underline)
- fields: outlined, floating label 12px, radius 4; centred section divider text with lines; trailing icons (📅 date, ＋ ✕ lookup, 📞 phone, ✉ email); read-only helper "System-generated ID"
- lookup/choice: full-panel picker with search + "+" to add value
- drawer footer #E8E8E8: 💬 + uppercase blue text buttons ("➤ SEND")
- FAB: 46px circle #1976D2, "+", bottom-right
- dashboard: KPI tiles (big number, light bg), horizontal bar funnel, bar charts, filterable tables, date filter drawer
- chat: bg #E8E4DC (patterned), out bubble #D4FECC, in bubble #FFFFFF, sender name purple, quote bar purple, date pill white
- bot notifications in launcher list: "<App>" + time, "✨ <b>Title!</b> text"
- mobile: same launcher, role-filtered tiles, full-screen record, chat

Reference frames: [screenshots/](screenshots/) (home-launcher, sheet, kanban, record-drawer, lookup-picker, chat, dashboard, bot-notification).
Not seen in footage: approval screen. Prototype uses approve-from-bot-chat, marked guessed.

## Vendorgate (BRD look) — example/Vendorgate Build Proposal_final.html CSS vars
- neome #1877D5, neome-deep #115EA8, accent #F47100
- ink 900 #1C1C1E, 700 #3A3A3C, 500 #595959, 400 #8A8A8E, 300 #C7C7C5
- line strong #D8D8D4, subtle #E6E6E3
- surface base #F7F7F7, card #FFFFFF, dark #1D1D1F, dark-2 #262629
- fonts: Schibsted Grotesk (sans), JetBrains Mono (mono)

## neome.ai public site (sources/neome-site/raw/home.html) — info only
- blue #1976D2 / #1565C0, light blue #DBEAFE / #EFF6FF; stone greys; green #059669; font Inter
