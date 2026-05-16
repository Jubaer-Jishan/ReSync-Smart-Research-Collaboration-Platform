# Projects API Examples (JSON)

Base URL: http://localhost:3000/api

Use this header for protected endpoints:

Authorization: Bearer <access_token>

## POST /projects

{
  "name": "Jishan Research",
  "description": "Research on collaborative annotation workflows.",
  "researchField": "Machine Learning",
  "visibility": "PUBLIC",
  "status": "DRAFT"
}

## POST /projects/:id/members

{
  "userId": "c5c1d8a9-5c2a-4f51-9f93-4b2f1c1d9c2f",
  "role": "AUTHOR"
}

## PATCH /projects/:id/members/role

{
  "userId": "c5c1d8a9-5c2a-4f51-9f93-4b2f1c1d9c2f",
  "role": "SUPERVISOR"
}

## DELETE /projects/:id/members/:userId

No JSON body. Requires Authorization header.

## DELETE /projects/:id/leave

No JSON body. Requires Authorization header.
