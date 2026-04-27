# Backend Endpoint Specifications for CITIZEN and POLITICIAN Roles

---

## CITIZEN ROLE - Complete API Specification

### 1. Registration Endpoint

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "fullName": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "phone": "string (optional)",
  "constituency": "string (optional)"
}

Response (201 Created):
{
  "success": true,
  "message": "Citizen registration successful",
  "data": {
    "id": 123,
    "fullName": "John Citizen",
    "email": "john@example.com",
    "phone": "9876543210",
    "constituency": "District 1",
    "role": "CITIZEN",
    "enabled": true,
    "createdAt": "2026-03-10T10:30:00"
  }
}
```

### 2. Dashboard Statistics Endpoint

```
GET /api/citizen/dashboard/stats
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": {
    "totalIssuesSubmitted": 5,
    "openIssues": 2,
    "resolvedIssues": 3,
    "totalFeedbackSubmitted": 8
  }
}
```

### 3. Get My Submitted Issues

```
GET /api/citizen/my-issues
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 101,
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "Infrastructure",
      "location": "Main Street, District 1",
      "status": "IN_PROGRESS",
      "response": "We are working on fixing this",
      "resolutionNotes": null,
      "assignedPoliticianId": 45,
      "assignedPoliticianName": "Ram Sharma",
      "createdAt": "2026-03-10T08:00:00",
      "resolvedAt": null
    }
  ]
}
```

### 4. Get My Submitted Feedback

```
GET /api/citizen/my-feedback
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 201,
      "text": "Great response to water issue",
      "rating": 4,
      "politicianId": 45,
      "politicianName": "Ram Sharma",
      "citizenId": 123,
      "citizenName": "John Citizen",
      "createdAt": "2026-03-10T09:00:00"
    }
  ]
}
```

### 5. Get Constituency Updates

```
GET /api/citizen/constituency-updates
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 301,
      "title": "Water Supply Project Update",
      "content": "Phase 1 of water supply project completed",
      "politicianId": 45,
      "politicianName": "Ram Sharma",
      "createdAt": "2026-03-09T15:00:00",
      "updatedAt": "2026-03-09T15:00:00"
    }
  ]
}
```

---

## ISSUE SUBMISSION & MANAGEMENT (Citizen Specific)

### 6. Create New Issue

```
POST /api/issues
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (required: Utilities, Infrastructure, Health, etc.)",
  "location": "string (optional)",
  "assignedPoliticianId": "number (optional)"
}

Response (201 Created):
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 102,
    "title": "No proper drinking water",
    "description": "Tap water is contaminated",
    "category": "Utilities",
    "location": "Vaddeswaram",
    "status": "OPEN",
    "response": null,
    "resolutionNotes": null,
    "citizenId": 123,
    "citizenName": "John Citizen",
    "createdAt": "2026-03-10T10:45:00",
    "resolvedAt": null
  }
}
```

### 7. Add Comment to Issue

```
POST /api/comments/issue/{issueId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "text": "string (required)",
  "issueId": "number (required)"
}

Response (201 Created):
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": 401,
    "content": "This issue is urgent",
    "userId": 123,
    "userName": "John Citizen",
    "issueId": 102,
    "createdAt": "2026-03-10T10:50:00"
  }
}
```

### 8. Submit Feedback on Politician

```
POST /api/feedback
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "politicianId": "number (required)",
  "rating": "number (required, 1-5)",
  "text": "string (optional)"
}

Response (201 Created):
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": 202,
    "text": "Quick response to issue",
    "rating": 5,
    "politicianId": 45,
    "politicianName": "Ram Sharma",
    "citizenId": 123,
    "citizenName": "John Citizen",
    "createdAt": "2026-03-10T11:00:00"
  }
}
```

---

## PUBLIC READ ENDPOINTS (Accessible to Citizens)

### 9. View All Issues

```
GET /api/issues
Response: List of all issues (publicly browsable)
```

### 10. View Issue Details

```
GET /api/issues/{id}
Response: Full issue details with comments and responses
```

### 11. Filter Issues by Status

```
GET /api/issues/status/{status}
Query Params: status = OPEN | IN_PROGRESS | RESOLVED | CLOSED
Response: Issues filtered by status
```

### 12. Search Issues

```
GET /api/issues/search?keyword={searchTerm}
Response: Issues matching search term in title or description
```

### 13. View Issue Comments

```
GET /api/comments/issue/{issueId}
Response: All comments on an issue
```

### 14. View Politician Feedback & Ratings

```
GET /api/feedback/politician/{politicianId}
Response: All feedback for a politician

