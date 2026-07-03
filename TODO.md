# Project TODO

## Current Status

- Client has been migrated from CRA to Vite.
- Client has been migrated to TypeScript with permissive compiler settings.
- Frontend tests now use Vitest, React Testing Library, and MSW.
- Tests are colocated near the pages/components that own the behavior.
- Shared test utilities exist for MSW request mocking and provider/router rendering.

## Next Steps

1. Commit the current frontend test and test utility changes.
2. Install and configure TanStack Query in the client.
3. Add `QueryClientProvider` at the app root.
4. Extend `renderWithProviders` with a test `QueryClient`.
5. Migrate read requests to query hooks:
   - listings
   - favorites
   - individual listing data
   - geocoding data
6. Migrate write requests to mutation hooks:
   - login
   - add/remove favorite
   - create/delete comment
   - upload listing
7. Extract repeated frontend logic into custom hooks.
8. Remove unnecessary `useEffect` usage after query migration.
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
