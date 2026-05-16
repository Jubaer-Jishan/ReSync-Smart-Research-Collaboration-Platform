# API Examples (JSON)

Base URL: http://localhost:3000/api

Use this header for protected endpoints:

Authorization: Bearer <access_token>

## Auth

### POST /auth/register

{
  "name": "Jubaer Jishan",
  "username": "jishan",
  "email": "jubaerjishan.65@gmail.com",
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "phoneNumber": "01712345678",
  "role": "STUDENT",
  "password": "asdfjkl;",
  "confirmPassword": "asdfjkl;"
}

### POST /auth/login

{
  "email": "jubaerjishan.65@gmail.com",
  "password": "asdfjkl;"
}

### POST /auth/logout

No JSON body. Requires Authorization header.

### POST /auth/verify-email/request

{
  "email": "jubaerjishan.65@gmail.com"
}

### POST /auth/verify-email/confirm

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456"
}

### POST /auth/password-reset/request

{
  "email": "jubaerjishan.65@gmail.com"
}

### POST /auth/password-reset/verify

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456"
}

### POST /auth/password-reset/reset

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456",
  "newPassword": "asdfjkl;",
  "confirmPassword": "asdfjkl;"
}

## Projects (protected)

### POST /projects

{
  "name": "Jishan Research",
  "description": "Research on collaborative annotation workflows.",
  "researchField": "Machine Learning",
  "visibility": "PUBLIC",
  "status": "DRAFT"
}

### POST /projects/:id/members

{
  "userId": "c5c1d8a9-5c2a-4f51-9f93-4b2f1c1d9c2f",
  "role": "AUTHOR"
}

### PATCH /projects/:id/members/role

{
  "userId": "c5c1d8a9-5c2a-4f51-9f93-4b2f1c1d9c2f",
  "role": "SUPERVISOR"
}

### DELETE /projects/:id/members/:userId

No JSON body. Requires Authorization header.

### DELETE /projects/:id/leave

No JSON body. Requires Authorization header.

## Notes

- Users and Groups controllers do not expose API endpoints yet.
- Enum values used above:
  - Role: STUDENT | TEACHER | RESEARCHER
  - VisibilityType: PUBLIC | PRIVATE
  - ProjectStatus: DRAFT | ONGOING | COMPLETED | ARCHIVED
  - ProjectRole: OWNER | SUPERVISOR | AUTHOR | CO_AUTHOR | CONTRIBUTOR | VIEWER
