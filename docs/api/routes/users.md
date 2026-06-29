# Users routes

Base path: `/api/v1/users`

## Summary

| Method | Route | Auth required | Description                               | Success response    |
| ------ | ----- | ------------: | ----------------------------------------- | ------------------- |
| GET    | `/me` |           Yes | Returns the authenticated user's profile. | `200 AppUserPublic` |
| PATCH  | `/me` |           Yes | Updates the authenticated user's profile. | `200 AppUserPublic` |
| DELETE | `/me` |           Yes | Deletes the authenticated user's account. | `204 No Content`    |

> [!WARNING]
> Admin authorization must be implemented.

| Method | Route  | Reason                                            |
| ------ | ------ | ------------------------------------------------- |
| GET    | `/`    | Would expose all users to any authenticated user. |
| GET    | `/:id` | Would allow reading another user's profile.       |
| PATCH  | `/:id` | Would allow modifying another user's profile.     |
| DELETE | `/:id` | Would allow deleting another user's account.      |

## Details

### `GET /users/me`

- Requires a valid `access_token` cookie.
- Reads `req.user.userId`.
- Fetches the current user from database.
- Returns `AppUserPublic`.

### `PATCH /users/me`

- Requires a valid `access_token` cookie.
- Validates request body with `updateAppUserSchema`.
- Updates only the authenticated user.
- Hashes the password if a new password is provided.
- Returns updated `AppUserPublic`.

### `DELETE /users/me`

- Requires a valid `access_token` cookie.
- Deletes the authenticated user.
- Clears the `access_token` cookie.
- Returns `204 No Content`.
