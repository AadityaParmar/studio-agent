# RFP-1 — Deans Pond HOA Business Requirement Document

Type: RFP · Date: 2026-10-30 · File: inputs/RFP-1-deans-pond-hoa-business-requirement.odt

---

Deans Pond HOA - Business Requirement Document

Neome platform  |  Version 1.0  |  30 October 2026
This document defines the member management, announcements, tickets, payments, and vendor directory requirements for Deans Pond HOA in the USA.
## 
## Contents
1 Document Purpose
2 Solution Overview
3 User Roles
4 Functional Modules
5 Member Registration and Management
6 Announcements Module
7 Tickets Module
8 Payments Module
9 Vendors Module
10 Access Control Matrix
11 Notifications and Reminders
12 Reporting and Dashboard Requirements
13Proposed High Level Workflow
14 Out of Scope and To Be Confirmed
15 Acceptance Criteria
16 Open Questions for Customer Confirmation

# 1 Document Purpose
This Business Requirement Document defines the functional requirements for the Deans Pond HOA Management Solution to be developed on the Neome platform.
The solution is intended for a Homeowners Association (HOA) in the USA and will be used by HOA Board Members and Society Members to manage community-related activities from a centralized system.
The solution will primarily cover:
Member management
Community announcements
Ticket and issue management
HOA payment tracking and collection
Vendor directory management
# 2 Solution Overview
The Deans Pond HOA Management Solution will provide a centralized platform for Board Members and Members to manage day-to-day HOA activities.
Members will be able to:
View community announcements
Raise and track their own tickets
View pending HOA payments
View their payment history
Receive upcoming payment reminders
Access the approved vendor directory
Board Members will have administrative access to:
Publish announcements
Manage events and party announcements
View and manage all member tickets
Raise payment collections
Monitor paid and pending payments
Maintain the HOA vendor directory
Manage member information
# 3 User Roles
The system will support the following roles:
## 3.1 Board Member
Board Members will have administrative access to the solution.
Key responsibilities include:
Manage announcements
Publish event and party announcements
View and manage all tickets
Raise payment collection requests
View payment status across all members
Manage the vendor directory
Access member information
## 3.2 Member
Members will have limited access based on their own account.
Members will be able to:
View announcements
View event and party announcements
Raise tickets
View their own tickets
View pending payments
View payment history
Receive payment reminders
View vendor directory information
# 4 Functional Modules
The solution will contain the following primary modules:
Announcements
Tickets
Payments
Vendors
Member Directory / Member Management
# 5 Member Registration and Management
The system will maintain a directory of HOA members.
## 5.1 Member Registration Form
The member registration form will contain the following fields:

| Field | Requirement |
|---|---|
| Name | Required |
| Email | Optional |
| Phone | Required |
| Address | Required |
| Number of Family Members | Optional |
| Number of Cards | Optional |

## 5.2 Member Access
Each registered member will have access to information associated with their own account.
Board Members will be able to view the complete member directory.
## 5.3 Additional Member Information
Additional member information, family member details, property ownership details, emergency contacts, vehicle information, or other HOA-related information are currently outside the defined requirements.
Status: TBC
# 6 Announcements Module
The Announcements module will be used by the HOA Board to communicate important information to Society Members.
## 6.1 General Announcements
Board Members will be able to:
Create announcements
Publish announcements
View previously published announcements
Members will have read-only access to announcements.
Members will not be able to create, modify, or delete announcements.
## 6.2 Event and Party Announcements
A separate form will be available for Board Members to publish party or event-related announcements.
Suggested fields may include:
Event title
Event description
Event date
Start time
End time
Venue / location
Contact person
# 7 Tickets Module
The Tickets module will allow members to report HOA-related concerns or requests.
## 7.1 Ticket Creation
Members will be able to create tickets related to community or HOA matters.
Potential fields may include:
Ticket title
Category
Description
Attachment / photo
Date
Priority
## 7.2 Ticket Visibility
### Member
A Member will:
View only tickets created by themselves
Track the status of their tickets
View responses or updates provided by Board Members
### Board Member
A Board Member will:
View all tickets submitted by all members
Review ticket details
Act on tickets
Update ticket status
Provide updates or comments
## 7.3 Ticket Status
The ticket lifecycle and statuses:
Open > In Progress > Resolved > Closed
# 8 Payments Module
The Payments module will allow Board Members to manage HOA payment obligations and Members to view their payment information.
## 8.1 Member Payment View
Each Member will be able to view:
Current pending payments
Upcoming payments
Previous payment history
Payment amount
Payment status
Members will only be able to view payment information associated with their own account.
## 8.2 Payment Reminders
Members will receive a reminder for upcoming payments approximately one month before the payment due date.
Possible channels may include:
Neome application notification
Email
SMS
WhatsApp
## 8.3 Board Member Payment Management
Board Members will be able to:
View payments for all members
View paid payments
View pending payments
Raise a new payment collection
Track payment status
## 8.4 Raise Payment Collection
Board Members will be able to create a payment request / collection for HOA members.
Potential fields may include:
Payment title
Description
Amount
Due date
Applicable members
Payment category
## 8.5 Online Payment Processing
Whether members will make payments directly through the Neome platform or whether the system will only track payment records is currently TBC.
If online payment is required, payment gateway requirements and integration details will need to be finalized separately.
# 9 Vendors Module
The Vendors module will maintain a directory of vendors used or recommended by the HOA.
Examples include:
Grass cutting / landscaping services
Plumber
Electrician
Maintenance vendors
Other HOA service providers
## 9.1 Vendor Information
The vendor directory will include:

