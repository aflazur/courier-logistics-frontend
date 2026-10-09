# Courier & Logistics Platform — Frontend

B7A7 assignment. A Next.js App Router frontend consuming the real B7A6 backend API. No mock data
in any core workflow.

| | |
|---|---|
| Live frontend | https://courier-logistics-frontend-delta.vercel.app |
| Live backend | https://courier-logistics-backend.vercel.app |
| Frontend repo | https://github.com/aflazur/courier-logistics-frontend |
| Backend repo | https://github.com/aflazur/courier-logistics-backend |
| API docs | https://documenter.getpostman.com/view/54821626/2sBYAxP9DV |

## Stack
Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · TanStack Query · Zustand ·
React Hook Form + Zod · Radix primitives (hand-built shadcn-style components) · Recharts · Sonner ·
SSLCommerz (sandbox, through the backend)

## Roles and demo accounts
Three roles: **Customer**, **Courier** (`/provider`), **Admin**. The login page has one-click
**Demo Login** buttons for each role. Credentials are used server-side only (`/api/auth/demo-login`).

| Role | Email | Password |
|---|---|---|
| Admin | admin@courier.com | Admin123! |
| Customer | customer@test.com | password123 |
| Courier | courier@test.com | password123 |

These are demo-only accounts created for evaluation.

## End-to-end workflow
1. **Customer** books a shipment (3-step wizard) and pays through SSLCommerz.
2. The payment is verified on the backend; the shipment moves to `PICKUP_SCHEDULED`.
3. **Admin** assigns an available courier from `/admin/manage`.
4. **Courier** advances the status step by step (picked up, hubs, in transit, out for delivery,
   delivered). Every change is written to the shipment timeline and the admin audit log.
5. **Customer** follows the timeline; the **Courier** earnings page updates on delivery.

## Architecture
**Server Components by default.** Every `page.tsx` is a Server Component (static `metadata`,
`Suspense` and a skeleton fallback). Interactive parts are small client islands in
`src/components` (`views/`, `admin/`, `forms/`). No `page.tsx` is marked `'use client'`.

**Auth is a BFF pattern.** JWT access and refresh tokens live in **httpOnly cookies**, never in
client JavaScript.
1. `src/app/api/auth/*` call the backend server-to-server and set the cookies.
2. `src/app/api/proxy/[...path]` forwards every client request with the Bearer token and
   transparently refreshes an expired token, then retries once.
3. `src/middleware.ts` protects `/admin`, `/provider` and `/dashboard` by role, and renews an
   expired access token before the page renders, so Server Components never see a missing token
   (this prevents a login redirect loop).
4. `src/lib/server-api.ts` lets Server Components call the backend directly with the same cookie.

Role protection is layered: middleware redirects wrong-role users, the sidebar shows only the
links for the current role, and the backend re-checks the role on every request (the real security
boundary).

**Payment relay.** SSLCommerz posts to `/api/payments/{success,fail,cancel}` on this frontend. The
route forwards `tran_id` / `val_id` to the backend, which re-validates with SSLCommerz before
marking anything paid, then redirects the browser to `/payment/success` or `/payment/cancel`.

**URL state.** Search, status/role filters, pagination and sorting use `useSearchParams`, so any
view can be bookmarked or shared (e.g. `/admin/manage?page=2&status=PENDING`).

**Forms.** React Hook Form + Zod on every form, with rules matching the backend validation.

**Images.** Hero illustration uses `next/image`.

## Routes (26 pages)
```
Public      /  /about  /services  /pricing  /contact
Auth        /login  /register
Admin       /admin  /admin/manage  /admin/manage/[id]  /admin/users  /admin/hubs  /admin/reports
Customer    /dashboard  /dashboard/shipments/new  /dashboard/shipments/[id]
            /dashboard/payments  /dashboard/profile
Courier     /provider  /provider/shipments/[id]  /provider/earnings  /provider/profile
Payment     /payment/success  /payment/cancel
Utility     not-found.tsx  error.tsx  loading.tsx on every data page
```

## Requirement checklist
| Requirement | Where |
|---|---|
| App Router, Server Components, layouts, `loading.tsx`, `error.tsx` | all routes |
| Role-based auth, middleware, role-based UI | `middleware.ts`, `nav-items.ts`, role layouts |
| One-click demo login for 3 roles | `/login` |
| TanStack Query, skeletons, error handling, toasts | `src/hooks`, `components/shared` |
| Zustand | auth store and sidebar UI store |
| React Hook Form + Zod | `src/components/forms`, `src/lib/validations.ts` |
| SSLCommerz payment with success/cancel flow | `/api/payments/*`, `/payment/*` |
| URL-synced filter, sort, search, pagination | all list pages |
| Multi-step wizard | `/dashboard/shipments/new` |
| Admin CRUD | `/admin/hubs` (create, edit, delete), `/admin/users` (role, status) |
| Charts | `/admin` overview, `/provider/earnings` |
| Reusable components and hooks | `ShipmentTable`, `StatusBadge`, `StatCard`, `Pagination`, `useDebounce` |
| SEO metadata | page-level `metadata` and Open Graph |

## Run locally
```bash
npm install
cp .env.example .env.local     # set BACKEND_API_URL, e.g. https://courier-logistics-backend.vercel.app/api/v1
npm run dev
```

### Backend configuration for payments
In the backend's environment (Vercel), point SSLCommerz at this frontend:
```
SSLCZ_SUCCESS_URL=https://courier-logistics-frontend-delta.vercel.app/api/payments/success
SSLCZ_FAIL_URL=https://courier-logistics-frontend-delta.vercel.app/api/payments/fail
SSLCZ_CANCEL_URL=https://courier-logistics-frontend-delta.vercel.app/api/payments/cancel
```
`SSLCZ_IPN_URL` stays on the backend (server-to-server, no UI).

## Notes
- The contact form validates input and opens the visitor's mail client (the backend has no
  contact-message endpoint).
- The backend limits `/auth` requests per IP; avoid spamming demo login while recording.