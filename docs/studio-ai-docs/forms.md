# Forms, composites and fields

Form structure. A form owns composites (sections/grids); fields live in composites. Call `schema kind=field` first to pick a type, then `schema kind=field variant=<type>` for its properties.

Generated from the live `schema` tool output (`EntArtifactBuilder.schema`). Property names, enums and required lists are exact.



## `form`

Form with its fields, composites, layouts, and form events. Add with name/details only — do not put compositeMap or fields on the form. Then add kind=composite (type=section), then kind=field with parent=form.

Required on add: `name`, `details`

| property | req | type | description |
|---|---|---|---|
| `mobileDefaultLayout` |  | string | Default mobile formLayout name (kind=formLayout). |
| `chatBubbleFields` |  | array of string |  |
| `description` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `commentRoles` |  | array of string |  |
| `formRenderingModeKind` |  | string | Form rendering mode for layouts. |
| `tabVariant` |  | string: standard \| scrollable \| fullWidth |  |
| `commentReadOnlyRoles` |  | array of string |  |
| `configForm` |  | boolean |  |
| `allowToPrintForm` |  | boolean |  |
| `chatLabelPattern` |  | object | Chat list label from a text var. Shape matches field prefix/default: { arg: text-var-name, argBinderMap? }. argBinderMap uses schema kind=argBinderMap. |
| `chatLabelPattern.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `chatLabelPattern.arg` |  | string | Resource name |
| `chatLabelField` |  | string | Resource name |
| `calculateFormulaMode` |  | string: automatic \| manual \| onSend |  |
| `chatPattern` |  | object | Chat bubble body from a paragraph var. Shape matches field prefix/default: { arg: paragraph-var-name, argBinderMap? }. argBinderMap uses schema kind=argBinderMap. |
| `chatPattern.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `chatPattern.arg` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `payment` |  | object | Call schema with kind=formPayment for the full shape, then set form property payment via set. Use enablePaymentV2 (legacy enablePayment is not supported in MCP). When enabled, amountField and referenceIdField are required. Not a standalone resource. |
| `asideDefaultLayout` |  | string | Default aside formLayout name (kind=formLayout). |




## `composite`

Section or grid inside a form. Needs parent form. Has variants by type. Create with type=section (or grid) after the form exists; required before adding fields.  Pass variant with one type value to see its own properties.

Required on add: `name`, `fieldMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `fieldMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `disabledField` |  | string | Resource name |
| `type` | yes | string: grid \| section \| spreadsheetRef | Polymorphic: each type has its own properties, not listed here. Pick one value and call schema again with {"kind":"composite","variant":"grid"}, using the chosen type as variant, to get its full schema before add; pass the same type inside properties. |
| `disabledRoles` |  | array of string |  |


### `composite / grid`

Required on add: `name`, `fieldMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `minRows` |  |  |  |
| `fieldMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `description` |  | string |  |
| `maxRowsField` |  | string | Resource name |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `maxRows` |  |  |  |
| `minRowsField` |  | string | Resource name |
| `rowActionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `showAllRowsField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `asideDefaultLayout` |  | string | Default aside gridLayout name on this grid (kind=gridLayout). |
| `disabledRoles` |  | array of string |  |


### `composite / section`

Required on add: `name`, `fieldMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `fieldMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `description` |  | string |  |
| `sectionVariant` |  | string: form \| propertyEditor |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `propertyEditorLabel` |  | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `direction` |  | string: horizontal \| vertical |  |
| `disabledRoles` |  | array of string |  |


### `composite / spreadsheetRef`

