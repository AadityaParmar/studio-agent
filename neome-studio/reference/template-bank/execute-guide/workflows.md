# Guide: workflows via `neome-studio` MCP

Src: `docs/studio-ai-docs/workflows.md`. [src] = Studio UI code/DTOs (`~/Documents/neome/WebApp`), not MCP schema: verify with `describe`.

## Flow
1. `schema kind=node variant=<kind>` before each new node kind.
2. `add kind=workflow` -> `add kind=node parent=<Wf>` (pass `kind` in properties too) -> `set kind=workflow ref=<Wf>` edgeMap -> `validate` till ok=true.
3. Writes one at a time, `entId` every call, edit lock needed.
4. Names `^[A-Z][A-Za-z0-9]*$`. Refs = resource names, not ids.

## `workflow`
Req on add: `name, nodeMap, edgeMap, noteMap, regionMap` -> pass the 4 maps as `{}`. Nodes go in via `kind=node`, never inline.
Opt: `label, description, module`(name), `isDefault`, `viewport{x,y,zoom}`.

### Edges = only way nodes connect
Nodes have NO next/branch props. Flow lives in `workflow.edgeMap`.
Raw entry [src DTO]: `{fromNodeId, toNodeId, kind, fromNodeHandleId?, value?, outputPipelineParamId?}`.
MCP key names (ids vs names) UNVERIFIED: wire 1 edge, `describe`, mirror.
`kind`: `NEXT|TRUE|FALSE|ITERATE|VALUE|EXPIRY|ERROR`.

| source | edge kinds | handle [src] |
|---|---|---|
| any other node | NEXT | out handle |
| branchIfElse, paramExist, mediaExists, userHas*, userIs* | TRUE/FALSE | TRUE=`outTop`, else FALSE |
| branchIterate*, userIterate | ITERATE (body), NEXT (after) | ITERATE=`controlCenter` |
| sendHumanLink | EXPIRY, NEXT | EXPIRY=`controlCenter` |
| branchSwitchCase/Form/Prompt, pause, ai*Sentiment, ai*Classification | VALUE + `value`; NEXT = Default | any |
| error-capable (below) | ERROR | `controlRight` |

- VALUE `value` = option key: switchCase -> switched pickText field's options; switchForm/Prompt -> `formMap`/`promptMap` key; pause -> `option` setOfText var key; classification -> `classification` var key; sentiment -> `VeryPositive|Positive|Neutral|Negative|VeryNegative`.
- Loop: body's last node -> NEXT back to iterate node.
- Edge `outputPipelineParamId`: which param becomes target's `$Prev`.
- Error-capable (ERROR edge + `terminateKind=resume|stopOrErrorBranch`): acquireLock, all ai*, applyFormula, botHistoryToStory, botSendResponse, branchSwitchForm/Prompt, execute*, generatePaymentLink, generateDeeplink, rowGet/Insert/Remove/SendComment/Update/UpdateFieldLogNumber, sendEmail, sendHumanLink, sendWhatsapp*, ssExecuteQuery, userAdd/Get/Remove/Update, validate, validatePrompt.
- No edge needed (UI draws synthetic): `startNode` of executeScheduler/executeSubWorkflow, executeParallel `workflowControlMap` starts.

### Regions / notes
No `region` kind. Regions = `workflow.regionMap` entries (raw `{name, point{x,y}, size{w,h}, bgClr?{value,shade}}`); node joins via `parentRegion=<region name>`. Notes = `noteMap` (raw `{point,size,value}`); pass `{}`.

## `node` common
Req `name, kind`. Opt: `point{x,y}`, `size{w,h}`, `parentRegion`, `logMsg`(TT), `uiVersion`. Set `point` (y += 150/step).
AI props (marked AI): `keychain`(R), `aiProvider=openAI_5_4_MINI|openAI_5_4|openAI_5_5`, `aiInstructions`(TT), `enableWebSearch`, `terminateKind`.

