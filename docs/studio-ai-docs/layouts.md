# Layouts

Form layouts (content/editor/template/report), grid layouts and spreadsheet layouts (table/list/card/map/kanban/calendar/charts), and enterprise user layouts.

Generated from the live `schema` tool output (`EntArtifactBuilder.schema`). Property names, enums and required lists are exact.



## `formLayout`

Form presentation layout (content, editor, template, report). Needs parent form. Create gridLayout first when the form has grids. type=content requires direction=horizontal|vertical (defaults to vertical when omitted). Top-level content: rootLayout=true (default). Nested sublayouts: rootLayout=false, then reference them from the root layout's formLayouts. Content: put fields/gridLayouts/formLayouts in start/flexCenter/end. Editor: layoutCompositeMap keyed by composite name; for grid composites set gridLayout.  Pass variant with one type value to see its own properties.

Required on add: `name`, `type`

| property | req | type | description |
|---|---|---|---|
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `type` | yes | string: content \| editor \| report \| template | Polymorphic: each type has its own properties, not listed here. Pick one value and call schema again with {"kind":"formLayout","variant":"content"}, using the chosen type as variant, to get its full schema before add; pass the same type inside properties. |


### `formLayout / content`

Required on add: `name`, `direction`, `type`

| property | req | type | description |
|---|---|---|---|
| `displayLabel` |  | string |  |
| `backgroundColor` |  |  |  |
| `borderColor` |  |  |  |
| `start` |  | object | Content region: put fields and/or gridLayouts and/or nested formLayouts (content sublayouts). gridLayouts must be kind=gridLayout names on THIS parent form only. Nested formLayouts are other type=content layouts with rootLayout=false. Example: {"fields":["CustomerName"],"gridLayouts":["Offices.OfficesTable"],"formLayouts":["CustomerBlock"]}. |
| `start.borderColor` |  | string | Resource name |
| `start.formLayouts` |  | array of string | Nested content sublayouts (rootLayout=false). Create those first, then reference here from the root layout (rootLayout=true). |
| `start.paddingSize` |  | string: thick \| thin |  |
| `start.fields` |  | array of string |  |
| `start.gridSwitchers` |  | array of string |  |
| `start.borderPositionSet` |  | array of string |  |
| `start.paddingPositionSet` |  | array of string |  |
| `start.gridLayouts` |  | array of string | kind=gridLayout names to show in this region. Create gridLayouts before referencing. |
| `description` |  | string |  |
| `borderRadiusSize` |  | string: thick \| thin |  |
| `type` | yes | string |  |
| `borderPositionSet` |  | array of string |  |
| `borderRadiusSet` |  | array of string |  |
| `renderingMode` |  | string: a4Size \| custom \| fitToScreen \| fullScreen \| mm_48 \| mm_58 \| mm_72 \| mm_80 \| mm_104 \| receiptSize |  |
| `flexCenter` |  | object | Content region: put fields and/or gridLayouts and/or nested formLayouts (content sublayouts). gridLayouts must be kind=gridLayout names on THIS parent form only. Nested formLayouts are other type=content layouts with rootLayout=false. Example: {"fields":["CustomerName"],"gridLayouts":["Offices.OfficesTable"],"formLayouts":["CustomerBlock"]}. |
| `flexCenter.borderColor` |  | string | Resource name |
| `flexCenter.formLayouts` |  | array of string | Nested content sublayouts (rootLayout=false). Create those first, then reference here from the root layout (rootLayout=true). |
| `flexCenter.paddingSize` |  | string: thick \| thin |  |
| `flexCenter.fields` |  | array of string |  |
| `flexCenter.gridSwitchers` |  | array of string |  |
| `flexCenter.borderPositionSet` |  | array of string |  |
| `flexCenter.paddingPositionSet` |  | array of string |  |
| `flexCenter.gridLayouts` |  | array of string | kind=gridLayout names to show in this region. Create gridLayouts before referencing. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `rootLayout` |  | boolean | true for the top-level content layout (the one report actions and the form shell use). false for nested sublayouts referenced from another content layout's formLayouts. Defaults to true when omitted on add. |
| `end` |  | object | Content region: put fields and/or gridLayouts and/or nested formLayouts (content sublayouts). gridLayouts must be kind=gridLayout names on THIS parent form only. Nested formLayouts are other type=content layouts with rootLayout=false. Example: {"fields":["CustomerName"],"gridLayouts":["Offices.OfficesTable"],"formLayouts":["CustomerBlock"]}. |
| `end.borderColor` |  | string | Resource name |
| `end.formLayouts` |  | array of string | Nested content sublayouts (rootLayout=false). Create those first, then reference here from the root layout (rootLayout=true). |
| `end.paddingSize` |  | string: thick \| thin |  |
| `end.fields` |  | array of string |  |
| `end.gridSwitchers` |  | array of string |  |
| `end.borderPositionSet` |  | array of string |  |
| `end.paddingPositionSet` |  | array of string |  |
| `end.gridLayouts` |  | array of string | kind=gridLayout names to show in this region. Create gridLayouts before referencing. |
| `paddingSize` |  | string: thick \| thin |  |
| `allowToSwitchLayouts` |  | array of string |  |
| `paddingPositionSet` |  | array of string |  |
| `direction` | yes | string: horizontal \| vertical | REQUIRED for type=content: horizontal or vertical (not row/column). Defaults to vertical when omitted. |


### `formLayout / editor`

Required on add: `name`, `editorLayoutRenderingMode`, `type`

| property | req | type | description |
|---|---|---|---|
| `prevButtonLabel` |  | string |  |
| `nextButtonLabel` |  | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `type` | yes | string |  |
| `composites` |  | array of string |  |
| `showStepper` |  | boolean |  |
| `formEditorLayouts` |  | array of string |  |
| `hideLabelComposites` |  | array of string |  |
| `navigationMode` |  | string: nextButton \| nextPreviousButton |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `layoutCompositeMap` |  | object | Editor only: ordered map keyed by composite name. Section entries may be {}. For a grid composite, set gridLayout to a kind=gridLayout name (create that gridLayout first). Example: {"Details":{},"Offices":{"gridLayout":"OfficesTable"}}. |
| `allowToSwitchLayouts` |  | array of string |  |
| `editorLayoutRenderingMode` | yes | string: tabs \| stack \| wizard |  |
| `direction` |  | string: horizontal \| vertical | REQUIRED for type=content: horizontal or vertical (not row/column). Defaults to vertical when omitted. |


### `formLayout / report`

Required on add: `name`, `type`

