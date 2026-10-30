# AI — AI Features

Prefix: AI
Name: AI Features
Status: resolved
Sources: RFP-1, WS-8, WS-13

## 1 Purpose and KPIs

- Purpose: AI help: form filling through NLP, AI based planogram suggestions, and Ask Neome. [RFP-1, WS-13]
- KPI: Visit Book order and Complaint forms filled by voice faster than typing; managers get answers about sales, visits and attendance in seconds, not from Excel; every Modern Trade update with shelf photo gets a planogram suggestion for the Sales Supervisor. [WS-13]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Sales Agent | Fills the Visit Book order and Complaint form by voice | 60 | [WS-13] |
| Sales Supervisor | Uses the planogram suggestion | 8 | [WS-8, WS-13] |
| Owner | Asks Neome; sees all data | 1 | [WS-13] |
| Sales Head | Asks Neome; sees all data | 1 | [WS-13] |
| Area Sales Manager | Asks Neome; own area only | 3 | [WS-13] |
| Regional Sales Manager | Asks Neome; own region only | 2 | [WS-13] |

## 3 Process

- Pain today: orders and complaints typed by hand on the phone in the field; managers wait for Excel; shelf share judged by eye. [WS-13]
- Sales Agent speaks in English or Nyanja; the Visit Book order or Complaint form fills; the Sales Agent checks and saves. Nothing saves without the user. [WS-13]
- Sales Agent adds shelf images in a Modern Trade update; the system suggests shelf share and missing products; the Sales Supervisor uses it and decides. [WS-8, WS-13]
- Owner, Sales Head, Area Sales Manager or Regional Sales Manager asks a question about sales, visits or attendance and gets an answer; read only. [WS-13]
- Hand-off in: Visit Book (order), Customer Complaints (complaint form), Modern Trade (shelf photo, OI-64 answered [WS-8]); Reports data for Ask Neome. [WS-8, WS-13]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Voice entry | Form | choice | yes | Values: Visit Book order / Complaint | [WS-13] |
| Voice entry | Language | choice | yes | Values: English / Nyanja | [WS-13] |
| Voice entry | Filled fields | text | yes | Filled for the user to check and save | [WS-13] |
| Planogram suggestion | Modern Trade update | link-to-entity | yes | Links to: Modern Trade | [WS-8, WS-13] |
| Planogram suggestion | Shelf photo | file | yes | From the update's shelf images | [WS-8] |
| Planogram suggestion | Suggested shelf share | text | yes | | [WS-8] |
| Planogram suggestion | Missing products | text | no | | [WS-8] |
| Question | Question text | text | yes | For example "top 5 agents this week" | [WS-13] |
| Question | Asked by | person | yes | Owner, Sales Head, Area Sales Manager or Regional Sales Manager | [WS-13] |
| Question | Answer | text | yes | | [WS-13] |

## 5 Statuses

N/A: none of these records has a status; each is a record only, the Sales Supervisor decides on a planogram suggestion. [WS-13]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Review before save | Voice fills a form | The user checks and saves; nothing saves by itself | [WS-13] |
| Ask Neome reach | A question is asked | Answer uses only data the user may see: Regional Sales Manager own region, Area Sales Manager own area, Sales Head and Owner all | [WS-13] |
| Ask Neome read only | A question is asked | Answers only; changes no data | [WS-13] |
| Cannot answer | Ask Neome has no answer | Says it cannot answer; no guess | [WS-13] |
| Planogram | Modern Trade update has shelf photo | Suggest shelf share and missing products for the Sales Supervisor | [WS-8, WS-13] |
| Notifications | Any of these | None | [WS-13] |

## 7 Exceptions

- No network: voice, planogram and Ask Neome do not work offline. [WS-13]
- Ask Neome cannot answer: it says so; no guess. [WS-13]
- Voice fills a field wrongly: the user edits before saving. [WS-13]

## 8 Reports

N/A: no report for AI features. [WS-13]

## 9 Integrations

N/A: nothing to or from SAP or any other system for AI features. [WS-13]

## 10 Volumes and NFRs

- Ask Neome: 7 users (1 Owner, 1 Sales Head, 3 Area Sales Managers, 2 Regional Sales Managers). [WS-13]
- Voice: Sales Agents' orders, about 700 orders a day, and complaints. [WS-13]
- Planogram: one suggestion per Modern Trade update with shelf photo. [WS-13]
- Network needed for all three. [WS-13]

## 11 Requirements

### AI-01 — Form filling through NLP

Statement: A Sales Agent fills the Visit Book order and the Complaint form by voice in English or Nyanja; the user checks and saves. [RFP-1, WS-13]
Acceptance:
- A spoken order or complaint in English or Nyanja fills the form fields for review. [WS-13]
- Nothing is saved until the user saves. [WS-13]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-13
Proposed: no

### AI-02 — AI based planogram suggestions

Statement: From a Modern Trade shelf photo the system suggests shelf share and missing products; the Sales Supervisor uses it. [RFP-1, WS-8, WS-13]
Acceptance:
- A Modern Trade update with a shelf photo gives a suggested shelf share and missing products. [WS-8, WS-13]
- The Sales Supervisor sees the suggestion; no approval is needed. [WS-13]
Priority: Could
Scope: Neome
Sources: RFP-1, WS-8, WS-13
Proposed: no

### AI-03 — Ask Neome

Statement: The Owner, Sales Head, Area Sales Manager and Regional Sales Manager ask questions about sales, visits and attendance and get an answer from the data they may see. [RFP-1, WS-13]
Acceptance:
- "Top 5 agents this week" returns an answer. [WS-13]
- A Regional Sales Manager gets answers for own region only; an Area Sales Manager for own area only. [WS-13]
- Other roles cannot use it; it changes no data; when it cannot answer it says so. [WS-13]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-13
Proposed: no
Delivery: Configuration

## 12 Neome mapping

Neome App: none
Delivery: Custom module
How: Voice entry in English and Nyanja filling the Visit Book order and Complaint form, and Planogram suggestion from a Modern Trade shelf photo → no App page models either; built by Neomenta on the platform; Ask Neome → platform Conversational AI and Contextual Search & Answers over the data the user may see, set up as Configuration; the catalog does not say voice, Nyanja or image analysis are supported (catalog section 5 item 15) (proposed, to confirm)

## 13 Open Items

N/A: no open Open Items