Required on add: `name`, `spreadsheet`, `refTargetField`, `fieldMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `maxRecords` |  | number |  |
| `fieldMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `description` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `actionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `layoutSpreadsheet` |  | string | Resource name |
| `inputMapping` |  | string | Resource name |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `refTargetField` | yes | string | Resource name |
| `rowActionPermissionMap` |  | object | Call schema with kind=actionPermission for each entry shape. Map keyed by action name; roles is required. Set actionPermissionMap via set on form, group, or composite. Example on group: {"BookSheetEditor":{"roles":["LibraryAdmin"]}}. Not a standalone resource. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |




## `field`

Field inside a form. Needs parent form. Has variants by type. Call schema kind=field (no variant) and pick type from enumDescriptions — never default to text when the name matches a type (Image→image, Camera→camera, Symbol→symbol, Duration→duration, Dob→date, Email→email, …). Pass composite=<section|grid name> when the form has more than one composite. Selections (gender, marital status, status, yes/no options): type=pickText. Prefer source=<setOfText var name> (create the var first) over inline constant options. People/members of the enterprise (Member, Borrower, Assignee): type=pickUser — never text. Links to another entity/spreadsheet row (Book→LibraryRoom, Booking→Book): type=ref with spreadsheet=<target sheet name> — never text. Do not use type=text for fixed choice lists or media/duration/symbol fields.  Pass variant with one type value to see its own properties.

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string: bool \| date \| decimal \| logDecimal \| image \| label \| number \| logNumber \| paragraph \| text \| chipSet \| chipSetDate \| chipSetDateTime \| chipSetDay \| chipSetDeviceSize \| chipSetDeviceType \| chipSetTime \| currency \| icon \| language \| timeZone \| pinShape \| lineStroke \| paymentStatus \| month \| quarter \| textSize \| messageKind \| pickRole \| pickText \| pickTree \| pickUser \| pickGridRow \| pickReportRow \| setOfRole \| setOfUser \| setOfText \| setOfEmail \| color \| hyperlink \| audio \| camera \| counter \| logCounter \| dateRange \| dateTime \| dateTimeRange \| duration \| email \| handle \| location \| mobileNumber \| rating \| signature \| slider \| time \| video \| voice \| geoPoint \| rowId \| symbol \| schedulerId \| spreadsheetId \| button \| divider \| document \| error \| html \| identifier \| info \| propertyMap \| scanCode \| setOfDocument \| showCode \| userId \| dynamic \| hyperlinkRow \| password \| ref \| refSet \| refUser \| refReport \| refTarget \| refContact | Polymorphic: each type has its own properties, not listed here. Choose the type that matches the data using enumDescriptions. Match field names to types via enumDescriptions (Image→image, Camera→camera, Symbol→symbol, Duration→duration, Dob→date — never text for those). Selections: type=pickText with source=<setOfText var>. People/members: type=pickUser with roleIdDataSource=[Role,…]. Links to another spreadsheet row: type=ref with spreadsheet=<sheet> and layoutSpreadsheet=<list\|card layout on that sheet> (refs reject table). Never type=text for those. Pick one value and call schema again with {"kind":"field","variant":"bool"}, using the chosen type as variant, to get its full schema before add; pass the same type inside properties. |
| `disabledRoles` |  | array of string |  |


### `field / audio`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `audioFormatType` |  | string: ogg \| mp3 \| wav |  |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / bool`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `captureLocation` |  | boolean |  |
| `captureTime` |  | boolean |  |
| `defaultValue` |  | boolean |  |
| `captureUser` |  | boolean |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `checkboxLabel` |  | object |  |
| `checkboxLabel.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `checkboxLabel.arg` |  | string | Resource name |
| `autoFocus` |  | boolean |  |
| `showAsCheckboxField` |  | string | Resource name |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelPlacement` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `showAsCheckbox` |  |  |  |
| `helperTextField` |  | string | Resource name |
| `position` |  |  |  |


### `field / button`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `whatsAppHandleField` |  | string | Resource name |
| `whatsAppMessage` |  | object |  |
| `whatsAppMessage.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `whatsAppMessage.arg` |  | string | Resource name |
| `btnPosDoNotInline` |  | boolean |  |
| `prefix` |  |  |  |
| `actionCloseAside` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `executeActionsAfterTargetSuccess` |  | boolean |  |
| `required` |  |  |  |
| `automationInputMapping` |  | string | Resource name |
| `spreadsheetMapping` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `pluginOutputMapping` |  | string | Resource name |
| `automation` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `action` |  | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `requiredRoles` |  | array of string |  |
| `btnPosFloating` |  | boolean |  |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `disableElevation` |  | string | Resource name |
| `reportOutputMapping` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `iconPosition` |  |  |  |
| `disabledElevation` |  | boolean |  |
| `buttonKind` |  | string: submit \| reset \| refresh \| normal |  |
| `disableElevationField` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `actionOpenLinkInNewTabField` |  | string | Resource name |
| `bgColor` |  |  |  |
| `requiredField` |  | string | Resource name |
| `textSizeField` |  | string | Resource name |
| `workflowInputMapping` |  | string | Resource name |
| `spreadsheet` |  | string | Resource name |
| `actionExecuteFormEvent` |  | string | Resource name |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |
| `btnPosMenu` |  | boolean |  |
| `textSize` |  |  |  |
| `toastMessageOnClick` |  | object |  |
| `toastMessageOnClick.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `toastMessageOnClick.arg` |  | string | Resource name |
| `actionOpenLinkInSameTab` |  | string | Resource name |
| `actionGroups` |  | array of string |  |
| `toolTip` |  | string |  |
| `autoFill` |  | boolean |  |
| `targetType` |  | string: callReport \| invokePlugin \| saveToSpreadsheet \| sendWhatsAppMessage \| triggerAction \| executeCallable \| startLocationTracking \| stopLocationTracking |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `reportInputMapping` |  | string | Resource name |
| `actionOpenLinkInSameTabField` |  | string | Resource name |
| `pluginErrorField` |  | string | Resource name |
| `buttonPosition` |  |  |  |
| `actionInputMapping` |  | string | Resource name |
| `workflowPointer` |  | object |  |
| `workflowPointer.autoDia` |  | string | Resource name |
| `workflowPointer.startNode` |  | string | Resource name |
| `btnPosToolbar` |  | boolean |  |
| `btnPosFooter` |  | boolean |  |
| `buttonVariant` |  |  |  |
| `report` |  | string | Resource name |
| `helperTextField` |  | string | Resource name |
| `actionOpenLinkInNewTab` |  | string | Resource name |
| `actionOutputMapping` |  | string | Resource name |


