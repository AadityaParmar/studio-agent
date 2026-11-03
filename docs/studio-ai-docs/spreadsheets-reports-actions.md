# Spreadsheets, reports, actions, groups, roles

Enterprise-level resources.

Generated from the live `schema` tool output (`EntArtifactBuilder.schema`). Property names, enums and required lists are exact.



## `spreadsheet`

Spreadsheet that stores rows of a form, with its layouts and permissions. REQUIRED: form=<existing form name>. Name it *Sheet (LibraryRoomSheet), not the same as the form. Create after that form's fields exist. Refs point at the spreadsheet name.

Required on add: `name`, `details`, `form`

| property | req | type | description |
|---|---|---|---|
| `uniqueIndexs` |  | array of string | Fields enforced unique via secondary-index checks (rare race under concurrency). Each listed field must also be in queryables. Controlled by uniquenessMode. |
| `groupForwardRolePermissionMap` |  | object | Keyed by the forwarder's role → group names they may forward into. Example: Employee→[Group1, Group2], Owner→[Group3]. |
| `description` |  | string | Author-only notes. Not shown to end clients. |
| `invisibleAfterDuration` |  | string | Duration var: after this time the row can no longer be read (hidden). |
| `auditTrailFormRoles` |  | array of string | Roles that can see row audit trail. Derived roles are allowed. |
| `partitionMap` |  | object | Named partitions that build a unique doc/row key from formula output (e.g. attendance: formula = current date so each user submits only one row per day). Each entry has assignPartitionField (text field) and formula (JS). Cannot combine with legacy uniques. |
| `showBorderSet` |  | array of string | Border kinds shown on spreadsheet layouts. Promoted from layoutSpreadsheetMap; not a StudioEntSpreadsheet field. |
| `indexHintField` |  | string | Resource name |
| `details` | yes | object | Optional details. modules lists module names this spreadsheet belongs to. |
| `details.modules` |  | array of string |  |
| `supportOffline` |  | boolean | Cache sheet data on mobile when connectivity is unreliable. Best for data that does not change often (same spirit as master sheets). |
| `placeholder` |  | object | Placeholder when the spreadsheet has no rows. Promoted from layoutSpreadsheetMap; not a StudioEntSpreadsheet field. |
| `isMasterSheet` |  | boolean | True for relatively stable reference data (items, discounts, customers), not high-churn transactional sheets. |
| `searchables` |  | array of string | Form fields searchable on this sheet (e.g. customer name, email, phone). Keep the set small — do not pollute with too many fields. |
| `removeRoles` |  | array of string | Roles that may remove rows. Derived roles ($Manager, $Assistant, …) are allowed. |
| `queryables` |  | array of string | Form fields usable in conditions/filters. Mark a field queryable when it is used in conditions. Unique-index fields must also be queryable. |
| `indexHint` |  | string |  |
| `historys` |  | array of string | Fields included in the audit-trail summary/tag line. Full before/after form values are still stored; this only picks the short summary fields. |
| `insertRoles` |  | array of string | Roles that may insert rows (e.g. every employee on Attendance; only HR/Admin/Accountant on SalaryRecord). Derived roles ($Manager, $Assistant, …) are not allowed — named roles only. |
| `readRole` |  | string | Optional setOfUser var for an extra/dynamic reader set (same group-message context as readRoles). Not a role name. |
| `clearRoles` |  | array of string | Roles allowed to wipe the whole spreadsheet. Do not set unless the author explicitly wants bulk clear. |
| `userForwardRolePermissionMap` |  | object | Keyed by the forwarder's role → role names whose users they may forward to. Example: Employee→[Employee] (Hiren can forward to Rahul, not Mitesh); Owner→[Employee, Owner] (Mitesh can forward to Employees and Owners). |
| `label` |  | string | Optional display label. Set only when it should differ from the auto label derived from name. |
| `updateRoles` |  | array of string | Roles that may update rows. Derived roles ($Manager, $Assistant, …) are allowed. |
| `readAfterDuration` |  | string | Duration var: after this time the row becomes read-only. |
| `readRoles` |  | array of string | Roles that can see a row when it is posted as a message in a group. The sender always sees their own post. Separate from form permissionMatrix (which still controls field visibility when the row is opened). |
| `form` | yes | string | REQUIRED on every add. Existing form name this spreadsheet stores rows for (e.g. form:"LibraryRoomForm"). A spreadsheet without form is invalid; refs use the spreadsheet name, not the form name. |
| `name` | yes | string | Spreadsheet symbol name. Uppercase first letter, then alphanumeric. Prefer *Sheet names distinct from the form (LibraryRoomSheet for LibraryRoomForm). Client label is auto-derived unless label is set (e.g. StudentSheetOne → "Student sheet one"). |
| `uniquenessMode` |  | string: individual \| combined | How uniqueIndexs are enforced. Default if unset: individual. individual = each field unique on its own; combined = the tuple is unique. |
| `bypassDurationRoles` |  | array of string | Roles that still see and edit after readAfterDuration / invisibleAfterDuration (e.g. employees locked after 1 day; Owner in bypassDurationRoles can still change). |
| `asideDefaultLayout` |  | string | Default aside spreadsheetLayout name (kind=spreadsheetLayout). Promoted from layoutSpreadsheetMap; not a StudioEntSpreadsheet field. |




