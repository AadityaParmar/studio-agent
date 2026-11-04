# Cheat sheet: forms, composites, fields, layouts via `neome-studio` MCP

Source: `docs/studio-ai-docs/forms.md`, `layouts.md` (live `schema` dump). (inf) = inferred from prop name. Run `schema kind=<k> variant=<v>` before `add`; put same `type`/`kind` in properties.

## Global rules
- `name`: Uppercase first letter, then alphanumeric (`BookForm`). Also `symbol.defaultValue`.
- "Resource name" props take another resource's NAME (field/var/layout/role/sheet), not id/label.
- `details` REQUIRED on form/composite/field: `{}` or `{"modules":["Mod"]}`.
- Discriminator: `type` on composite/field/formLayout; `kind` on gridLayout/spreadsheetLayout/layoutUser (don't confuse with resource-kind arg).
- `XField` = field that supplies X at runtime; `XRoles` = role names.
- Ordered maps keyed by id (`fieldMap`) or by name (`ruleMap`, `swimlaneMap`, `xAxisMap`, table `header`/`footer`/`styleMap`). Same key = update; new key = add.
- Pattern objects `{arg:<text|paragraph var>, argBinderMap?}`: `chatLabelPattern`, `chatPattern`, `checkboxLabel`, `default` (text/paragraph/password/info/showCode), `textPattern` (identifier), `labelPattern`, `displayText`, `whatsAppMessage`, `toastMessageOnClick`. See `schema kind=argBinderMap`/`argBinder`.
- `permissionMatrix` (`schema kind=permissionMatrix`): field > composite > form; unset = inherit. `actionPermissionMap`: `{"Act":{"roles":["Role"]}}`.

## `form` (root)
- req: `name`, `details`. Never put compositeMap/fields on form.
- opt: `label`, `mobileDefaultLayout`/`asideDefaultLayout` (formLayout names), `calculateFormulaMode` automatic|manual|onSend, `tabVariant` standard|scrollable|fullWidth, `allowToPrintForm`, `commentRoles[]`, `commentReadOnlyRoles[]`, `chatLabelField`, `chatBubbleFields[]`, `permissionMatrix`, `actionPermissionMap`.
- `payment` (`schema kind=formPayment`): `enablePaymentV2` only; then `amountField` + `referenceIdField` required.

## `composite` (parent=<Form>)
- req: `name`, `fieldMap` (`{}`; fields added as kind=field (inf)), `details`, `type`. opt: `label`, `disabled`/`disabledField`/`disabledRoles[]`, `permissionMatrix`, `actionPermissionMap`.
- `section`: `sectionVariant` form|propertyEditor, `direction` horizontal|vertical, `propertyEditorLabel`.
- `grid`: `minRows`/`maxRows` (+Field), `showAllRowsField`, `rowActionPermissionMap`, `asideDefaultLayout` (gridLayout).
- `spreadsheetRef`: + req `spreadsheet`, `refTargetField`. opt `layoutSpreadsheet`, `inputMapping`, `filterCondition{cond,negation}`, `maxRecords`.

## `field` (parent=<Form>; `composite=<name>` if >1 composite)
req: `name`, `details`, `type` + per-type REQ below.
Common: `label`, `hideLabel`, `helperText`, `placeHolder`, `prefix`, `suffix`, `icon`, `autoFocus`, `autoFill`, `required`/`requiredField`/`requiredRoles[]`, `disabled`/`disabledField`/`disabledRoles[]` (= read-only), `refField`, `refTarget`, `permissionMatrix`.
Defaults: `defaultValue` literal (typed per field); `default` var name or pattern; `defaultField` copy from field.
Capture (bool, camera, scanCode, signature, voice): `captureLocation`/`captureTime`/`captureUser`, `showCapturedValuesOnAside[]`.
No field prop for formula/visible/hidden. Use `formFormula`, `formEventAction` hidden|visible (logic-sheets.md).

| type | use | REQ / key props |
|---|---|---|
| text | free words | `validationPattern{value:aadhaar\|gstin\|pan` or `customValue}`, `min/maxCharCount` |
| paragraph | long text | `lineCount`, `flexHeight`, char counts |
| password | secret | `requireLowerCaseChar`/`UpperCase`/`Numeric`/`Special`, `securePassword` |
| number / decimal | qty | `defaultValue` num, `min`, `max`, `numberFormat`; decimal `numberOfDigitsAfterPeriod` |
| logNumber / logDecimal / logCounter | base + value log (inf) | base props + `logReadRoles[]` |
| counter / slider | stepper / range | `min`, `max`, `step`; slider `allowRangePicker`, `showAsInputBox` |
| currency | money code | `defaultValue` str |
| bool | yes/no | `defaultValue` bool, `showAsCheckbox`, `checkboxLabel` |
| date | date | `defaultValue{value` now\|tomorrow\|yesterday\|lastWeek..nextYear\|startOfMonth..endOfYear\|createdOn\|updatedOn, or `customValue` ISO UTC}, `min/max`, `displayDateFormat` |
| dateTime | date+time | date + `defaultValue.time` "HH:MM:SS" |
| dateRange / dateTimeRange | from-to | `fromDefault`/`toDefault` (+Field) |
| time | time | `defaultValue{value:"now"` or `customValue:"HH:MM:SS"}`, `showSecond` |
| duration | span | `defaultValue{value,unit seconds..years}`, `excludeDurationUnits[]` |
| month / quarter | period | `defaultValue` January..December\|CurrentMonth\|PreviousMonth\|NextMonth / Quarter_1..4 |
| chipSet (+Date/DateTime/Day/Time/DeviceSize/DeviceType) | tags | `allowDuplicate`; typed ones `defaultValue[]` |
| email / handle / mobileNumber | contact | `validDomain`/`invalidDomain`, `validCountryCodeSet`/`invalidCountryCodeSet` (handle: `...MobileCountryCodeSet`), `autoPickSelf` |
| hyperlink / setOfEmail | URL / emails | `default` / `defaultValue[]` |
| hyperlinkRow | link to row | REQ `spreadsheet`; `hyperlinkFields[]`, `displayText` |
| pickText | single choice | `source`=setOfText var (create first), `defaultOption`, `showAs` radioButtonVertical\|radioButtonHorizontal\|led\|dropdown |
| setOfText | multi choice | `source`, `defaultValue[]`, `showAs` checkboxVertical\|checkboxHorizontal\|dropdown |
| pickTree | tree choice | `source`=var kind=tree (inf), `forceLeafSelection` |
| pickUser / setOfUser / refUser | member(s) | `roleIdDataSource[]` (validate needs it), `dataSource`, `showAsDropdown`; refUser `copyFieldVarMap` |
| pickRole / setOfRole | role(s) | `defaultRole` / `defaultRoles[]`, `showAs` |
| userId | auto user | `defaultValue` createdBy\|updatedBy, `displayProperty` nickName\|handle |
| ref | link to sheet row | REQ `spreadsheet`; `layoutSpreadsheet`=list\|card ON that sheet (table rejected); `copyFieldMap`, `keyFields[]`, `editableFields[]`, `filterCondition{cond,negation}`, `refreshOn` refreshOnOpen\|refreshOnSend\|refreshOnDemand, `canCreateRefRecord`+`createRefRecordMapping`. No `required` prop. |
| refSet | many rows | REQ `spreadsheet`, `displayField`; `layoutSpreadsheet`, `maxSize`, `ejectionPolicy` FIFO\|LIFO |
| refReport | report row | REQ `report`, `grid`, `layoutGrid`; `copyFieldMap`, `keyFields[]` |
| refTarget | multi-sheet target | REQ `refTargetSpreadsheetMap` |
| refContact | phone contact | REQ `copyFieldMap` |
| pickGridRow | row of grid on form | REQ `grid`, `gridDisplayField`; `gridLayout`, `copyFieldMap` |
| pickReportRow | report output row | REQ `report`, `reportOutputFormGrid`, `reportOutputFormGridLayout`, `gridDisplayField` |
| image / camera | photo | `maxSize`, `showPreview`, `mediaCompressionQuality` high\|balanced\|low; camera `allowPickImage`, `pickImageRoles[]` |
| video / audio / voice | media | `videoFormatType` mp4, `audioFormatType` ogg\|mp3\|wav, `maxSize` |
| document / setOfDocument | files | `fileTypeSet[]`, `maxSize` |
| signature | sign pad | capture props |
| scanCode | scan | `barCode`, `qrCode` bools |
| showCode | render code | `codeType` barCode\|qrCode, `codeWidth`, `codeHeight`, `default` |
| geoPoint / location | geo | location: `captureMode` manual\|onInsert\|onUpdate, `defaultValue{geoPoint,address,city,country}` |
| rating / color / icon / language / timeZone / textSize / pinShape / lineStroke / messageKind / paymentStatus | pickers | `defaultValue` (language ISO 639-1; lineStroke dash\|dotted\|solid; paymentStatus pending\|paid\|failed); rating `ratingKind` |
| symbol / identifier | code / auto id | identifier `textPattern{arg}`, `setOnSend` |
| rowId / spreadsheetId / schedulerId / propertyMap | system | common only |
| dynamic | rule-driven | `ruleMap` |
| button | trigger | `buttonKind` submit\|reset\|refresh\|normal; `targetType` callReport(`report`,`reportInputMapping`,`reportOutputMapping`)\|invokePlugin(`pluginApi.metaIdPlugin`,`pluginInputMapping`)\|saveToSpreadsheet(`spreadsheet`,`spreadsheetMapping`)\|sendWhatsAppMessage(`whatsAppHandleField`,`whatsAppMessage`)\|triggerAction(`action`,`actionInputMapping`)\|executeCallable\|startLocationTracking\|stopLocationTracking (pairing inf). Also `workflowPointer{autoDia,startNode}`, `automation`, `actionExecuteFormEvent`, `actionOpenLinkInNewTab`, `toastMessageOnClick`, `btnPosFooter`/`Toolbar`/`Menu`/`Floating` |
| label / info | static text | `textPattern`, `bold`/`italic`, `color`, `textSize`; info `defaultValue`, `showBorder`, `showCloseButton` |
| error / html / divider | display | `showCloseButton`; html `defaultValue`; divider `dividerKind` |