### `field / camera`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `showSizeField` |  | string | Resource name |
| `captureLocation` |  | boolean |  |
| `disableCompression` |  | boolean |  |
| `captureTime` |  | boolean |  |
| `captureUser` |  | boolean |  |
| `showPreviewField` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  |  |  |
| `pickImageRoles` |  | array of string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `showLabel` |  |  |  |
| `showLabelField` |  | string | Resource name |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `showSize` |  |  |  |
| `requiredField` |  | string | Resource name |
| `allowPickImage` |  | boolean |  |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `defaultImage` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showPreview` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `mediaCompressionQuality` |  | string: high \| balanced \| low |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `defaultImageField` |  | string | Resource name |


### `field / chipSet`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `allowDuplicate` |  | boolean |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetDate`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetDateTime`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetDay`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetDeviceSize`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetDeviceType`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / chipSetTime`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / color`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / counter`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `stepField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |
| `step` |  |  |  |


### `field / currency`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / date`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | object | Set exactly one of value, customValue |
| `defaultValue.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `defaultValue.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / dateRange`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | object | Set exactly one of value, customValue |
| `defaultValue.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `defaultValue.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `fromDefault` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `toDefaultField` |  | string | Resource name |
| `fromDefaultField` |  | string | Resource name |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `toDefault` |  |  |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / dateTime`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | object | Set exactly one of value, customValue |
| `defaultValue.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `defaultValue.time` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `defaultValue.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / dateTimeRange`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | object | Set exactly one of value, customValue |
| `defaultValue.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `defaultValue.time` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `defaultValue.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `fromDefault` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `toDefaultField` |  | string | Resource name |
| `fromDefaultField` |  | string | Resource name |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `displayDateFormat` |  | string |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `toDefault` |  |  |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / decimal`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `numberOfDigitsAfterPeriodField` |  | string | Resource name |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `numberFormat` |  | string |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `numberOfDigitsAfterPeriod` |  |  |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |


### `field / divider`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `dividerKind` |  |  |  |
| `color` |  |  |  |
| `description` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |


### `field / document`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showSizeField` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `defaultDocument` |  |  |  |
| `maxSize` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `showSize` |  |  |  |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `defaultDocumentField` |  | string | Resource name |
| `fileTypeSet` |  | array of string |  |


### `field / duration`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | object |  |
| `defaultValue.unit` |  | string: seconds \| minutes \| hours \| days \| weeks \| months \| quarters \| years |  |
| `defaultValue.value` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `excludeDurationUnits` |  | array of string |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `autoFormatValue` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / dynamic`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `ruleMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / email`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `invalidDomain` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `autoPickSelf` |  | boolean |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `validDomain` |  | string | Resource name |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / error`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `showCloseButton` |  | boolean |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / geoPoint`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / handle`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `invalidDomain` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `invalidMobileCountryCodeSet` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `autoPickSelf` |  | boolean |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `validDomain` |  | string | Resource name |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `validMobileCountryCodeSet` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / html`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultField` |  | string | Resource name |
| `defaultValue` |  | string |  |
| `description` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `default` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `showCloseButton` |  | boolean |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `disabledRoles` |  | array of string |  |


### `field / hyperlink`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / hyperlinkRow`

