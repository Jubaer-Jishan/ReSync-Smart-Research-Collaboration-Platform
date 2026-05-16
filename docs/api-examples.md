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

## Users (protected)

### GET /users/me

No JSON body. Requires Authorization header.

### PATCH /users/me/profile

{
  "bio": "Research assistant focused on HCI and ML.",
  "profilePictureUrl": "https://cdn.example.com/profiles/jishan.jpg",
  "bannerImage": "https://cdn.example.com/banners/jishan.png",
  "location": "Dhaka, Bangladesh",
  "website": "https://example.com/jishan",
  "contactNumber": "+8801700000000",
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "phoneNumber": "01712345678",
  "githubProfile": "https://github.com/jishan",
  "linkedinProfile": "https://www.linkedin.com/in/jishan",
  "twitterProfile": "https://twitter.com/jishan",
  "facebookProfile": "https://facebook.com/jishan",
  "orcidProfile": "https://orcid.org/0000-0000-0000-0000",
  "googleScholarProfile": "https://scholar.google.com/citations?user=xxxx",
  "researchGateProfile": "https://www.researchgate.net/profile/Jishan"
}

### PATCH /users/me/student-profile

{
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "semester": "7th",
  "cgpa": 3.82,
  "graduationYear": 2026,
  "skills": "Python, ML, Data Visualization",
  "interestedResearchFields": "HCI, ML, NLP"
}

### PATCH /users/me/teacher-profile

{
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "designation": "Assistant Professor",
  "officeLocation": "Room 501, CSE Building",
  "yearsOfExperience": 6,
  "specialization": "Human Computer Interaction",
  "currentResearchArea": "Explainable AI",
  "googleScholarProfile": "https://scholar.google.com/citations?user=xxxx",
  "researchGateProfile": "https://www.researchgate.net/profile/Jishan",
  "orcidId": "0000-0000-0000-0000",
  "totalPublications": 12,
  "hIndex": 8
}

## Notes

- Groups controller does not expose API endpoints yet.
- Enum values used above:
  - Role: STUDENT | TEACHER | RESEARCHER
  - VisibilityType: PUBLIC | PRIVATE
  - ProjectStatus: DRAFT | ONGOING | COMPLETED | ARCHIVED
  - ProjectRole: OWNER | SUPERVISOR | AUTHOR | CO_AUTHOR | CONTRIBUTOR | VIEWER
