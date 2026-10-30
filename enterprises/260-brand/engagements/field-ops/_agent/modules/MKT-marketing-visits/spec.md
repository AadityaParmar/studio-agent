# MKT — Marketing Visits

Prefix: MKT
Name: Marketing Visits
Status: resolved
Sources: RFP-1, WS-1, WS-7

## 1 Purpose and KPIs

- Purpose: Record marketing, school, farm and door to door visits by sales or marketing staff, for product sampling and brand awareness. [RFP-1, WS-7]
- KPI: Every Marketing Visit is recorded with GPS location and photo; the Sales Head sees how many sampling visits each rider did; no paper sheets. [WS-7]

## 2 Roles

| role | does what | headcount | Source |
|---|---|---|---|
| Tricycle Rider | Records Marketing, School, Farm and Door to door Visits | 25 | [RFP-1, WS-7] |
| Sales Agent | May also record Marketing Visits | 60 | [RFP-1, WS-7] |
| Sales Supervisor | Sees all visits | 8 | [WS-7] |
| Area Sales Manager | Sees all visits | 3 | [WS-7] |
| Regional Sales Manager | Sees all visits | 2 | [WS-7] |
| Sales Head | Sees all visits; gets the Marketing Visits report | 1 | [WS-7] |
| Owner | Sees all visits | 1 | [WS-7] |

## 3 Process

- Tricycle Rider: Add Marketing Visit → Marketing Visit Sheet. [RFP-1]
- Marketing Visit: pick a Beat, then pick an existing Customer or type a new person's details → End. [RFP-1, WS-7]
- School, Farm, Door to door Visit: add the visit → End. [RFP-1]
- Pain today: visits kept on paper and WhatsApp; no proof the rider was there; no count of sampling work. [WS-7]
- TO-BE: see this Module's section of `process.md`.

## 4 Records and data

| entity | field | type | required | notes | Source |
|---|---|---|---|---|---|
| Marketing Visit | Date | date | yes | Auto: date of the visit | [RFP-1] |
| Marketing Visit | Visited By | person | yes | Auto: the Tricycle Rider or Sales Agent who records it | [RFP-1, WS-7] |
| Marketing Visit | Visit type | choice | no | Values: School / Farm / Door to door / Shop activation | [RFP-1, WS-7] |
| Marketing Visit | Route | link-to-entity | no | Auto fill from Beat. Links to: Route | [RFP-1] |
| Marketing Visit | Beat | link-to-entity | no | Links to: Beat; riders are mapped to Beats | [RFP-1, WS-1] |
| Marketing Visit | Customer name | text | no | Pick an existing Customer, or type the new person's name | [RFP-1, WS-7] |
| Marketing Visit | Mobile number | text | no | Typed for a new person | [RFP-1, WS-7] |
| Marketing Visit | Address | text | no | Typed for a new person | [RFP-1, WS-7] |
| Marketing Visit | Email | text | no | Optional | [RFP-1, WS-7] |
| Marketing Visit | Location | text | no | Auto: GPS | [RFP-1] |
| Marketing Visit | Remarks | text | no |  | [RFP-1] |
| Marketing Visit | Images | file | no |  | [RFP-1] |
| School Visit | Date | date | yes |  | [RFP-1] |
| School Visit | Visited By | person | yes |  | [RFP-1] |
| School Visit | Procurement officer name | text | no |  | [RFP-1] |
| School Visit | School name | text | yes |  | [RFP-1] |
| School Visit | Mobile number | text | no |  | [RFP-1] |
| School Visit | No of children | number | no |  | [RFP-1] |
| School Visit | Head teacher name | text | no |  | [RFP-1] |
| School Visit | Area | text | no |  | [RFP-1] |
| School Visit | Location | text | no | Auto | [RFP-1] |
| School Visit | Images | file | no |  | [RFP-1] |
| Farm Visit | Date | date | yes |  | [RFP-1] |
| Farm Visit | Visited By | person | yes |  | [RFP-1] |
| Farm Visit | Visitor name | text | no | The person visited | [RFP-1, WS-7] |
| Farm Visit | Gender | choice | no | Values: Male / Female / Prefer not to say | [RFP-1, WS-7] |
| Farm Visit | Mobile number | text | no |  | [RFP-1] |
| Farm Visit | Area | text | no |  | [RFP-1] |
| Farm Visit | Number of people in family | number | no |  | [RFP-1] |
| Farm Visit | Location | text | no | Auto | [RFP-1] |
| Farm Visit | Camera | file | no |  | [RFP-1] |
| Door to door Visit | Date | date | yes |  | [RFP-1] |
| Door to door Visit | Visited By | person | yes |  | [RFP-1] |
| Door to door Visit | Visitor name | text | no | The person visited | [RFP-1, WS-7] |
| Door to door Visit | Gender | choice | no | Values: Male / Female / Prefer not to say | [RFP-1, WS-7] |
| Door to door Visit | Mobile number | text | no |  | [RFP-1] |
| Door to door Visit | Area | text | no |  | [RFP-1] |
| Door to door Visit | Number of people in family | number | no |  | [RFP-1] |
| Door to door Visit | Location | text | no | Auto | [RFP-1] |
| Door to door Visit | Camera | file | no |  | [RFP-1] |