Required on add: `name`, `spreadsheet`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `hyperlinkFields` |  | array of string |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `displayText` |  | object |  |
| `displayText.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `displayText.arg` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / icon`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / identifier`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `setOnSend` |  | boolean |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `textPattern` |  | object |  |
| `textPattern.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `textPattern.arg` |  | string | Resource name |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / image`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showSizeField` |  | string | Resource name |
| `disableCompression` |  | boolean |  |
| `showPreviewField` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `showLabel` |  |  |  |
| `showLabelField` |  | string | Resource name |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `showSize` |  |  |  |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `defaultImage` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showPreview` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `mediaCompressionQuality` |  | string: high \| balanced \| low |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `defaultImageField` |  | string | Resource name |


### `field / info`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `italicField` |  | string | Resource name |
| `flexGrow` |  | boolean |  |
| `underlineField` |  | string | Resource name |
| `color` |  | string | Resource name |
| `underline` |  |  |  |
| `defaultValue` |  | string |  |
| `textPatternField` |  | string | Resource name |
| `description` |  | string |  |
| `justifyText` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `italic` |  |  |  |
| `showLabel` |  | boolean |  |
| `default` |  | object |  |
| `default.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `default.arg` |  | string | Resource name |
| `boldField` |  | string | Resource name |
| `bgColor` |  |  |  |
| `textSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `showCloseButton` |  | boolean |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `lineCount` |  |  |  |
| `disabledRoles` |  | array of string |  |
| `leftPadding` |  |  |  |
| `defaultField` |  | string | Resource name |
| `topPadding` |  |  |  |
| `textSize` |  |  |  |
| `rightPadding` |  |  |  |
| `lineCountField` |  | string | Resource name |
| `bottomPadding` |  |  |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `bold` |  |  |  |
| `textPattern` |  |  |  |
| `showBorder` |  | boolean |  |
| `strikeThrough` |  |  |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `labelPattern` |  | object |  |
| `labelPattern.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `labelPattern.arg` |  | string | Resource name |
| `opacityField` |  | string | Resource name |
| `strikeThroughField` |  | string | Resource name |
| `opacity` |  |  |  |


### `field / label`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `italicField` |  | string | Resource name |
| `underlineField` |  | string | Resource name |
| `color` |  | string | Resource name |
| `underline` |  |  |  |
| `textPatternField` |  | string | Resource name |
| `description` |  | string |  |
| `justifyText` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `italic` |  |  |  |
| `boldField` |  | string | Resource name |
| `bgColor` |  |  |  |
| `textSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |
| `textSize` |  |  |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `bold` |  |  |  |
| `textPattern` |  |  |  |
| `strikeThrough` |  |  |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `opacityField` |  | string | Resource name |
| `strikeThroughField` |  | string | Resource name |
| `opacity` |  |  |  |


### `field / language`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string | Two-letter ISO 639-1 language code, e.g. en for English, hi for Hindi |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / lineStroke`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: dash \| dotted \| solid |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / location`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `captureTime` |  | boolean |  |
| `defaultValue` |  | object |  |
| `defaultValue.dateTime` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `defaultValue.country` |  | string |  |
| `defaultValue.address` |  | string |  |
| `defaultValue.entUser` |  | string | Resource name |
| `defaultValue.city` |  | string |  |
| `defaultValue.geoPoint` |  | string |  |
| `captureUser` |  | boolean |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `captureMode` |  | string: manual \| onInsert \| onUpdate |  |


### `field / logCounter`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `stepField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `logReadRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |
| `step` |  |  |  |


### `field / logDecimal`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `numberOfDigitsAfterPeriodField` |  | string | Resource name |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `numberFormat` |  | string |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `numberOfDigitsAfterPeriod` |  |  |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `logReadRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |


### `field / logNumber`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `numberFormat` |  | string |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `logReadRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |


### `field / messageKind`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / mobileNumber`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `validCountryCodeSet` |  | string | Resource name |
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `autoPickSelf` |  | boolean |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `invalidCountryCodeSet` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / month`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: January \| February \| March \| April \| May \| June \| July \| August \| September \| October \| November \| December \| CurrentMonth \| PreviousMonth \| NextMonth |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / number`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `numberFormat` |  | string |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |


### `field / paragraph`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `flexHeight` |  | boolean |  |
| `minCharCountField` |  | string | Resource name |
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `maxCharCount` |  |  |  |
| `default` |  | object |  |
| `default.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `default.arg` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `lineCount` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `lineCountField` |  | string | Resource name |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `minCharCount` |  |  |  |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `maxCharCountField` |  | string | Resource name |


### `field / password`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `requireLowerCaseChar` |  | boolean |  |
| `minCharCountField` |  | string | Resource name |
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `maxCharCount` |  |  |  |
| `requireNumericChar` |  | boolean |  |
| `default` |  | object |  |
| `default.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `default.arg` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `securePassword` |  | boolean |  |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requireSpecialChar` |  | boolean |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `minCharCount` |  |  |  |
| `helperText` |  |  |  |
| `requireUpperCaseChar` |  | boolean |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `maxCharCountField` |  | string | Resource name |


### `field / paymentStatus`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: pending \| paid \| failed |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / pickGridRow`

