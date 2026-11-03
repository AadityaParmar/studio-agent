// Writes acme-build.json: a small hand-made, made-up Neome Build ("Acme Widgets") in the real export shape
// {type:"ent", payload:{studioEnt:{…*Map{keys,map}}}}. No client data. Re-run after editing: node make-fixture.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const M = (...items) => ({ keys: items.map((x) => x.metaId), map: Object.fromEntries(items.map((x) => [x.metaId, x])) });
const field = (metaId, name, type, extra = {}) => ({ metaId, details: { name }, type, ...extra });
const comp = (metaId, name, fields, type = "section") => ({ metaId, details: { name }, type, fieldMap: M(...fields) });
const form = (metaId, name, comps, extra = {}) => ({ metaId, details: { name }, compositeMap: M(...comps), ...extra });
const opts = (...xs) => ({ keys: xs.map((x) => `opt${x}`), map: Object.fromEntries(xs.map((x) => [`opt${x}`, { metaId: `opt${x}`, value: x }])) });
const param = (fieldId) => ({ argName: "a", kind: "parameter", value: { paramId: "$Curr", compositeId: "msc-order", fieldId } });

const studioEnt = {
  version: 7,
  entId: "ent-acme01",
  details: { name: "Acme Widgets", about: "Acme Widgets sells widgets to Zorbia shops. Call +1 555 010 9999 or ops@acme-widgets.example" },
  moduleMap: M({ metaId: "mmd-quotes", name: "Quotes" }),
  pluginMap: M(),
  roleMap: M({ metaId: "mr-rep", details: { name: "Sales Rep" } }, { metaId: "mr-mgr", details: { name: "Manager" } }),
  varMap: M(
    { metaId: "mw-kind", details: { name: "Customer Kind" }, kind: "setOfText", value: opts("Retail", "Wholesale") },
    { metaId: "mw-status", details: { name: "Order Status" }, kind: "setOfText", value: opts("Draft", "Approved", "Rejected") },
  ),
  formMap: M(
    form("mf-cust", "Customer", [comp("msc-cust", "Details", [
      field("mfd-cname", "Name", "text", { required: true }),
      field("mfd-cphone", "Phone", "mobileNumber"),
      field("mfd-ckind", "Kind", "pickText", { sourceVarId: "mw-kind" }),
      field("mfd-cdiv", "Line", "divider"),
    ])]),
    form("mf-order", "Order", [
      comp("msc-order", "Details", [
        field("mfd-ocust", "Customer", "ref", { spreadsheetId: "mss-cust" }),
        field("mfd-ocname", "CustName", "text", { refTargetId: "mfd-ocust", refFieldId: "mfd-cname" }),
        field("mfd-ostatus", "Status", "pickText", { sourceVarId: "mw-status", required: true }),
        field("mfd-oamt", "Amount", "number"),
        field("mfd-oappr", "Approver", "pickUser", { roleIdDataSource: { roleIdSet: ["mr-mgr"] } }),
      ]),
      comp("msc-olines", "Lines", [field("mfd-oline", "Line", "ref", { spreadsheetId: "mss-line" })], "grid"),
    ], {
      formulaMap: M({ metaId: "mfm-1", name: "tax", assignToFieldId: "mfd-oamt", formula: { value: "${f:Details.Amount} * 1.1" } }),
      visibilityRuleMap: M({ metaId: "mvr-1", name: "show approver", visibilityCondMap: { statement: { lhs: "mfd-ostatus", operator: "hasValue" } } }),
      eventMap: M({ metaId: "mfe-1", name: "on status", kind: "onChange" }),
    }),
    form("mf-quote", "Quote", [comp("msc-quote", "Details", [
      field("mfd-qcust", "Customer", "ref", { spreadsheetId: "mss-cust" }),
      field("mfd-qamt", "Total", "number"),
    ])], { details: { name: "Quote", modules: { moduleIdSet: ["mmd-quotes"] } } }),
    form("mf-line", "Order Line", [comp("msc-line", "Details", [
      field("mfd-lprod", "Product", "ref", { spreadsheetId: "mss-prod" }),
      field("mfd-lqty", "Qty", "number"),
    ])]),
    form("mf-prod", "Product", [comp("msc-prod", "Details", [field("mfd-pname", "Name", "text")])]),
    form("mf-old", "Old Import", [comp("msc-old", "Details", [field("mfd-xname", "Name", "text")])]),
    form("mf-sumout", "Summary Out", [comp("msc-sumout", "Details", [field("mfd-stotal", "Total", "number")])]),
  ),
  spreadsheetMap: M(
    { metaId: "mss-cust", details: { name: "Customer" }, formId: "mf-cust", isMasterSheet: true, insertRoleSet: ["mr-rep"], readRoleSet: ["mr-rep", "mr-mgr"] },
    { metaId: "mss-order", details: { name: "Order" }, formId: "mf-order", updateRoleSet: ["mr-mgr"] },
    { metaId: "mss-quote", details: { name: "Quote" }, formId: "mf-quote" },
    { metaId: "mss-line", details: { name: "Order Line" }, formId: "mf-line" },
    { metaId: "mss-prod", details: { name: "Product" }, formId: "mf-prod" },
    { metaId: "mss-old", details: { name: "Old Import" }, formId: "mf-old" },
  ),
  reportMap: M(
    { metaId: "mrp-sum", details: { name: "Order Summary" }, kind: "query", fromSpreadsheetIdSet: ["mss-order"], outputFormId: "mf-sumout" },
    { metaId: "mrp-old", details: { name: "Old Dump" }, kind: "spreadsheet", fromSpreadsheetId: "mss-old" },
  ),
  automationMap: M({ metaId: "mau-legacy", details: { name: "Migrated legacy" } }),
  actionMap: M(
    { metaId: "mac-cust", details: { name: "Customers" }, kind: "spreadsheetEditor", spreadsheetId: "mss-cust" },
    { metaId: "mac-order", details: { name: "New order" }, kind: "rowInsert", spreadsheetId: "mss-order" },
    { metaId: "mac-quote", details: { name: "Quotes" }, kind: "spreadsheetEditor", spreadsheetId: "mss-quote" },
  ),
  groupMap: M(
    { metaId: "mgp-sales", details: { name: "Sales" }, actionPermissionMap: M(
      { metaId: "mac-cust", roleIdSet: ["mr-rep"] },
      { metaId: "mac-order", roleIdSet: ["mr-rep", "mr-mgr"] },
      { metaId: "mac-quote", roleIdSet: ["mr-rep"] },
    ) },
    { metaId: "mgp-lobby", details: { name: "Lobby" }, actionPermissionMap: M() },
  ),
  deeplinkMap: M(),
  autoDiaMap: M(
    {
      metaId: "mad-approve", name: "wf1", label: "Order approval",
      nodeMap: {
        "van-ev": { metaId: "van-ev", kind: "eventSsUpdateAfter", name: "NeoEvent", spreadsheetId: "mss-order" },
        "van-if": { metaId: "van-if", kind: "branchIfElse", name: "Approved?", condition: { statement: {
          lhs: param("mfd-ostatus"), operator: "equalTo",
          rhs: { kind: "derived", value: { derivedFieldId: "mfd-ostatus", valueOptionId: "optApproved" } } } } },
        "van-msg": { metaId: "van-msg", kind: "sendMessageToUsers", name: "Tell rep", message: { value: "Hi \"Acme\" team, order for Zorbia approved" }, toUsers: { users: param("mfd-oappr") } },
        "van-loop": { metaId: "van-loop", kind: "branchIterateGrid", name: "NeoIterate" },
        "van-line": { metaId: "van-line", kind: "rowInsert", name: "rowInsert", spreadsheetId: "mss-line" },
        "van-rej": { metaId: "van-rej", kind: "rowUpdate", name: "Mark rejected", spreadsheetId: "mss-order" },
      },
      edgeMap: {
        e1: { fromNodeId: "van-ev", toNodeId: "van-if", kind: "NEXT" },
        e2: { fromNodeId: "van-if", toNodeId: "van-msg", kind: "TRUE" },
        e3: { fromNodeId: "van-if", toNodeId: "van-rej", kind: "FALSE" },
        e4: { fromNodeId: "van-msg", toNodeId: "van-loop", kind: "NEXT" },
        e5: { fromNodeId: "van-loop", toNodeId: "van-line", kind: "ITERATE" },
        e6: { fromNodeId: "van-line", toNodeId: "van-loop", kind: "NEXT" },
      },
    },
    {
      metaId: "mad-nightly", name: "wf2", label: "Nightly cleanup",
      nodeMap: {
        "van-s": { metaId: "van-s", kind: "eventSchedule", name: "NeoSchedule", scheduler: { repeatSetting: { frequency: 1, repeatFrequencyKind: "day", setOfTime: ["02:00"] } } },
        "van-x": { metaId: "van-x", kind: "ssRemoveRows", name: "Purge", spreadsheetId: "mss-old" },
      },
      edgeMap: { e1: { fromNodeId: "van-s", toNodeId: "van-x", kind: "NEXT" } },
    },
  ),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "acme-build.json");
writeFileSync(out, JSON.stringify({ type: "ent", payload: { studioEnt } }, null, 1) + "\n");
console.log(`wrote ${out}`);
