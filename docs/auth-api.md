# Auth API Flow

Base URL: http://localhost:3000/api

## Email verification flow

1) Register a user
   - POST /auth/register
2) Request email OTP
   - POST /auth/verify-email/request
3) Confirm email OTP
   - POST /auth/verify-email/confirm
4) Login
   - POST /auth/login
   - Use the returned accessToken as Bearer token

## Logout flow

- POST /auth/logout (requires Authorization header)
- After logout, the current access token is invalidated.

## Password reset flow

1) Request password reset OTP
   - POST /auth/password-reset/request
2) Verify password reset OTP
   - POST /auth/password-reset/verify
3) Reset password
   - POST /auth/password-reset/reset

## Notes

- Login is blocked until email is verified.
- Access token must be sent in Authorization header for protected endpoints.