## `report`

Report over spreadsheet rows (not an action). Has variants by kind. Create before kind=action kind=report. kind=spreadsheet needs fromSpreadsheet + outputForm + outputFormMapping (kind=var kind=mapping from sheet form to output form; use toGrid when mapping into a multi-row grid, or section→section for single-record/section fields); Call schema kind=report variant=spreadsheet before add (open schema omits fromSpreadsheet). add formLayout type=content rootLayout=true (direction=horizontal|vertical) on the output form for the report action.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`, `details`, `outputForm`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string: composite \| mapper \| plugin \| query \| spreadsheet | Polymorphic: each kind has its own properties, not listed here. For kind=spreadsheet you MUST call schema with variant=spreadsheet before add — fromSpreadsheet, outputForm, and outputFormMapping are only on that variant (open schema omits them). Never add spreadsheet report without fromSpreadsheet. Pick one value and call schema again with {"kind":"report","variant":"composite"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |


### `report / composite`

Required on add: `name`, `mergeReports`, `kind`, `details`, `outputForm`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `mergeReports` | yes | array of string |  |


### `report / mapper`

Required on add: `name`, `mappedReport`, `kind`, `details`, `outputForm`, `outputFormMapping`

| property | req | type | description |
|---|---|---|---|
| `mappedReport` | yes | string | Resource name |
| `inputFormMapping` |  | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `saveToSpreadsheet` |  | string | Resource name |
| `outputFormMapping` | yes | string | REQUIRED for kind=spreadsheet: kind=var kind=mapping name. Put wiring under properties.value (not top-level): Multi-row: value.fromForm=sheet form, value.toForm=outputForm, value.toGrid=grid name, value.fieldMappingMap. Single-record/section-only: value.fromForm + value.toForm + value.fieldMappingMap (no toGrid). Never pass a kind=text var. Never add the output grid onto the sheet form. |


### `report / plugin`

Required on add: `name`, `pluginApi`, `outputFormMapping`, `kind`, `details`, `outputForm`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` | yes | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `inputFormMapping` |  | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `outputFormMapping` | yes | string | REQUIRED for kind=spreadsheet: kind=var kind=mapping name. Put wiring under properties.value (not top-level): Multi-row: value.fromForm=sheet form, value.toForm=outputForm, value.toGrid=grid name, value.fieldMappingMap. Single-record/section-only: value.fromForm + value.toForm + value.fieldMappingMap (no toGrid). Never pass a kind=text var. Never add the output grid onto the sheet form. |


### `report / query`

Required on add: `name`, `neoQL`, `kind`, `details`, `outputForm`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `fromSpreadsheets` |  | array of string |  |
| `neoQL` | yes | object |  |
| `neoQL.value` |  | string |  |


### `report / spreadsheet`

Required on add: `name`, `fromSpreadsheet`, `kind`, `details`, `outputForm`, `outputFormMapping`

| property | req | type | description |
|---|---|---|---|
| `orderByField` |  | string | Resource name |
| `ascOrder` |  | boolean |  |
| `fromSpreadsheet` | yes | string | REQUIRED for kind=spreadsheet: source spreadsheet name (kind=spreadsheet), e.g. BookSheet. Must call schema kind=report variant=spreadsheet before add — this property is not on the open schema. |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `outputForm` | yes | string | Output form that receives report rows. Multi-row results need a type=grid on this form; single-record/section-only output may use a section. Add formLayout type=content rootLayout=true (direction=horizontal\|vertical) before kind=action kind=report. |
| `label` |  | string |  |
| `outputFormMapping` | yes | string | REQUIRED for kind=spreadsheet: kind=var kind=mapping name. Put wiring under properties.value (not top-level): Multi-row: value.fromForm=sheet form, value.toForm=outputForm, value.toGrid=grid name, value.fieldMappingMap. Single-record/section-only: value.fromForm + value.toForm + value.fieldMappingMap (no toGrid). Never pass a kind=text var. Never add the output grid onto the sheet form. |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `limit` |  | number |  |
| `inputForm` |  | string | Optional input/filter form name. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |




## `action`

Action members run, such as rowInsert, spreadsheetEditor, or user. Has variants by kind. kind=user requires kind=layoutUser first (pass layoutUser=layout name, or rely on web/mobile defaults). kind=report needs an existing kind=report resource + formLayout type=content rootLayout=true on that report's output form (report=report name, outputFormContentLayout=root content layout name) — never pass a spreadsheet, spreadsheetLayout, or nested sublayout (rootLayout=false).  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `increaseAsideWidth` |  | boolean |  |
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string: actionsSet \| executeCallable \| report \| rowInsert \| rowUpdate \| spreadsheetEditor \| spreadsheetHistory \| uiUpdate \| user | Polymorphic: each kind has its own properties, not listed here. spreadsheetEditor needs spreadsheet + layoutSpreadsheet. rowInsert needs spreadsheet; if that sheet has partitionMap, also set chatBubbleHeader={title,subTitle}. user needs kind=layoutUser first; pass layoutUser=layout name (or rely on web/mobile defaults). report needs kind=report first, then formLayout type=content rootLayout=true on the output form + a mapping var (toGrid for multi-row grid output, or section→section for single-record); pass report=report name and outputFormContentLayout=root content layout name — never a spreadsheet, spreadsheetLayout, or nested sublayout (rootLayout=false). Assign actions to a group via set group actionPermissionMap keyed by action name with roles=[RoleName,…] on each entry (roles required). Pick one value and call schema again with {"kind":"action","variant":"actionsSet"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `label` |  | string |  |


### `action / actionsSet`

Required on add: `name`, `actions`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `increaseAsideWidth` |  | boolean |  |
| `renderingMode` |  | string: grid \| list |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `actions` | yes | array of string |  |


### `action / executeCallable`

Required on add: `name`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `increaseAsideWidth` |  | boolean |  |
| `workflowPointer` |  | object |  |
| `workflowPointer.autoDia` |  | string | Resource name |
| `workflowPointer.startNode` |  | string | Resource name |
| `automation` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |


### `action / report`

Required on add: `name`, `report`, `outputFormContentLayout`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `outputFormContentLayout` | yes | string | formLayout type=content with rootLayout=true on the report's output form (create with kind=formLayout parent=outputForm type=content direction=horizontal\|vertical; rootLayout defaults to true). Not a nested sublayout (rootLayout=false) or spreadsheetLayout. |
| `mobileOutputFormContentLayout` |  | string | Optional mobile formLayout type=content with rootLayout=true on the report's output form. |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `outputFormTemplateLayout` |  | string | Optional formLayout type=template on the report's output form. |
| `sendMessageToInbox` |  | boolean |  |
| `increaseAsideWidth` |  | boolean |  |
| `mobileOutputFormTemplateLayout` |  | string | Optional mobile formLayout type=template on the report's output form. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `report` | yes | string | kind=report name (list kind=report). Not a spreadsheet. Create the report first. |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |


### `action / rowInsert`

Required on add: `name`, `spreadsheet`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `mobileFormEditorLayout` |  | string | Resource name |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `formEditorLayout` |  | string | Resource name |
| `sendMessageToInbox` |  | boolean |  |
| `formRenderingModeKind` |  | string: bottom \| dialog \| aside \| main |  |
| `increaseAsideWidth` |  | boolean |  |
| `chatBubbleHeader` |  | object |  |
| `chatBubbleHeader.image` |  | object |  |
| `chatBubbleHeader.image.fileName` |  | string |  |
| `chatBubbleHeader.image.size` |  | number |  |
| `chatBubbleHeader.image.mediaIdBlurImage` |  | string | Resource name |
| `chatBubbleHeader.image.mediaIdImage` |  | string | Resource name |
| `chatBubbleHeader.image.primaryColor` |  | string |  |
| `chatBubbleHeader.image.width` |  | number |  |
| `chatBubbleHeader.image.height` |  | number |  |
| `chatBubbleHeader.subTitle` |  | string |  |
| `chatBubbleHeader.title` |  | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |


### `action / rowUpdate`

Required on add: `name`, `spreadsheet`, `layoutSpreadsheet`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `lookupField` |  | string | Resource name |
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `layoutSpreadsheet` | yes | string | Resource name |
| `increaseAsideWidth` |  | boolean |  |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |


### `action / spreadsheetEditor`

Required on add: `name`, `spreadsheet`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `sendMessageToGroup` |  | string | Resource name |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `spreadsheet` | yes | string | Resource name |
| `inputForm` |  | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `doNotOpenAside` |  | boolean |  |
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `bulkInsertFields` |  | array of string |  |
| `bulkUpdateRoles` |  | array of string |  |
| `kind` | yes | string |  |
| `mobileLayoutSpreadsheet` |  | string | Resource name |
| `readOnly` |  | boolean |  |
| `label` |  | string |  |
| `layoutSpreadsheet` |  | string | Resource name |
| `increaseAsideWidth` |  | boolean |  |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `bulkUpdateFields` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `bulkInsertRoles` |  | array of string |  |


### `action / spreadsheetHistory`

Required on add: `name`, `spreadsheet`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `increaseAsideWidth` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |


### `action / uiUpdate`

Required on add: `name`, `updateKind`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `updateKind` | yes | string: groupSwitcher |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `increaseAsideWidth` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `group` |  | string | Resource name |


### `action / user`

Required on add: `name`, `kind`, `details`

| property | req | type | description |
|---|---|---|---|
| `backgroundColor` |  | object |  |
| `backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `borderColor` |  | object |  |
| `borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `kind` | yes | string |  |
| `defaultValueMap` |  | object | Keyed as describe prints |
| `layoutUser` |  | string | Resource name |
| `icon` |  | string |  |
| `tooltip` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `increaseAsideWidth` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |




## `group`

Group of members with its own actions, reports, and layout.

Required on add: `name`, `details`

| property | req | type | description |
|---|---|---|---|
| `groupPermissions` |  | array of string |  |
| `description` |  | string |  |
| `removeMessagePermissions` |  | array of string |  |
| `label` |  | string |  |
| `avatar` |  | string | Resource name |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `freezeAvatarKind` |  | string: rounded \| square |  |
| `freezeSortName` |  | string |  |
| `hideActionMenu` |  | boolean |  |
| `pinnedActionIdSetMobile` |  | array of string |  |
| `defaultAction` |  | string | Resource name |
| `freeze` |  | boolean |  |
| `pinnedActions` |  | array of string |  |
| `hideMembers` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `chatPermissions` |  | array of string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |




## `role`

User role that forms, spreadsheets, and groups grant permissions to.

Required on add: `name`, `details`

| property | req | type | description |
|---|---|---|---|
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |




## `module`

Module name that other resources reference to organize the app.

Required on add: `name`

| property | req | type | description |
|---|---|---|---|
| `name` | yes | string |  |




## `plugin`

Imported plugin and its APIs.

Required on add: `name`, `pluginBundle`, `plugin`, `pluginName`, `mode`, `pluginVersion`, `pluginApiIdKeys`, `pluginApiIdMap`, `pluginFormKeys`, `pluginFormMap`, `pluginVarKeys`, `pluginVarMap`

| property | req | type | description |
|---|---|---|---|
| `singleton` |  | boolean |  |
| `pluginAvatar` |  | string | Resource name |
| `authMap` |  | object |  |
| `authMap.defaultAuthMethod` |  | string | Resource name |
| `authMap.map` |  | object | Keyed as describe prints |
| `pluginFormMap` | yes | object | Keyed as describe prints |
| `kind` |  | string: plugin |  |
| `description` |  | string |  |
| `pluginVarMap` | yes | object | Keyed as describe prints |
| `pluginConfigForm` |  | string | Resource name |
| `pluginResourceMap` |  | object |  |
| `pluginResourceMap.rpc` |  | object |  |
| `pluginResourceMap.rpc.pluginConfigForm` |  | string | Resource name |
| `pluginResourceMap.dev` |  | object |  |
| `pluginResourceMap.dev.packageNameVar` |  | string |  |
| `pluginResourceMap.dev.pluginConfigForm` |  | string | Resource name |
| `pluginResourceMap.jar` |  | object |  |
| `pluginResourceMap.jar.packageNameVar` |  | string |  |
| `pluginResourceMap.jar.uploadJarMap` |  | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `pluginResourceMap.jar.pluginConfigForm` |  | string | Resource name |
| `pluginApiIdMap` | yes | object | Keyed as describe prints |
| `modules` |  | array of string |  |
| `pluginBundle` | yes | string | Resource name |
| `mode` | yes | string: agent \| javascript \| webService |  |
| `pluginVersion` | yes | string |  |
| `plugin` | yes | string | Resource name |
| `pluginName` | yes | string |  |
| `pluginAbout` |  | string |  |
| `pluginFormKeys` | yes | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `pluginApiIdKeys` | yes | array of string |  |
| `pluginVarKeys` | yes | array of string |  |




## `deeplink`

Deep link that opens a resource in the app. Has variants by kind.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`, `visibilityConstraint`, `creationRoles`, `expiry`

| property | req | type | description |
|---|---|---|---|
| `targetUserHandleField` |  | string | Resource name |
| `kind` | yes | string: report \| spreadsheetEditor \| spreadsheetInsert \| spreadsheetRow | Polymorphic: each kind has its own properties, not listed here. Pick one value and call schema again with {"kind":"deeplink","variant":"report"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `targetUserSpreadsheet` |  | string | Resource name |
| `userFieldMap` |  | object | Keyed as describe prints |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `showEnterpriseImageInLinkPreview` |  | boolean |  |
| `visibilityConstraint` | yes | string: enforceGlobalUserSignIn \| enforceEnterpriseUserSignIn \| makeAnEnterpriseUser \| allowPublicSharing |  |
| `makeUserDefaultRoles` |  | array of string |  |
| `expiry` | yes | string: onFirstClick \| withinOneWeek \| withinOneMonth \| noExpiry |  |
| `creationRoles` | yes | array of string |  |
| `modules` |  | array of string |  |


### `deeplink / report`

Required on add: `name`, `report`, `outputFormContentLayout`, `kind`, `visibilityConstraint`, `creationRoles`, `expiry`

| property | req | type | description |
|---|---|---|---|
| `outputFormContentLayout` | yes | string | Resource name |
| `transparentHeader` |  | boolean |  |
| `mobileOutputFormContentLayout` |  | string | Resource name |
| `showHeader` |  | boolean |  |
| `kind` | yes | string |  |
| `targetUserSpreadsheet` |  | string | Resource name |
| `description` |  | string |  |
| `showEnterpriseImageInLinkPreview` |  | boolean |  |
| `visibilityConstraint` | yes | string: enforceGlobalUserSignIn \| enforceEnterpriseUserSignIn \| makeAnEnterpriseUser \| allowPublicSharing |  |
| `makeUserDefaultRoles` |  | array of string |  |
| `outputFormTemplateLayout` |  | string | Resource name |
| `creationRoles` | yes | array of string |  |
| `modules` |  | array of string |  |
| `targetUserHandleField` |  | string | Resource name |
| `showEnterprise` |  | boolean |  |
| `mobileOutputFormTemplateLayout` |  | string | Resource name |
| `userFieldMap` |  | object | Keyed as describe prints |
| `report` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `expiry` | yes | string: onFirstClick \| withinOneWeek \| withinOneMonth \| noExpiry |  |
| `hyperlinks` |  | array of string |  |


### `deeplink / spreadsheetEditor`

Required on add: `name`, `spreadsheet`, `kind`, `visibilityConstraint`, `creationRoles`, `expiry`

| property | req | type | description |
|---|---|---|---|
| `transparentHeader` |  | boolean |  |
| `showHeader` |  | boolean |  |
| `kind` | yes | string |  |
| `targetUserSpreadsheet` |  | string | Resource name |
| `description` |  | string |  |
| `showEnterpriseImageInLinkPreview` |  | boolean |  |
| `mobileLayoutSpreadsheet` |  | string | Resource name |
| `visibilityConstraint` | yes | string: enforceGlobalUserSignIn \| enforceEnterpriseUserSignIn \| makeAnEnterpriseUser \| allowPublicSharing |  |
| `makeUserDefaultRoles` |  | array of string |  |
| `creationRoles` | yes | array of string |  |
| `modules` |  | array of string |  |
| `layoutSpreadsheet` |  | string | Resource name |
| `targetUserHandleField` |  | string | Resource name |
| `showEnterprise` |  | boolean |  |
| `userFieldMap` |  | object | Keyed as describe prints |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `expiry` | yes | string: onFirstClick \| withinOneWeek \| withinOneMonth \| noExpiry |  |
| `hyperlinks` |  | array of string |  |


### `deeplink / spreadsheetInsert`

Required on add: `name`, `spreadsheet`, `successMessage`, `kind`, `visibilityConstraint`, `creationRoles`, `expiry`

| property | req | type | description |
|---|---|---|---|
| `successMessageBgColor` |  | string | Resource name |
| `transparentHeader` |  | boolean |  |
| `description` |  | string |  |
| `showEnterpriseImageInLinkPreview` |  | boolean |  |
| `formEditorLayout` |  | string | Resource name |
| `repeatButtonLabel` |  | string |  |
| `successMessageTextSize` |  | string | Resource name |
| `showEnterprise` |  | boolean |  |
| `successDeeplink` |  | string | Resource name |
| `spreadsheet` | yes | string | Resource name |
| `expiry` | yes | string: onFirstClick \| withinOneWeek \| withinOneMonth \| noExpiry |  |
| `showRepeatButton` |  | boolean |  |
| `mobileFormEditorLayout` |  | string | Resource name |
| `showHeader` |  | boolean |  |
| `kind` | yes | string |  |
| `targetUserSpreadsheet` |  | string | Resource name |
| `visibilityConstraint` | yes | string: enforceGlobalUserSignIn \| enforceEnterpriseUserSignIn \| makeAnEnterpriseUser \| allowPublicSharing |  |
| `makeUserDefaultRoles` |  | array of string |  |
| `successMessage` | yes | object |  |
| `successMessage.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `successMessage.arg` |  | string | Resource name |
| `creationRoles` | yes | array of string |  |
| `modules` |  | array of string |  |
| `targetUserHandleField` |  | string | Resource name |
| `userFieldMap` |  | object | Keyed as describe prints |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `hyperlinks` |  | array of string |  |


### `deeplink / spreadsheetRow`

Required on add: `name`, `spreadsheet`, `kind`, `visibilityConstraint`, `creationRoles`, `expiry`

| property | req | type | description |
|---|---|---|---|
| `transparentHeader` |  | boolean |  |
| `showHeader` |  | boolean |  |
| `kind` | yes | string |  |
| `targetUserSpreadsheet` |  | string | Resource name |
| `description` |  | string |  |
| `showEnterpriseImageInLinkPreview` |  | boolean |  |
| `visibilityConstraint` | yes | string: enforceGlobalUserSignIn \| enforceEnterpriseUserSignIn \| makeAnEnterpriseUser \| allowPublicSharing |  |
| `makeUserDefaultRoles` |  | array of string |  |
| `creationRoles` | yes | array of string |  |
| `modules` |  | array of string |  |
| `formTemplateLayout` |  | string | Resource name |
| `targetUserHandleField` |  | string | Resource name |
| `showEnterprise` |  | boolean |  |
| `userFieldMap` |  | object | Keyed as describe prints |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `expiry` | yes | string: onFirstClick \| withinOneWeek \| withinOneMonth \| noExpiry |  |
| `formContentLayout` |  | string | Resource name |
| `hyperlinks` |  | array of string |  |




## `driveSheet`

Drive sheet backed by a spreadsheet.

Required on add: `name`, `spreadsheet`, `partitionedData`, `roles`

| property | req | type | description |
|---|---|---|---|
| `layoutMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `dataPartitionPeriod` |  | string: daily \| hourly \| weekly \| monthly \| quarterly \| yearly |  |
| `partitionedData` | yes | boolean |  |
| `attachmentRoles` |  | array of string |  |
| `exportKindSet` |  | array of string |  |
| `roles` | yes | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `spreadsheet` | yes | string | Resource name |
| `dataRetentionDuration` |  | object |  |
| `dataRetentionDuration.unit` |  | string: seconds \| minutes \| hours \| days \| weeks \| months \| quarters \| years |  |
| `dataRetentionDuration.value` |  | number |  |
| `modules` |  | array of string |  |




## `translation`

Translation of labels into another language.

Required on add: `name`, `phrase`, `type`

| property | req | type | description |
|---|---|---|---|
| `translationMap` |  | object | Keyed as describe prints |
| `phrase` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `type` | yes | string: text \| paragraph |  |
| `doNotShareWithPublicLibrary` |  | boolean |  |

