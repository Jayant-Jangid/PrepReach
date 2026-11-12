# PrepReach — Regional Government Exam Bootcamps

> **45% Development Benchmark Milestone Reached**  
> **Tech Stack:** Next.js 14 · Node.js + Express.js · MongoDB

---

## 🏗️ Architecture & Project Structure

This monorepo contains both the frontend and backend services:

```
prepreach/
├── apps/
│   ├── server/                         # Express.js REST API
│   │   ├── src/
│   │   │   ├── config/                # DB (Mongoose) & Environment config
│   │   │   ├── controllers/           # Auth, Course, Enrollment controllers
│   │   │   ├── middleware/            # JWT protect, Role check, Validator, Error handler
│   │   │   ├── models/                # User, Course, Module, Enrollment, OTP schemas
│   │   │   ├── routes/                # Express API routes
│   │   │   ├── services/              # SendGrid email & OTP services
│   │   │   ├── utils/                 # Token generator & API response formatters
│   │   │   └── index.js               # Server entry point
│   │   ├── .env.local                 # Secret environment variables (SendGrid, Mongo, JWT)
│   │   └── package.json
│   └── web/                            # Next.js 14 App Router Frontend
│       ├── app/
│       │   ├── (auth)/                # Login, Register, 6-box OTP verification
│       │   ├── (student)/             # Dashboard, Course catalog, Details, Learning room
│       │   ├── (instructor)/          # Dashboard, 3-step Course creation wizard
│       │   ├── (admin)/               # Admin management portal
│       │   ├── globals.css            # Tailwind directives & PrepReach brand palette
│       │   ├── layout.tsx             # Root layout with Inter font & Toaster
│       │   └── page.tsx               # High-converting Landing Page
│       ├── components/
│       │   ├── course/                # CourseCard, Grid, Filters, ModuleAccordion, VideoPlayer
│       │   ├── dashboard/             # ProgressCard, StatsCard
│       │   ├── layout/                # Navbar (role-aware), Sidebar, Footer
│       │   └── ui/                    # Button, Input, Card, Badge, Modal, Avatar, ProgressBar, OTPInput
│       ├── lib/                       # Axios client with interceptors, Auth cookie helpers, utils
│       ├── store/                     # Zustand stores (Auth & Course)
│       ├── types/                     # TypeScript definitions
│       ├── middleware.ts              # Route protection middleware
│       └── package.json
├── package.json                       # Monorepo root scripts
└── pnpm-workspace.yaml
```

---

## 🎨 Brand Design & System

- **Primary Color:** `#8B85C1` (Grayish Lavender)
- **Accent Color:** `#C4622D` (Cinnamon Rufous)
- **Background:** `#F9F8FF` (Subtle Lavender-tinted white)
- **Text:** `#1A1A2E` (Deep navy contrast)
- **Target Exam Categories:** Civil Service, Public Banking, Railway, Municipal

---

## 🚀 Getting Started

### 1. Install Dependencies
In the root directory, install the monorepo packages:
```bash
pnpm install
```

### 2. Configure SendGrid API Key
Open [apps/server/.env.local](file:///C:/Users/Jayant/miscellaneous/random/prepreach/apps/server/.env.local) and replace the placeholder with your verified SendGrid credentials:
```env
SENDGRID_API_KEY=SG.your_actual_key_here
SENDGRID_FROM_EMAIL=your_verified_sender@email.com
```

### 3. Ensure Local MongoDB is Running
```bash
mongod
```

### 4. Run Development Servers
You can run both backend and frontend concurrently:
```bash
pnpm dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend Web App:** `http://localhost:3000`
