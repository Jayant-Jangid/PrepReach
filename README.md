# PrepReach — Regional Government Exam Bootcamps

> **Target Exam Categories:** Civil Service, Public Banking, Railway, Municipal  
> **Architecture:** Monorepo Workspace (pnpm 9) · Next.js 14 · Express.js · MongoDB Atlas

---

## 🏗️ Project Structure

```
prepreach/
├── apps/
│   ├── server/                         # Express.js REST API
│   │   ├── package.json
│   │   └── .env.example
│   └── web/                            # Next.js 14 App Router Frontend
│       ├── package.json
│       └── .env.example
├── packages/
│   └── shared/                         # Shared TypeScript types & constants
├── docs/                               # System architecture documentation
├── package.json                       # Monorepo root scripts & dev tools
├── pnpm-workspace.yaml                 # Workspace package definitions
└── turbo.json                         # Turborepo task pipelines
```

---

## 🎨 Brand Design Tokens

- **Primary Brand:** `#524C73` (Grayish Lavender)
- **Accent Action:** `#B85324` (Cinnamon Rufous)
- **Background Slate:** `#F8F9FA` (Clean institutional canvas)
- **Text Contrast:** `#1A1A2E` (Deep navy text)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Files
Copy the example environment files and supply the required values:
```bash
cp apps/server/.env.example apps/server/.env.local
cp apps/web/.env.example apps/web/.env.local
```

### 3. Start Development
```bash
pnpm dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend Web App:** `http://localhost:3000`
