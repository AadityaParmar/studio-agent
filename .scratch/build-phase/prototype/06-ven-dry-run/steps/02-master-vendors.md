# 02 master: Vendors

Status: done
Modules: VEN · Requirements: VEN-01, VEN-02, VEN-03, VEN-04, VEN-05, VEN-06 · Needs: 01

1. add form VendorForm (details.modules=[Vendors]); permissionMatrix default read, BoardMember write
2. add composite VendorDetails type=section (parent VendorForm)
3. add fields (parent VendorForm):
   - VendorName text, required
   - ServiceCategory pickText source=VarServiceCategory, required
   - ContactNumber mobileNumber, required
   - Email email
   - Address paragraph
   - GovernmentIdProof document, required; permissionMatrix default hide, BoardMember write (VEN-04)
   - AdditionalNotes paragraph
   - Status pickText source=VarVendorStatus, defaultOption Active, required
4. add spreadsheet VendorSheet form=VendorForm: insertRoles [BoardMember], updateRoles [BoardMember], no removeRoles (never delete, VEN-06), isMasterSheet, searchables [VendorName, ServiceCategory], queryables [Status, ServiceCategory]
5. add spreadsheetLayout VendorTable kind=table (VendorName, ServiceCategory, ContactNumber, Email, Status)
6. add spreadsheetLayout VendorDirectoryList kind=list, filter tab by ServiceCategory (VEN-07)
7. validate

## Run log
- 2026-11-04 Consultant yes. 14 writes ok. validate FAIL: list filter `categoryFields` rejects pickText ("ServiceCategory type is not a correct field type"); write itself was accepted. Fix 1: `set` categoryFields [] + `groupByField` ServiceCategory → validate ok.
- Schema `spreadsheetLayout variant=list` = 88 KB; read via script, not context.
