# Project TODO

## Current Status

- Client has been migrated from CRA to Vite.
- Client has been migrated to TypeScript with permissive compiler settings.
- Frontend tests now use Vitest, React Testing Library, and MSW.
- Tests are colocated near the pages/components that own the behavior.
- Shared test utilities exist for MSW request mocking and provider/router rendering.
- React has been upgraded to 19.
- TanStack Query is installed and configured in the client using the current major version.
- API reads and writes now flow through `src/api` and query/mutation hooks.
- Forms (search, login, sign up, comments, listing upload, image upload) use React Hook Form; server errors come from mutation state.
- The map moved from google-map-react to MapLibre GL (react-map-gl) with keyless OpenFreeMap tiles; geocoding still uses the server's Google `/geocode` route.

## Next Steps

1. ~~Commit the current frontend test and test utility changes.~~
2. ~~Install and configure TanStack Query in the client.~~
3. ~~Add `QueryClientProvider` at the app root.~~
4. ~~Extend `renderWithProviders` with a test `QueryClient`.~~
5. ~~Migrate read requests to query hooks:~~
   - listings
   - favorites
   - individual listing data
   - geocoding data
6. ~~Migrate write requests to mutation hooks:~~
   - login
   - add/remove favorite
   - create/delete comment
   - upload listing
7. ~~Extract repeated frontend logic into custom hooks.~~
8. ~~Remove unnecessary `useEffect` usage after query migration.~~
9. Add backend database tooling:
   - create database on start
   - replace JSON file persistence
   - add backend tests around data access
10. Add a `.env` generation script for frontend and backend non-secret defaults.

## Later Improvements

- Tighten TypeScript compiler settings.
- Add stricter domain types for listings, comments, users, and API responses.
- Add route-level lazy loading.
- Improve accessibility in forms and icon-only controls.
- Add CI checks for test, typecheck, and build.

## React Query Refactor Review

### Iteration 1

- `App.tsx`: initialize auth state directly from `localStorage` instead of using effects to mirror `token` and `name`.
- `IndividualListing.tsx`: remove effects that copy query data into local state, reset image state from listing data, and mirror favorite query results.
- `SignUp.tsx`: derive password mismatch state from form input instead of synchronizing it in an effect.
- Result: all client HTTP calls now go through `src/api`, server state uses TanStack Query hooks, and app code in `client/src` no longer has `useEffect` calls (one remains in test utilities).
- Verification: `npm test`, `npm run typecheck`, and `npm run build` passed after each cleanup slice.

### Remaining Frontend Follow-ups

- Add stronger TypeScript types for API payloads and query/mutation hook return data.
- Consider grouping related query/mutation hooks by feature if the hook folders grow.
- Consider replacing `alert` in `SignUp` with app-level feedback UI.
- Refactor `UploadPage` into a form hook with schema-based validation and smaller step components. (Partly done: React Hook Form with per-step `trigger` validation is in place; schema validation and smaller step components remain.)
- After posting a listing, navigate to the newly created listing detail page instead of the city listings page.
- Refactor `IndividualListing` into smaller hooks/components for listing media, favorites, and comments.
- Refactor `ListingsPage` into smaller hooks/components for loading states, favorites view, and city listing/map behavior.
- Refactor `SignUp` to use app-level success feedback instead of `alert`. (Shared React Hook Form validation and mutation-state error handling are done.)
- Update frontend authentication flow before continuing component-level refactors.
- Refactor `Rating` so interactive ratings use semantic form controls, such as a radio group or buttons with accessible names, instead of clickable `<img>` elements.
- Split `Rating` into separate read-only display and interactive input variants, or add an explicit mode prop, so comment display and comment form behavior are not coupled.
- Generate rating options from an array rather than repeating five nearly identical star blocks.
- Assert the login request body in form tests. Sign up, comments, and listing upload are covered.
- Add test coverage for login/sign-up modal cancellation and switching between the two modals.
- Strengthen the "cancels and resets a signed-in user review form" test: assert no filled stars remain instead of only checking that some empty stars exist.
- Tidy tests: move shared helpers (`waitForListing`, `fillReview`) to the top of their files and reuse them in older tests.
- Add a visible disabled style for buttons (for example `.button:disabled`); submit buttons are now disabled while requests run but look the same as enabled ones.
- Use one listings cache: `useListingsQuery`, `useListingQuery`, and `useCityListingsQuery` all fetch the full list under different query keys. Share `queryKeys.listings` and keep filtering in `select`.
- Have comment create/delete mutations update the query cache with `setQueryData` and remove the `updatedListing` local state in `IndividualListing` (it duplicates server state and leaves the cache stale).

## React Hook Form Migration

### Addressed

- Migrated home search, login, sign up, comment, listing upload, and image upload forms from hand-rolled `useState` validation to React Hook Form.
- Upload steps validate with `trigger` before advancing; values persist when navigating back between steps.
- Contact validation (phone or email required) reads the other field from validator form values; sign-up password confirmation does the same.
- Server errors are read from mutation state (`isError`) instead of form errors, so failed submissions can be retried.
- The upload form is one React Hook Form (shared via `FormProvider`) with per-step `trigger` validation (`STEP_FIELDS`), inline rules on each input, and on-change re-validation. The location step adds a zip code and verifies the address through the server's `/geocode` route before continuing.
- The image is its own step (`UploadPage4`) inside the same upload form. The client sends one multipart `POST /listings` (listing JSON plus image) and the server's multer middleware handles the image before creating the listing; the separate image upload form and `/listings/:id/images` route are removed.
- Removed the unused start/end date inputs from the home search.
- `CommentSection` owns the create-comment mutation; a failed review keeps the draft, and Cancel clears both the form and the error.
- Submit buttons are disabled while their mutation is pending, preventing duplicate listings and reviews.
- Sign up no longer sends `confirmPassword` to the API.
- Upload form values contain only form fields; `name` and `coordinates` are added when building the request, and the server adds `id`, `comments`, and `images`.
- Login shows "Invalid login credentials" for 400/401 responses and a generic error otherwise.
- Home search trims whitespace and treats a whitespace-only location as missing.
- Home search is disabled while listings load and shows an error if they fail.
- Fixed form copy and label bugs: login username error text, sign-up name error text, label `htmlFor` targets, and redundant `name` attributes.
- Added tests for: sign up (validation, mismatch, success payload, failure), login (validation, failure, generic failure, retry), home search (missing, no listings, whitespace, loading, error), comments (validation clearing, cancel, payload, failure, retry), and upload (each step's validation, contact rules, payload, phone-only, geocode failure and retry, back navigation, pending state, image validation, image failure, post-upload navigation).

## Known Bugs

- `/login` and `/register` routes in `App.tsx` render `Login` and `SignUp` without props. Visiting either URL and clicking Cancel throws, and a successful login stores the token and then throws on `setShowLogin`. Nothing links to these routes (the header uses modals), so remove them and let the catch-all redirect to `/home`.
- New listings and seed data store `rentPeriod` and `price` differently. Seed data uses `'Daily, Weekly, Monthly'` and `'$30'`; the upload form sends `['Daily', 'Weekly']` and `'25'`. Cards and the detail page render `rentPeriod` directly, so new listings show "DailyWeekly" and prices without `$`. Pick one format (ideally as part of stricter domain types) and migrate the seed data; until then, join arrays when displaying.
- Deleting a comment and adding/removing a favorite fail silently (`console.log` only) and are not disabled while pending. Show an error and disable the control during the request.
- The server's `/geocode` route proxies Google with the server's API key and has no authentication or rate limiting, so anyone can spend the key's quota. Cover it with the planned rate limiting and auth work.
