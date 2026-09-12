# ZM FactoryOS

FactoryOS is the operational workspace for ZM Printing & Design Ltd., connecting factory jobs, clients, departments, billing, accounting, and management visibility.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (provided by the Replit database)
- Authentication env: set `SESSION_SECRET` plus `INITIAL_MD_USERNAME` and `INITIAL_MD_PASSWORD` before first login. Optional `INITIAL_MD_NAME` and `INITIAL_MD_EMAIL` customize the one-time Master MD record.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/zm-factoryos/src/App.tsx` — React/Vite routes, layout, dashboards, forms, and data views
- `artifacts/zm-factoryos/src/index.css` — FactoryOS light theme, typography, and responsive utilities
- `artifacts/api-server/src/routes/factory.ts` — authenticated factory operations and dashboard endpoints
- `lib/db/src/schema/index.ts` — Drizzle/PostgreSQL tables, enums, indexes, and insert validation schemas
- `lib/api-spec/openapi.yaml` — API contract source for generated client and Zod types

## Architecture decisions

- Keep the existing pnpm workspace and React/Vite + Express + Drizzle stack; do not migrate the imported project to a different framework.
- Keep human-readable job and invoice numbers separate from UUID primary keys.
- Treat the database and API as the source of truth for operational and financial values; the client consumes generated API contracts.
- Protect factory routes with database-backed server sessions and keep health checks available without authentication. Passwords use scrypt hashes; the Master MD is created once from environment values and employee accounts are invite-only.

## Product

The current first slice includes the public factory overview, management dashboard, reception job intake and register, job timelines/status updates, client records, billing, accounting, users, notifications, audit activity, and catalog settings. Future work should deepen permissions, workflow configuration, financial integrity, reporting, and the remaining factory departments.

## User preferences

Follow the attached ZM FactoryOS master prompt: prioritize architecture, security, database integrity, workflow correctness, and clear factory-first language.

## Gotchas

- The API workflow listens on the managed `PORT` (currently 8080); do not hardcode port 5000 in application code.
- Authenticated API routes require managed Clerk configuration. Without it, `/api/healthz` remains available and protected routes return 401.
- The account system intentionally has no public signup route. Master MD/Admin-only user creation accepts a temporary password and marks the employee for a forced password change.
- Run `pnpm install --frozen-lockfile` after importing the project before restarting workflows.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
