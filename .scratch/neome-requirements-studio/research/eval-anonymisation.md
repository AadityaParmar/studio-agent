# Eval anonymisation map (tickets 40, 42)

Not shipped. Real → alias, applied to Inputs, answer key and golden alike.

| Case | Real | Alias |
|---|---|---|
| anglo-gulf-crm | Anglo Gulf | Crescent Gulf Chemicals (`crescent-gulf`) |
| anglo-gulf-crm | (no people named in the BRD) | Rania Haddad, Head of Sales (made up) |
| petrostar-crm | Petro Star Corporation LLC / PetroStar | Falcon Ridge Trading LLC (`falcon-ridge`) |
| petrostar-crm | Sriram, Finance Manager and Project Coordinator | Daniel Sousa, same role |
| petrostar-crm | Muscat, Sultanate of Oman | dropped ("in the Gulf") |
| petrostar-crm | PDO, OQ, Oxy, BP, Shell | dropped ("oil and gas operators") |

Kept: product lines, molecules, country lists in the Anglo Gulf deck (generic), Tally, SAP, dates.
Still real: the case folder names `anglo-gulf-crm`, `petrostar-crm` (named by ticket 42).

Inputs are **reconstructed** from the golden docs, not the real raw Inputs (Consultant chose this, 2026-10-29). Real Inputs replace them when supplied.
