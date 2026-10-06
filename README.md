# Courier & Logistics Platform — Frontend

B7A7 Assignment. A Next.js App Router frontend consuming the real B7A6 backend API — no mock
data anywhere in the core workflows.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · TanStack Query · Zustand ·
React Hook Form + Zod · Radix primitives (hand-built shadcn-style components, not the CLI,
since its registry isn't reachable from a sandboxed build environment) · Recharts

## Architecture — the parts worth explaining in your video

**Auth is a BFF (Backend-for-Frontend) pattern, not a direct client to backend call.** The JWT
access/refresh tokens live in **httpOnly cookies** that client-side JavaScript can never read.
Three pieces make this work:

1. `src/app/api/auth/{login,register,demo-login,logout}/route.ts` - call the real backend
   server-to-server, then set httpOnly cookies. The browser only ever receives the user object,
   never the tokens.
2. `src/app/api/proxy/[...path]/route.ts` - every authenticated Client Component request goes
   through here. It reads the httpOnly access token, attaches it as a Bearer header, forwards to
   the backend, and **transparently refreshes an expired token and retries once** before giving
   up - so a 15-minute access token doesn't kill an interactive session.
3. `src/lib/server-api.ts` - Server Components skip the proxy entirely and call the backend
   directly (no CORS boundary to route around server-side), reading the same httpOnly cookie.

**Two auth files, split deliberately - this is also a real bug I hit and fixed.** `lib/session.ts`
imports `next/headers` (server-only). `lib/auth-shared.ts` holds the pure pieces (`roleHomePath`,
cookie name, the `SessionUser` type) that Client Components also need. Originally these were one
file - the build failed because importing `roleHomePath` from a client component pulled the
entire `next/headers`-dependent module into the browser bundle. Splitting it, and adding the
`server-only` package to `session.ts` so this fails loudly at build time instead of silently
shipping broken code, fixed it for good.

**Role protection is defense-in-depth, not the only line of defense.** `middleware.ts` reads a
small **non-httpOnly** cookie (`{id, name, email, role}` only - never the JWT) to redirect
before a wrong-role page even renders. The backend's own `auth()` middleware re-checks role
independently on every request regardless of what this cookie says - that's the real security
boundary; the frontend check is purely a UX nicety.

**Payment success/cancel is a relay, not a reimplementation.** SSLCommerz's `SSLCZ_SUCCESS_URL`
etc. must point at `api/payments/success` **on this frontend**, not the backend directly (see
"Backend configuration" below). That route receives SSLCommerz's POST, hands `tran_id`/`val_id`
to the backend's real verification endpoint (which independently re-validates with SSLCommerz
before marking anything paid - same logic as the B7A6 backend), then redirects the browser to a
GET page for display. Verification itself always happens on the backend; this route is UX only.

## Setup

```bash
cd courier-frontend
npm install
cp .env.example .env.local      # set BACKEND_API_URL to your running backend
npm run dev
```

### Demo accounts (required for the one-click login buttons)
The backend's seed script only creates the **admin** account. Register the customer and courier
demo accounts once through `/register` (or reuse the ones you already created while testing the
backend - `customer@test.com` / `password123` and `courier@test.com` / `password123` match the
`.env.example` defaults):

```
Admin:    admin@courier.com / Admin123!
Customer: customer@test.com / password123
Courier:  courier@test.com / password123
```

### Backend configuration needed for the payment flow to redirect correctly
In the **B7A6 backend's** `.env` (and Vercel env vars once deployed), point these at this
frontend's deployed URL instead of the backend itself:
```
SSLCZ_SUCCESS_URL=https://<your-frontend-url>/api/payments/success
SSLCZ_FAIL_URL=https://<your-frontend-url>/api/payments/fail
SSLCZ_CANCEL_URL=https://<your-frontend-url>/api/payments/cancel
```
`SSLCZ_IPN_URL` can stay pointed at the backend directly - IPN is server-to-server and has no UI.

## What's implemented

| Requirement | Status |
|---|---|
| App Router: Server Components by default, `layout.tsx`/`loading.tsx`/`error.tsx` throughout | Done - the three list pages marked `'use client'` at the top (`admin/manage`, `dashboard`, `provider`) are a deliberate exception: URL-synced filters + live mutations need it, documented inline in each file |
| Role-based auth, middleware-protected routes, role-based UI rendering | Done |
| One-click demo login (3 roles) | Done |
| TanStack Query data fetching + loading skeletons + error boundaries | Done |
| React Hook Form + Zod on every form, matching backend validation rules | Done |
| Payment integration (SSLCommerz success/cancel handling) | Done - see backend config note above |
| URL-synced filtering/sorting/pagination (`useSearchParams`) | Done on all three shipment list pages |
| Multi-step wizard form | Done - `/dashboard/shipments/new`, 3 steps, per-step Zod validation |
| Zustand global state | Done - auth store (session) + UI store (sidebar) |
| 18+ real, functional pages | Done - 24 page routes, see route list below |
| Reusable components, custom hooks | Done - `ShipmentTable`, `StatusBadge`, `StatCard`, `Pagination`, `FilterBar`, `useDebounce`, one query-hook file per domain |
| TypeScript strictness, no `any` | Done - clean `tsc --noEmit` |
| SEO metadata on public pages | Done |
| Responsive, mobile-first | Done - test with DevTools device mode before your video |

**Verified in this build:** `npx tsc --noEmit`, `npm run lint` (0 errors/warnings), and
`npm run build` all pass clean - 30 routes compiled successfully. (Google Fonts couldn't be
fetched in the sandboxed container this was built in - that's a network-allowlist limitation of
the build environment, not a code issue; it will resolve on your machine or on Vercel.)

## Route map

```
/                        /login                    /admin
/about                   /register                 /admin/manage
/services                                           /admin/manage/[id]
/contact                                            /admin/reports
/pricing

/dashboard                              /provider
/dashboard/profile                      /provider/earnings
/dashboard/payments                     /provider/profile
/dashboard/shipments/new                /provider/shipments/[id]
/dashboard/shipments/[id]

/payment/success          /payment/cancel           not-found.tsx + error.tsx
```

## Before you submit - things only you can do

- [ ] Deploy to Vercel, set `BACKEND_API_URL` and the `DEMO_*` env vars there
- [ ] Update the **backend's** SSLCommerz URLs to point at this frontend (see above), redeploy
      the backend
- [ ] Register (or confirm) the demo customer/courier accounts exist on your backend
- [ ] Test the full payment flow end-to-end against the **deployed** frontend + backend, not just
      locally - SSLCommerz's redirect needs real public URLs to work
- [ ] Push to your own GitHub repo with 20+ real, incremental commits
- [ ] Record your 5-10 min walkthrough - the BFF/httpOnly-cookie auth pattern and the
      `session.ts`/`auth-shared.ts` split (a real bug you can point at) are strong material for
      the "technical challenge" part of the video
- [ ] Resize the browser / use device mode on a couple of pages to show responsiveness on camera
