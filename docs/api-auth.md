# Auth API Examples (JSON)

Base URL: http://localhost:3000/api

Use this header for protected endpoints:

Authorization: Bearer <access_token>

## POST /auth/register

{
  "name": "Jubaer Jishan",
  "username": "jishan",
  "email": "jubaerjishan.65@gmail.com",
  "institution": "Example University",
  "department": "Computer Science and Engineering",
  "phoneNumber": "01712345678",
  "role": "STUDENT",
  "password": "asdfjkl;",
  "confirmPassword": "asdfjkl;",
  "rememberMe": true
}

## POST /auth/login

{
  "email": "jubaerjishan.65@gmail.com",
  "password": "asdfjkl;",
  "rememberMe": true
}

Response:

{
  "message": "Login successful",
  "accessToken": "<access_token>",
  "user": { }
}

## POST /auth/logout

No JSON body. Requires Authorization header.

## POST /auth/refresh

Refresh token is read from the `HttpOnly` cookie.

Response:

{
  "message": "Token refreshed successfully",
  "accessToken": "<new_access_token>",
  "user": { }
}

## POST /auth/verify-email/request

{
  "email": "jubaerjishan.65@gmail.com"
}

## POST /auth/verify-email/confirm

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456"
}

## POST /auth/password-reset/request

{
  "email": "jubaerjishan.65@gmail.com"
}

## POST /auth/password-reset/verify

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456"
}

## POST /auth/password-reset/reset

{
  "email": "jubaerjishan.65@gmail.com",
  "otp": "123456",
  "newPassword": "asdfjkl;",
  "confirmPassword": "asdfjkl;"
}
