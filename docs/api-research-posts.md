# Research Posts API Examples (JSON)

Base URL: http://localhost:3000/api

Use this header for protected endpoints:

Authorization: Bearer <access_token>

## POST /posts

Content-Type: multipart/form-data

Fields:
- images: up to 4 image files (jpeg/png/webp, max 5MB each)
- title
- description
- researchDomain
- collaborationType
- requiredSkills[] (optional)
- requiredRoles[] (optional)
- requiredCollaborators
- department
- academicLevel
- researchStage
- experienceLevel
- deadline (ISO string)
- status (optional)

Example JSON body (if you are sending without files):

{
  "title": "Collaborators needed for HCI study",
  "description": "Looking for 2 collaborators to help run a small user study and analyze results.",
  "researchDomain": "HCI",
  "collaborationType": "RESEARCH",
  "requiredSkills": ["User interviews", "Data analysis"],
  "requiredRoles": ["Research Assistant"],
  "requiredCollaborators": 2,
  "department": "Computer Science and Engineering",
  "academicLevel": "UNDERGRAD",
  "researchStage": "DATA_COLLECTION",
  "experienceLevel": "INTERMEDIATE",
  "deadline": "2026-06-15T12:00:00.000Z",
  "status": "OPEN"
}

## GET /posts

Optional query params:
- page
- limit
- researchDomain
- collaborationType
- department
- academicLevel
- researchStage
- experienceLevel
- status
- q
- sortBy (createdAt | deadline | updatedAt)
- sortOrder (ASC | DESC)
- deadlineFrom
- deadlineTo

Example:

GET /posts?page=1&limit=20&researchDomain=HCI&sortBy=createdAt&sortOrder=DESC

## GET /posts/:id

No JSON body.

## PATCH /posts/:id

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "OPEN",
  "deadline": "2026-07-01T12:00:00.000Z"
}

## DELETE /posts/:id

No JSON body.

## POST /posts/:id/apply

{
  "message": "I would love to contribute to this project.",
  "portfolioLink": "https://example.com/portfolio",
  "githubLink": "https://github.com/example",
  "researchExperience": "Worked on an NLP project in 2025 and published a workshop paper."
}

## POST /posts/:id/likes

Requires Authorization header.

No JSON body.

## DELETE /posts/:id/likes

Requires Authorization header.

No JSON body.

## POST /posts/:id/comments

Requires Authorization header.

{
  "content": "Great post. Interested to join the study."
}

## GET /posts/:id/comments

No JSON body.

## POST /posts/:id/shares

Requires Authorization header.

No JSON body.
