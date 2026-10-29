# IN-1 — neome SAP integration document

Type: integration document · Date: unknown · File: inputs/IN-1-sap-integration.docx

---

neome Integration Document

- CUSTOMER MASTER

Process to sync customers from SAP to neome.

[flowchart: New customer created/modified in SAP → neome plugin fetch customer from SAP → Customer details pushed in neome via plugin → Customer visible in neome app]

[flowchart: GEO tagging will be done in neome app]

Process to sync customers from neome to SAP.

[flowchart: New customer created/modified in neome → neome will send customer data to plugin → Plugin will push customer data to SAP]

- Plugin will be configured using neome dashboard.

- Neome team will write the plugin for the SAP integration part.

- Existing SAP data will also be synched to neome via plugin.

- PRODUCT MASTER

Process to sync products from SAP to neome.

[flowchart: New product created/modified in SAP → neome plugin fetch product from SAP → Product details pushed in neome via plugin → Product visible in neome app]

Process to sync products from neome to SAP.

[flowchart: New product created/modified in neome → neome will send product data to plugin → Plugin will push product data to SAP]

- Data sync frequency can be configured into dashboard.

- EMPLOYEE MASTER

Process to sync employees from SAP to neome.

[flowchart: New employee created/modified in SAP → neome plugin fetch employee from SAP → Employee details pushed in neome via plugin → Employee visible in neome app]

[flowchart: Beat allocation will be done in neome app]

Process to sync employees from neome to SAP.

[flowchart: New employee created/modified in neome → neome will send employee data to plugin → Plugin will push employee data to SAP]

- ORDER INVOICE

Process to sync order invoice from neome to SAP.

[flowchart: New order placed in neome → Invoice generated in neome → Plugin will send the invoice data to SAP → Invoice visible in SAP]
