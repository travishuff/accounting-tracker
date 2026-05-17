# Banana Tracker

![Version](https://img.shields.io/github/package-json/v/travishuff/accounting-tracker?label=version)

A small React 19 single-page app for tracking a banana inventory: record
purchases, sell from inventory under a 10-day freshness window, browse the
historical ledger, and inspect margin scenarios.

The companion backend lives at
[banana-backend](https://github.com/travishuff/accounting-tracker-backend) and
exposes the REST API this app consumes.

## Stack

- React 19 (concurrent + lazy routes)
- React Router 7 (`createBrowserRouter`, route loaders, `useRevalidator`)
- TypeScript 5
- Vite 7 (dev server + build)
- Bun 1.3.14+ (package manager and script runner)
- Vitest 4 + Testing Library (jsdom)
- ESLint 9 (flat config) + Prettier 3

## Requirements

- Bun `1.3.14+`
- No external services are required; the app talks to a locally running
  `banana-backend` API by default.

If you need Bun, install or upgrade it first:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Quick start

```bash
bun install
bun run dev
```

Vite serves the app on localhost and prints the active URL in the terminal.
The backend must be running separately — by default the app talks to
`http://localhost:8080`.

## Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `bun run dev`           | Vite dev server with HMR             |
| `bun run build`         | Production build to `dist/`          |
| `bun run preview`       | Preview the production build locally |
| `bun run test`          | Run the Vitest suite once            |
| `bun run test:watch`    | Vitest in watch mode                 |
| `bun run test:coverage` | Vitest with v8 coverage reporting    |
| `bun run lint`          | ESLint over the project              |
| `bun run format`        | Prettier write                       |
| `bun run format:check`  | Prettier check                       |
| `bun run typecheck`     | `tsc --noEmit`                       |

## Routes

The router lives in [src/router.tsx](src/router.tsx). All routes nest under an
`AppLayout` shell with a top nav, and the inventory routes use React Router
loaders so the data is fetched before the component renders.

| Path         | Component                      | Loader        | Purpose                                                     |
| ------------ | ------------------------------ | ------------- | ----------------------------------------------------------- |
| `/`          | [Home](src/Home.tsx)           | —             | Landing page                                                |
| `/buy`       | [Buy](src/Buy.tsx)             | —             | Submit a purchase (`number`, `buyDate`)                     |
| `/sell`      | [Sell](src/Sell.tsx)           | `listBananas` | Submit a sale; preview eligible inventory before submitting |
| `/list`      | [FullList](src/FullList.tsx)   | `listBananas` | Flat ledger of every banana                                 |
| `/groups`    | [GroupList](src/GroupList.tsx) | `listBananas` | Bananas grouped by buy/sell-date pairs                      |
| `/analytics` | [Analytics](src/Analytics.tsx) | `listBananas` | Date-range filter, margin scenarios, expired inventory      |

After a successful `Buy` or `Sell` submission, the page calls
`useRevalidator().revalidate()` so the loader re-fetches and dependent views
stay in sync.

## Configuration

The frontend reads one env variable at build time:

| Variable            | Default                 | Description                      |
| ------------------- | ----------------------- | -------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Origin of the banana-backend API |

To point at a different backend, create a `.env` file at the repo root:

```bash
VITE_API_BASE_URL=https://api.example.com
```

A trailing slash on the value is stripped before requests are made.

## Backend API

All requests go through [src/api/bananas.ts](src/api/bananas.ts). The app
expects banana-backend's contract:

| Method   | Path                 | Body                   | Success | Notes                                                                          |
| -------- | -------------------- | ---------------------- | ------- | ------------------------------------------------------------------------------ |
| `GET`    | `/api/bananas`       | —                      | `200`   | Returns every banana, sorted by insertion order                                |
| `POST`   | `/api/bananas`       | `{ number, buyDate }`  | `201`   | Returns the bananas created by this request                                    |
| `POST`   | `/api/bananas/sales` | `{ number, sellDate }` | `201`   | Atomic — fails with `409 Conflict` if fewer than `number` bananas are eligible |
| `DELETE` | `/api/database`      | —                      | `200`   | Deletes all banana records and returns `{ deleted }`                           |

Error responses follow the envelope `{ "error": "human-readable message" }`.
The API client surfaces `data.error` directly to the UI; the `Sell` page, for
example, renders the backend's 409 message verbatim so the user sees why the
sale was rejected.

A banana object looks like:

```ts
type Banana = {
  id: string // UUID v4 assigned by the server
  buyDate: string // ISO date, YYYY-MM-DD
  sellDate: string | null // ISO date once sold; null while in inventory
}
```

## Sell eligibility

The backend enforces the canonical rule and is the source of truth, but the
[`Sell`](src/Sell.tsx) page also computes eligibility client-side so the form
can preview the count before submitting. A banana is **eligible to sell on
`sellDate`** when:

- it has not already been sold,
- its `buyDate` is on or before `sellDate`, and
- fewer than 10 days have elapsed between `buyDate` and `sellDate` (the
  freshness window — see `BANANA_SHELF_LIFE_DAYS` in
  [src/lib/date.ts](src/lib/date.ts)).

If the user requests more bananas than the eligible count, the form blocks
submission. As a backstop, the server returns `409 Conflict` and the page
renders the server's error message.

## Testing

```bash
bun run test
```

Tests use **Vitest** with the jsdom environment and React Testing Library.
The Buy and Sell suites stub `fetch` (`vi.stubGlobal`) so they exercise the
component → API client path without a live backend. Each suite asserts both
the rendered behavior and the outgoing request shape (URL, method, body), so
contract drift with the backend is caught here.

## Linting, formatting, type-checking

```bash
bun run lint
bun run format         # write
bun run format:check   # check only
bun run typecheck
```

## Versioning

Every merged PR bumps the version automatically based on labels:

- `semver:major`
- `semver:minor`
- `semver:patch` (default if no semver label is applied)
