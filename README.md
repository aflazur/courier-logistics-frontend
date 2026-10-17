# 🚚 Courier & Logistics Platform — Frontend

A role-based courier management web app built with Next.js (App Router). Customers book and pay for shipments, admins assign couriers, and couriers update delivery status step by step, all against a real backend API with no mock data.

[🌐 Live Site](https://courier-logistics-frontend-delta.vercel.app) • [⚙️ Live API](https://courier-logistics-backend.vercel.app) • [📚 API Docs](https://documenter.getpostman.com/view/54821626/2sBYAxP9DV)

![Courier & Logistics Platform](./public/Courier-hero-page.png)


## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, Radix UI primitives, class-variance-authority |
| Data fetching | TanStack Query |
| State | Zustand |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts (bar, line, pie) |
| AI | Google Gemini API (server-side route handlers) |
| Social login | Google OAuth 2.0 (via the backend) |
| Notifications | Sonner |
| Payment | SSLCommerz (sandbox, via backend) |
| Deployment | Vercel |

## ✨ Core Features

**Public site**
- 🏠 Home page with an interactive hero slider and 11 sections (stats, features, how it works, live hub network, roles, pricing, security, FAQ, newsletter, CTA)
- 🗺️ **Hubs explorer** (`/hubs`): 4-per-row cards with skeleton loading, search, city and zone filters, sorting, pagination, and a public **details page** (`/hubs/[id]`) with related hubs
- 🌗 Light / dark mode (saved in the browser, no flash on load) with a restrained 3-colour palette
- 📱 Fully responsive, plus Help, Privacy and Terms pages

**Authentication**
- 🔐 Role-based access for **Customer**, **Courier** and **Admin**, with route protection
- 🔑 JWT in httpOnly cookies (BFF pattern with automatic token refresh)
- ⚡ One-click **Demo Login** for all three roles
- 🔵 **Continue with Google** social login (new Google users become customers)

**Dashboards**
- 📦 3-step shipment booking wizard with SSLCommerz payment
- 🕒 Live shipment status timeline, updated step by step by the courier
- 🛠️ Admin panel: assign couriers, manage users, hubs (full CRUD), audit logs and reports
- 📊 Overview cards plus **Bar, Line and Pie** charts on the admin overview, earnings chart for couriers
- 🔎 URL-synced search, status filter, date range filter, sort and pagination on every table
- 👤 Profile dropdown (Dashboard / Profile / Log out) and a Profile page for every role

**AI features (Google Gemini)**
- 💬 **Ask AI** chat assistant on every page: answers questions about tracking, delivery fees, statuses and cancellation
- 📈 **AI shipment insights** (admin overview): unusual-day detection, stalled and unassigned shipments, and a recommended action, computed from live data and summarised by the model

**Quality**
- ♿ Loading skeletons, error boundaries, toasts and SEO metadata on all pages

## 🧭 Dashboard Menus

| Role | Sidebar items |
|---|---|
| Customer | My Shipments, New Shipment, Payments, Profile |
| Courier | My Deliveries, Earnings, Profile |
| Admin | Overview, Shipments, Users, Hubs, Audit Logs, Profile |

## 👥 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@courier.com | Admin123! |
| Customer | customer@test.com | password123 |
| Courier | courier@test.com | password123 |

These are demo-only accounts created for evaluation.

## 📦 Dependencies

**Production:** next, react, react-dom, @tanstack/react-query, zustand, react-hook-form, @hookform/resolvers, zod, recharts, sonner, lucide-react, date-fns, js-cookie, clsx, tailwind-merge, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-select, @radix-ui/react-slot, @radix-ui/react-tabs, server-only

**Development:** typescript, tailwindcss, @tailwindcss/postcss, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, @types/node, @types/react, @types/react-dom, @types/js-cookie

## 🚀 Run Locally

**Prerequisites:** Node.js 18+ and npm

1. Clone the repository
   ```bash
   git clone https://github.com/aflazur/courier-logistics-frontend.git
   ```
2. Go to the project folder
   ```bash
   cd courier-logistics-frontend
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Create your environment file
   ```bash
   cp .env.example .env.local
   ```
5. Set the backend URL in `.env.local`
   ```env
   BACKEND_API_URL=https://courier-logistics-backend.vercel.app/api/v1

   # AI features (free key from https://aistudio.google.com/apikey)
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   Without `GEMINI_API_KEY` the rest of the app works; only the AI chat and insights return an error message.
6. Start the dev server and open http://localhost:3000
   ```bash
   npm run dev
   ```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`.

## 🔵 Google Login Setup

Google sign-in runs through the backend ([repo](https://github.com/aflazur/courier-logistics-backend)). In the backend `.env` set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (`<backend>/api/v1/auth/google/callback`) and `FRONTEND_URL` (this app's URL). Add the same callback URL under *Authorized redirect URIs* in Google Cloud Console. Flow: button → `/api/auth/google` → Google → backend callback → `/api/auth/google/complete`, which stores the tokens in httpOnly cookies and redirects to the role's dashboard.

## 🔗 Links

| | |
|---|---|
| Live frontend | https://courier-logistics-frontend-delta.vercel.app |
| Live backend | https://courier-logistics-backend.vercel.app |
| Backend repo | https://github.com/aflazur/courier-logistics-backend |
| API docs | https://documenter.getpostman.com/view/54821626/2sBYAxP9DV |
| Frontend repo | https://github.com/aflazur/courier-logistics-frontend |

## 👨‍💻 Author

**Aflazur Rahaman** — Full Stack Web Developer
GitHub: [@aflazur](https://github.com/aflazur)