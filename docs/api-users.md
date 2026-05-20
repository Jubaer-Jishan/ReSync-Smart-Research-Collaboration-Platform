# Users API Examples (JSON)

Base URL: http://localhost:3000/api

Use this header for protected endpoints:

Authorization: Bearer <access_token>

## GET /users/me

No JSON body. Requires Authorization header.

## GET /users/search

Requires Authorization header.

Query params:
- q
- page
- limit

Example:

GET /users/search?q=farhan&page=1&limit=20

## PATCH /users/me/profile

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

## PATCH /users/me/student-profile

{
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "semester": "7th",
  "cgpa": 3.82,
  "graduationYear": 2026,
  "skills": "Python, ML, Data Visualization",
  "interestedResearchFields": "HCI, ML, NLP"
}

## PATCH /users/me/teacher-profile

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

### Follow/Unfollow Users

#### POST /users/:id/follow
- **Description**: Follow a user.
- **Authorization**: Bearer token required.
- **Request Body**: None.
- **Response**: 204 No Content.

#### DELETE /users/:id/follow
- **Description**: Unfollow a user.
- **Authorization**: Bearer token required.
- **Request Body**: None.
- **Response**: 204 No Content.

#### GET /users/:id/followers
- **Description**: Get followers of a user.
- **Authorization**: None.
- **Response**: Array of user objects.

#### GET /users/:id/following
- **Description**: Get users followed by a user.
- **Authorization**: None.
- **Response**: Array of user objects.
