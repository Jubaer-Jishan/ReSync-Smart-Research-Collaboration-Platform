### Team Management APIs

#### POST /teams
- **Description**: Create a new team.
- **Authorization**: Bearer token required.
- **Request Body**:
  - `name` (string): Name of the team.
  - `ownerId` (UUID): ID of the team owner.
- **Response**: Created team object.

#### POST /teams/:id/members
- **Description**: Add a member to a team.
- **Authorization**: Bearer token required.
- **Request Body**:
  - `userId` (UUID): ID of the user to add.
  - `role` (string): Role of the user in the team.
- **Response**: 204 No Content.

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

#### Request Body:
```json
{
  "applicantId": "string",
  "message": "string"
}
```

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

#### Request Body:
```json
{
  "inviterId": "string",
  "inviteeId": "string",
  "message": "string"
}
```

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