# Auth routes

Base path: `/api/v1/auth`

## Summary

| Method | Route       | Auth required | Description                                                                     | Success response    |
| ------ | ----------- | ------------: | ------------------------------------------------------------------------------- | ------------------- |
| POST   | `/register` |            No | Creates a new user account. Does not log the user in.                           | `201 AppUserPublic` |
| POST   | `/login`    |            No | Checks credentials, creates an access token, and sets it in an httpOnly cookie. | `200 AppUserPublic` |
| POST   | `/logout`   |            No | Clears the `access_token` cookie.                                               | `204 No Content`    |

## Details

### `POST /auth/register`

- Validates request body with `registerSchema`.
- Checks email uniqueness.
- Checks pseudo uniqueness.
- Hashes the password.
- Creates the user in `app_user`.
- Returns `AppUserPublic`.
- Does not set an auth cookie.

### `POST /auth/login`

- Validates request body with `loginSchema`.
- Finds user by email.
- Compares password with stored password hash.
- Generates an access token with payload `{ userId }`.
- Sets the token in an `httpOnly` cookie named `access_token`.
- Returns `AppUserPublic`.

### `POST /auth/logout`

- Clears the `access_token` cookie.
- Returns `204 No Content`.
