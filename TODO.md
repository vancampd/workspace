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

## Next Steps

1. Commit the current frontend test and test utility changes.
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
- Result: all client HTTP calls now go through `src/api`, server state uses TanStack Query hooks, and `client/src` no longer has `useEffect` calls.
- Verification: `npm test`, `npm run typecheck`, and `npm run build` passed after each cleanup slice.

### Remaining Frontend Follow-ups

- Add stronger TypeScript types for API payloads and query/mutation hook return data.
- Consider grouping related query/mutation hooks by feature if the hook folders grow.
- Add tests for registration and the successful upload flow.
- Consider replacing `alert` in `SignUp` with app-level feedback UI.
- Keep form-state extraction for a later pass; current forms still have local validation logic in components.
- Refactor `UploadPage` into a form hook with schema-based validation and smaller step components.
- Refactor `IndividualListing` into smaller hooks/components for listing media, favorites, and comments.
- Refactor `ListingsPage` into smaller hooks/components for loading states, favorites view, and city listing/map behavior.
- Refactor `SignUp` to use shared form validation patterns, clearer error handling, and app-level success feedback.