## Value shapes
- **TT**: `{value:"Hi ${Name}", paramSet:["Name"]}`. `${x}` only, never `{{x}}`; paramSet same count+order; omit if none.
- **FR** field ref: `{param, composite?, field, valuePathArray?}` (names). `param` = `$Curr`/`$Prev`/`$Iter`/... or own param name.
- **FORM**: `{form, plugin?}`.
- **B** ArgBinder: `{argName:<same as prop key>, kind, value}`. kind: `constant|field|parameter|variable|context|input|output|derived|spreadsheet|argument|response|refTarget|sep`. `value` per kind: `schema kind=argBinder` once/session. Known: constant `{type:"text",value:{value:"x"}}`. Raw: parameter `{paramId,compositeId,fieldId}`, variable `{varId}`, context `{kind:caller|ent|form|row|..., attribute}`.
- **U** users (toUsers/cc/bcc/replyTo/userManager): one of `user`(R) | `userPipelineParam`(R) | `users`(B).
- **RP** `rowIdPointer`: `{spreadsheet, row:B}`.
- **R** resource name. **M** keyed map (mirror describe). **OP** = `outputParam`(R, existing) / `outputParamName`(str, new param).

### Pipeline params [src]
`$Curr` event row (flows down), `$Prev` prev node output, `$Prior` old row (eventSsUpdate*/Remove*, eventHumanLink), `$Iter` loop item, `$Out` output form, `$Sys` system.
Own params: event node `pipelineVarMap` (keyed by name; raw `{name, variableForm:{form}}`), or `outputParamName` on a node.

## Nodes (req excl. name/kind; `?` = optional)

**Events** (all: `pipelineVarMap?`)
- eventSsInsertBefore/After, eventSsUpdateBefore/After, eventSsRemoveBefore/After, eventRowComment: `spreadsheet`
- eventSchedule: `scheduler{startDateTime?, timeZone?, repeatSetting?{frequency, repeatFrequencyKind=minutes|hours|days|weeks|months|years, endDateTime?, excludeSetOfDate?(var)}}`. Dates = ISO UTC of ent-local time (`describe kind=ent`), `+05:30` ok.
- eventManualTrigger: `inputForm`(FORM)
- eventSubWorkflow: none; `workflowPointer?{autoDia,startNode}, inputForm?, outputForm?, sharedParameters?[]`
- eventPaymentReceipt, eventChat, eventUserJoin/Exit/Online/Offline: none
- eventUserLocation: `locationCapture{type=scheduled|manual, roles[], fromTime/toTime "HH:MM:SS", frequencyBasedOnTime, frequencyBasedOnDistance, excludeDaysSet[]}`
- eventPluginWebhook: `pluginApi{metaIdPlugin}`
- eventRpcCall (inbound API): `inputForm, outputForm, apiName, allowedKeychains[]`; `apiMethod?=delete|get|patch|post|put, requestBody?/responseBody?{declarative.value|script.value}, executeAsync?`
- eventHumanLink: `sendForm`(FORM)

**Branches**
- branchIfElse: `option=Condition|ConditionVar` (REQUIRED); `condition?` (untyped; condition tree `{statement{lhs,operator,rhs}}` or andOr+map)
- branchSwitchCase: `field`(FR to pickText)
- branchSwitchForm (AI): `field, formMap`(M) · branchSwitchPrompt: `field, promptMap`(M)
- branchIterateArray: `arrayField`(R) · branchIterateGrid: `grid`(R) · userIterate: none
- branchIterateSpreadsheet: `spreadsheet`; `filterCondition?, orderByFieldIds?[], ascendingOrder?=ascending|descending, selectFieldIds?[], numberOfRows?`

**Rows / sheets**
- rowInsert (inserts $Prev): `spreadsheet`; OP?
- rowGet: `rowIdPointer`(RP); OP?
- rowUpdate: `rowIdPointer`; `option?=Mapping|MappingVar, outputMapping?`(untyped, mapping value), `overwriteRow?, skipSpreadsheetUpdateTrigger?`, OP?
- rowRemove: `rowIdPointer`
- rowGetHistory: `rowIdPointer`; `pageSize?, offset?(FR)`, OP?
- rowForward: none; `rowIdPointer?, toGroups?[], toUsers?(U), fromSender?(B)`
- rowSendComment: `message`(TT); `rowIdPointer?, sender?(B)`
- rowUpdateFieldLogNumber: `rowIdPointer, outputLogNumberField(R), operation=add|subtract|set, inputField(B)`; `operationMessage?`(TT)
- rowInsertPartitionRequest: `spreadsheet, toGroups[], requestBubbleHeader{title,subTitle,image{...}}`; `fromSender?`
- ssSearchRows: `spreadsheet`; `filterCondition?, selectFieldIds?[]` · ssRemoveRows: `spreadsheet`; `filterCondition?`
- ssExecuteQuery (NeoQL): `outputForm, spreadsheets[], neoQL{value}`; OP?
- ssFtsSearch: `searchText(B), searchSpreadsheets[]`; `maxResultCount?`, OP?