GET /api/feedback/politician/{politicianId}/average
Response: Average rating for politician (0-5)

GET /api/feedback/politician/{politicianId}/stats
Response: Feedback statistics (total feedback, average rating, etc.)
```

### 15. View All Politicians

```
GET /api/users/politicians
Response: List of all politicians in system

GET /api/users/politicians/constituency/{constituency}
Response: Politicians in specific constituency
```

### 16. View Updates

```
GET /api/updates
Response: All updates from all politicians

GET /api/updates/politician/{politicianId}
Response: Updates from specific politician

GET /api/updates/{id}
Response: Specific update details
```

---

## POLITICIAN ROLE - Complete API Specification

### 1. Registration Endpoint

```
POST /api/auth/register/politician
Content-Type: application/json

Request Body:
{
  "fullName": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "phone": "string (optional)",
  "constituency": "string (required for politician)"
}

Response (201 Created):
{
  "success": true,
  "message": "Politician registration successful",
  "data": {
    "id": 45,
    "fullName": "Ram Sharma",
    "email": "ram.politics@gmail.com",
    "phone": "9876543210",
    "constituency": "District 5",
    "role": "POLITICIAN",
    "enabled": true,
    "createdAt": "2026-03-10T10:30:00"
  }
}
```

### 2. Dashboard Statistics Endpoint

```
GET /api/politician/dashboard/stats
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": {
    "assignedIssues": 12,
    "openIssues": 3,
    "inProgressIssues": 5,
    "resolvedIssues": 4,
    "feedbackReceived": 45,
    "averageRating": 4.2,
    "updatesPosted": 8
  }
}
```

### 3. Get Assigned Issues

```
GET /api/politician/assigned-issues
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 101,
      "title": "Water Supply Issue",
      "description": "No proper drinking water",
      "category": "Utilities",
      "location": "Vaddeswaram",
      "status": "IN_PROGRESS",
      "response": "We are working on this",
      "resolutionNotes": null,
      "citizenId": 123,
      "citizenName": "John Citizen",
      "createdAt": "2026-03-10T08:00:00",
      "resolvedAt": null
    }
  ]
}
```

### 4. Get All Dashboard Issues

```
GET /api/politician/dashboard-issues
Authorization: Bearer {token}

Response: All issues including assigned and constituency-related issues
```

### 5. Get Feedback Received

```
GET /api/politician/feedback-received
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 201,
      "text": "Quick response",
      "rating": 4,
      "politicianId": 45,
      "politicianName": "Ram Sharma",
      "citizenId": 123,
      "citizenName": "John Citizen",
      "createdAt": "2026-03-10T09:00:00"
    }
  ]
}
```

### 6. Get Average Rating

```
GET /api/politician/rating
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": 4.35
}
```

### 7. Get My Posted Updates

```
GET /api/politician/my-updates
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 301,
      "title": "Water Project Completion",
      "content": "Water supply project phase 1 completed successfully",
      "politicianId": 45,
      "politicianName": "Ram Sharma",
      "createdAt": "2026-03-09T15:00:00",
      "updatedAt": "2026-03-09T15:00:00"
    }
  ]
}
```

---

## ISSUE RESPONSE & RESOLUTION (Politician Specific)

### 8. Respond to Assigned Issue

```
PUT /api/issues/{issueId}/respond
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "response": "string (required)"
}

Response (200 OK):
{
  "success": true,
  "message": "Response added successfully",
  "data": {
    "id": 101,
    "title": "Water Supply Issue",
    "status": "IN_PROGRESS",
    "response": "We are working on fixing water contamination",
    "resolutionNotes": null
  }
}
```

### 9. Resolve Issue

```
PUT /api/issues/{issueId}/resolve
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "resolutionNotes": "string (required)"
}

Response (200 OK):
{
  "success": true,
  "message": "Issue resolved successfully",
  "data": {
    "id": 101,
    "title": "Water Supply Issue",
    "status": "RESOLVED",
    "resolutionNotes": "Water contamination fixed, supply restored",
    "resolvedAt": "2026-03-10T14:00:00"
  }
}
```

---

## UPDATE POSTING (Politician Specific)

### 10. Create Update/Announcement

```
POST /api/updates
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string (required)",
  "content": "string (required)"
}