| property | req | type | description |
|---|---|---|---|
| `watermark` |  | object |  |
| `watermark.textPosition` |  | string: top \| bottom \| start \| end \| center \| diagonal \| overlayTop \| flexCenter \| spaceBetween \| justify |  |
| `watermark.textSize` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `watermark.bgImageHorizontalPosition` |  | string: start \| center \| end |  |
| `watermark.bgImage` |  | object |  |
| `watermark.bgImage.fileName` |  | string |  |
| `watermark.bgImage.size` |  | number |  |
| `watermark.bgImage.mediaIdBlurImage` |  | string | Resource name |
| `watermark.bgImage.mediaIdImage` |  | string | Resource name |
| `watermark.bgImage.primaryColor` |  | string |  |
| `watermark.bgImage.width` |  | number |  |
| `watermark.bgImage.height` |  | number |  |
| `watermark.text` |  | object |  |
| `watermark.text.paramSet` |  | array of string | Names of each ${...} in value, same count and order. For Hello ${name} use ["name"]. Omit when there are no placeholders |
| `watermark.text.value` |  | string | Template text. Placeholders are ${name} (dollar-brace), never {{name}}. Example: Hello ${name} |
| `watermark.opacity` |  | number |  |
| `watermark.bgImageVerticalPosition` |  | string: start \| center \| end |  |
| `footer` |  | object |  |
| `footer.comp` |  | string | Resource name |
| `footer.showSeparator` |  | boolean |  |
| `description` |  | string |  |
| `compMap` |  | object | Keyed as describe prints |
| `type` | yes | string |  |
| `ruleMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `paperSize` |  | string: a4Size \| custom \| fitToScreen \| fullScreen \| mm_48 \| mm_58 \| mm_72 \| mm_80 \| mm_104 \| receiptSize |  |
| `displayComp` |  | string | Resource name |
| `paperWidth` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `styleSheetMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `header` |  | object |  |
| `header.comp` |  | string | Resource name |
| `header.backgroundColor` |  | object |  |
| `header.backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `header.backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `header.topComp` |  | string | Resource name |
| `header.showEnterprise` |  | boolean |  |
| `header.showSeparator` |  | boolean |  |
| `header.textColor` |  | object |  |
| `header.textColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `header.textColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `header.hyperlinkMap` |  | object | Entries keyed by id, in order, as describe prints. Keep an id to update that entry; any new key adds one |
| `style` |  | object |  |
| `style.borderColor` |  | object |  |
| `style.borderColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `style.borderColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `style.hidden` |  | boolean |  |
| `style.align` |  | string: start \| center \| end |  |
| `style.borderPositionSet` |  | array of string |  |
| `style.minHeight` |  | string |  |
| `style.top` |  | number |  |
| `style.maxHeight` |  | string |  |
| `style.justify` |  | string: start \| center \| end \| spaceBetween |  |
| `style.gap` |  | number |  |
| `style.variant` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `style.backgroundGradientDirection` |  | string: horizontal \| vertical |  |
| `style.direction` |  | string: horizontal \| vertical |  |
| `style.height` |  | string |  |
| `style.maxWidth` |  | string |  |
| `style.backgroundColor` |  | object |  |
| `style.backgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `style.backgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `style.grow` |  | number |  |
| `style.bottom` |  | number |  |
| `style.textStyleSet` |  | array of string |  |
| `style.borderRadiusSize` |  | string: thick \| thin |  |
| `style.minWidth` |  | string |  |
| `style.right` |  | number |  |
| `style.shadowSize` |  | string: thick \| thin |  |
| `style.textColor` |  | object |  |
| `style.textColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `style.textColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `style.backgroundGradientColor` |  | object |  |
| `style.backgroundGradientColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `style.backgroundGradientColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `style.borderRadiusSet` |  | array of string |  |
| `style.left` |  | number |  |
| `style.textAlignment` |  | string: start \| center \| end \| justify |  |
| `style.width` |  | string |  |
| `style.position` |  | string: relative \| absolute |  |
| `style.paddingSize` |  | string: thick \| thin |  |
| `style.paddingPositionSet` |  | array of string |  |
| `paperHeight` |  | number |  |


### `formLayout / template`

Required on add: `name`, `type`

| property | req | type | description |
|---|---|---|---|
| `watermark` |  | object |  |
| `watermark.textSize` |  | string | Resource name |
| `watermark.textPosition` |  | string | Resource name |
| `watermark.bgImageHorizontalPosition` |  | string: start \| center \| end |  |
| `watermark.textOpacity` |  | string | Resource name |
| `watermark.textPattern` |  | object |  |
| `watermark.textPattern.argBinderMap` |  | object | Call schema with kind=argBinderMap for the ordered argBinderMap shape ({ map: { key: ArgBinder } }). Map entries use ArgBinder — also call schema kind=argBinder once for entry kinds/values. Fetch once per session; shared by field prefix/suffix/placeHolder/helperText/default and form chatLabelPattern/chatPattern. |
| `watermark.textPattern.arg` |  | string | Resource name |
| `watermark.bgImage` |  |  |  |
| `watermark.bgImageVerticalPosition` |  | string: start \| center \| end |  |
| `footer` |  | object |  |
| `footer.footerImage` |  |  |  |
| `footer.formLayout` |  | string | Resource name |
| `footer.footerImageHeight` |  | number |  |
| `footer.showSeparator` |  | boolean |  |
| `paperWidth` |  | number |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `header` |  | object |  |
| `header.backgroundColor` |  |  |  |
| `header.formLayout` |  | string | Resource name |
| `header.showEnterprise` |  | boolean |  |
| `header.headerImage` |  |  |  |
| `header.showSeparator` |  | boolean |  |
| `header.textColor` |  |  |  |
| `header.headerImageHeight` |  | number |  |
| `header.hyperlinks` |  | array of string |  |
| `description` |  | string |  |
| `paddingSize` |  | string: thick \| thin |  |
| `type` | yes | string |  |
| `paperSize` |  | string: a4Size \| custom \| fitToScreen \| fullScreen \| mm_48 \| mm_58 \| mm_72 \| mm_80 \| mm_104 \| receiptSize |  |
| `paperHeight` |  | number |  |
| `borderPositionSet` |  | array of string |  |
| `paddingPositionSet` |  | array of string |  |




## `gridLayout`