**Fields / params / misc**
- fieldSet: `value(B), outputField(FR)` · fieldRemove: `field(FR)`
- fieldRefSetSet: `inputField(FR), operation=set|union|intersection|insert|put|remove|moveUp|moveDown|moveTop|moveBottom|sort, outputField(FR)`; `outputSortOrder?`
- applyFormula: `assignToField(FR), javascriptFormula{value}` · applyTransforms: `map`(M)
- paramCreate: `option=Mapping|MappingVar, outputForm`; `outputMapping?`, OP?
- paramUpdate: `option, pipelineParam(R)`; `outputMapping?`
- paramClone: `inputParam, outputParam` · paramRemove / paramExist (T/F): `pipelineParam` · paramCalc: none; `pipelineParam?`
- mediaExists (T/F) / mediaRemove: `mediaField(FR)` · debugLog: `message`(TT)

**Users** (`user` = B; T/F = TRUE/FALSE edges)
- userAdd: `userNameField, userHandleField`(FR); `userRoles?(B), userManager?(U), outputField?`
- userUpdate: `userIdField`; `userNameField?, userRoles?, userManager?, userActivateField?(B)` · userRemove: `userIdField`
- userGet: `user`; OP? · userGetManager/GrandManager/Assistants/AllAssistants: `user, outputField(FR)`
- T/F: userHasManager/HasGrandManager `user`; userHasRoles `user, roleField`; userIsManager/AllManager `user, managerField`; userIsGrandManager `user, grandManagerField`; userIsAssistant/AllAssistant `user, assistantField`

**Messaging**
- sendMessageToUsers: `message(TT), toUsers(U)`; `sender?(B)`
- sendMessageToGroups: `message, toGroups[]`; `sender?, toUsers?`
- sendEmail: `subject(TT), message(TT), toUsers`; `ccUsers?, bccUsers?, replyToUsers?, attachmentField?(FR)`
- sendPushNotification: none; `toUsers?, customize?, customTitle?/customMessage?(TT), notificationTone?=alert|beacon|bell|breeze|chime|defaultTone|echo|glass|pop|pulse|signal, sender?`
- sendWhatsappMessage: `toUsers`; `message?, mediaField?, whatsAppGroup?/whatsAppReplyToParticipant?/whatsAppReplyToMessage?(FR)`
- sendWhatsappTemplate: `toUsers, templateGroup(str)`; `templateVarMap.map?, buttonIdVarMap.map?, carouselCardVarMap.map?, templateMediaField?`
- sendHumanLink: `sender(B), toHandle(B), targetChannels[], title(TT), message(TT), expiryDatetime{value,unit}, embedFormParam(R)`; `fromHandle?, reminders?, maxClicks?`, OP?

**Generate**
- generatePdf / generateImage: `contentLayout(R), outputField(FR)`; `templateLayout?, fileName?(TT)`
- generateExcel: `fileName(TT), outputField`; `form?, spreadsheet?, spreadsheetLayout?, rowIdField?, gridLayoutMap?`
- generateDeeplink: `deeplink(R), outputField`; `spreadsheetEditorAction?`
- generatePaymentLink: `allowedPaymentMethodSet[], currency(B), amount(B), outputField`; `paymentProvider?, paymentDescription?, expiryDuration?, referenceIdField?, spreadsheetRowIdField?`