Required on add: `name`, `grid`, `gridDisplayField`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `gridLayout` |  | string | Resource name |
| `gridDisplayField` | yes | string | Resource name |
| `copyFieldMap` |  | object | Keyed as describe prints |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `editableFields` |  | array of string |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `showAsDropdown` |  | boolean |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `grid` | yes | string | Resource name |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / pickReportRow`

Required on add: `name`, `report`, `reportOutputFormGrid`, `reportOutputFormGridLayout`, `gridDisplayField`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `copyFieldMap` |  | object | Keyed as describe prints |
| `gridDisplayField` | yes | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `editableFields` |  | array of string |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `reportOutputFormGridLayout` | yes | string | Resource name |
| `showAsDropdown` |  | boolean |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `reportOutputFormGrid` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `report` | yes | string | Resource name |
| `helperTextField` |  | string | Resource name |


### `field / pickRole`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showAs` |  | string: radioButtonVertical \| radioButtonHorizontal \| led \| dropdown |  |
| `defaultRole` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `defaultRoleField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / pickText`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `prefix` |  |  |  |
| `defaultOptionField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `source` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `sourceField` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showAs` |  | string: radioButtonVertical \| radioButtonHorizontal \| led \| dropdown |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `defaultOption` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `optionPermissionMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / pickTree`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `prefix` |  |  |  |
| `defaultOptionField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `includeAllChildrenInReport` |  | boolean |  |
| `source` |  | string | Resource name |
| `forceLeafSelection` |  | boolean |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `defaultOption` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / pickUser`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `defaultValue` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultValueField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `showAsDropdownField` |  | string | Resource name |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `showAsDropdown` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `roleIdDataSource` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `dataSource` |  | string | Resource name |


### `field / pinShape`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: avatar \| avatarWithName \| circle \| circleBig \| circleMedium \| circleWithLabel \| heart \| heartBig \| heartMedium \| label \| pin \| pinWithLabel \| square \| squareBig \| squareMedium \| star \| starBig \| starMedium \| triangle \| triangleBig \| triangleMedium |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / propertyMap`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / quarter`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: Quarter_1 \| Quarter_2 \| Quarter_3 \| Quarter_4 |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / rating`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `ratingKind` |  |  |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / ref`

Required on add: `name`, `spreadsheet`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showRefreshInMenu` |  | boolean |  |
| `showRefreshOnFields` |  | array of string |  |
| `refreshOn` |  | string: refreshOnOpen \| refreshOnSend \| refreshOnDemand |  |
| `copyFieldMap` |  | object | Keyed as describe prints |
| `description` |  | string |  |
| `mobileOverlayLayoutSpreadsheet` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fourthLine` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fourthLine.middle` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fourthLine.caption` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fourthLine.first` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fifthLine` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fifthLine.middle` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fifthLine.caption` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.fifthLine.first` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.imageWidth` |  |  |  |
| `mobileOverlayLayoutSpreadsheet.item.medias` |  | array of string |  |
| `mobileOverlayLayoutSpreadsheet.item.thirdLine` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.thirdLine.middle` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.thirdLine.caption` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.thirdLine.first` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.imageCorner` |  | string | Resource name |
| `mobileOverlayLayoutSpreadsheet.item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `mobileOverlayLayoutSpreadsheet.item.secondLine` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.secondLine.middle` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.secondLine.caption` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.secondLine.first` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.imageBackgroundColor` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `mobileOverlayLayoutSpreadsheet.item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `mobileOverlayLayoutSpreadsheet.item.mediaFields` |  | array of string |  |
| `mobileOverlayLayoutSpreadsheet.item.firstLine` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.firstLine.middle` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.firstLine.caption` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.firstLine.first` |  | object |  |
| `mobileOverlayLayoutSpreadsheet.item.imageHeight` |  |  |  |
| `forceOpenOnGridRowCreate` |  | boolean |  |
| `editableFields` |  | array of string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `canCreateRefRecord` |  | boolean |  |
| `keyFields` |  | array of string |  |
| `composite` |  | string | Composite name when the form has more than one |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |
| `lookupField` |  | string | Resource name |
| `createRefRecordMapping` |  | string | Resource name |
| `mobileLayoutSpreadsheet` |  | string | Resource name |
| `categoryFilterDisplayField` |  | string | Resource name |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `layoutSpreadsheet` |  | string | Resource name |
| `overlayLayoutSpreadsheet` |  | object |  |
| `overlayLayoutSpreadsheet.item` |  | object |  |
| `overlayLayoutSpreadsheet.item.fourthLine` |  | object |  |
| `overlayLayoutSpreadsheet.item.fourthLine.middle` |  | object |  |
| `overlayLayoutSpreadsheet.item.fourthLine.caption` |  | object |  |
| `overlayLayoutSpreadsheet.item.fourthLine.first` |  | object |  |
| `overlayLayoutSpreadsheet.item.fifthLine` |  | object |  |
| `overlayLayoutSpreadsheet.item.fifthLine.middle` |  | object |  |
| `overlayLayoutSpreadsheet.item.fifthLine.caption` |  | object |  |
| `overlayLayoutSpreadsheet.item.fifthLine.first` |  | object |  |
| `overlayLayoutSpreadsheet.item.imageWidth` |  |  |  |
| `overlayLayoutSpreadsheet.item.medias` |  | array of string |  |
| `overlayLayoutSpreadsheet.item.thirdLine` |  | object |  |
| `overlayLayoutSpreadsheet.item.thirdLine.middle` |  | object |  |
| `overlayLayoutSpreadsheet.item.thirdLine.caption` |  | object |  |
| `overlayLayoutSpreadsheet.item.thirdLine.first` |  | object |  |
| `overlayLayoutSpreadsheet.item.imageCorner` |  | string | Resource name |
| `overlayLayoutSpreadsheet.item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `overlayLayoutSpreadsheet.item.secondLine` |  | object |  |
| `overlayLayoutSpreadsheet.item.secondLine.middle` |  | object |  |
| `overlayLayoutSpreadsheet.item.secondLine.caption` |  | object |  |
| `overlayLayoutSpreadsheet.item.secondLine.first` |  | object |  |
| `overlayLayoutSpreadsheet.item.imageBackgroundColor` |  | object |  |
| `overlayLayoutSpreadsheet.item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `overlayLayoutSpreadsheet.item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `overlayLayoutSpreadsheet.item.mediaFields` |  | array of string |  |
| `overlayLayoutSpreadsheet.item.firstLine` |  | object |  |
| `overlayLayoutSpreadsheet.item.firstLine.middle` |  | object |  |
| `overlayLayoutSpreadsheet.item.firstLine.caption` |  | object |  |
| `overlayLayoutSpreadsheet.item.firstLine.first` |  | object |  |
| `overlayLayoutSpreadsheet.item.imageHeight` |  |  |  |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `forceOpenOnFormCreate` |  | boolean |  |


