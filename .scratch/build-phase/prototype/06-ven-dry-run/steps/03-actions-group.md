# 03 actions + group

Status: done
Modules: VEN · Requirements: VEN-02, VEN-03, VEN-06, VEN-07 · Needs: 02

1. add var kind=condition VarActiveVendor: Status equalTo Active (sourceForm VendorForm)
2. add action AddVendor kind=rowInsert spreadsheet=VendorSheet
3. add action ManageVendors kind=spreadsheetEditor spreadsheet=VendorSheet layout=VendorTable
4. add action VendorDirectory kind=spreadsheetEditor readOnly, filter VarActiveVendor, layout=VendorDirectoryList (verify: validate may demand table)
5. add group Vendors
6. set group Vendors actionPermissionMap: AddVendor [BoardMember], ManageVendors [BoardMember], VendorDirectory [BoardMember, Member]
7. validate till ok; describe VendorSheet, group Vendors

## Run log
- 2026-11-04 Consultant yes. 6 writes + 1 set ok. VendorDirectory on list layout accepted (no table needed). validate ok.
- `diff_enterprise` FAILED x2: "form not found: mf-Si1SbBluw7" (new form only in draft). Fallback: `describe ent` counts: roles 2, vars 3, module 1, form 1, sheet 1, actions 3, group 1 = plan.