**Schedulers / execute**
- executeScheduler: `scheduleTrigger(B), startNode(R node)`; `sharedParamMap?(M), skipRecursionCheck?, forRemoveSchedulerIdField?(FR)`
- executeSchedulerRemove: `forSchedulerIdField(FR)`
- executeSubWorkflow: `startNode`; `sharedParamMap?`, OP?
- executeParallel: `responseWaitKind=all|anyOne|none, workflowControlMap(M; raw entry {startNode,inputParam,outputParam,sharedParamMap})`
- executeAction: `inputField(FR)` + AI props; no action ref (odd, verify)
- executeReport: `report(R)`; OP? · executePlugin: `plugin(R)`; `timeoutSeconds?`, OP?
- executeJavascript: `outputForm, script{value}`; OP?
- executeRpc: `apiName(TT), inputParam(R), outputForm, sendKeychain(R)`; `apiMethod?`, OP?

**AI** (all AI props)
- aiAgent: `systemMessage(TT), userMessage(TT), outputForm`; `enableSpreadsheetTools?, agentControlMap?(M)`, OP?
- aiTextToForm / aiDocumentToForm: `inputField(FR), outputForm`; OP? · aiFakerToForm: `outputForm`; OP?
- aiTextToSummary: `inputField, outputField` · aiFormToSummary: `outputField`
- aiTextToClassification: `inputField, classification(R setOfText)` · aiFormToClassification: `classification`
- aiTextToSentiment: `inputField` · aiFormToSentiment: none · validatePrompt: `inputField`

**Bot**
- botHistoryAddPrompt: `promptField(FR)`; `label?(B), imageAttachment?, documentAttachment?`
- botHistoryAddResponse, botSendResponse: none · botHistoryGet: none; OP?
- botHistoryRemove: none; `removeAll?, retainCount?, historyIdField?` · botHistoryToStory (AI): `outputField`
- botBuildResponse: none; `contentField?(B), attachmentField?`, OP?

**Locks / control**
- acquireLock: `lockKey(TT), duration{value, unit=seconds|minutes|hours|days|weeks|months|quarters|years}` · releaseLock: `lockKey`
- validate: `condition` (untyped) -> fail = ERROR edge/stop · stopAndError: `message(TT)`
- wait: `duration(B)` · pause: none; `pauseKey?(TT), message?(TT), option?(R setOfText, VALUE edges), canAdminResume?` · resume: `pauseKey(TT)`; `option?(B)`

## Pattern: insert row from event [src Studio converter]
1. Event `pipelineVarMap: {Pipe: {variableForm: <TargetForm>}}` (MCP entry shape: verify).
2. paramUpdate `option=Mapping, pipelineParam=Pipe, outputMapping=<mapping value: fromForm/toForm/fieldMappingMap as var kind=mapping>`.
3. rowInsert `spreadsheet=<Sheet>, outputParam=Pipe`.
4. Edges: event->paramUpdate NEXT; paramUpdate->rowInsert NEXT + outputPipelineParamId=Pipe.
Update same row: rowUpdate `rowIdPointer{spreadsheet, row:B on $Curr row id}, option=Mapping`.

## Gotchas
- Open `schema kind=node` hides variant props; always pass `variant`.
- `condition`/`filterCondition`/`outputMapping` untyped in schema. Shapes: condition = `formEventCondition.statement` / `var condition.value.node` (logic-sheets.md); mapping = `var mapping.value`. Try, read validate errors, fix.
- Condition operators: hasChanged|hasNoValue|hasValue|equalTo|notEqualTo|greaterThan|lessThan|greaterThanOrEqualTo|lessThanOrEqualTo|contains. rhs.kind = binder kind, never text/mapOfText.
- Id-keyed maps: reuse describe keys on set, else dupes.

## Not possible / unclear
- MCP edgeMap entry keys; whether `fromNodeHandleId` needed; edge `value`/`outputPipelineParamId` naming. UNVERIFIED.
- Entry shapes undocumented: regionMap, noteMap, pipelineVarMap, sharedParamMap, workflowControlMap, formMap, promptMap, agentControlMap, applyTransforms.map, gridLayoutMap.
- `ConditionVar`/`MappingVar`: schema has no var-ref prop (raw: `conditionVarId`/`outputMappingVarId`). Use inline `Condition`/`Mapping`.
- ArgBinder `value` per kind: only via `schema kind=argBinder`.
- executeAction: no target-action prop.
