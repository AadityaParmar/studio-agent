# Answer key: petrostar-crm

Reconstructed and anonymised (see [README.md](README.md)). The RFP holds what the Enterprise asked for; this key adds the business facts the RFP states in its own words, nothing more. Every fact the simulated client may give is below, with its ID. Anything else is Don't know.

## Enterprise

| ID | Fact |
|---|---|
| K-01 | Falcon Ridge Trading supplies equipment and materials to oil and gas operators in the Gulf, back to back: it represents manufacturers (principals) and sells their products to operators and their contractors. About 10 users: sales, operations, finance. |
| K-02 | Daniel Sousa, Finance Manager and Project Coordinator, speaks for Falcon Ridge on the CRM. |
| K-03 | A product reaches a tender only after each operator has approved it; each operator runs its own approval process. |
| K-04 | Two order types. Own-account orders run through Falcon Ridge's books. Commission orders go buyer to principal; Falcon Ridge earns a pre-agreed commission of about 3%, invoiced to the principal, kept out of its own order book. |
| K-05 | Post-order documents (ITP, GAD, MTC, WPS/PQR, inspection records, client approval) must close before goods move. |
| K-06 | Cost, margin, commission terms and principal pricing must stay with a named few. |
| K-07 | SAP stays the system of record for orders and finance. No live integration needed now. |
| K-08 | Everything in the RFP is right as written. |

## Consultant choices

- Enterprise folder `falcon-ridge`, Enterprise name "Falcon Ridge Trading". Engagement slug `quote-to-cash-crm`, title "Quote-to-cash CRM".
- Module set: one Module per RFP Section 5 module (17). Accept a merge only when the skill shows two are the same work; accept the skill's names and prefixes.
- Security, migration, training and support are across all Modules, not a Module.
- Priorities: accept the skill's proposal.
- resolve-module: live mode; the Enterprise answers through you, from this key only. Accept the skill's recommended Neome App and Delivery for each Module.
- Commits and pushes: yes.
