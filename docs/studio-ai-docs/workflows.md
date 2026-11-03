# Workflows and nodes

Visual workflow automation: events (entry points) and steps.

Generated from the live `schema` tool output (`EntArtifactBuilder.schema`). Property names, enums and required lists are exact.



## `workflow`

Workflow diagram of events and steps.

Required on add: `name`, `nodeMap`, `edgeMap`, `noteMap`, `regionMap`

| property | req | type | description |
|---|---|---|---|
| `isDefault` |  | boolean |  |
| `noteMap` | yes | object | Keyed as describe prints |
| `viewport` |  | object |  |
| `viewport.x` |  | number |  |
| `viewport.y` |  | number |  |
| `viewport.zoom` |  | number |  |
| `regionMap` | yes | object | Keyed as describe prints |
| `module` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `edgeMap` | yes | object | Keyed as describe prints |
| `nodeMap` | yes | object | Keyed as describe prints |




## `node`

Event or step inside a workflow. Needs parent workflow. Has variants by kind.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string: acquireLock \| aiAgent \| aiDocumentToForm \| aiFakerToForm \| aiFormToClassification \| aiFormToSentiment \| aiFormToSummary \| aiTextToClassification \| aiTextToForm \| aiTextToSentiment \| aiTextToSummary \| applyFormula \| applyTransforms \| botBuildResponse \| botHistoryAddPrompt \| botHistoryAddResponse \| botHistoryGet \| botHistoryRemove \| botHistoryToStory \| botSendResponse \| branchIfElse \| branchIterateArray \| branchIterateGrid \| branchIterateSpreadsheet \| branchSwitchCase \| branchSwitchForm \| branchSwitchPrompt \| debugLog \| eventChat \| eventHumanLink \| eventManualTrigger \| eventPaymentReceipt \| eventPluginWebhook \| eventRowComment \| eventRpcCall \| eventSchedule \| eventSsInsertAfter \| eventSsInsertBefore \| eventSsRemoveAfter \| eventSsRemoveBefore \| eventSsUpdateAfter \| eventSsUpdateBefore \| eventSubWorkflow \| eventUserExit \| eventUserJoin \| eventUserLocation \| eventUserOffline \| eventUserOnline \| executeAction \| executeJavascript \| executeParallel \| executePlugin \| executeReport \| executeRpc \| executeScheduler \| executeSchedulerRemove \| executeSubWorkflow \| fieldRefSetSet \| fieldRemove \| fieldSet \| generateDeeplink \| generateImage \| generatePaymentLink \| generatePdf \| generateExcel \| mediaExists \| mediaRemove \| paramCalc \| paramClone \| paramCreate \| paramExist \| paramRemove \| paramUpdate \| pause \| releaseLock \| resume \| rowForward \| rowGet \| rowGetHistory \| rowInsert \| rowInsertPartitionRequest \| rowRemove \| rowSendComment \| rowUpdate \| rowUpdateFieldLogNumber \| sendEmail \| sendHumanLink \| sendMessageToGroups \| sendMessageToUsers \| sendPushNotification \| sendWhatsappMessage \| sendWhatsappTemplate \| ssExecuteQuery \| ssFtsSearch \| ssRemoveRows \| ssSearchRows \| stopAndError \| userAdd \| userGet \| userGetAllAssistants \| userGetAssistants \| userGetGrandManager \| userGetManager \| userHasGrandManager \| userHasManager \| userHasRoles \| userIsAllAssistant \| userIsAllManager \| userIsAssistant \| userIsGrandManager \| userIsManager \| userIterate \| userRemove \| userUpdate \| validate \| validatePrompt \| wait | Polymorphic: each kind has its own properties, not listed here. Pick one value and call schema again with {"kind":"node","variant":"acquireLock"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / acquireLock`

Required on add: `name`, `lockKey`, `duration`, `kind`

| property | req | type | description |
|---|---|---|---|
| `duration` | yes | object |  |
| `duration.unit` |  | string: seconds \| minutes \| hours \| days \| weeks \| months \| quarters \| years |  |
| `duration.value` |  | number |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `lockKey` | yes | object |  |
| `lockKey.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `lockKey.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / aiAgent`

Required on add: `name`, `systemMessage`, `userMessage`, `outputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `systemMessage` | yes | object |  |
| `systemMessage.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `systemMessage.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `kind` | yes | string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `enableSpreadsheetTools` |  | boolean |  |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `userMessage` | yes | object |  |
| `userMessage.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `userMessage.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `agentControlMap` |  | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputParamName` |  | string |  |


### `node / aiDocumentToForm`

Required on add: `name`, `inputField`, `outputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputParamName` |  | string |  |


### `node / aiFakerToForm`

Required on add: `name`, `outputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputParamName` |  | string |  |


### `node / aiFormToClassification`

Required on add: `name`, `classification`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `classification` | yes | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / aiFormToSentiment`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / aiFormToSummary`

Required on add: `name`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / aiTextToClassification`

Required on add: `name`, `inputField`, `classification`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `classification` | yes | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / aiTextToForm`

Required on add: `name`, `inputField`, `outputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputParamName` |  | string |  |


### `node / aiTextToSentiment`

Required on add: `name`, `inputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / aiTextToSummary`

Required on add: `name`, `inputField`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / applyFormula`

Required on add: `name`, `assignToField`, `javascriptFormula`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `javascriptFormula` | yes | object |  |
| `javascriptFormula.value` |  | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `assignToField` | yes | object |  |
| `assignToField.field` |  | string | Resource name |
| `assignToField.param` |  | string | Resource name |
| `assignToField.composite` |  | string | Resource name |
| `assignToField.valuePathArray` |  | array of string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / applyTransforms`

Required on add: `name`, `map`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `map` | yes | object | Keyed as describe prints |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botBuildResponse`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `attachmentField` |  | object |  |
| `attachmentField.field` |  | string | Resource name |
| `attachmentField.param` |  | string | Resource name |
| `attachmentField.composite` |  | string | Resource name |
| `attachmentField.valuePathArray` |  | array of string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `contentField` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `contentField.argName` | yes | string | Same as this entry's key |
| `contentField.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `contentField.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botHistoryAddPrompt`

Required on add: `name`, `promptField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `promptField` | yes | object |  |
| `promptField.field` |  | string | Resource name |
| `promptField.param` |  | string | Resource name |
| `promptField.composite` |  | string | Resource name |
| `promptField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `label` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `label.argName` | yes | string | Same as this entry's key |
| `label.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `label.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `documentAttachment` |  | object |  |
| `documentAttachment.field` |  | string | Resource name |
| `documentAttachment.param` |  | string | Resource name |
| `documentAttachment.composite` |  | string | Resource name |
| `documentAttachment.valuePathArray` |  | array of string |  |
| `imageAttachment` |  | object |  |
| `imageAttachment.field` |  | string | Resource name |
| `imageAttachment.param` |  | string | Resource name |
| `imageAttachment.composite` |  | string | Resource name |
| `imageAttachment.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botHistoryAddResponse`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botHistoryGet`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botHistoryRemove`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `removeAll` |  | boolean |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `historyIdField` |  | object |  |
| `historyIdField.field` |  | string | Resource name |
| `historyIdField.param` |  | string | Resource name |
| `historyIdField.composite` |  | string | Resource name |
| `historyIdField.valuePathArray` |  | array of string |  |
| `retainCount` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / botHistoryToStory`

Required on add: `name`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / botSendResponse`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / branchIfElse`

Required on add: `name`, `option`, `kind`

| property | req | type | description |
|---|---|---|---|
| `condition` |  |  |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `option` | yes | string: Condition \| ConditionVar |  |


### `node / branchIterateArray`

Required on add: `name`, `arrayField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `arrayField` | yes | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / branchIterateGrid`

Required on add: `name`, `grid`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `grid` | yes | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / branchIterateSpreadsheet`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `ascendingOrder` |  | string: ascending \| descending |  |
| `orderByFieldIds` |  | array of string |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `filterCondition` |  |  |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `selectFieldIds` |  | array of string |  |
| `numberOfRows` |  | number |  |


### `node / branchSwitchCase`

Required on add: `name`, `field`, `kind`

| property | req | type | description |
|---|---|---|---|
| `field` | yes | object |  |
| `field.field` |  | string | Resource name |
| `field.param` |  | string | Resource name |
| `field.composite` |  | string | Resource name |
| `field.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / branchSwitchForm`

Required on add: `name`, `field`, `formMap`, `kind`

| property | req | type | description |
|---|---|---|---|
| `formMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `field` | yes | object |  |
| `field.field` |  | string | Resource name |
| `field.param` |  | string | Resource name |
| `field.composite` |  | string | Resource name |
| `field.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / branchSwitchPrompt`

Required on add: `name`, `field`, `promptMap`, `kind`

| property | req | type | description |
|---|---|---|---|
| `promptMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `field` | yes | object |  |
| `field.field` |  | string | Resource name |
| `field.param` |  | string | Resource name |
| `field.composite` |  | string | Resource name |
| `field.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / debugLog`

Required on add: `name`, `message`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventChat`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventHumanLink`

Required on add: `name`, `sendForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `sendForm` | yes | object |  |
| `sendForm.plugin` |  | string | Resource name |
| `sendForm.form` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventManualTrigger`

Required on add: `name`, `inputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `inputForm` | yes | object |  |
| `inputForm.plugin` |  | string | Resource name |
| `inputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventPaymentReceipt`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventPluginWebhook`

Required on add: `name`, `pluginApi`, `kind`

| property | req | type | description |
|---|---|---|---|
| `pluginApi` | yes | object |  |
| `pluginApi.metaIdPlugin` |  | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventRowComment`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventRpcCall`

Required on add: `name`, `inputForm`, `outputForm`, `apiName`, `allowedKeychains`, `kind`

| property | req | type | description |
|---|---|---|---|
| `apiName` | yes | string |  |
| `responseBody` |  | object |  |
| `responseBody.declarative` |  | object |  |
| `responseBody.declarative.value` |  | string |  |
| `responseBody.script` |  | object |  |
| `responseBody.script.value` |  | string |  |
| `kind` | yes | string |  |
| `allowedKeychains` | yes | array of string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `apiMethod` |  | string: delete \| get \| patch \| post \| put |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `requestBody` |  | object |  |
| `requestBody.declarative` |  | object |  |
| `requestBody.declarative.value` |  | string |  |
| `requestBody.script` |  | object |  |
| `requestBody.script.value` |  | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `inputForm` | yes | object |  |
| `inputForm.plugin` |  | string | Resource name |
| `inputForm.form` |  | string | Resource name |
| `executeAsync` |  | boolean |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |


### `node / eventSchedule`

Required on add: `name`, `scheduler`, `kind`

| property | req | type | description |
|---|---|---|---|
| `scheduler` | yes | object |  |
| `scheduler.repeatSetting` |  | object |  |
| `scheduler.repeatSetting.excludeSetOfDate` |  | string | Resource name |
| `scheduler.repeatSetting.endDateTime` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `scheduler.repeatSetting.repeatFrequencyKind` |  | string: minutes \| hours \| days \| weeks \| months \| years |  |
| `scheduler.repeatSetting.frequency` |  | number |  |
| `scheduler.startDateTime` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `scheduler.timeZone` |  | string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsInsertAfter`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsInsertBefore`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsRemoveAfter`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsRemoveBefore`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsUpdateAfter`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSsUpdateBefore`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventSubWorkflow`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `workflowPointer` |  | object |  |
| `workflowPointer.autoDia` |  | string | Resource name |
| `workflowPointer.startNode` |  | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `inputForm` |  | object |  |
| `inputForm.plugin` |  | string | Resource name |
| `inputForm.form` |  | string | Resource name |
| `outputForm` |  | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `sharedParameters` |  | array of string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventUserExit`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventUserJoin`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventUserLocation`

Required on add: `name`, `locationCapture`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `locationCapture` | yes | object |  |
| `locationCapture.frequencyBasedOnTime` |  | number |  |
| `locationCapture.frequencyBasedOnDistance` |  | number |  |
| `locationCapture.roles` |  | array of string |  |
| `locationCapture.fromTime` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `locationCapture.excludeDaysSet` |  | array of string |  |
| `locationCapture.type` |  | string: scheduled \| manual |  |
| `locationCapture.toTime` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventUserOffline`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / eventUserOnline`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `pipelineVarMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executeAction`

Required on add: `name`, `inputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / executeJavascript`

Required on add: `name`, `outputForm`, `script`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `script` | yes | object |  |
| `script.value` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executeParallel`

Required on add: `name`, `responseWaitKind`, `workflowControlMap`, `kind`

| property | req | type | description |
|---|---|---|---|
| `workflowControlMap` | yes | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `responseWaitKind` | yes | string: all \| anyOne \| none |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executePlugin`

Required on add: `name`, `plugin`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `plugin` | yes | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `timeoutSeconds` |  | number |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executeReport`

Required on add: `name`, `report`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `report` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executeRpc`

Required on add: `name`, `apiName`, `inputParam`, `outputForm`, `sendKeychain`, `kind`

| property | req | type | description |
|---|---|---|---|
| `apiName` | yes | object |  |
| `apiName.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `apiName.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `kind` | yes | string |  |
| `inputParam` | yes | string | Resource name |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `apiMethod` |  | string: delete \| get \| patch \| post \| put |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sendKeychain` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `outputParamName` |  | string |  |


### `node / executeScheduler`

Required on add: `name`, `scheduleTrigger`, `startNode`, `kind`

| property | req | type | description |
|---|---|---|---|
| `skipRecursionCheck` |  | boolean |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `scheduleTrigger` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `scheduleTrigger.argName` | yes | string | Same as this entry's key |
| `scheduleTrigger.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `scheduleTrigger.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `sharedParamMap` |  | object | Keyed as describe prints |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `startNode` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `forRemoveSchedulerIdField` |  | object |  |
| `forRemoveSchedulerIdField.field` |  | string | Resource name |
| `forRemoveSchedulerIdField.param` |  | string | Resource name |
| `forRemoveSchedulerIdField.composite` |  | string | Resource name |
| `forRemoveSchedulerIdField.valuePathArray` |  | array of string |  |


### `node / executeSchedulerRemove`

Required on add: `name`, `forSchedulerIdField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `forSchedulerIdField` | yes | object |  |
| `forSchedulerIdField.field` |  | string | Resource name |
| `forSchedulerIdField.param` |  | string | Resource name |
| `forSchedulerIdField.composite` |  | string | Resource name |
| `forSchedulerIdField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / executeSubWorkflow`

Required on add: `name`, `startNode`, `kind`

| property | req | type | description |
|---|---|---|---|
| `sharedParamMap` |  | object | Keyed as describe prints |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `startNode` | yes | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / fieldRefSetSet`

Required on add: `name`, `inputField`, `operation`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `outputSortOrder` |  | string: ascending \| descending |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `operation` | yes | string: set \| union \| intersection \| insert \| put \| remove \| moveUp \| moveDown \| moveTop \| moveBottom \| sort |  |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / fieldRemove`

Required on add: `name`, `field`, `kind`

| property | req | type | description |
|---|---|---|---|
| `field` | yes | object |  |
| `field.field` |  | string | Resource name |
| `field.param` |  | string | Resource name |
| `field.composite` |  | string | Resource name |
| `field.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / fieldSet`

Required on add: `name`, `value`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `value` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `value.argName` | yes | string | Same as this entry's key |
| `value.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `value.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / generateDeeplink`

Required on add: `name`, `deeplink`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `deeplink` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `spreadsheetEditorAction` |  | string | Resource name |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / generateExcel`

Required on add: `name`, `fileName`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `fileName` | yes | object |  |
| `fileName.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `fileName.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `rowIdField` |  | object |  |
| `rowIdField.field` |  | string | Resource name |
| `rowIdField.param` |  | string | Resource name |
| `rowIdField.composite` |  | string | Resource name |
| `rowIdField.valuePathArray` |  | array of string |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `spreadsheetLayout` |  | string | Resource name |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `form` |  | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `spreadsheet` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `gridLayoutMap` |  | object | Keyed as describe prints |


### `node / generateImage`

Required on add: `name`, `contentLayout`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `contentLayout` | yes | string | Resource name |
| `fileName` |  | object |  |
| `fileName.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `fileName.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `templateLayout` |  | string | Resource name |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / generatePaymentLink`

Required on add: `name`, `allowedPaymentMethodSet`, `currency`, `amount`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `amount` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `amount.argName` | yes | string | Same as this entry's key |
| `amount.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `amount.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `allowedPaymentMethodSet` | yes | array of string |  |
| `spreadsheetRowIdField` |  | object |  |
| `spreadsheetRowIdField.field` |  | string | Resource name |
| `spreadsheetRowIdField.param` |  | string | Resource name |
| `spreadsheetRowIdField.composite` |  | string | Resource name |
| `spreadsheetRowIdField.valuePathArray` |  | array of string |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `referenceIdField` |  | object |  |
| `referenceIdField.field` |  | string | Resource name |
| `referenceIdField.param` |  | string | Resource name |
| `referenceIdField.composite` |  | string | Resource name |
| `referenceIdField.valuePathArray` |  | array of string |  |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `paymentDescription` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `paymentDescription.argName` | yes | string | Same as this entry's key |
| `paymentDescription.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `paymentDescription.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `paymentProvider` |  | string | Resource name |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `currency` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `currency.argName` | yes | string | Same as this entry's key |
| `currency.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `currency.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `expiryDuration` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `expiryDuration.argName` | yes | string | Same as this entry's key |
| `expiryDuration.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `expiryDuration.value` | yes | object | Shape depends on kind — see schema kind=argBinder |


### `node / generatePdf`

Required on add: `name`, `contentLayout`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `contentLayout` | yes | string | Resource name |
| `fileName` |  | object |  |
| `fileName.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `fileName.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `templateLayout` |  | string | Resource name |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / mediaExists`

Required on add: `name`, `mediaField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `mediaField` | yes | object |  |
| `mediaField.field` |  | string | Resource name |
| `mediaField.param` |  | string | Resource name |
| `mediaField.composite` |  | string | Resource name |
| `mediaField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / mediaRemove`

Required on add: `name`, `mediaField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `mediaField` | yes | object |  |
| `mediaField.field` |  | string | Resource name |
| `mediaField.param` |  | string | Resource name |
| `mediaField.composite` |  | string | Resource name |
| `mediaField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / paramCalc`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `pipelineParam` |  | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / paramClone`

Required on add: `name`, `inputParam`, `outputParam`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `inputParam` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` | yes | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / paramCreate`

Required on add: `name`, `option`, `outputForm`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputMapping` |  |  |  |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `option` | yes | string: Mapping \| MappingVar |  |


### `node / paramExist`

Required on add: `name`, `pipelineParam`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `pipelineParam` | yes | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / paramRemove`

Required on add: `name`, `pipelineParam`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `pipelineParam` | yes | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / paramUpdate`

Required on add: `name`, `option`, `pipelineParam`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `pipelineParam` | yes | string | Resource name |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `outputMapping` |  |  |  |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `option` | yes | string: Mapping \| MappingVar |  |


### `node / pause`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `pauseKey` |  | object |  |
| `pauseKey.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `pauseKey.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `canAdminResume` |  | boolean |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` |  | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `option` |  | string | Resource name |


### `node / releaseLock`

Required on add: `name`, `lockKey`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `lockKey` | yes | object |  |
| `lockKey.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `lockKey.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / resume`

Required on add: `name`, `pauseKey`, `kind`

| property | req | type | description |
|---|---|---|---|
| `pauseKey` | yes | object |  |
| `pauseKey.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `pauseKey.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `option` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `option.argName` | yes | string | Same as this entry's key |
| `option.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `option.value` | yes | object | Shape depends on kind — see schema kind=argBinder |


### `node / rowForward`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `rowIdPointer` |  | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `toGroups` |  | array of string |  |
| `fromSender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `fromSender.argName` | yes | string | Same as this entry's key |
| `fromSender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `fromSender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `toUsers` |  | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowGet`

Required on add: `name`, `rowIdPointer`, `kind`

| property | req | type | description |
|---|---|---|---|
| `rowIdPointer` | yes | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowGetHistory`

Required on add: `name`, `rowIdPointer`, `kind`

| property | req | type | description |
|---|---|---|---|
| `rowIdPointer` | yes | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `offset` |  | object |  |
| `offset.field` |  | string | Resource name |
| `offset.param` |  | string | Resource name |
| `offset.composite` |  | string | Resource name |
| `offset.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `pageSize` |  | number |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowInsert`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowInsertPartitionRequest`

Required on add: `name`, `spreadsheet`, `toGroups`, `requestBubbleHeader`, `kind`

| property | req | type | description |
|---|---|---|---|
| `toGroups` | yes | array of string |  |
| `fromSender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `fromSender.argName` | yes | string | Same as this entry's key |
| `fromSender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `fromSender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `requestBubbleHeader` | yes | object |  |
| `requestBubbleHeader.image` |  | object |  |
| `requestBubbleHeader.image.fileName` |  | string |  |
| `requestBubbleHeader.image.size` |  | number |  |
| `requestBubbleHeader.image.mediaIdBlurImage` |  | string | Resource name |
| `requestBubbleHeader.image.mediaIdImage` |  | string | Resource name |
| `requestBubbleHeader.image.primaryColor` |  | string |  |
| `requestBubbleHeader.image.width` |  | number |  |
| `requestBubbleHeader.image.height` |  | number |  |
| `requestBubbleHeader.subTitle` |  | string |  |
| `requestBubbleHeader.title` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowRemove`

Required on add: `name`, `rowIdPointer`, `kind`

| property | req | type | description |
|---|---|---|---|
| `rowIdPointer` | yes | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowSendComment`

Required on add: `name`, `message`, `kind`

| property | req | type | description |
|---|---|---|---|
| `rowIdPointer` |  | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `sender.argName` | yes | string | Same as this entry's key |
| `sender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `sender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / rowUpdate`

Required on add: `name`, `rowIdPointer`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `rowIdPointer` | yes | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `skipSpreadsheetUpdateTrigger` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `overwriteRow` |  | boolean |  |
| `outputMapping` |  |  |  |
| `outputParamName` |  | string |  |
| `option` |  | string: Mapping \| MappingVar |  |


### `node / rowUpdateFieldLogNumber`

Required on add: `name`, `rowIdPointer`, `outputLogNumberField`, `operation`, `inputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `outputLogNumberField` | yes | string | Resource name |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `rowIdPointer` | yes | object |  |
| `rowIdPointer.spreadsheet` |  | string | Resource name |
| `rowIdPointer.row` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `rowIdPointer.row.argName` | yes | string | Same as this entry's key |
| `rowIdPointer.row.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `rowIdPointer.row.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `inputField` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `inputField.argName` | yes | string | Same as this entry's key |
| `inputField.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `inputField.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `operationMessage` |  | object |  |
| `operationMessage.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `operationMessage.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `operation` | yes | string: add \| subtract \| set |  |


### `node / sendEmail`

Required on add: `name`, `subject`, `message`, `toUsers`, `kind`

| property | req | type | description |
|---|---|---|---|
| `subject` | yes | object |  |
| `subject.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `subject.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `kind` | yes | string |  |
| `bccUsers` |  | object |  |
| `bccUsers.userPipelineParam` |  | string | Resource name |
| `bccUsers.user` |  | string | Resource name |
| `bccUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `bccUsers.users.argName` | yes | string | Same as this entry's key |
| `bccUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `bccUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `attachmentField` |  | object |  |
| `attachmentField.field` |  | string | Resource name |
| `attachmentField.param` |  | string | Resource name |
| `attachmentField.composite` |  | string | Resource name |
| `attachmentField.valuePathArray` |  | array of string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `toUsers` | yes | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `ccUsers` |  | object |  |
| `ccUsers.userPipelineParam` |  | string | Resource name |
| `ccUsers.user` |  | string | Resource name |
| `ccUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `ccUsers.users.argName` | yes | string | Same as this entry's key |
| `ccUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `ccUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `replyToUsers` |  | object |  |
| `replyToUsers.userPipelineParam` |  | string | Resource name |
| `replyToUsers.user` |  | string | Resource name |
| `replyToUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `replyToUsers.users.argName` | yes | string | Same as this entry's key |
| `replyToUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `replyToUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |


### `node / sendHumanLink`

Required on add: `name`, `sender`, `toHandle`, `targetChannels`, `title`, `message`, `expiryDatetime`, `embedFormParam`, `kind`

| property | req | type | description |
|---|---|---|---|
| `toHandle` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toHandle.argName` | yes | string | Same as this entry's key |
| `toHandle.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toHandle.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `reminders` |  | number |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `title` | yes | object |  |
| `title.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `title.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `expiryDatetime` | yes | object |  |
| `expiryDatetime.unit` |  | string: seconds \| minutes \| hours \| days \| weeks \| months \| quarters \| years |  |
| `expiryDatetime.value` |  | number |  |
| `outputParam` |  | string | Resource name |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sender` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `sender.argName` | yes | string | Same as this entry's key |
| `sender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `sender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `maxClicks` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `embedFormParam` | yes | string | Resource name |
| `outputParamName` |  | string |  |
| `fromHandle` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `fromHandle.argName` | yes | string | Same as this entry's key |
| `fromHandle.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `fromHandle.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `targetChannels` | yes | array of string |  |


### `node / sendMessageToGroups`

Required on add: `name`, `message`, `toGroups`, `kind`

| property | req | type | description |
|---|---|---|---|
| `toGroups` | yes | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `sender.argName` | yes | string | Same as this entry's key |
| `sender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `sender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `toUsers` |  | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / sendMessageToUsers`

Required on add: `name`, `message`, `toUsers`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `sender.argName` | yes | string | Same as this entry's key |
| `sender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `sender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `toUsers` | yes | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / sendPushNotification`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `customTitle` |  | object |  |
| `customTitle.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `customTitle.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `toUsers` |  | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `customize` |  | boolean |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `notificationTone` |  | string: alert \| beacon \| bell \| breeze \| chime \| defaultTone \| echo \| glass \| pop \| pulse \| signal |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `sender` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `sender.argName` | yes | string | Same as this entry's key |
| `sender.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `sender.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `customMessage` |  | object |  |
| `customMessage.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `customMessage.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / sendWhatsappMessage`

Required on add: `name`, `toUsers`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` |  | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `mediaField` |  | object |  |
| `mediaField.field` |  | string | Resource name |
| `mediaField.param` |  | string | Resource name |
| `mediaField.composite` |  | string | Resource name |
| `mediaField.valuePathArray` |  | array of string |  |
| `toUsers` | yes | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `whatsAppGroup` |  | object |  |
| `whatsAppGroup.field` |  | string | Resource name |
| `whatsAppGroup.param` |  | string | Resource name |
| `whatsAppGroup.composite` |  | string | Resource name |
| `whatsAppGroup.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `whatsAppReplyToParticipant` |  | object |  |
| `whatsAppReplyToParticipant.field` |  | string | Resource name |
| `whatsAppReplyToParticipant.param` |  | string | Resource name |
| `whatsAppReplyToParticipant.composite` |  | string | Resource name |
| `whatsAppReplyToParticipant.valuePathArray` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `whatsAppReplyToMessage` |  | object |  |
| `whatsAppReplyToMessage.field` |  | string | Resource name |
| `whatsAppReplyToMessage.param` |  | string | Resource name |
| `whatsAppReplyToMessage.composite` |  | string | Resource name |
| `whatsAppReplyToMessage.valuePathArray` |  | array of string |  |


### `node / sendWhatsappTemplate`

Required on add: `name`, `toUsers`, `templateGroup`, `kind`

| property | req | type | description |
|---|---|---|---|
| `templateMediaField` |  | object |  |
| `templateMediaField.field` |  | string | Resource name |
| `templateMediaField.param` |  | string | Resource name |
| `templateMediaField.composite` |  | string | Resource name |
| `templateMediaField.valuePathArray` |  | array of string |  |
| `kind` | yes | string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `toUsers` | yes | object |  |
| `toUsers.userPipelineParam` |  | string | Resource name |
| `toUsers.user` |  | string | Resource name |
| `toUsers.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `toUsers.users.argName` | yes | string | Same as this entry's key |
| `toUsers.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `toUsers.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `templateGroup` | yes | string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `carouselCardVarMap` |  | object |  |
| `carouselCardVarMap.map` |  | object | Entries in order, each under its own key. Their order is kept; keep a key to update that entry, a new key adds one, a missing key removes it |
| `buttonIdVarMap` |  | object |  |
| `buttonIdVarMap.map` |  | object | Entries in order, each under its own key. Their order is kept; keep a key to update that entry, a new key adds one, a missing key removes it |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `templateVarMap` |  | object |  |
| `templateVarMap.map` |  | object | Entries in order, each under its own key. Their order is kept; keep a key to update that entry, a new key adds one, a missing key removes it |


### `node / ssExecuteQuery`

Required on add: `name`, `outputForm`, `spreadsheets`, `neoQL`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `outputForm` | yes | object |  |
| `outputForm.plugin` |  | string | Resource name |
| `outputForm.form` |  | string | Resource name |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `neoQL` | yes | object |  |
| `neoQL.value` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `spreadsheets` | yes | array of string |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `outputParamName` |  | string |  |


### `node / ssFtsSearch`

Required on add: `name`, `searchText`, `searchSpreadsheets`, `kind`

| property | req | type | description |
|---|---|---|---|
| `searchText` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `searchText.argName` | yes | string | Same as this entry's key |
| `searchText.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `searchText.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `searchSpreadsheets` | yes | array of string |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `maxResultCount` |  | number |  |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / ssRemoveRows`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `filterCondition` |  |  |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / ssSearchRows`

Required on add: `name`, `spreadsheet`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `filterCondition` |  |  |  |
| `spreadsheet` | yes | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `selectFieldIds` |  | array of string |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / stopAndError`

Required on add: `name`, `message`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `message` | yes | object |  |
| `message.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `message.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userAdd`

Required on add: `name`, `userNameField`, `userHandleField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `userManager` |  | object |  |
| `userManager.userPipelineParam` |  | string | Resource name |
| `userManager.user` |  | string | Resource name |
| `userManager.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `userManager.users.argName` | yes | string | Same as this entry's key |
| `userManager.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `userManager.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputField` |  | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `userRoles` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `userRoles.argName` | yes | string | Same as this entry's key |
| `userRoles.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `userRoles.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `userNameField` | yes | object |  |
| `userNameField.field` |  | string | Resource name |
| `userNameField.param` |  | string | Resource name |
| `userNameField.composite` |  | string | Resource name |
| `userNameField.valuePathArray` |  | array of string |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `userHandleField` | yes | object |  |
| `userHandleField.field` |  | string | Resource name |
| `userHandleField.param` |  | string | Resource name |
| `userHandleField.composite` |  | string | Resource name |
| `userHandleField.valuePathArray` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |


### `node / userGet`

Required on add: `name`, `user`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `outputParam` |  | string | Resource name |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputParamName` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userGetAllAssistants`

Required on add: `name`, `user`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userGetAssistants`

Required on add: `name`, `user`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userGetGrandManager`

Required on add: `name`, `user`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userGetManager`

Required on add: `name`, `user`, `outputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `outputField` | yes | object |  |
| `outputField.field` |  | string | Resource name |
| `outputField.param` |  | string | Resource name |
| `outputField.composite` |  | string | Resource name |
| `outputField.valuePathArray` |  | array of string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userHasGrandManager`

Required on add: `name`, `user`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userHasManager`

Required on add: `name`, `user`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userHasRoles`

Required on add: `name`, `user`, `roleField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `roleField` | yes | object |  |
| `roleField.field` |  | string | Resource name |
| `roleField.param` |  | string | Resource name |
| `roleField.composite` |  | string | Resource name |
| `roleField.valuePathArray` |  | array of string |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIsAllAssistant`

Required on add: `name`, `user`, `assistantField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `assistantField` | yes | object |  |
| `assistantField.field` |  | string | Resource name |
| `assistantField.param` |  | string | Resource name |
| `assistantField.composite` |  | string | Resource name |
| `assistantField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIsAllManager`

Required on add: `name`, `user`, `managerField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `managerField` | yes | object |  |
| `managerField.field` |  | string | Resource name |
| `managerField.param` |  | string | Resource name |
| `managerField.composite` |  | string | Resource name |
| `managerField.valuePathArray` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIsAssistant`

Required on add: `name`, `user`, `assistantField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `assistantField` | yes | object |  |
| `assistantField.field` |  | string | Resource name |
| `assistantField.param` |  | string | Resource name |
| `assistantField.composite` |  | string | Resource name |
| `assistantField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIsGrandManager`

Required on add: `name`, `user`, `grandManagerField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `grandManagerField` | yes | object |  |
| `grandManagerField.field` |  | string | Resource name |
| `grandManagerField.param` |  | string | Resource name |
| `grandManagerField.composite` |  | string | Resource name |
| `grandManagerField.valuePathArray` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIsManager`

Required on add: `name`, `user`, `managerField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `managerField` | yes | object |  |
| `managerField.field` |  | string | Resource name |
| `managerField.param` |  | string | Resource name |
| `managerField.composite` |  | string | Resource name |
| `managerField.valuePathArray` |  | array of string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `user` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `user.argName` | yes | string | Same as this entry's key |
| `user.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `user.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userIterate`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userRemove`

Required on add: `name`, `userIdField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `userIdField` | yes | object |  |
| `userIdField.field` |  | string | Resource name |
| `userIdField.param` |  | string | Resource name |
| `userIdField.composite` |  | string | Resource name |
| `userIdField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / userUpdate`

Required on add: `name`, `userIdField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `userManager` |  | object |  |
| `userManager.userPipelineParam` |  | string | Resource name |
| `userManager.user` |  | string | Resource name |
| `userManager.users` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `userManager.users.argName` | yes | string | Same as this entry's key |
| `userManager.users.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `userManager.users.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `userRoles` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `userRoles.argName` | yes | string | Same as this entry's key |
| `userRoles.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `userRoles.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `userNameField` |  | object |  |
| `userNameField.field` |  | string | Resource name |
| `userNameField.param` |  | string | Resource name |
| `userNameField.composite` |  | string | Resource name |
| `userNameField.valuePathArray` |  | array of string |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `userIdField` | yes | object |  |
| `userIdField.field` |  | string | Resource name |
| `userIdField.param` |  | string | Resource name |
| `userIdField.composite` |  | string | Resource name |
| `userIdField.valuePathArray` |  | array of string |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `userActivateField` |  | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `userActivateField.argName` | yes | string | Same as this entry's key |
| `userActivateField.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `userActivateField.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `name` | yes | string | Uppercase first letter, then alphanumeric |


### `node / validate`

Required on add: `name`, `condition`, `kind`

| property | req | type | description |
|---|---|---|---|
| `condition` | yes |  |  |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |


### `node / validatePrompt`

Required on add: `name`, `inputField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string |  |
| `enableWebSearch` |  | boolean |  |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |
| `inputField` | yes | object |  |
| `inputField.field` |  | string | Resource name |
| `inputField.param` |  | string | Resource name |
| `inputField.composite` |  | string | Resource name |
| `inputField.valuePathArray` |  | array of string |  |
| `keychain` |  | string | Resource name |
| `terminateKind` |  | string: resume \| stopOrErrorBranch |  |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `aiProvider` |  | string: openAI_5_4_MINI \| openAI_5_4 \| openAI_5_5 |  |
| `aiInstructions` |  | object |  |
| `aiInstructions.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `aiInstructions.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |


### `node / wait`

Required on add: `name`, `duration`, `kind`

| property | req | type | description |
|---|---|---|---|
| `duration` | yes | object | Call schema with kind=argBinder for the full ArgBinder entry shape (argName, kind, value). Shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. Fetch once per session, then reuse; do not invent binder kinds. |
| `duration.argName` | yes | string | Same as this entry's key |
| `duration.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `duration.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `size` |  | object |  |
| `size.w` |  | number |  |
| `size.h` |  | number |  |
| `kind` | yes | string |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `logMsg` |  | object |  |
| `logMsg.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `logMsg.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `parentRegion` |  | string | Resource name |
| `uiVersion` |  | string |  |
| `point` |  | object |  |
| `point.x` |  | number |  |
| `point.y` |  | number |  |