| Field | Requirement |
|---|---|
| Vendor Name | Required |
| Service Type / Category | Required |
| Contact Number | Required |
| Email | Optional |
| Address | Optional |
| Government ID Proof | Required |
| Additional Notes | Optional |

## 9.2 Vendor Management
Board Members will be able to:
Add vendors
View vendors
Update vendor information
Maintain vendor documents and identification details
Members will have read-only access to the vendor directory.
## 9.3 Government ID Proof
Government ID documents will contain sensitive personal information.
Access permissions, document retention, security requirements, and which specific government IDs should be collected must be confirmed before implementation.
# 10 Access Control Matrix

| Function | Board Member | Member |
|---|---|---|
| View Member Directory | Yes | Yes |
| Manage Members | Yes | No |
| Post General Announcement | Yes | No |
| View General Announcements | Yes | Yes |
| Post Event / Party Announcement | Yes | No |
| View Event / Party Announcements | Yes | Yes |
| Raise Ticket | Yes | Yes |
| View Own Tickets | Yes | Yes |
| View All Tickets | Yes | No |
| Update Ticket Status | Yes | No |
| View Own Payments | Yes | Yes |
| View All Member Payments | Yes | No |
| Raise Payment Collection | Yes | No |
| View Vendor Directory | Yes | Yes |
| Add / Edit Vendors | Yes | No |
| View Vendor Government ID | Yes | Yes |

# 11 Notifications and Reminders
The system is expected to support notifications for relevant activities.
Confirmed notification requirement:
Payment reminder one month before the payment due date
Other notifications that need confirmation include:
New announcement notification
New event notification
Ticket status update
Ticket response notification
New payment request
Payment received confirmation
Overdue payment reminder
Notification channels are TBC.
# 12 Reporting and Dashboard Requirements
Detailed reporting requirements have not yet been defined.
Potential Board Member dashboards can include:
Total number of members
Open tickets
Tickets by status
Total payment collection
Paid payments
Pending payments
Overdue payments
Upcoming events
The exact dashboard and reporting requirements should be finalized with the customer.
# 13 Proposed High Level Workflow
## Member Onboarding
Member Registration  →  Member Account Created  →  Member Added to HOA Directory  →  Member Gets Access to Relevant Modules
## Announcement Workflow
Board Member Creates Announcement  →  Announcement Published  →  Members View Announcement
## Ticket Workflow
Member Raises Ticket  →  Board Member Reviews Ticket  →  Board Member Takes Action  →  Ticket Status Updated  →  Member Views Update  →  Ticket Closed
## Payment Workflow
Board Member Raises Payment Collection  →  Payment Assigned to Applicable Members  →  Member Views Pending Payment  →  Reminder Sent One Month Before Due Date  →  Payment Recorded  →  Payment History Updated
## Vendor Workflow
Board Member Adds Vendor  →  Vendor Information and Documents Stored  →  Vendor Listed in Directory  →  Members View Vendor Details
# 14 Out of Scope and To Be Confirmed
The following requirements have not yet been defined and should be confirmed before the scope is finalized:
Online payment gateway integration
Payment collection method
Family member details
Event registration / RSVP functionality
Vendor rating or review functionality
Exact vendor government ID types
Notification channels
Email / SMS / WhatsApp integrations
Reporting requirements
# 15 Acceptance Criteria
The solution will be considered functionally complete for the defined scope when:
Board Members can manage HOA members.
Board Members can create and publish announcements.
Members can view announcements but cannot modify them.
Board Members can publish separate event / party announcements.
Members can raise HOA-related tickets.
Members can view only their own tickets.
Board Members can view and manage all tickets.
Members can view their pending payments and payment history.
Members receive upcoming payment reminders as defined.
Board Members can raise payment collections.
Board Members can monitor paid and pending payments.
Board Members can maintain the vendor directory.
Members can access the approved vendor directory.
Role-based access is implemented for Board Members and Members.
The agreed member registration information is captured and maintained.
# 16 Open Questions for Customer Confirmation
Before freezing the final requirements, the following items need clarification:
Should Members be able to view the directory and contact information of other Members?
Should family members have separate login accounts or only be recorded under the primary Member?
How will HOA payments actually be collected?
What payment reminder channels should be used?
Should overdue reminders also be sent after the due date?
What fields are required for a ticket?
What ticket categories and statuses are required?
Should Members be able to comment or respond on their tickets?
Should ticket photos/documents be supported?
What information is required for event / party announcements?
Is RSVP or event registration required?
Which government ID proof should be collected for vendors?
Should Members be allowed to view vendor government ID documents, or should these remain accessible only to Board Members?
Is vendor rating / feedback required?
Are email, SMS, or WhatsApp notifications required?
Is there any existing member, payment, ticket, or vendor data that needs to be migrated?
Are there any specific US privacy, security, or HOA regulatory requirements that need to be considered?
