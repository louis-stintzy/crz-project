# Closets — API v1

All routes require the `access_token` HTTP-only cookie issued by `POST /api/v1/auth/login`.

| Method | Route | Description | Success |
| --- | --- | --- | --- |
| GET | `/api/v1/closets` | List the authenticated user's closets | 200 |
| GET | `/api/v1/closets/:id` | Get one owned closet | 200 |
| POST | `/api/v1/closets` | Create a closet for the authenticated user | 201 |
| PATCH | `/api/v1/closets/:id` | Update one owned closet | 200 |
| DELETE | `/api/v1/closets/:id` | Delete one owned closet | 204 |

## Request bodies

**POST /closets**

```json
{
  "name": "Main Closet",
  "description": "Everyday clothes"
}
```

**PATCH /closets/:id** (partial update)

```json
{
  "name": "Summer Closet"
}
```

`name` is required on creation and non-empty (max 255 characters). `description` is optional and nullable. `PATCH` must contain at least one recognized field. Unknown fields (including `userId`) are rejected.

## Response example (200/201)

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "userId": "22222222-2222-4222-8222-222222222222",
  "name": "Main Closet",
  "description": "Everyday clothes",
  "createdAt": "2026-11-10T10:00:00.000Z",
  "updatedAt": null
}
```

## Access control and errors

- `userId` always comes from the verified access token, never the request body.
- `GET /` returns only the caller's closets.
- `/:id` operations require both closet ID and caller user ID in the SQL `WHERE` clause.
- A missing closet or one owned by another user returns **404** (no ownership disclosure).
- Missing/invalid authentication: **401**.
- Invalid UUID or request body: **400**.
- Duplicate closet name for the same user: **409**.
- Deleting a closet cascades to its clothing items and related joins/pictures as defined in `init.sql`. Treat deletion as destructive.
