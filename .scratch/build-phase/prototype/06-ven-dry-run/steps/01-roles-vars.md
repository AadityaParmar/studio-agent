# 01 roles + vars

Status: done
Modules: VEN · Requirements: VEN-02, VEN-03, VEN-05, VEN-06 · Needs: 00

1. add module Vendors
2. add role BoardMember (label "Board Member")
3. add role Member
4. add var kind=setOfText VarServiceCategory, deploy=fixedOnDeploy: Landscaping, Plumber, Electrician, Maintenance, Other
5. add var kind=setOfText VarVendorStatus, deploy=fixedOnDeploy: Active (green), Inactive (grey)
6. validate

## Run log
- 2026-11-04 Consultant yes. 5 writes ok, validate ok. Option keys auto: keyLandscaping…keyOther, keyActive, keyInactive.
