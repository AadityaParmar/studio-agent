# 14: Prototype look from real Neome screens

Type: prototype
Status: resolved
Blocked by: None

## Question

Align the Prototype template (ticket 10) and its tokens to the real Neome product. Source: 51 CRM screenshots in `example/crm-screenshots/` (video frames). What do sheet, form, kanban, record detail, approvals, nav and mobile look like in Neome, and which of those patterns should the three tabs (app / scenarios / mobile) copy? Update `ui-reference/tokens.md` with the real colours, fonts, spacing and components; rework the ticket 10 prototype to react to.

## Constraints from earlier tickets

- From ticket 09: Prototype look so far = Vendorgate tokens in `ui-reference/tokens.md`; `ui-reference/screenshots/` is the drop spot (copy or link the chosen frames there).
- From ticket 10: one HTML per Module, 3 tabs, fixed template + per-Module data. This ticket changes look only, not shape.
- Open: does the BRD (ticket 05) also move to the product look, or keep the Vendorgate look?

## Answer

Prototype asset: [prototypes/14-neome-look-PROTOTYPE.html](../prototypes/14-neome-look-PROTOTYPE.html) (ticket 10 Quotation, same data and 3 tabs, new look). Consultant accepted as is.

**Prototype look = Neome product.** Tokens + components in [ui-reference/tokens.md](../ui-reference/tokens.md) "Neome product". Reference frames copied to `ui-reference/screenshots/`.

**Patterns per tab:**
1. **App**: desktop device frame with role title on top ("Name (Role)" = the role switcher). Left panel = tile launcher (data green / report blue / master data grey; other Modules' tiles greyed) + bot notifications. Main = grey title bar ("<Entity> sheet · Total rows"), Sheet (Action + Sr No. columns, pager) or Kanban (one tinted column per status, label:value cards). Record = right drawer over dimmed list, DETAILS / ACTIVITY tabs, outlined fields by section, actions as blue text buttons in grey footer. Blue FAB for create. Rules tables (e.g. discount bands) = master data sheet.
2. **Scenarios**: two-device view from the demo video: actor's desktop record + next role's phone receiving the bot notification. Proof + coverage panel unchanged.
3. **Mobile + trace**: phones = launcher home with notification, full-screen record, approve from bot chat. Trace unchanged.

**Rules:**
- Statuses show as coloured text (Neome style), kanban columns tinted per status.
- Requirement / OI / proposed chips stay as Studio overlay chips (not Neome UI).
- Every state change pushes a bot notification to the next role (shows Neome's conversational side).
- Approval screen not in footage → approve-from-chat is marked guessed. Real approval screens → fog.
- **BRD keeps the Vendorgate look** (Neomenta document, A4). Ticket 05 unchanged.
- Shape from ticket 10 unchanged.

## Comments

- Agent: not a git repo, so prototype kept in `prototypes/` (no throwaway branch).