### `field / refContact`

Required on add: `name`, `copyFieldMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `copyFieldMap` | yes | object | Keyed as describe prints |
| `editableContactFieldSet` |  | array of string |  |
| `description` |  | string |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `disabledRoles` |  | array of string |  |


### `field / refReport`

Required on add: `name`, `report`, `grid`, `layoutGrid`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `copyFieldMap` |  | object | Keyed as describe prints |
| `layoutGrid` | yes | string | Resource name |
| `description` |  | string |  |
| `mobileLayoutGrid` |  | string | Resource name |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `forceOpenOnGridRowCreate` |  | boolean |  |
| `editableFields` |  | array of string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `overlayLayoutGrid` |  | object |  |
| `overlayLayoutGrid.item` |  | object |  |
| `overlayLayoutGrid.item.fourthLine` |  | object |  |
| `overlayLayoutGrid.item.fourthLine.middle` |  | object |  |
| `overlayLayoutGrid.item.fourthLine.caption` |  | object |  |
| `overlayLayoutGrid.item.fourthLine.first` |  | object |  |
| `overlayLayoutGrid.item.fifthLine` |  | object |  |
| `overlayLayoutGrid.item.fifthLine.middle` |  | object |  |
| `overlayLayoutGrid.item.fifthLine.caption` |  | object |  |
| `overlayLayoutGrid.item.fifthLine.first` |  | object |  |
| `overlayLayoutGrid.item.imageWidth` |  |  |  |
| `overlayLayoutGrid.item.medias` |  | array of string |  |
| `overlayLayoutGrid.item.thirdLine` |  | object |  |
| `overlayLayoutGrid.item.thirdLine.middle` |  | object |  |
| `overlayLayoutGrid.item.thirdLine.caption` |  | object |  |
| `overlayLayoutGrid.item.thirdLine.first` |  | object |  |
| `overlayLayoutGrid.item.imageCorner` |  | string | Resource name |
| `overlayLayoutGrid.item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `overlayLayoutGrid.item.secondLine` |  | object |  |
| `overlayLayoutGrid.item.secondLine.middle` |  | object |  |
| `overlayLayoutGrid.item.secondLine.caption` |  | object |  |
| `overlayLayoutGrid.item.secondLine.first` |  | object |  |
| `overlayLayoutGrid.item.imageBackgroundColor` |  | object |  |
| `overlayLayoutGrid.item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `overlayLayoutGrid.item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `overlayLayoutGrid.item.mediaFields` |  | array of string |  |
| `overlayLayoutGrid.item.firstLine` |  | object |  |
| `overlayLayoutGrid.item.firstLine.middle` |  | object |  |
| `overlayLayoutGrid.item.firstLine.caption` |  | object |  |
| `overlayLayoutGrid.item.firstLine.first` |  | object |  |
| `overlayLayoutGrid.item.imageHeight` |  |  |  |
| `mobileOverlayLayoutGrid` |  | object |  |
| `mobileOverlayLayoutGrid.item` |  | object |  |
| `mobileOverlayLayoutGrid.item.fourthLine` |  | object |  |
| `mobileOverlayLayoutGrid.item.fourthLine.middle` |  | object |  |
| `mobileOverlayLayoutGrid.item.fourthLine.caption` |  | object |  |
| `mobileOverlayLayoutGrid.item.fourthLine.first` |  | object |  |
| `mobileOverlayLayoutGrid.item.fifthLine` |  | object |  |
| `mobileOverlayLayoutGrid.item.fifthLine.middle` |  | object |  |
| `mobileOverlayLayoutGrid.item.fifthLine.caption` |  | object |  |
| `mobileOverlayLayoutGrid.item.fifthLine.first` |  | object |  |
| `mobileOverlayLayoutGrid.item.imageWidth` |  |  |  |
| `mobileOverlayLayoutGrid.item.medias` |  | array of string |  |
| `mobileOverlayLayoutGrid.item.thirdLine` |  | object |  |
| `mobileOverlayLayoutGrid.item.thirdLine.middle` |  | object |  |
| `mobileOverlayLayoutGrid.item.thirdLine.caption` |  | object |  |
| `mobileOverlayLayoutGrid.item.thirdLine.first` |  | object |  |
| `mobileOverlayLayoutGrid.item.imageCorner` |  | string | Resource name |
| `mobileOverlayLayoutGrid.item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `mobileOverlayLayoutGrid.item.secondLine` |  | object |  |
| `mobileOverlayLayoutGrid.item.secondLine.middle` |  | object |  |
| `mobileOverlayLayoutGrid.item.secondLine.caption` |  | object |  |
| `mobileOverlayLayoutGrid.item.secondLine.first` |  | object |  |
| `mobileOverlayLayoutGrid.item.imageBackgroundColor` |  | object |  |
| `mobileOverlayLayoutGrid.item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `mobileOverlayLayoutGrid.item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `mobileOverlayLayoutGrid.item.mediaFields` |  | array of string |  |
| `mobileOverlayLayoutGrid.item.firstLine` |  | object |  |
| `mobileOverlayLayoutGrid.item.firstLine.middle` |  | object |  |
| `mobileOverlayLayoutGrid.item.firstLine.caption` |  | object |  |
| `mobileOverlayLayoutGrid.item.firstLine.first` |  | object |  |
| `mobileOverlayLayoutGrid.item.imageHeight` |  |  |  |
| `keyFields` |  | array of string |  |
| `grid` | yes | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `report` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `forceOpenOnFormCreate` |  | boolean |  |
| `disabledRoles` |  | array of string |  |


### `field / refSet`

Required on add: `name`, `spreadsheet`, `displayField`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  | number |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `spreadsheet` | yes | string | Resource name |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `ejectionPolicy` |  | string: FIFO \| LIFO |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `allowDuplicateValues` |  | boolean |  |
| `helperText` |  |  |  |
| `layoutSpreadsheet` |  | string | Resource name |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `filterCondition` |  | object |  |
| `filterCondition.negation` |  | boolean |  |
| `filterCondition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `displayField` | yes | string | Resource name |
| `helperTextField` |  | string | Resource name |