Response (201 Created):
{
  "success": true,
  "message": "Update created successfully",
  "data": {
    "id": 302,
    "title": "Road Repair Completed",
    "content": "All roads in District 5 have been repaired",
    "politicianId": 45,
    "politicianName": "Ram Sharma",
    "createdAt": "2026-03-10T12:00:00",
    "updatedAt": "2026-03-10T12:00:00"
  }
}
```

### 11. Edit Update

```
PUT /api/updates/{updateId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string",
  "content": "string"
}

Response (200 OK): Updated update object
```

### 12. Delete Update

```
DELETE /api/updates/{updateId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Update deleted successfully"
}
```

---

## PUBLIC READ ENDPOINTS (Accessible to Politicians)

### 13. Community Engagement

```
GET /api/comments/issue/{issueId}
Response: View comments and public engagement on issues

GET /api/feedback/politician/{politicianId}
Response: View feedback and ratings from community

GET /api/users/politicians
Response: View other politicians in system

GET /api/updates
Response: View updates from all politicians
```

---

## API Response Format (All Endpoints)

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data object or array
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

---

## Authentication

All endpoints marked with `@PreAuthorize` require:
- Bearer token in Authorization header: `Authorization: Bearer {JWT_TOKEN}`
- Token obtained from login endpoint: `POST /api/auth/login`

---

## HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Role-Based Access Control

| Endpoint | CITIZEN | POLITICIAN | ADMIN | MODERATOR |
|----------|---------|-----------|-------|-----------|
| POST /api/issues | ✅ | ❌ | ❌ | ❌ |
| POST /api/feedback | ✅ | ❌ | ❌ | ❌ |
| PUT /api/issues/{id}/respond | ❌ | ✅ | ❌ | ❌ |
| PUT /api/issues/{id}/resolve | ❌ | ✅ | ❌ | ❌ |
| POST /api/updates | ❌ | ✅ | ❌ | ❌ |
| GET /api/admin/users | ❌ | ❌ | ✅ | ❌ |
| GET /api/moderator/issues/pending | ❌ | ❌ | ❌ | ✅ |

---

## Complete Endpoint Summary

### CITIZEN Endpoints (Role Restricted)
```
POST   /api/auth/register
GET    /api/citizen/dashboard/stats
GET    /api/citizen/my-issues
GET    /api/citizen/my-feedback
GET    /api/citizen/constituency-updates
POST   /api/issues
POST   /api/comments/issue/{issueId}
POST   /api/feedback
```

### POLITICIAN Endpoints (Role Restricted)
```
POST   /api/auth/register/politician
GET    /api/politician/dashboard/stats
GET    /api/politician/assigned-issues
GET    /api/politician/dashboard-issues
GET    /api/politician/feedback-received
GET    /api/politician/rating
GET    /api/politician/my-updates
PUT    /api/issues/{issueId}/respond
PUT    /api/issues/{issueId}/resolve
POST   /api/updates
PUT    /api/updates/{updateId}
DELETE /api/updates/{updateId}
```

### ADMIN Endpoints (Role Restricted)
```
GET    /api/admin/users
GET    /api/admin/users/role/{role}
PUT    /api/admin/users/{id}/disable
PUT    /api/admin/users/{id}/enable
DELETE /api/admin/users/{id}
GET    /api/admin/dashboard/stats
```

### MODERATOR Endpoints (Role Restricted)
```
GET    /api/moderator/issues/pending
GET    /api/moderator/issues/all
PUT    /api/moderator/issues/{id}/approve
PUT    /api/moderator/issues/{id}/reject
GET    /api/moderator/comments/all
DELETE /api/moderator/comments/{id}
GET    /api/moderator/dashboard/stats
```

### Public Endpoints (No Authorization Required)
```
GET    /api/issues
GET    /api/issues/{id}
GET    /api/issues/status/{status}
GET    /api/issues/search
GET    /api/comments/issue/{issueId}
GET    /api/feedback/politician/{politicianId}
GET    /api/feedback/politician/{politicianId}/average
GET    /api/feedback/politician/{politicianId}/stats
GET    /api/updates
GET    /api/updates/{id}
GET    /api/updates/politician/{politicianId}
GET    /api/users/politicians
GET    /api/users/politicians/constituency/{constituency}
```
