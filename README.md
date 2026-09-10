# PandaWorld Admin

A standalone admin dashboard for PandaWorld Apparel — **Vite + React**, styled with **Tailwind CSS** and the same hand-built shadcn/ui-style component kit as the storefront, authenticated with **Clerk**, wired to the same backend API (Express/Prisma/PostgreSQL) as the customer storefront.

This is a **separate app** from `pandaworld-frontend` (the storefront) — separate origin, separate deploy, separate `npm install`. It shares the same backend and the same Clerk application/user pool, but no code is imported between the two projects; anything both apps need (UI primitives, the API client, design tokens) is duplicated here rather than shared via a package, by design (see the parent conversation for why — simplicity over a monorepo setup).

## Setup

```bash
npm install
cp .env.example .env
# then fill in:
#   VITE_API_URL                  — same backend URL the storefront uses
#   VITE_CLERK_PUBLISHABLE_KEY     — SAME Clerk app/keys as the storefront (shared user pool)
#   VITE_STOREFRONT_URL              — where pandaworld-frontend runs, e.g. http://localhost:5173
npm run dev
```

Runs at `http://localhost:5174` (set in `vite.config.js` so it doesn't clash with the storefront's 5173). Make sure the backend's `CORS_ORIGIN` includes `http://localhost:5174`.

## Getting admin access

There's no sign-up here — admins are promoted, not self-registered:

1. Sign up as a normal customer on the **storefront** app first.
2. Bootstrap your first admin: in the [Clerk Dashboard](https://dashboard.clerk.com), open that user → **Metadata** → set Public metadata to `{ "role": "ADMIN" }`.
3. Come back here and sign in (`/sign-in`) with that same account — Clerk session tokens work across both apps since they're the same Clerk application, you just sign in separately per origin in local dev (see note below).
4. From then on, promote/demote other users directly from **Admin Users** (`/admins`) in this app — no more manual Clerk Dashboard edits needed.

A signed-in user who *isn't* an admin sees an **Access Denied** screen (not a redirect loop back to `/`, since `/` here is the dashboard itself) with a link back to the storefront.

> **Cross-origin sessions in local dev:** two separate `localhost` ports are two separate origins, so Clerk won't automatically share a session between `:5173` and `:5174` locally — you'll sign in once per app. In production, if both apps live under the same root domain (e.g. `shop.pandaworld.com` and `admin.pandaworld.com`), configure Clerk's [satellite domains](https://clerk.com/docs/advanced-usage/satellite-domains) for true single sign-on across them.

## Architecture

```
src/
├── components/
│   ├── ui/          Duplicated shadcn-style primitives (Button, Card, Dialog, Select…)
│   ├── admin/         AdminSidebar, AdminTopbar, DataTable, StatCard, ConfirmDialog, StatusBadge, PageHeader, ProductFormDialog
│   ├── product/         RatingStars (used by the Reviews placeholder page)
│   └── common/            EmptyState, LoadingSpinner, Pagination, AdminRoute
├── pages/            One file per route — this project's pages/ IS the admin section (no /admin prefix)
├── services/          products (full CRUD), orders (admin-scoped), admin (users/roles)
├── store/              authStore (current user/role), notificationsStore, promotionsStore, settingsStore
├── lib/                 api client (axios + Clerk token interceptor), utils
├── App.jsx               Routes + auth bootstrap
└── main.jsx                ClerkProvider + Router mount
```

## Pages

| Page | Route | Data source |
|---|---|---|
| Dashboard Overview | `/` | Real — stat cards (orders/customers/products) + recent orders + low-stock list, computed from existing paginated endpoints. **No charts** (see below) |
| Product Management | `/products` | Real — full CRUD via `/api/products`, including image upload |
| Categories Management | `/categories` | Real — full CRUD via `/api/categories` |
| Inventory Management | `/inventory` | Real — stock levels with inline quick-edit, low-stock filter |
| Orders Management | `/orders`, `/orders/:id` | Real — list/filter all orders, update status. Refunds are a disabled placeholder (see below) |
| Customers Management | `/customers`, `/customers/:id` | Real — list/delete customers, per-customer order history (via the backend's `?userId=` order filter) |
| Promotions & Coupons | `/promotions` | **Placeholder** — local-only (`promotionsStore`), no backend Coupon model |
| Reviews Management | `/reviews` | **Placeholder** — mock data, no backend Review model |
| Notifications Center | `/notifications` | Real, but synthesized — no Notification model, so notifications are derived from live orders + low-stock products; only read/unread state is persisted locally |
| Reports & Analytics | `/reports` | Real — tabular breakdowns (orders by status/payment, products by category) computed client-side. **No charts** |
| Admin User Management | `/admins` | Real — promote/demote via `PATCH /api/users/:id/role`, which calls Clerk's backend SDK |
| Settings | `/settings` | **Placeholder** — local-only (`settingsStore`), no backend Settings model |

**Why no charts:** the backend has no analytics/aggregation endpoint, and this build deliberately didn't add one. Dashboard and Reports show real numbers as stat cards and tabular breakdowns instead of line/pie charts. If you want charts later, add a backend endpoint that aggregates revenue over time server-side (summing across paginated orders client-side doesn't scale) and wire in a charting library.

**Refunds:** the order detail page shows a disabled "Issue Refund" button — `paymentStatus` is set automatically by PayFast's ITN webhook, and there's no refund model/endpoint yet. Process refunds via the PayFast merchant dashboard for now.

Every placeholder page has an in-app banner explaining exactly what's missing and what to add on the backend to make it real.

## Backend endpoints this app relies on beyond the storefront's

- `GET /api/users/:id` — single-user lookup, for the customer detail page
- `PATCH /api/users/:id/role` — promote/demote, admin-only, calls Clerk's backend SDK
- `GET /api/orders?userId=` — per-customer order history filter

All three are documented in the backend's own README.

## Security note

Every mutation here (product/category CRUD, order status updates, role changes, user deletion) is enforced server-side by the backend's `authorize('ADMIN')` middleware — this app's `AdminRoute` guard is a UX convenience, not the actual security boundary. A non-admin can't do real damage even if they somehow loaded this app's UI, because the API rejects their requests regardless of what the frontend shows.