### `field / refTarget`

Required on add: `name`, `refTargetSpreadsheetMap`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `composite` |  | string | Composite name when the form has more than one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `refTargetSpreadsheetMap` | yes | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `disabledRoles` |  | array of string |  |


### `field / refUser`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `defaultValue` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultValueField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `copyFieldVarMap` |  | object | Keyed as describe prints |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `roleIdDataSource` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `dataSource` |  | string | Resource name |


### `field / rowId`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / scanCode`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `captureLocation` |  | boolean |  |
| `captureTime` |  | boolean |  |
| `captureUser` |  | boolean |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `qrCode` |  | boolean |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `barCode` |  | boolean |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / schedulerId`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / setOfDocument`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showSizeField` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `defaultDocument` |  |  |  |
| `maxSize` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `showSize` |  |  |  |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `defaultDocumentField` |  | string | Resource name |
| `fileTypeSet` |  | array of string |  |


### `field / setOfEmail`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / setOfRole`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showAs` |  | string: checkboxVertical \| checkboxHorizontal \| dropdown |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `defaultRoleField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `defaultRoles` |  | array of string |  |
| `helperTextField` |  | string | Resource name |


### `field / setOfText`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `defaultValue` |  | array of string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `source` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `sourceField` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultValueField` |  | string | Resource name |
| `showAs` |  | string: checkboxVertical \| checkboxHorizontal \| dropdown |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `optionPermissionMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / setOfUser`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` |  | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `pluginInputMapping` |  | string | Resource name |
| `defaultValue` |  | string | Resource name |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultValueField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `showAsDropdownField` |  | string | Resource name |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `pluginErrorField` |  | string | Resource name |
| `showAsDropdown` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `roleIdDataSource` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `dataSource` |  | string | Resource name |


### `field / showCode`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `codeType` |  | string: barCode \| qrCode |  |
| `codeWidth` |  | number |  |
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `showLabel` |  |  |  |
| `showLabelField` |  | string | Resource name |
| `required` |  |  |  |
| `codeHeight` |  | number |  |
| `default` |  | object |  |
| `default.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `default.arg` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `helperTextColor` |  | object |  |
| `helperTextColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `helperTextColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / signature`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `captureLocation` |  | boolean |  |
| `captureTime` |  | boolean |  |
| `captureUser` |  | boolean |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / slider`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | number |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `stepField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `allowRangePicker` |  | boolean |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `showAsInputBox` |  | boolean |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `minDisplayValue` |  | number |  |
| `step` |  |  |  |


### `field / spreadsheetId`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / symbol`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string | Uppercase first letter, then alphanumeric |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / text`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `validationPattern` |  | object | Set exactly one of value, customValue |
| `validationPattern.customValue` |  | string |  |
| `validationPattern.value` |  | string: aadhaar \| gstin \| pan |  |
| `minCharCountField` |  | string | Resource name |
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `maxCharCount` |  |  |  |
| `default` |  | object |  |
| `default.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `default.arg` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `minCharCount` |  |  |  |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |
| `maxCharCountField` |  | string | Resource name |


