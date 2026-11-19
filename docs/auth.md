# Authentication Plan

Workspace uses custom authentication rather than a hosted vendor. This document records
what was wrong with the original implementation, the target design, and the order of work.

## Original Problems

### Authorization

- The server signed a JWT at login but never verified it. Every write route — creating
  listings, uploading images, posting and deleting comments, favorites — accepted
  unauthenticated requests.
- Identity came from the client. Favorites were looked up by the display name in the URL
  (`/favorites/:name`), and comments and listings took `name` from the request body, so
  anyone could read or change another user's favorites, post as another user, or delete
  any comment.

### Registration and Login

- `if (!username || !password, !name)` used the comma operator, so only `name` was
  validated.
- Duplicate usernames could register; login used whichever matched first.
- Login returned different messages for an unknown username and a wrong password,
  revealing which usernames exist, and had no rate limiting.
- bcrypt used cost 8. OWASP's minimum for bcrypt is 10, and it prefers Argon2id for new
  code.

### Tokens

- The JWT lived in `localStorage`, readable by any XSS, for 24 hours with no way to revoke
  it. Logout only cleared it in the browser.
- `jsonwebtoken@8.5.1` has known advisories fixed in v9.
- `cors()` allowed every origin.
- The server started with any `JWT_SECRET`, including the `replace_me` placeholder.

## Target Design: Server-Side Sessions

The app is one Express server and its own SPA, so it doesn't need stateless tokens. Opaque
sessions stored server-side are simpler and can be revoked. The design follows the
[Lucia sessions guide](https://lucia-auth.com/sessions/overview) and
[The Copenhagen Book](https://thecopenhagenbook.com/).

- **Session token:** 32 random bytes, sent as a cookie with `HttpOnly; Secure; SameSite=Lax;
  Path=/`. The database stores only the SHA-256 hash of the token in a `sessions` table, so a
  database leak doesn't expose usable sessions.
- **Expiry:** 30 days, extended when a session is used after half its lifetime has passed.
- **Revocation:** logout deletes the session row; a password change deletes all of the
  user's sessions.
- **CSRF:** `SameSite=Lax` plus an `Origin` header check on every non-GET request.
- **Identity:** users get UUIDs. `requireAuth` loads the user from the session into
  `req.user`; routes never trust identity from URLs or bodies.
- **Authorization:** favorites move to `/me/favorites`; comments and listings store
  `userId`, and only the owner can change or delete them.
- **Passwords:** Argon2id (`@node-rs/argon2`); bcrypt hashes are rehashed on next login.
- **Hardening:** rate limits on login, register and geocode; generic login errors; schema
  validation (zod) on request bodies; `helmet`; CORS restricted to the client origin with
  credentials.
- **Client:** drop `localStorage` tokens and `jwt-decode`; add `GET /auth/me` behind a
  TanStack Query `useSession` hook; send cookies with `withCredentials`; use a Vite dev
  proxy so cookies are same-origin in development.

## Phases

### Phase 1: Stopgap Hardening (done on `feat/auth-hardening`)

- `requireAuth` middleware verifies the bearer JWT (HS256 only) on every write route and
  on all favorites routes. Reading listings and geocoding stay public because signed-out
  visitors browse listings.
- The server takes the author and owner from the token: new listings and comments store
  `name` and `username` from the token, and server-controlled fields (`id`, `comments`,
  `images`) can't be overridden by the request body.
- Only authors can delete comments, only owners can add images to listings, and users can
  only access their own favorites. Older records without `username` are matched by display
  name.
- Registration validates every field, requires 8–72-byte passwords, and rejects duplicate
  usernames (case-insensitive).
- Login returns one `401 Invalid username or password` for any failure, runs bcrypt against
  a dummy hash for unknown users to keep timing even, and rehashes cost-8 passwords at
  cost 12.
- In-memory rate limits: login 10 per 15 minutes, register 10 per hour, geocode 30 per
  minute, per IP.
- The server refuses to start without a `JWT_SECRET` of at least 32 characters; CORS is
  limited to `CLIENT_ORIGIN`.
- Request handlers no longer log whole request objects, which would have written
  `Authorization` headers to the logs.
- The client attaches the stored token as `Authorization: Bearer` through an axios
  interceptor, and sign up enforces the 8-character minimum.
- Data paths resolve from `DATA_DIR` or `server/data`, and `app.js` is separated from
  `server.js`, so the server can be tested with supertest against temporary data.

### Phase 2: Database

Replace the JSON files with SQLite (`better-sqlite3`) or Postgres: `users`, `sessions`,
`listings`, `comments`, `favorites`, with `user_id` foreign keys. This also removes the race
between concurrent JSON file writes.

### Phase 3: Sessions

Replace JWTs with the session design above on the server and client, and remove
`jsonwebtoken` and `jwt-decode`.

### Phase 4: Optional Features

Password reset and email verification (needs an email sender), TOTP two-factor
authentication, Google sign-in (for example with `arctic`), and passkeys.