Layout on a form grid (table, card, kanban, …). Needs parent form. Pass composite=<grid name|id> on add/set when the form has more than one grid.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string: card \| list \| map \| table \| kanban \| calendar \| xyChartBarGraph \| xyChartLineChart \| xyChartPieChart \| xyChartDoughnut \| xyChartScatterPlot | Polymorphic: each kind has its own properties, not listed here. Pick one value and call schema again with {"kind":"gridLayout","variant":"card"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / calendar`

Required on add: `name`, `fromDateField`, `titleField`, `showFields`, `kind`

| property | req | type | description |
|---|---|---|---|
| `toDateField` |  | string | Resource name |
| `titleField` | yes | string | Resource name |
| `kind` | yes | string |  |
| `toTimeField` |  | string | Resource name |
| `description` |  | string |  |
| `defaultCalendarView` |  | string: currentMonth \| firstAvailableMonth \| lastAvailableMonth |  |
| `showFields` | yes | array of string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `colorField` |  | string | Resource name |
| `fromDateField` | yes | string | Resource name |
| `fromTimeField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / card`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `item` |  | object |  |
| `item.fourthLine` |  | object |  |
| `item.fourthLine.middle` |  | object |  |
| `item.fourthLine.middle.lineFields` |  | array of string |  |
| `item.fourthLine.middle.textSize` |  |  |  |
| `item.fourthLine.middle.color` |  |  |  |
| `item.fourthLine.middle.showLabels` |  | boolean |  |
| `item.fourthLine.middle.textSizeField` |  | string | Resource name |
| `item.fourthLine.middle.line` |  |  |  |
| `item.fourthLine.middle.colorField` |  | string | Resource name |
| `item.fourthLine.caption` |  | object |  |
| `item.fourthLine.caption.lineFields` |  | array of string |  |
| `item.fourthLine.caption.textSize` |  |  |  |
| `item.fourthLine.caption.color` |  |  |  |
| `item.fourthLine.caption.showLabels` |  | boolean |  |
| `item.fourthLine.caption.textSizeField` |  | string | Resource name |
| `item.fourthLine.caption.line` |  |  |  |
| `item.fourthLine.caption.colorField` |  | string | Resource name |
| `item.fourthLine.first` |  | object |  |
| `item.fourthLine.first.lineFields` |  | array of string |  |
| `item.fourthLine.first.textSize` |  |  |  |
| `item.fourthLine.first.color` |  |  |  |
| `item.fourthLine.first.showLabels` |  | boolean |  |
| `item.fourthLine.first.textSizeField` |  | string | Resource name |
| `item.fourthLine.first.line` |  |  |  |
| `item.fourthLine.first.colorField` |  | string | Resource name |
| `item.fifthLine` |  | object |  |
| `item.fifthLine.middle` |  | object |  |
| `item.fifthLine.middle.lineFields` |  | array of string |  |
| `item.fifthLine.middle.textSize` |  |  |  |
| `item.fifthLine.middle.color` |  |  |  |
| `item.fifthLine.middle.showLabels` |  | boolean |  |
| `item.fifthLine.middle.textSizeField` |  | string | Resource name |
| `item.fifthLine.middle.line` |  |  |  |
| `item.fifthLine.middle.colorField` |  | string | Resource name |
| `item.fifthLine.caption` |  | object |  |
| `item.fifthLine.caption.lineFields` |  | array of string |  |
| `item.fifthLine.caption.textSize` |  |  |  |
| `item.fifthLine.caption.color` |  |  |  |
| `item.fifthLine.caption.showLabels` |  | boolean |  |
| `item.fifthLine.caption.textSizeField` |  | string | Resource name |
| `item.fifthLine.caption.line` |  |  |  |
| `item.fifthLine.caption.colorField` |  | string | Resource name |
| `item.fifthLine.first` |  | object |  |
| `item.fifthLine.first.lineFields` |  | array of string |  |
| `item.fifthLine.first.textSize` |  |  |  |
| `item.fifthLine.first.color` |  |  |  |
| `item.fifthLine.first.showLabels` |  | boolean |  |
| `item.fifthLine.first.textSizeField` |  | string | Resource name |
| `item.fifthLine.first.line` |  |  |  |
| `item.fifthLine.first.colorField` |  | string | Resource name |
| `item.imageWidth` |  |  |  |
| `item.medias` |  | array of string |  |
| `item.thirdLine` |  | object |  |
| `item.thirdLine.middle` |  | object |  |
| `item.thirdLine.middle.lineFields` |  | array of string |  |
| `item.thirdLine.middle.textSize` |  |  |  |
| `item.thirdLine.middle.color` |  |  |  |
| `item.thirdLine.middle.showLabels` |  | boolean |  |
| `item.thirdLine.middle.textSizeField` |  | string | Resource name |
| `item.thirdLine.middle.line` |  |  |  |
| `item.thirdLine.middle.colorField` |  | string | Resource name |
| `item.thirdLine.caption` |  | object |  |
| `item.thirdLine.caption.lineFields` |  | array of string |  |
| `item.thirdLine.caption.textSize` |  |  |  |
| `item.thirdLine.caption.color` |  |  |  |
| `item.thirdLine.caption.showLabels` |  | boolean |  |
| `item.thirdLine.caption.textSizeField` |  | string | Resource name |
| `item.thirdLine.caption.line` |  |  |  |
| `item.thirdLine.caption.colorField` |  | string | Resource name |
| `item.thirdLine.first` |  | object |  |
| `item.thirdLine.first.lineFields` |  | array of string |  |
| `item.thirdLine.first.textSize` |  |  |  |
| `item.thirdLine.first.color` |  |  |  |
| `item.thirdLine.first.showLabels` |  | boolean |  |
| `item.thirdLine.first.textSizeField` |  | string | Resource name |
| `item.thirdLine.first.line` |  |  |  |
| `item.thirdLine.first.colorField` |  | string | Resource name |
| `item.imageCorner` |  | string | Resource name |
| `item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `item.secondLine` |  | object |  |
| `item.secondLine.middle` |  | object |  |
| `item.secondLine.middle.lineFields` |  | array of string |  |
| `item.secondLine.middle.textSize` |  |  |  |
| `item.secondLine.middle.color` |  |  |  |
| `item.secondLine.middle.showLabels` |  | boolean |  |
| `item.secondLine.middle.textSizeField` |  | string | Resource name |
| `item.secondLine.middle.line` |  |  |  |
| `item.secondLine.middle.colorField` |  | string | Resource name |
| `item.secondLine.caption` |  | object |  |
| `item.secondLine.caption.lineFields` |  | array of string |  |
| `item.secondLine.caption.textSize` |  |  |  |
| `item.secondLine.caption.color` |  |  |  |
| `item.secondLine.caption.showLabels` |  | boolean |  |
| `item.secondLine.caption.textSizeField` |  | string | Resource name |
| `item.secondLine.caption.line` |  |  |  |
| `item.secondLine.caption.colorField` |  | string | Resource name |
| `item.secondLine.first` |  | object |  |
| `item.secondLine.first.lineFields` |  | array of string |  |
| `item.secondLine.first.textSize` |  |  |  |
| `item.secondLine.first.color` |  |  |  |
| `item.secondLine.first.showLabels` |  | boolean |  |
| `item.secondLine.first.textSizeField` |  | string | Resource name |
| `item.secondLine.first.line` |  |  |  |
| `item.secondLine.first.colorField` |  | string | Resource name |
| `item.imageBackgroundColor` |  | object |  |
| `item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `item.mediaFields` |  | array of string |  |
| `item.firstLine` |  | object |  |
| `item.firstLine.middle` |  | object |  |
| `item.firstLine.middle.lineFields` |  | array of string |  |
| `item.firstLine.middle.textSize` |  |  |  |
| `item.firstLine.middle.color` |  |  |  |
| `item.firstLine.middle.showLabels` |  | boolean |  |
| `item.firstLine.middle.textSizeField` |  | string | Resource name |
| `item.firstLine.middle.line` |  |  |  |
| `item.firstLine.middle.colorField` |  | string | Resource name |
| `item.firstLine.caption` |  | object |  |
| `item.firstLine.caption.lineFields` |  | array of string |  |
| `item.firstLine.caption.textSize` |  |  |  |
| `item.firstLine.caption.color` |  |  |  |
| `item.firstLine.caption.showLabels` |  | boolean |  |
| `item.firstLine.caption.textSizeField` |  | string | Resource name |
| `item.firstLine.caption.line` |  |  |  |
| `item.firstLine.caption.colorField` |  | string | Resource name |
| `item.firstLine.first` |  | object |  |
| `item.firstLine.first.lineFields` |  | array of string |  |
| `item.firstLine.first.textSize` |  |  |  |
| `item.firstLine.first.color` |  |  |  |
| `item.firstLine.first.showLabels` |  | boolean |  |
| `item.firstLine.first.textSizeField` |  | string | Resource name |
| `item.firstLine.first.line` |  |  |  |
| `item.firstLine.first.colorField` |  | string | Resource name |
| `item.imageHeight` |  |  |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `numOfColumns` |  | number |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `groupByField` |  | string | Resource name |
| `filter` |  | object |  |
| `filter.advanceFilterFields` |  | array of string |  |
| `filter.kind` |  | string: tree \| tab |  |
| `filter.sortOrder` |  | string: ascending \| descending |  |
| `filter.categoryFields` |  | array of string |  |
| `filter.sortByFields` |  | array of string |  |
| `filter.showSearchBar` |  | boolean |  |
| `hideBorders` |  | boolean |  |
| `renderingMode` |  | string: auto \| flex |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / kanban`

Required on add: `name`, `kanbanField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kanbanField` | yes | string | Resource name |
| `textSize` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `showCommentCount` |  | boolean |  |
| `showFields` |  | array of string |  |
| `showSectionName` |  | boolean |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `showFooter` |  | boolean |  |
| `sortOrder` |  | string: ascending \| descending |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `sortByFields` |  | array of string |  |
| `swimlaneMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / list`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `item` |  | object |  |
| `item.fourthLine` |  | object |  |
| `item.fourthLine.middle` |  | object |  |
| `item.fourthLine.middle.lineFields` |  | array of string |  |
| `item.fourthLine.middle.textSize` |  |  |  |
| `item.fourthLine.middle.color` |  |  |  |
| `item.fourthLine.middle.showLabels` |  | boolean |  |
| `item.fourthLine.middle.textSizeField` |  | string | Resource name |
| `item.fourthLine.middle.line` |  |  |  |
| `item.fourthLine.middle.colorField` |  | string | Resource name |
| `item.fourthLine.caption` |  | object |  |
| `item.fourthLine.caption.lineFields` |  | array of string |  |
| `item.fourthLine.caption.textSize` |  |  |  |
| `item.fourthLine.caption.color` |  |  |  |
| `item.fourthLine.caption.showLabels` |  | boolean |  |
| `item.fourthLine.caption.textSizeField` |  | string | Resource name |
| `item.fourthLine.caption.line` |  |  |  |
| `item.fourthLine.caption.colorField` |  | string | Resource name |
| `item.fourthLine.first` |  | object |  |
| `item.fourthLine.first.lineFields` |  | array of string |  |
| `item.fourthLine.first.textSize` |  |  |  |
| `item.fourthLine.first.color` |  |  |  |
| `item.fourthLine.first.showLabels` |  | boolean |  |
| `item.fourthLine.first.textSizeField` |  | string | Resource name |
| `item.fourthLine.first.line` |  |  |  |
| `item.fourthLine.first.colorField` |  | string | Resource name |
| `item.fifthLine` |  | object |  |
| `item.fifthLine.middle` |  | object |  |
| `item.fifthLine.middle.lineFields` |  | array of string |  |
| `item.fifthLine.middle.textSize` |  |  |  |
| `item.fifthLine.middle.color` |  |  |  |
| `item.fifthLine.middle.showLabels` |  | boolean |  |
| `item.fifthLine.middle.textSizeField` |  | string | Resource name |
| `item.fifthLine.middle.line` |  |  |  |
| `item.fifthLine.middle.colorField` |  | string | Resource name |
| `item.fifthLine.caption` |  | object |  |
| `item.fifthLine.caption.lineFields` |  | array of string |  |
| `item.fifthLine.caption.textSize` |  |  |  |
| `item.fifthLine.caption.color` |  |  |  |
| `item.fifthLine.caption.showLabels` |  | boolean |  |
| `item.fifthLine.caption.textSizeField` |  | string | Resource name |
| `item.fifthLine.caption.line` |  |  |  |
| `item.fifthLine.caption.colorField` |  | string | Resource name |
| `item.fifthLine.first` |  | object |  |
| `item.fifthLine.first.lineFields` |  | array of string |  |
| `item.fifthLine.first.textSize` |  |  |  |
| `item.fifthLine.first.color` |  |  |  |
| `item.fifthLine.first.showLabels` |  | boolean |  |
| `item.fifthLine.first.textSizeField` |  | string | Resource name |
| `item.fifthLine.first.line` |  |  |  |
| `item.fifthLine.first.colorField` |  | string | Resource name |
| `item.imageWidth` |  |  |  |
| `item.medias` |  | array of string |  |
| `item.thirdLine` |  | object |  |
| `item.thirdLine.middle` |  | object |  |
| `item.thirdLine.middle.lineFields` |  | array of string |  |
| `item.thirdLine.middle.textSize` |  |  |  |
| `item.thirdLine.middle.color` |  |  |  |
| `item.thirdLine.middle.showLabels` |  | boolean |  |
| `item.thirdLine.middle.textSizeField` |  | string | Resource name |
| `item.thirdLine.middle.line` |  |  |  |
| `item.thirdLine.middle.colorField` |  | string | Resource name |
| `item.thirdLine.caption` |  | object |  |
| `item.thirdLine.caption.lineFields` |  | array of string |  |
| `item.thirdLine.caption.textSize` |  |  |  |
| `item.thirdLine.caption.color` |  |  |  |
| `item.thirdLine.caption.showLabels` |  | boolean |  |
| `item.thirdLine.caption.textSizeField` |  | string | Resource name |
| `item.thirdLine.caption.line` |  |  |  |
| `item.thirdLine.caption.colorField` |  | string | Resource name |
| `item.thirdLine.first` |  | object |  |
| `item.thirdLine.first.lineFields` |  | array of string |  |
| `item.thirdLine.first.textSize` |  |  |  |
| `item.thirdLine.first.color` |  |  |  |
| `item.thirdLine.first.showLabels` |  | boolean |  |
| `item.thirdLine.first.textSizeField` |  | string | Resource name |
| `item.thirdLine.first.line` |  |  |  |
| `item.thirdLine.first.colorField` |  | string | Resource name |
| `item.imageCorner` |  | string | Resource name |
| `item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `item.secondLine` |  | object |  |
| `item.secondLine.middle` |  | object |  |
| `item.secondLine.middle.lineFields` |  | array of string |  |
| `item.secondLine.middle.textSize` |  |  |  |
| `item.secondLine.middle.color` |  |  |  |
| `item.secondLine.middle.showLabels` |  | boolean |  |
| `item.secondLine.middle.textSizeField` |  | string | Resource name |
| `item.secondLine.middle.line` |  |  |  |
| `item.secondLine.middle.colorField` |  | string | Resource name |
| `item.secondLine.caption` |  | object |  |
| `item.secondLine.caption.lineFields` |  | array of string |  |
| `item.secondLine.caption.textSize` |  |  |  |
| `item.secondLine.caption.color` |  |  |  |
| `item.secondLine.caption.showLabels` |  | boolean |  |
| `item.secondLine.caption.textSizeField` |  | string | Resource name |
| `item.secondLine.caption.line` |  |  |  |
| `item.secondLine.caption.colorField` |  | string | Resource name |
| `item.secondLine.first` |  | object |  |
| `item.secondLine.first.lineFields` |  | array of string |  |
| `item.secondLine.first.textSize` |  |  |  |
| `item.secondLine.first.color` |  |  |  |
| `item.secondLine.first.showLabels` |  | boolean |  |
| `item.secondLine.first.textSizeField` |  | string | Resource name |
| `item.secondLine.first.line` |  |  |  |
| `item.secondLine.first.colorField` |  | string | Resource name |
| `item.imageBackgroundColor` |  | object |  |
| `item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `item.mediaFields` |  | array of string |  |
| `item.firstLine` |  | object |  |
| `item.firstLine.middle` |  | object |  |
| `item.firstLine.middle.lineFields` |  | array of string |  |
| `item.firstLine.middle.textSize` |  |  |  |
| `item.firstLine.middle.color` |  |  |  |
| `item.firstLine.middle.showLabels` |  | boolean |  |
| `item.firstLine.middle.textSizeField` |  | string | Resource name |
| `item.firstLine.middle.line` |  |  |  |
| `item.firstLine.middle.colorField` |  | string | Resource name |
| `item.firstLine.caption` |  | object |  |
| `item.firstLine.caption.lineFields` |  | array of string |  |
| `item.firstLine.caption.textSize` |  |  |  |
| `item.firstLine.caption.color` |  |  |  |
| `item.firstLine.caption.showLabels` |  | boolean |  |
| `item.firstLine.caption.textSizeField` |  | string | Resource name |
| `item.firstLine.caption.line` |  |  |  |
| `item.firstLine.caption.colorField` |  | string | Resource name |
| `item.firstLine.first` |  | object |  |
| `item.firstLine.first.lineFields` |  | array of string |  |
| `item.firstLine.first.textSize` |  |  |  |
| `item.firstLine.first.color` |  |  |  |
| `item.firstLine.first.showLabels` |  | boolean |  |
| `item.firstLine.first.textSizeField` |  | string | Resource name |
| `item.firstLine.first.line` |  |  |  |
| `item.firstLine.first.colorField` |  | string | Resource name |
| `item.imageHeight` |  |  |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `numOfColumns` |  | number |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `groupByField` |  | string | Resource name |
| `filter` |  | object |  |
| `filter.advanceFilterFields` |  | array of string |  |
| `filter.kind` |  | string: tree \| tab |  |
| `filter.sortOrder` |  | string: ascending \| descending |  |
| `filter.categoryFields` |  | array of string |  |
| `filter.sortByFields` |  | array of string |  |
| `filter.showSearchBar` |  | boolean |  |
| `hideBorders` |  | boolean |  |
| `renderingMode` |  | string: auto \| flex |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / map`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `locationField` |  | string | Resource name |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `liveLocationPin` |  | object |  |
| `liveLocationPin.shapeField` |  | string | Resource name |
| `liveLocationPin.shape` |  |  |  |
| `liveLocationPin.color` |  |  |  |
| `liveLocationPin.toolTip` |  |  |  |
| `liveLocationPin.avatarField` |  | string | Resource name |
| `liveLocationPin.avatar` |  |  |  |
| `liveLocationPin.label` |  |  |  |
| `liveLocationPin.toolTipField` |  | string | Resource name |
| `liveLocationPin.colorField` |  | string | Resource name |
| `liveLocationPin.labelField` |  | string | Resource name |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `displayMode` |  | string: auto \| cluster \| heatmap \| marker |  |
| `lineStroke` |  | object |  |
| `lineStroke.groupByField` |  | string | Resource name |
| `lineStroke.color` |  |  |  |
| `lineStroke.strokeField` |  | string | Resource name |
| `lineStroke.stroke` |  |  |  |
| `lineStroke.colorField` |  | string | Resource name |
| `renderingMode` |  | string: fixedLocation \| liveLocation |  |
| `mapPin` |  | object |  |
| `mapPin.shapeField` |  | string | Resource name |
| `mapPin.shape` |  |  |  |
| `mapPin.color` |  |  |  |
| `mapPin.toolTip` |  |  |  |
| `mapPin.avatarField` |  | string | Resource name |
| `mapPin.avatar` |  |  |  |
| `mapPin.label` |  |  |  |
| `mapPin.toolTipField` |  | string | Resource name |
| `mapPin.colorField` |  | string | Resource name |
| `mapPin.labelField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / table`

Required on add: `name`, `showComps`, `kind`

| property | req | type | description |
|---|---|---|---|
| `pagination` |  | boolean |  |
| `footer` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `showComps` | yes | array of string |  |
| `hideRowSeparator` |  | boolean |  |
| `description` |  | string |  |
| `allowCustomFilters` |  | boolean |  |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `renderingMode` |  | string: auto \| flex |  |
| `freezeFields` |  | array of string |  |
| `sortByFields` |  | array of string |  |
| `theme` |  | string: standard \| spacious |  |
| `serverSideFilter` |  | boolean |  |
| `columnAlignmentArray` |  | array of string |  |
| `masterDetailGridLayoutMap` |  | object | Keyed as describe prints |
| `hideHeaders` |  | boolean |  |
| `allowToSwitchLayouts` |  | array of string |  |
| `indexColumnName` |  | string |  |
| `kind` | yes | string |  |
| `showCommentCount` |  | boolean |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `rowsPerPage` |  | number |  |
| `sparklineLayoutMap` |  | object | Keyed as describe prints |
| `columnSizeSet` |  | array of string |  |
| `sortOrder` |  | string: ascending \| descending |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `header` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `styleMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |


### `gridLayout / xyChartBarGraph`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `alwaysShowBarValues` |  | boolean |  |
| `renderingMode` |  | string: horizontal \| vertical |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / xyChartDoughnut`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `alwaysShowSliceValues` |  | boolean |  |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / xyChartLineChart`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / xyChartPieChart`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `alwaysShowSliceValues` |  | boolean |  |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `gridLayout / xyChartScatterPlot`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |




## `spreadsheetLayout`

Layout on a spreadsheet (table, card, kanban, list, …). Needs parent spreadsheet. Use kind=table for browsing/editors; use kind=list or kind=card for type=ref layoutSpreadsheet (refs reject table). Prefer unique names per sheet.  Pass variant with one kind value to see its own properties.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kind` | yes | string: card \| list \| map \| table \| kanban \| calendar \| xyChartBarGraph \| xyChartLineChart \| xyChartPieChart \| xyChartDoughnut \| xyChartScatterPlot | Polymorphic: each kind has its own properties, not listed here. Pick one value and call schema again with {"kind":"spreadsheetLayout","variant":"card"}, using the chosen kind as variant, to get its full schema before add; pass the same kind inside properties. |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / calendar`

Required on add: `name`, `fromDateField`, `titleField`, `showFields`, `kind`

| property | req | type | description |
|---|---|---|---|
| `toDateField` |  | string | Resource name |
| `titleField` | yes | string | Resource name |
| `kind` | yes | string |  |
| `toTimeField` |  | string | Resource name |
| `description` |  | string |  |
| `defaultCalendarView` |  | string: currentMonth \| firstAvailableMonth \| lastAvailableMonth |  |
| `showFields` | yes | array of string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `colorField` |  | string | Resource name |
| `fromDateField` | yes | string | Resource name |
| `fromTimeField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / card`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `item` |  | object |  |
| `item.fourthLine` |  | object |  |
| `item.fourthLine.middle` |  | object |  |
| `item.fourthLine.middle.lineFields` |  | array of string |  |
| `item.fourthLine.middle.textSize` |  |  |  |
| `item.fourthLine.middle.color` |  |  |  |
| `item.fourthLine.middle.showLabels` |  | boolean |  |
| `item.fourthLine.middle.textSizeField` |  | string | Resource name |
| `item.fourthLine.middle.line` |  |  |  |
| `item.fourthLine.middle.colorField` |  | string | Resource name |
| `item.fourthLine.caption` |  | object |  |
| `item.fourthLine.caption.lineFields` |  | array of string |  |
| `item.fourthLine.caption.textSize` |  |  |  |
| `item.fourthLine.caption.color` |  |  |  |
| `item.fourthLine.caption.showLabels` |  | boolean |  |
| `item.fourthLine.caption.textSizeField` |  | string | Resource name |
| `item.fourthLine.caption.line` |  |  |  |
| `item.fourthLine.caption.colorField` |  | string | Resource name |
| `item.fourthLine.first` |  | object |  |
| `item.fourthLine.first.lineFields` |  | array of string |  |
| `item.fourthLine.first.textSize` |  |  |  |
| `item.fourthLine.first.color` |  |  |  |
| `item.fourthLine.first.showLabels` |  | boolean |  |
| `item.fourthLine.first.textSizeField` |  | string | Resource name |
| `item.fourthLine.first.line` |  |  |  |
| `item.fourthLine.first.colorField` |  | string | Resource name |
| `item.fifthLine` |  | object |  |
| `item.fifthLine.middle` |  | object |  |
| `item.fifthLine.middle.lineFields` |  | array of string |  |
| `item.fifthLine.middle.textSize` |  |  |  |
| `item.fifthLine.middle.color` |  |  |  |
| `item.fifthLine.middle.showLabels` |  | boolean |  |
| `item.fifthLine.middle.textSizeField` |  | string | Resource name |
| `item.fifthLine.middle.line` |  |  |  |
| `item.fifthLine.middle.colorField` |  | string | Resource name |
| `item.fifthLine.caption` |  | object |  |
| `item.fifthLine.caption.lineFields` |  | array of string |  |
| `item.fifthLine.caption.textSize` |  |  |  |
| `item.fifthLine.caption.color` |  |  |  |
| `item.fifthLine.caption.showLabels` |  | boolean |  |
| `item.fifthLine.caption.textSizeField` |  | string | Resource name |
| `item.fifthLine.caption.line` |  |  |  |
| `item.fifthLine.caption.colorField` |  | string | Resource name |
| `item.fifthLine.first` |  | object |  |
| `item.fifthLine.first.lineFields` |  | array of string |  |
| `item.fifthLine.first.textSize` |  |  |  |
| `item.fifthLine.first.color` |  |  |  |
| `item.fifthLine.first.showLabels` |  | boolean |  |
| `item.fifthLine.first.textSizeField` |  | string | Resource name |
| `item.fifthLine.first.line` |  |  |  |
| `item.fifthLine.first.colorField` |  | string | Resource name |
| `item.imageWidth` |  |  |  |
| `item.medias` |  | array of string |  |
| `item.thirdLine` |  | object |  |
| `item.thirdLine.middle` |  | object |  |
| `item.thirdLine.middle.lineFields` |  | array of string |  |
| `item.thirdLine.middle.textSize` |  |  |  |
| `item.thirdLine.middle.color` |  |  |  |
| `item.thirdLine.middle.showLabels` |  | boolean |  |
| `item.thirdLine.middle.textSizeField` |  | string | Resource name |
| `item.thirdLine.middle.line` |  |  |  |
| `item.thirdLine.middle.colorField` |  | string | Resource name |
| `item.thirdLine.caption` |  | object |  |
| `item.thirdLine.caption.lineFields` |  | array of string |  |
| `item.thirdLine.caption.textSize` |  |  |  |
| `item.thirdLine.caption.color` |  |  |  |
| `item.thirdLine.caption.showLabels` |  | boolean |  |
| `item.thirdLine.caption.textSizeField` |  | string | Resource name |
| `item.thirdLine.caption.line` |  |  |  |
| `item.thirdLine.caption.colorField` |  | string | Resource name |
| `item.thirdLine.first` |  | object |  |
| `item.thirdLine.first.lineFields` |  | array of string |  |
| `item.thirdLine.first.textSize` |  |  |  |
| `item.thirdLine.first.color` |  |  |  |
| `item.thirdLine.first.showLabels` |  | boolean |  |
| `item.thirdLine.first.textSizeField` |  | string | Resource name |
| `item.thirdLine.first.line` |  |  |  |
| `item.thirdLine.first.colorField` |  | string | Resource name |
| `item.imageCorner` |  | string | Resource name |
| `item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `item.secondLine` |  | object |  |
| `item.secondLine.middle` |  | object |  |
| `item.secondLine.middle.lineFields` |  | array of string |  |
| `item.secondLine.middle.textSize` |  |  |  |
| `item.secondLine.middle.color` |  |  |  |
| `item.secondLine.middle.showLabels` |  | boolean |  |
| `item.secondLine.middle.textSizeField` |  | string | Resource name |
| `item.secondLine.middle.line` |  |  |  |
| `item.secondLine.middle.colorField` |  | string | Resource name |
| `item.secondLine.caption` |  | object |  |
| `item.secondLine.caption.lineFields` |  | array of string |  |
| `item.secondLine.caption.textSize` |  |  |  |
| `item.secondLine.caption.color` |  |  |  |
| `item.secondLine.caption.showLabels` |  | boolean |  |
| `item.secondLine.caption.textSizeField` |  | string | Resource name |
| `item.secondLine.caption.line` |  |  |  |
| `item.secondLine.caption.colorField` |  | string | Resource name |
| `item.secondLine.first` |  | object |  |
| `item.secondLine.first.lineFields` |  | array of string |  |
| `item.secondLine.first.textSize` |  |  |  |
| `item.secondLine.first.color` |  |  |  |
| `item.secondLine.first.showLabels` |  | boolean |  |
| `item.secondLine.first.textSizeField` |  | string | Resource name |
| `item.secondLine.first.line` |  |  |  |
| `item.secondLine.first.colorField` |  | string | Resource name |
| `item.imageBackgroundColor` |  | object |  |
| `item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `item.mediaFields` |  | array of string |  |
| `item.firstLine` |  | object |  |
| `item.firstLine.middle` |  | object |  |
| `item.firstLine.middle.lineFields` |  | array of string |  |
| `item.firstLine.middle.textSize` |  |  |  |
| `item.firstLine.middle.color` |  |  |  |
| `item.firstLine.middle.showLabels` |  | boolean |  |
| `item.firstLine.middle.textSizeField` |  | string | Resource name |
| `item.firstLine.middle.line` |  |  |  |
| `item.firstLine.middle.colorField` |  | string | Resource name |
| `item.firstLine.caption` |  | object |  |
| `item.firstLine.caption.lineFields` |  | array of string |  |
| `item.firstLine.caption.textSize` |  |  |  |
| `item.firstLine.caption.color` |  |  |  |
| `item.firstLine.caption.showLabels` |  | boolean |  |
| `item.firstLine.caption.textSizeField` |  | string | Resource name |
| `item.firstLine.caption.line` |  |  |  |
| `item.firstLine.caption.colorField` |  | string | Resource name |
| `item.firstLine.first` |  | object |  |
| `item.firstLine.first.lineFields` |  | array of string |  |
| `item.firstLine.first.textSize` |  |  |  |
| `item.firstLine.first.color` |  |  |  |
| `item.firstLine.first.showLabels` |  | boolean |  |
| `item.firstLine.first.textSizeField` |  | string | Resource name |
| `item.firstLine.first.line` |  |  |  |
| `item.firstLine.first.colorField` |  | string | Resource name |
| `item.imageHeight` |  |  |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `numOfColumns` |  | number |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `groupByField` |  | string | Resource name |
| `filter` |  | object |  |
| `filter.advanceFilterFields` |  | array of string |  |
| `filter.kind` |  | string: tree \| tab |  |
| `filter.sortOrder` |  | string: ascending \| descending |  |
| `filter.categoryFields` |  | array of string |  |
| `filter.sortByFields` |  | array of string |  |
| `filter.showSearchBar` |  | boolean |  |
| `hideBorders` |  | boolean |  |
| `renderingMode` |  | string: auto \| flex |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / kanban`

Required on add: `name`, `kanbanField`, `kind`

| property | req | type | description |
|---|---|---|---|
| `kanbanField` | yes | string | Resource name |
| `textSize` |  | string: body1 \| body2 \| button \| caption \| h1 \| h2 \| h3 \| h4 \| h5 \| h6 \| inherit \| overline \| subtitle1 \| subtitle2 \| subtitle3 \| subtitle4 |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `showCommentCount` |  | boolean |  |
| `showFields` |  | array of string |  |
| `showSectionName` |  | boolean |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `showFooter` |  | boolean |  |
| `sortOrder` |  | string: ascending \| descending |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `sortByFields` |  | array of string |  |
| `swimlaneMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / list`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `item` |  | object |  |
| `item.fourthLine` |  | object |  |
| `item.fourthLine.middle` |  | object |  |
| `item.fourthLine.middle.lineFields` |  | array of string |  |
| `item.fourthLine.middle.textSize` |  |  |  |
| `item.fourthLine.middle.color` |  |  |  |
| `item.fourthLine.middle.showLabels` |  | boolean |  |
| `item.fourthLine.middle.textSizeField` |  | string | Resource name |
| `item.fourthLine.middle.line` |  |  |  |
| `item.fourthLine.middle.colorField` |  | string | Resource name |
| `item.fourthLine.caption` |  | object |  |
| `item.fourthLine.caption.lineFields` |  | array of string |  |
| `item.fourthLine.caption.textSize` |  |  |  |
| `item.fourthLine.caption.color` |  |  |  |
| `item.fourthLine.caption.showLabels` |  | boolean |  |
| `item.fourthLine.caption.textSizeField` |  | string | Resource name |
| `item.fourthLine.caption.line` |  |  |  |
| `item.fourthLine.caption.colorField` |  | string | Resource name |
| `item.fourthLine.first` |  | object |  |
| `item.fourthLine.first.lineFields` |  | array of string |  |
| `item.fourthLine.first.textSize` |  |  |  |
| `item.fourthLine.first.color` |  |  |  |
| `item.fourthLine.first.showLabels` |  | boolean |  |
| `item.fourthLine.first.textSizeField` |  | string | Resource name |
| `item.fourthLine.first.line` |  |  |  |
| `item.fourthLine.first.colorField` |  | string | Resource name |
| `item.fifthLine` |  | object |  |
| `item.fifthLine.middle` |  | object |  |
| `item.fifthLine.middle.lineFields` |  | array of string |  |
| `item.fifthLine.middle.textSize` |  |  |  |
| `item.fifthLine.middle.color` |  |  |  |
| `item.fifthLine.middle.showLabels` |  | boolean |  |
| `item.fifthLine.middle.textSizeField` |  | string | Resource name |
| `item.fifthLine.middle.line` |  |  |  |
| `item.fifthLine.middle.colorField` |  | string | Resource name |
| `item.fifthLine.caption` |  | object |  |
| `item.fifthLine.caption.lineFields` |  | array of string |  |
| `item.fifthLine.caption.textSize` |  |  |  |
| `item.fifthLine.caption.color` |  |  |  |
| `item.fifthLine.caption.showLabels` |  | boolean |  |
| `item.fifthLine.caption.textSizeField` |  | string | Resource name |
| `item.fifthLine.caption.line` |  |  |  |
| `item.fifthLine.caption.colorField` |  | string | Resource name |
| `item.fifthLine.first` |  | object |  |
| `item.fifthLine.first.lineFields` |  | array of string |  |
| `item.fifthLine.first.textSize` |  |  |  |
| `item.fifthLine.first.color` |  |  |  |
| `item.fifthLine.first.showLabels` |  | boolean |  |
| `item.fifthLine.first.textSizeField` |  | string | Resource name |
| `item.fifthLine.first.line` |  |  |  |
| `item.fifthLine.first.colorField` |  | string | Resource name |
| `item.imageWidth` |  |  |  |
| `item.medias` |  | array of string |  |
| `item.thirdLine` |  | object |  |
| `item.thirdLine.middle` |  | object |  |
| `item.thirdLine.middle.lineFields` |  | array of string |  |
| `item.thirdLine.middle.textSize` |  |  |  |
| `item.thirdLine.middle.color` |  |  |  |
| `item.thirdLine.middle.showLabels` |  | boolean |  |
| `item.thirdLine.middle.textSizeField` |  | string | Resource name |
| `item.thirdLine.middle.line` |  |  |  |
| `item.thirdLine.middle.colorField` |  | string | Resource name |
| `item.thirdLine.caption` |  | object |  |
| `item.thirdLine.caption.lineFields` |  | array of string |  |
| `item.thirdLine.caption.textSize` |  |  |  |
| `item.thirdLine.caption.color` |  |  |  |
| `item.thirdLine.caption.showLabels` |  | boolean |  |
| `item.thirdLine.caption.textSizeField` |  | string | Resource name |
| `item.thirdLine.caption.line` |  |  |  |
| `item.thirdLine.caption.colorField` |  | string | Resource name |
| `item.thirdLine.first` |  | object |  |
| `item.thirdLine.first.lineFields` |  | array of string |  |
| `item.thirdLine.first.textSize` |  |  |  |
| `item.thirdLine.first.color` |  |  |  |
| `item.thirdLine.first.showLabels` |  | boolean |  |
| `item.thirdLine.first.textSizeField` |  | string | Resource name |
| `item.thirdLine.first.line` |  |  |  |
| `item.thirdLine.first.colorField` |  | string | Resource name |
| `item.imageCorner` |  | string | Resource name |
| `item.imageRenderingMode` |  | string: aspectFit \| scaleToFit |  |
| `item.secondLine` |  | object |  |
| `item.secondLine.middle` |  | object |  |
| `item.secondLine.middle.lineFields` |  | array of string |  |
| `item.secondLine.middle.textSize` |  |  |  |
| `item.secondLine.middle.color` |  |  |  |
| `item.secondLine.middle.showLabels` |  | boolean |  |
| `item.secondLine.middle.textSizeField` |  | string | Resource name |
| `item.secondLine.middle.line` |  |  |  |
| `item.secondLine.middle.colorField` |  | string | Resource name |
| `item.secondLine.caption` |  | object |  |
| `item.secondLine.caption.lineFields` |  | array of string |  |
| `item.secondLine.caption.textSize` |  |  |  |
| `item.secondLine.caption.color` |  |  |  |
| `item.secondLine.caption.showLabels` |  | boolean |  |
| `item.secondLine.caption.textSizeField` |  | string | Resource name |
| `item.secondLine.caption.line` |  |  |  |
| `item.secondLine.caption.colorField` |  | string | Resource name |
| `item.secondLine.first` |  | object |  |
| `item.secondLine.first.lineFields` |  | array of string |  |
| `item.secondLine.first.textSize` |  |  |  |
| `item.secondLine.first.color` |  |  |  |
| `item.secondLine.first.showLabels` |  | boolean |  |
| `item.secondLine.first.textSizeField` |  | string | Resource name |
| `item.secondLine.first.line` |  |  |  |
| `item.secondLine.first.colorField` |  | string | Resource name |
| `item.imageBackgroundColor` |  | object |  |
| `item.imageBackgroundColor.shade` |  | string: s50 \| s100 \| s200 \| s300 \| s400 \| s500 |  |
| `item.imageBackgroundColor.value` |  | string: black \| white \| transparent \| primary \| secondary \| error \| info \| success \| warning \| textPrimary \| textSecondary \| textDisabled \| textInverse \| primaryLight \| secondaryLight \| successLight \| errorLight \| infoLight \| warningLight \| primaryDark \| secondaryDark \| successDark \| errorDark \| infoDark \| warningDark \| amber \| blue \| cyan \| deepOrange \| deepPurple \| green \| grey \| indigo \| lightBlue \| lightGreen \| lime \| orange \| pink \| purple \| red \| teal \| yellow |  |
| `item.mediaFields` |  | array of string |  |
| `item.firstLine` |  | object |  |
| `item.firstLine.middle` |  | object |  |
| `item.firstLine.middle.lineFields` |  | array of string |  |
| `item.firstLine.middle.textSize` |  |  |  |
| `item.firstLine.middle.color` |  |  |  |
| `item.firstLine.middle.showLabels` |  | boolean |  |
| `item.firstLine.middle.textSizeField` |  | string | Resource name |
| `item.firstLine.middle.line` |  |  |  |
| `item.firstLine.middle.colorField` |  | string | Resource name |
| `item.firstLine.caption` |  | object |  |
| `item.firstLine.caption.lineFields` |  | array of string |  |
| `item.firstLine.caption.textSize` |  |  |  |
| `item.firstLine.caption.color` |  |  |  |
| `item.firstLine.caption.showLabels` |  | boolean |  |
| `item.firstLine.caption.textSizeField` |  | string | Resource name |
| `item.firstLine.caption.line` |  |  |  |
| `item.firstLine.caption.colorField` |  | string | Resource name |
| `item.firstLine.first` |  | object |  |
| `item.firstLine.first.lineFields` |  | array of string |  |
| `item.firstLine.first.textSize` |  |  |  |
| `item.firstLine.first.color` |  |  |  |
| `item.firstLine.first.showLabels` |  | boolean |  |
| `item.firstLine.first.textSizeField` |  | string | Resource name |
| `item.firstLine.first.line` |  |  |  |
| `item.firstLine.first.colorField` |  | string | Resource name |
| `item.imageHeight` |  |  |  |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `numOfColumns` |  | number |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `groupByField` |  | string | Resource name |
| `filter` |  | object |  |
| `filter.advanceFilterFields` |  | array of string |  |
| `filter.kind` |  | string: tree \| tab |  |
| `filter.sortOrder` |  | string: ascending \| descending |  |
| `filter.categoryFields` |  | array of string |  |
| `filter.sortByFields` |  | array of string |  |
| `filter.showSearchBar` |  | boolean |  |
| `hideBorders` |  | boolean |  |
| `renderingMode` |  | string: auto \| flex |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / map`

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `locationField` |  | string | Resource name |
| `kind` | yes | string |  |
| `description` |  | string |  |
| `label` |  | string |  |
| `liveLocationPin` |  | object |  |
| `liveLocationPin.shapeField` |  | string | Resource name |
| `liveLocationPin.shape` |  |  |  |
| `liveLocationPin.color` |  |  |  |
| `liveLocationPin.toolTip` |  |  |  |
| `liveLocationPin.avatarField` |  | string | Resource name |
| `liveLocationPin.avatar` |  |  |  |
| `liveLocationPin.label` |  |  |  |
| `liveLocationPin.toolTipField` |  | string | Resource name |
| `liveLocationPin.colorField` |  | string | Resource name |
| `liveLocationPin.labelField` |  | string | Resource name |
| `bgColorField` |  | string | Resource name |
| `toolTipField` |  | string | Resource name |
| `displayMode` |  | string: auto \| cluster \| heatmap \| marker |  |
| `lineStroke` |  | object |  |
| `lineStroke.groupByField` |  | string | Resource name |
| `lineStroke.color` |  |  |  |
| `lineStroke.strokeField` |  | string | Resource name |
| `lineStroke.stroke` |  |  |  |
| `lineStroke.colorField` |  | string | Resource name |
| `renderingMode` |  | string: fixedLocation \| liveLocation |  |
| `mapPin` |  | object |  |
| `mapPin.shapeField` |  | string | Resource name |
| `mapPin.shape` |  |  |  |
| `mapPin.color` |  |  |  |
| `mapPin.toolTip` |  |  |  |
| `mapPin.avatarField` |  | string | Resource name |
| `mapPin.avatar` |  |  |  |
| `mapPin.label` |  |  |  |
| `mapPin.toolTipField` |  | string | Resource name |
| `mapPin.colorField` |  | string | Resource name |
| `mapPin.labelField` |  | string | Resource name |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / table`

Required on add: `name`, `showComps`, `kind`

| property | req | type | description |
|---|---|---|---|
| `pagination` |  | boolean |  |
| `footer` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `showComps` | yes | array of string |  |
| `hideRowSeparator` |  | boolean |  |
| `description` |  | string |  |
| `allowCustomFilters` |  | boolean |  |
| `showSearchBar` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `renderingMode` |  | string: auto \| flex |  |
| `freezeFields` |  | array of string |  |
| `sortByFields` |  | array of string |  |
| `theme` |  | string: standard \| spacious |  |
| `serverSideFilter` |  | boolean |  |
| `columnAlignmentArray` |  | array of string |  |
| `masterDetailGridLayoutMap` |  | object | Keyed as describe prints |
| `hideHeaders` |  | boolean |  |
| `allowToSwitchLayouts` |  | array of string |  |
| `indexColumnName` |  | string |  |
| `kind` | yes | string |  |
| `showCommentCount` |  | boolean |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `rowsPerPage` |  | number |  |
| `sparklineLayoutMap` |  | object | Keyed as describe prints |
| `columnSizeSet` |  | array of string |  |
| `sortOrder` |  | string: ascending \| descending |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `header` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `styleMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |


### `spreadsheetLayout / xyChartBarGraph`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `alwaysShowBarValues` |  | boolean |  |
| `renderingMode` |  | string: horizontal \| vertical |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / xyChartDoughnut`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `alwaysShowSliceValues` |  | boolean |  |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / xyChartLineChart`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / xyChartPieChart`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `alwaysShowSliceValues` |  | boolean |  |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |


### `spreadsheetLayout / xyChartScatterPlot`

Required on add: `name`, `xAxis`, `kind`

| property | req | type | description |
|---|---|---|---|
| `xAxis` | yes | string | Resource name |
| `kind` | yes | string |  |
| `xAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `yAxisMap` |  | object | Entries keyed by their name, in order, as describe prints. Keep a name to update that entry; a new name adds one |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `description` |  | string |  |
| `label` |  | string |  |
| `bgColorField` |  | string | Resource name |
| `hideLegend` |  | boolean |  |
| `toolTipField` |  | string | Resource name |
| `allowToSwitchLayouts` |  | array of string |  |




## `layoutUser`

Enterprise user layout (hierarchy or tree) used by kind=user actions. Create before add kind=action kind=user. First layout becomes web/mobile default when unset.

Required on add: `name`, `kind`

| property | req | type | description |
|---|---|---|---|
| `showMyAssistantsOnly` |  | boolean |  |
| `includeRoles` |  | array of string |  |
| `kind` | yes | string: hierarchy \| tree |  |
| `name` | yes | string | Uppercase first letter, then alphanumeric |
| `excludeRoles` |  | array of string |  |
| `label` |  | string |  |
| `allowToSwitchLayouts` |  | array of string |  |