### `field / textSize`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / time`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showSecond` |  |  |  |
| `defaultValue` |  | object | Set exactly one of value, customValue |
| `defaultValue.customValue` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `defaultValue.value` |  | string: now |  |
| `prefix` |  |  |  |
| `minField` |  | string | Resource name |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `showSecondField` |  | string | Resource name |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `min` |  |  |  |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `maxField` |  | string | Resource name |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `max` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / timeZone`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `default` |  | string | Resource name |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `defaultField` |  | string | Resource name |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / userId`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `defaultValue` |  | string: createdBy \| updatedBy |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `displayProperty` |  | string: nickName \| handle |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / video`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showSizeField` |  | string | Resource name |
| `showPreviewField` |  | string | Resource name |
| `prefix` |  |  |  |
| `allowPickVideo` |  | boolean |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  |  |  |
| `videoFormatType` |  | string: mp4 |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `showSize` |  |  |  |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `showPreview` |  |  |  |
| `requiredRoles` |  | array of string |  |
| `mediaCompressionQuality` |  | string: high \| balanced \| low |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |


### `field / voice`

Required on add: `name`, `details`, `type`

| property | req | type | description |
|---|---|---|---|
| `showCapturedValuesOnAside` |  | array of string |  |
| `captureLocation` |  | boolean |  |
| `captureTime` |  | boolean |  |
| `captureUser` |  | boolean |  |
| `prefix` |  |  |  |
| `icon` |  |  |  |
| `description` |  | string |  |
| `maxSize` |  |  |  |
| `autoFocus` |  | boolean |  |
| `suffix` |  |  |  |
| `disabledField` |  | string | Resource name |
| `type` | yes | string |  |
| `required` |  |  |  |
| `refField` |  | string | Resource name |
| `requiredField` |  | string | Resource name |
| `maxSizeField` |  | string | Resource name |
| `composite` |  | string | Composite name when the form has more than one |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `aiInstructions` |  | string |  |
| `disabled` |  |  |  |
| `placeHolder` |  |  |  |
| `hideLabel` |  | boolean |  |
| `disabledRoles` |  | array of string |  |
| `requiredRoles` |  | array of string |  |
| `autoFill` |  | boolean |  |
| `permissionMatrix` |  | object | Call schema with kind=permissionMatrix for the full shape (defaultPermission, map keyed by role name). Role permissions for this resource. Field overrides composite; composite overrides form. If unset at a level, the parent level applies. Null or absent matrix means inherit. Fetch once per session; set on form, composite, or field via set. Not a standalone resource. |
| `label` |  | string |  |
| `refTarget` |  | string | Resource name |
| `helperText` |  |  |  |
| `labelField` |  | string | Resource name |
| `placeHolderField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `helperTextField` |  | string | Resource name |