## `formLayout` (parent=<Form>) req `name`, `type`
- `content`: REQ `direction` horizontal|vertical. `rootLayout` true (default)=top; false=sublayout. Regions `start`/`flexCenter`/`end` = `{fields[], gridLayouts[], formLayouts[], gridSwitchers[], paddingSize}`. gridLayouts only from THIS form (schema example `"Offices.OfficesTable"`, README bare `"BooksTable"`: check describe). formLayouts = rootLayout=false layouts, made first. opt `renderingMode` a4Size|fitToScreen|fullScreen|receiptSize|mm_58..., `displayLabel`. Report action needs rootLayout=true.
- `editor`: REQ `editorLayoutRenderingMode` tabs|stack|wizard. `layoutCompositeMap`: `{"Details":{},"Offices":{"gridLayout":"OfficesTable"}}`. opt `showStepper`, `navigationMode` nextButton|nextPreviousButton, `hideLabelComposites[]`.
- `report` (print): `paperSize`, `compMap`, `header{comp,showEnterprise}`, `footer{comp}`, `watermark{text{value:"Hi ${name}",paramSet:["name"]}}`. `${x}`, never `{{x}}`.
- `template`: `header{formLayout,headerImage}`, `footer{formLayout}`, `watermark{textPattern}`, `paperSize`.

