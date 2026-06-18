# 🔥 Hua — Goal Setting for African Freelancers

A modern SaaS dashboard for setting goals, tracking progress, and building accountability habits. Built for African freelancers and small business owners.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + inline design tokens |
| State | Zustand + Immer |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Fonts | Space Grotesk (headings) · Poppins (body) |

---

## Project Structure

```
hua-app/
├── app/                        # Next.js App Router pages
│   ├── landing/                # Public landing page
│   ├── auth/
│   │   ├── login/              # Sign in page
│   │   └── signup/             # Sign up page
│   ├── dashboard/              # Main dashboard
│   ├── goals/
│   │   ├── page.tsx            # Goals list (filterable, searchable)
│   │   └── [id]/page.tsx       # Goal detail with step management
│   ├── progress/               # Progress charts & breakdown
│   ├── guide/                  # Freelancer resource guides
│   └── profile/                # User profile & settings
│
├── components/
│   ├── ui/                     # Primitive components (Badge, Modal, etc.)
│   ├── goals/                  # Goal-specific components
│   │   ├── CreateGoalModal.tsx # Full goal creation form
│   │   ├── GoalCard.tsx        # Reusable goal card with actions
│   │   └── StepList.tsx        # Interactive step checklist
│   └── layout/
│       ├── AppShell.tsx        # Root layout with auth guard
│       ├── Sidebar.tsx         # Collapsible navigation sidebar
│       └── TopBar.tsx          # Sticky top navigation bar
│
├── hooks/
│   └── useGoals.ts             # Memoized selectors & action hooks
│
├── store/
│   ├── goalStore.ts            # Zustand store: goals + steps CRUD
│   └── authStore.ts            # Zustand store: auth + profile
│
├── lib/
│   ├── supabase.ts             # Supabase client singleton
│   ├── db.ts                   # All database operations (abstracted)
│   └── schema.sql              # Supabase SQL schema (run once)
│
└── types/
    └── index.ts                # All TypeScript types & interfaces
```

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo>
cd hua-app
npm install
```

### 2. Run in Demo Mode (no database needed)

The app works out of the box without Supabase. Data is stored in `localStorage`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — click **View demo** or **Log in** to access the dashboard.

### 3. Connect Supabase (production)

1. Create a free project at [supabase.com](https://supabase.com)
2. In the Supabase **SQL Editor**, paste and run the contents of `lib/schema.sql`
3. Copy your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server — the app now uses real auth and Supabase database.

---

## Features

### Goals
- ✅ Create goals with title, description, category, priority, deadline, color
- ✅ Edit goal title, description, deadline inline on the detail page
- ✅ Change goal status (active / completed / paused / archived)
- ✅ Delete goals with confirmation
- ✅ Filter by status or priority; search by title/category
- ✅ Progress percentage auto-calculated from steps

### Steps / Milestones
- ✅ Add unlimited steps to any goal
- ✅ Toggle step completion (optimistic update)
- ✅ Double-click any step to rename it inline
- ✅ Delete individual steps
- ✅ Goal auto-marks as "completed" when all steps are checked

### Dashboard
- ✅ Stats: active goals, completed, avg progress, streak
- ✅ Real-time data from Zustand store
- ✅ Quick-create goal from dashboard

### Auth
- ✅ Sign up with name, email, password, role
- ✅ Sign in with email + password
- ✅ Auth guard — redirects unauthenticated users to login
- ✅ Demo mode — works without Supabase

---

## Demo Mode vs Supabase Mode

| | Demo Mode | Supabase Mode |
|---|---|---|
| Auth | Fake (always succeeds) | Real email/password auth |
| Data storage | `localStorage` | PostgreSQL via Supabase |
| Multi-device sync | ❌ | ✅ |
| Data persistence | Browser only | Cloud |
| Row-level security | N/A | ✅ Per-user isolation |

The app automatically detects which mode to use based on whether `NEXT_PUBLIC_SUPABASE_URL` is set.

---

## Design System

```
Primary:    #02066F  (deep navy)
Secondary:  #FFA500  (amber/orange — CTA, accents)
Background: #0A0F3C  (dark navy)
Text:       #FFFFFF
Success:    #22c55e
Danger:     #ef4444
```

---

## Adding Supabase Auth Middleware (production hardening)

Create `middleware.ts` in the project root:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/goals") ||
    request.nextUrl.pathname.startsWith("/progress") ||
    request.nextUrl.pathname.startsWith("/guide") ||
    request.nextUrl.pathname.startsWith("/profile");

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```
