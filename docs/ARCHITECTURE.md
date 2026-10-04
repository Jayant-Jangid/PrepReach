# PrepReach Platform Architecture

PrepReach is a regional government examination bootcamp platform organized as a monorepo workspace.

## Monorepo Layout

- `apps/server`: Express.js + Mongoose REST API service.
- `apps/web`: Next.js 14 App Router frontend with Tailwind CSS.
- `packages/shared`: Shared TypeScript type definitions, constants, and utilities.
- `docs/`: Technical specifications, architecture decision records, and API contracts.

## Technology Stack

- **Runtime:** Node.js (>= 18.0.0)
- **Package Manager:** pnpm 9.15.4
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Frontend:** Next.js 14, React 18, Tailwind CSS, Zustand
- **Backend:** Express.js, JWT, bcryptjs, SendGrid HTTPS API
