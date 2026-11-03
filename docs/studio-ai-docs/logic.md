# Variables, formulas and form events

Reusable variables, calculated fields, and show/hide event wiring.

Generated from the live `schema` tool output (`EntArtifactBuilder.schema`). Property names, enums and required lists are exact.



## `var`

Reusable variable such as a set of text options, condition, or mapping. Has variants by kind.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string: bool \| buttonVariant \| color \| currency \| date \| dateTime \| day \| decimal \| deviceSize \| deviceType \| direction \| dividerKind \| document \| duration \| email \| textSize \| html \| hyperlink \| icon \| image \| imageCorner \| language \| location \| mapPinShape \| mobileNumber \| number \| paragraph \| ratingKind \| stroke \| symbol \| text \| placement \| time \| timeZone \| month \| quarter \| condition \| function \| mapping \| sequence \| userSetting \| mapOfText \| setOfDate \| setOfDay \| setOfNumber \| setOfText \| setOfTime \| setOfUser \| tree | Polymorphic: each kind has its own properties, not listed here. Choose the kind that matches the data using enumDescriptions. Pick one value and call schema again with {"kind":"var","variant":"bool"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / bool`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | True or false flag, such as a feature switch or allow overdue |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | boolean |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / buttonVariant`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Theme button style, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: text \| contained \| outlined \| icon |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / color`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A color, for theming or highlighting |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `value.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / condition`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A reusable true or false rule over form data, used by visibility rules, filters and workflows |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set sourceForm when any statement uses kind field or derived; set inputForm when any uses kind input. sourcePlugin / inputPlugin are for plugin-owned forms (plugin form resolution not wired yet). Set sourceGrid (grid on sourceForm) for per-row evaluation; omit for form-level (grid fields then yield arrays). node is a leaf statement or andOr + children. |
| `value.node` |  |  |  |
| `value.sourceForm` |  | string | Resource name |
| `value.inputPlugin` |  | string | Resource name |
| `value.inputForm` |  | string | Resource name |
| `value.sourcePlugin` |  | string | Resource name |
| `value.sourceGrid` |  | string | Resource name |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / currency`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A currency such as INR or USD, not an amount. Use decimal for money amounts |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / date`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A calendar date without time, such as a fiscal year start or go-live date. Store midnight of that day in the enterprise timeZone as UTC: 1 Oct 2026 in Asia/Kolkata is 2026-09-30T18:30:00.000Z |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set exactly one of value, customValue |
| `value.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `value.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / dateTime`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A date with time of day, such as a launch moment. Store the enterprise-local moment as UTC: 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set exactly one of value, customValue |
| `value.customValue` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `value.time` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `value.value` |  | string: lastQuarter \| lastWeek \| lastMonth \| lastYear \| nextQuarter \| nextWeek \| nextMonth \| nextYear \| now \| tomorrow \| yesterday \| startOfWeek \| startOfMonth \| startOfYear \| endOfWeek \| endOfMonth \| endOfYear \| createdOn \| updatedOn |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / day`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | One day of the week, such as the weekly off day |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: sunday \| monday \| tuesday \| wednesday \| thursday \| friday \| saturday |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / decimal`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Number with fractions, such as a fine rate of 2.5, a tax percentage or a price |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / deviceSize`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Screen size breakpoint, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: mobile \| tablet \| laptop \| desktop |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / deviceType`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Device type such as mobile or desktop, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: android \| ios \| web \| widget \| agent \| test |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / direction`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Layout direction, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: horizontal \| vertical |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / dividerKind`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Divider style, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: thick \| thin |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / document`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An uploaded file, such as a policy PDF or a template |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | object |  |
| `value.value.fileName` |  | string |  |
| `value.value.fileSize` |  | number |  |
| `value.value.mediaIdDocument` |  | string | Resource name |
| `value.value.fileExt` |  | string: ai \| any \| avi \| cdr \| csv \| dll \| doc \| docx \| drawio \| dwg \| eml \| gif \| html \| jar \| jpeg \| jpg \| json \| md \| mov \| mp3 \| mp4 \| msg \| oga \| ogg \| pdf \| png \| ppt \| pptx \| rvt \| std \| svg \| tiff \| txt \| wav \| webm \| xls \| xlsx \| xml \| zip |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / duration`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A length of time with a unit, such as 10 seconds, 30 minutes or 14 days. Use for timeouts, loan periods, SLAs and reminders instead of number or text |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | object |  |
| `value.value.unit` |  | string: seconds \| minutes \| hours \| days \| weeks \| months \| quarters \| years |  |
| `value.value.value` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / email`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An email address, such as a support or sender address |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / function`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A reusable JavaScript function with typed inputs and one output |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.inputFuncArgMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `value.outputKind` |  | string: number \| text \| numberArray \| textArray |  |
| `value.javascript` |  | object |  |
| `value.javascript.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / html`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Rich HTML content, such as an email body or a formatted notice. Placeholders in value use ${name} with matching paramSet names, not {{name}} |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `value.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / hyperlink`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A URL, such as a help page or an external portal link |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.displayText` |  | string |  |
| `value.color` |  |  |  |
| `value.kind` |  | string: general \| youtube |  |
| `value.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / icon`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An icon name, for UI |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / image`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An uploaded image, such as a logo |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | object |  |
| `value.value.fileName` |  | string |  |
| `value.value.size` |  | number |  |
| `value.value.mediaIdBlurImage` |  | string | Resource name |
| `value.value.mediaIdImage` |  | string | Resource name |
| `value.value.primaryColor` |  | string |  |
| `value.value.width` |  | number |  |
| `value.value.height` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / imageCorner`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Image corner style, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: rectangle \| circle \| rounded |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / language`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A language, such as English or Hindi |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | string | Two-letter ISO 639-1 language code, e.g. en for English, hi for Hindi |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / location`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A map location, such as an office pin |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | object |  |
| `value.value.dateTime` |  | string | ISO 8601 UTC timestamp of the local time in the enterprise timeZone (see describe ent), e.g. 28 Sep 2026 02:00 in Asia/Kolkata is 2026-09-27T20:30:00.000Z. An offset such as +05:30 is also accepted |
| `value.value.country` |  | string |  |
| `value.value.address` |  | string |  |
| `value.value.entUser` |  | string | Resource name |
| `value.value.city` |  | string |  |
| `value.value.geoPoint` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / mapOfText`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Key to text pairs, such as message templates or labels by key |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set sourceForm when any entry uses kind field or derived |
| `value.sourceForm` |  | string | Resource name |
| `value.map` |  | object | Entries in order, each under its own key. Their order is kept; keep a key to update that entry, a new key adds one, a missing key removes it |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / mapPinShape`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Map pin shape, for map UI |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: avatar \| avatarWithName \| circle \| circleBig \| circleMedium \| circleWithLabel \| heart \| heartBig \| heartMedium \| label \| pin \| pinWithLabel \| square \| squareBig \| squareMedium \| star \| starBig \| starMedium \| triangle \| triangleBig \| triangleMedium |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / mapping`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Field mapping from one form or plugin to another. Put fromForm/toForm/toGrid/fieldMappingMap under properties.value (not top-level). Spreadsheet reports: value.fromForm=sheet form, value.toForm=outputForm; add value.toGrid for multi-row grid output, or omit toGrid for section→section (single-record / section fields only). |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set toForm (required). Set fromForm when any from binder uses kind field or derived; without fromForm only constant, context, or variable. fromGrid / toGrid pick section↔grid field-map mode; gridMappingMap entries carry their own grids for grid→grid. Spreadsheet report mapping: fromForm=sheet form, toForm=output form; multi-row → set toGrid; single-record/section-only → omit toGrid (section fields only). Plugin forms not wired yet. |
| `value.toForm` |  | string | Resource name |
| `value.toGrid` |  | string | Resource name |
| `value.gridMappingMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `value.fieldMappingMap` |  | object | Named field mappings (from binder → to field) plus optional match keys and variants. Entry shape is $defs/mappingField. |
| `value.fieldMappingMap.toKey` |  | string | Match key field on toForm |
| `value.fieldMappingMap.fromKey` |  | string | Match key field on fromForm |
| `value.fieldMappingMap.emptyFieldVariant` |  | string: ignoreEmptyField \| overrideEmptyField | Empty source field behavior |
| `value.fieldMappingMap.insertVariant` |  | string: insertForced \| skipEmptyKeyField \| doNotInsert | When to insert |
| `value.fieldMappingMap.updateVariant` |  | string: updateForced \| doNotUpdate | When to update |
| `value.fieldMappingMap.removeVariant` |  | string: removeForced \| doNotRemove | When to remove |
| `value.fromForm` |  | string | Resource name |
| `value.fromGrid` |  | string | Resource name |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / mobileNumber`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A phone number, such as a helpline |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | object |  |
| `value.value.nationalNumber` |  | number |  |
| `value.value.countryCode` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / month`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | One month of the year, such as the fiscal year start month |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: January \| February \| March \| April \| May \| June \| July \| August \| September \| October \| November \| December \| CurrentMonth \| PreviousMonth \| NextMonth |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / number`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Whole number without fractions, such as max retries, max books per member or page size. Use duration when the number is a length of time and decimal when it has fractions |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / paragraph`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Multi-line plain text, such as terms or instructions. Placeholders in value use ${name} with matching paramSet names, not {{name}} |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `value.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / placement`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Position choice, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: top \| bottom \| start \| end \| center \| diagonal \| overlayTop \| flexCenter \| spaceBetween \| justify |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / quarter`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | One quarter of the year, Q1 to Q4 |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: Quarter_1 \| Quarter_2 \| Quarter_3 \| Quarter_4 |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / ratingKind`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Rating style such as stars, for rating fields |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: heart_1 \| thumbs_2 \| star_3 \| star_4 \| star_5 |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / sequence`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An auto-incrementing counter for generated numbers, such as invoice or ticket numbers |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfDate`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A list of dates, such as public holidays. Store each as midnight of that day in the enterprise timeZone as UTC: 15 Aug 2026 in Asia/Kolkata is 2026-08-14T18:30:00.000Z |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.valueSet` |  | array of string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfDay`

Required on add: `name`, `value`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A list of weekdays, such as working days |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` | yes | object |  |
| `value.valueSet` |  | array of string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfNumber`

Required on add: `name`, `value`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A list of whole numbers, such as allowed quantities |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` | yes | object |  |
| `value.valueSet` |  | array of number |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfText`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Reusable option list for pickText/setOfText fields (statuses, gender, marital status, categories). Prefer this over hardcoding options on each field so the same options can be compared and reused. Create once, then set field source=<this var name>. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Options keyed by option key, in order. Rows and references such as defaultOption store the key, so keep it when changing value (the label). An entry without value uses the map key as the label and gets key plus PascalCase label, e.g. {"Out Of Stock":{}} becomes keyOutOfStock |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfTime`

Required on add: `name`, `value`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A list of times of day, such as reminder slots |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` | yes | object |  |
| `value.valueSet` |  | array of string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / setOfUser`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A rule that selects users, such as approvers or notification recipients |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set sourceForm when any statement uses kind fields |
| `value.node` |  |  |  |
| `value.sourceForm` |  | string | Resource name |
| `value.sourcePlugin` |  | string | Resource name |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / stroke`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Line stroke style, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: dash \| dotted \| solid |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / symbol`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | An identifier-like name: uppercase first letter, then letters and digits, no spaces |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string | Uppercase first letter, then alphanumeric |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / text`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Single-line plain text, such as a business name or an invoice prefix. Not for numbers, lengths of time, dates or URLs. Placeholders in value use ${name} with matching paramSet names, not {{name}} |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `value.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / textSize`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Text size, for UI settings |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / time`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A time of day without date, such as office opening time |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set exactly one of value, customValue |
| `value.customValue` |  | string | Time of day as HH:MM:SS, e.g. 09:30:00 |
| `value.value` |  | string: now |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / timeZone`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A time zone, such as Asia/Kolkata |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object |  |
| `value.value` |  | string |  |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / tree`

Required on add: `name`, `value`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | Hierarchical options with parent and child levels, such as category and subcategory |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` | yes | object |  |
| `value.value` |  | object |  |
| `value.value.map` |  | object | Entries in order, each under its own key. Their order is kept; keep a key to update that entry, a new key adds one, a missing key removes it |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |


### `var / userSetting`

Required on add: `name`, `details`, `deploy`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string | A preference each user sets for themselves |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `details` | yes | object |  |
| `details.modules` |  | array of string |  |
| `label` |  | string |  |
| `value` |  | object | Set defaultValue to match userSettingOptionKind; set optionDataSource when kind is pickOne or pickMany |
| `value.defaultValue` |  | object | Optional. Gson shape of the FieldValue for userSettingOptionKind; see oneOf |
| `value.userSettingOptionKind` | yes | string: text \| number \| decimal \| pickOne \| pickMany | What kind of value this setting stores |
| `value.optionDataSource` |  | string | setOfText var name. Required when userSettingOptionKind is pickOne or pickMany |
| `value.doNotShowOnUserSettings` |  | boolean | Admin enters it; hidden from the user settings UI; system may use it |
| `value.doNotShowValueToAdmin` |  | boolean | User enters it; admin must not read the value; system may use it |
| `deploy` | yes | string: requiredOnDeploy \| fixedOnDeploy | fixedOnDeploy (default): a constant the enterprise owns and reuses in many places, such as an HTTP timeout, loan days or a fine rate. Set value here; changing it once updates every use, and it is copied as-is when the enterprise is cloned for another client. requiredOnDeploy: client-specific data each deployment must enter for itself, such as GST number, business address or an API key. Leave value empty; it is supplied in the deploy var map and not carried over on clone. |




## `formFormula`

Formula on a form that assigns a computed value to a field. Needs parent form. Create after the target field exists. formula.value uses ${f:FieldName} placeholders (grid: ${f:Grid.Field}; sum: SUM(${f:Grid.Field})).

Required on add: `name`, `assignToField`, `formula`

| property | req | type | description |
|---|---|---|---|
| `condition` |  | object |  |
| `condition.negation` |  | boolean |  |
| `condition.cond` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `assignToField` | yes | string | Field that receives the result. Use the field name; when the same name exists in more than one grid, qualify as GridName.FieldName. |
| `formula` | yes | object | Computed script written to assignToField. See formula.value for ${f:…} placeholder rules. |
| `formula.value` |  | string | JavaScript expression. Reference form fields with ${f:FieldName} (dollar-brace, f: prefix), never bare names like TeaPrice. Grid fields: ${f:GridName.FieldName}. Aggregates over a grid column: SUM(${f:GridName.FieldName}). Example: (${f:TeaPrice} * ${f:NoOfTea}) + (${f:CoffeePrice} * ${f:NoOfCoffee}). Example sum: SUM(${f:Offices.TotalAmount}). |




## `formEvent`

Event handler on a form (onChange, onInitForm, onInitAndOnChange, …). Needs parent form. Create formEventAction and formEventCondition first, then bind them only via actions[]: [{"action":"HideX","condition":"IsSingle"},{"action":"ShowX","condition":"IsSingle","negate":true}]. Do not put formula or condition on formEventAction; condition belongs on actions[] entries.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `eventComps` |  | array of string |  |
| `kind` | yes | string: onChange \| onInitForm \| onSubmitForm \| onClickButton \| onInitAndOnChange |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `actions` |  | array of object | Ordered bindings to shared formEventAction / formEventCondition. Create those first (parent=form), then reference by name. Each entry is an object: {action, condition?, negate?}. action required (formEventAction name); condition optional (formEventCondition name); negate=true inverts the condition. Example hide when single / show otherwise: [{"action":"HideChildren","condition":"IsSingle"},{"action":"ShowChildren","condition":"IsSingle","negate":true}]. Do not put formula on actions[] entries. eventComps: fields/comps that trigger (typical for onChange, onInitAndOnChange, onClickButton; often omit for onInitForm / onSubmitForm). |
| `actions.condition` |  | string | Optional formEventCondition name on this form |
| `actions.negate` |  | boolean | Negate the condition when true |
| `actions.action` | yes | string | formEventAction name on this form |




## `formEventAction`

Shared form-event action (hidden, visible, setValue, …) in the form event pool. Needs parent form. Referenced only by formEvent.actions[].action. Do not attach condition here — put condition/negate on the formEvent actions[] binding.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `mapping` |  | string | Resource name |
| `comps` |  | array of string | Target field/comp names on this form (for setValue, hidden, visible, clear, …). Do not put condition here — bind condition/negate on formEvent.actions[]. |
| `kind` | yes | string: blink \| clear \| click \| disable \| enable \| executeAction \| executeFormula \| hidden \| highlight \| invisible \| optional \| required \| reset \| setValue \| shake \| visible |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `action` |  | string | Enterprise action name when kind=executeAction. |
| `groups` |  | array of string | Optional group names that scope where this action applies. |
| `formula` |  | object | JavaScript formula when kind=executeFormula. |
| `formula.value` |  | string |  |
| `outputMapping` |  | string | Resource name |
| `source` |  | object | ArgBinder value source (schema kind=argBinder). Used by setValue and similar. |
| `source.argName` | yes | string | Same as this entry's key |
| `source.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `source.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `actionOn` |  | string: component \| field \| layout \| sendButton |  |
| `layouts` |  | array of string | Optional form layout names that scope where this action applies. |




## `formEventCondition`

Shared form-event condition in the form event pool. Needs parent form. Referenced by formEvent.actions[].condition (optional; negate=true inverts). Leaf example equalTo text: statement={lhs:"MaritalStatus",operator:"equalTo",rhs:{argName:"rhs",kind:"constant",value:{type:"text",value:{value:"single"}}}}. rhs.kind must be an ArgBinder kind (constant/field/…), never mapOfText/condition/text.

Required on add: `name`

| property | req | type | description |
|---|---|---|---|
| `andOr` |  | boolean |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `statement` |  | object | Leaf condition: lhs is a field name on this form; operator is one of hasChanged\|hasNoValue\|hasValue\|equalTo\|notEqualTo\|greaterThan\|lessThan\|greaterThanOrEqualTo\|lessThanOrEqualTo\|contains; optional rhs ArgBinder. For equalTo/notEqualTo string compare use rhs kind=constant, e.g. {"lhs":"MaritalStatus","operator":"equalTo","rhs":{"argName":"rhs","kind":"constant","value":{"type":"text","value":{"value":"single"}}}}. rhs.kind must be constant/field/variable/… (EnumDefnArgBinder), never mapOfText, condition, mapping, or text. For hasNoValue/hasValue omit rhs. For composite trees use andOr + nested named map instead of statement. |
| `statement.lhs` |  | string | Resource name |
| `statement.rhs` |  | object | Right-hand ArgBinder (schema kind=argBinder) |
| `statement.rhs.argName` | yes | string | Same as this entry's key |
| `statement.rhs.kind` | yes | string | Binder kind — see schema kind=argBinder |
| `statement.rhs.value` | yes | object | Shape depends on kind — see schema kind=argBinder |
| `statement.operator` |  | string: hasChanged \| hasNoValue \| hasValue \| equalTo \| notEqualTo \| greaterThan \| lessThan \| greaterThanOrEqualTo \| lessThanOrEqualTo \| contains |  |
| `map` |  | object | Named child conditions for composite and/or trees. Nested nodes stay inline (not separate resource kinds). |

