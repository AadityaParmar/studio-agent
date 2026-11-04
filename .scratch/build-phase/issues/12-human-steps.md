# Human steps inside the build

Type: grilling
Status: resolved
Blocked by: 04

## Question

MCP can't do several build steps (ticket 01): install a Neome App, take the edit lock, create the Enterprise, set deploy var values, add users and roles to people, plugin import/config, data import. How do step files mark these: a human checklist step the run stops at and waits for "done"? Who checks it was done (e.g. `list` after App install)? Standard Delivery path depends on this.

## Answer

User, 2026-11-04 (Q1–Q3 taken as yes; Q4 changed):

1. Where: file `00` = take Studio edit lock, deploy empty Enterprise once, install Apps (Modules with choice A). `NN-deploy.md` = set deploy var values before deploy. Go-live list after deploy = add users, roles to people, import data (go-live detail still fog).
2. Check: agent checks where MCP can see it (`list` for App sheets, `deploy_status`); else Consultant's "done" logged with name + date.
3. Shape: `- [ ] HUMAN: <what> — <where in Studio>`; run log `done by <who> <date>`.
4. Plugins: always a human step (import + set URL/key). Agent suggests a plugin only where absolutely needed (Requirement can't be met without an outside system). No standing Open Item rule.

## Comments