## `gridLayout` (parent=<Form>, `composite=<Grid>` if >1 grid) / `spreadsheetLayout` (parent=<Sheet>)
Same kinds/props. req `name`, `kind`; opt `label`, `bgColorField`, `toolTipField`, `allowToSwitchLayouts[]`.

| kind | REQ extra | key opt |
|---|---|---|
| table | `showComps[]` (column fields) | `sortByFields[]`, `sortOrder` ascending\|descending, `freezeFields[]`, `pagination`, `rowsPerPage`, `showSearchBar`, `serverSideFilter`, `theme` standard\|spacious |
| list / card | none | `item.firstLine..fifthLine.first\|middle\|caption.lineFields[]`, `item.mediaFields[]`, `numOfColumns`, `groupByField`, `filter{kind tree\|tab,categoryFields[],sortByFields[]}` |
| kanban | `kanbanField` (column field; pickText likely (inf)) | `showFields[]`, `swimlaneMap`, `sortByFields[]` |
| calendar | `fromDateField`, `titleField`, `showFields[]` | `toDateField`, `fromTimeField`, `toTimeField`, `colorField`, `defaultCalendarView` |
| map | none | `locationField` (location/geoPoint (inf)), `renderingMode` fixedLocation\|liveLocation, `displayMode` auto\|cluster\|heatmap\|marker, `mapPin{shapeField,colorField,labelField}` |
| xyChartBarGraph / LineChart / PieChart / Doughnut / ScatterPlot | `xAxis` (field) | `yAxisMap`, `xAxisMap`, `hideLegend`; bar `renderingMode` horizontal\|vertical |

Accepts: `ref`/`refSet.layoutSpreadsheet` → list|card on target sheet only ("supported: List, Card"). spreadsheetEditor action → layout on its sheet (table). `refReport.layoutGrid`, `pickGridRow.gridLayout`, `pickReportRow.reportOutputFormGridLayout` → gridLayout names (kind limits unstated). Use unique layout names per sheet (name collisions).

## `layoutUser` (root) req `name`, `kind` hierarchy|tree
opt `includeRoles[]`, `excludeRoles[]`, `showMyAssistantsOnly`. Make before action kind=user; first = default.

## Not possible / unclear
- No field formula/visible/hidden/readonly props (`disabled` ~ read-only).
- Shapes not given: `ruleMap`, `refTargetSpreadsheetMap`, `copyFieldMap`, `optionPermissionMap`, `swimlaneMap`, `xAxisMap`/`yAxisMap`, table `header`/`footer`/`styleMap`, `compMap`. Copy from `describe` of an existing one.
- Enums missing: `formRenderingModeKind`, `ratingKind`, `dividerKind`, `buttonVariant`.
- Untyped: `required`, `disabled`, `min`/`max`/`step`, `maxSize`, `prefix`/`placeHolder`/`helperText`. Check variant schema.
- `kanbanField`/`locationField` allowed types unstated. `roleIdDataSource` not schema-required but validate demands it. `fieldMap:{}` on add assumed OK.