## 5 Statuses

N/A: a visit has no status, it is only recorded. [WS-7]

## 6 Rules and notifications

| rule | when | action/notify whom | Source |
|---|---|---|---|
| Same day edit | A visit is saved | The recorder can change it until the day ends | [WS-7] |
| Route from Beat | The Beat is picked | Route fills in by itself | [RFP-1] |
| No extra push | Any visit | No push for Marketing Visits | [WS-7] |

## 7 Exceptions

- No network: visits are recorded offline and sync when online. [WS-7]
- New person not in the Customer list: the rider types name, mobile, address and optional email. [WS-7]

## 8 Reports

| name | audience | measures/filters | Source |
|---|---|---|---|
| Marketing Visit Sheet | Rider or Sales Agent own visits; Sales Supervisor and above all | Marketing visits; filters date, area, supervisor, rider, Beat, Visit type; Excel export | [RFP-1, WS-7] |
| Marketing Visits report | Sales Head | Visits per rider and Visit type; filters date, area, supervisor, rider, Beat, Visit type; Excel export | [WS-7] |

## 9 Integrations

N/A: no integration; visits stay in neome and are not sent to SAP. [WS-7]

## 10 Volumes and NFRs

- 25 Tricycle Riders and 60 Sales Agents may record visits. [WS-7]
- Works offline; visits sync when online. [WS-7]
- OI-77: Visits per day, and in peak season.

## 11 Requirements

### MKT-01 — Marketing Visit

Statement: A Tricycle Rider or Sales Agent records a Marketing Visit with Visit type, Beat (Route auto), an existing Customer or a new person's details, auto Location, remarks and images. [RFP-1, WS-7]
Acceptance:
- A saved Marketing Visit shows in the Marketing Visit Sheet with its location. [WS-7]
- A visit can be recorded offline and appears after sync. [WS-7]
- The recorder can change a visit only on the same day. [WS-7]
- Visit type offers School, Farm, Door to door and Shop activation. [WS-7]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-1, WS-7
OIs: OI-77
Proposed: no

### MKT-02 — Tricycle Rider limited to visit forms

Statement: A Tricycle Rider records Marketing, School, Farm and Door to door Visits only. [RFP-1, WS-7]
Acceptance:
- A Tricycle Rider sees no other forms than the four visit forms. [WS-7]
Priority: Must
Scope: Neome
Sources: RFP-1, WS-7
Proposed: no

### MKT-03 — School Visit

Statement: A Tricycle Rider records a School Visit with procurement officer, school name, mobile, number of children, head teacher, area, auto Location and images; goal is product sampling and brand awareness. [RFP-1, WS-7]
Acceptance:
- A saved School Visit keeps its location and images. [WS-7]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-7
Proposed: no

### MKT-04 — Farm Visit

Statement: A Tricycle Rider records a Farm Visit with visitor name (the person visited), gender, mobile, area, number of people in family, auto Location and camera photo. [RFP-1, WS-7]
Acceptance:
- A saved Farm Visit keeps its location and photo. [WS-7]
- Gender offers Male, Female and Prefer not to say. [WS-7]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-7
Proposed: no

### MKT-05 — Door to door Visit

Statement: A Tricycle Rider records a Door to door Visit (including the D2D - Nurtamilk campaign) with visitor name, gender, mobile, area, number of people in family, auto Location and camera photo. [RFP-1, WS-7]
Acceptance:
- A saved Door to door Visit keeps its location and photo. [WS-7]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-7
Proposed: no

### MKT-06 — Marketing Visit Sheet and report

Statement: The rider or agent sees own visits; Sales Supervisor and above see all visits in the Marketing Visit Sheet; the Sales Head gets the Marketing Visits report with filters and Excel export. [RFP-1, WS-7]
Acceptance:
- The sheet filters by date, area, supervisor, rider, Beat and Visit type. [WS-7]
- The sheet exports to Excel. [WS-7]
- The Sales Head sees the number of visits per rider. [WS-7]
Priority: Should
Scope: Neome
Sources: RFP-1, WS-7
Proposed: no

## 12 Neome mapping

Neome App: `fmcg-field-sales-and-distribution`
Delivery: Configuration
How: Marketing Visit and Rider visit → Outlet visit and Rider visit/route with GPS tag, Beat and photo; Visit type values (School, Farm, Door to door, Shop activation), the School, Farm and Door to door forms and the typed new-person fields set up as extra fields and forms; existing Customer pick → CRM account link; Marketing Visit Sheet and Marketing Visits report (visits per rider) are not named App reports, set up as reports with filters and Excel export; offline capture as the App does (proposed, to confirm)

## 13 Open Items

- OI-77: Visits per day, and in peak season.
