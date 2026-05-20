### Team Management APIs

#### POST /teams
- **Description**: Create a new team.
- **Authorization**: Bearer token required.
- **Request Body**:
  - `name` (string): Name of the team.
- **Notes**: The authenticated user is used as the team owner.
- **Response**: Created team object.

#### POST /teams/:id/members
- **Description**: Add a member to a team.
- **Authorization**: Bearer token required.
- **Request Body**:
  - `userId` (UUID): ID of the user to add.
  - `role` (string): Role of the user in the team.
- **Response**: 204 No Content.
- **Frontend hint**: The client now uses `GET /users/search` to pick the user instead of typing IDs manually.

#### DELETE /teams/:id/members/:userId
- **Description**: Remove a member from a team.
- **Authorization**: Bearer token required.
- **Response**: 204 No Content.

#### PATCH /teams/:id/members/:userId/role
- **Description**: Change a member's role in a team.
- **Authorization**: Bearer token required.
- **Request Body**:
  - `role` (string): New role for the user.
- **Response**: 204 No Content.

#### DELETE /teams/:id
- **Description**: Delete a team.
- **Authorization**: Bearer token required.
- **Response**: 204 No Content.

## Application API

### Apply to Team
**POST** `/applications/:teamId`

- **Authorization**: Bearer token required.

#### Request Body:
```json
{
  "message": "string"
}
```

- **Notes**: The authenticated user is used as the applicant.

#### Response:
```json
{
  "id": "string",
  "applicant": { ... },
  "team": { ... },
  "message": "string",
  "createdAt": "string"
}
```

---

## Invitation API

### Invite to Team
**POST** `/invitations/:teamId`

- **Authorization**: Bearer token required.

#### Request Body:
```json
{
  "inviteeId": "string",
  "message": "string"
}
```

- **Notes**: The authenticated user is used as the inviter.

## User Search

### Search Users
**GET** `/users/search?q=...`

- **Authorization**: Bearer token required.
- **Purpose**: Powers the frontend team member and invitee selectors.
- **Response**: Paginated result with `items`, `total`, `page`, and `limit`.

#### Response:
```json
{
  "id": "string",
  "inviter": { ... },
  "invitee": { ... },
  "team": { ... },
  "message": "string",
  "createdAt": "string"
}
```

---