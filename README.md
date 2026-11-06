# Wine Friend (Kamaltara Enterprises)

Three separate apps in one repository, plus a tiny shared package:

```
winefriend/
├─ backend/     API: owns the data, admin login and image uploads          (port 4000)
├─ website/     Public site: home, about, products, wine tours, blog, contact (port 3000)
├─ dashboard/   Admin dashboard: products, blog posts, enquiries           (port 3001)
└─ shared/      Data types and constants used by all three
```

```
 visitors ─▶ website ──┐
                       ├──▶ backend ──▶ data folder (JSON files + uploaded images)
 staff ────▶ dashboard ┘        │
                                └──▶ tells the website to refresh its cache after every save
```

- The **backend** is the only thing that touches the data. It validates everything, stores products / posts / enquiries / images,
  checks the admin login, and refreshes the website after each save.
- The **website** and **dashboard** are front-ends. They never read the data folder; they call the backend over HTTP.
- Because of that, each can be hosted, restarted or redeployed on its own.

| | backend | website | dashboard |
|---|---|---|---|
| Env file | `backend/.env.local` | `website/.env.local` | `dashboard/.env.local` |
| Holds | `ADMIN_*`, `SESSION_SECRET`, `DATA_DIR`, `WEBSITE_URL`, `REVALIDATE_SECRET` | `BACKEND_URL`, `REVALIDATE_SECRET` | `BACKEND_URL`, `WEBSITE_URL` |
| Needs a disk | yes (persistent) | no | no |

## Run it locally

```bash
npm install
cp backend/.env.example   backend/.env.local     # fill in the values
cp website/.env.example   website/.env.local
cp dashboard/.env.example dashboard/.env.local
```

Then start all three (each in its own terminal), **backend first**:

```bash
npm run dev:backend      # http://localhost:4000
npm run dev:website      # http://localhost:3000
npm run dev:dashboard    # http://localhost:3001   sign in with ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env.local
```

Use the same `REVALIDATE_SECRET` in `backend/.env.local` and `website/.env.local`.
After editing an `.env.local`, restart that app. Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Where things live

| To change… | Edit |
|---|---|
| Page copy, sections, styling | `website/app`, `website/components`, `website/data` |
| Contact details, WhatsApp number | `website/data/footer.ts` |
| Tour website link | `NEXT_PUBLIC_TOUR_SITE_URL` in `website/.env.local` |
| Dashboard screens | `dashboard/app`, `dashboard/components` |
| Login, validation, saving, uploads | `backend/src` (`routes/admin.ts`, `routes/public.ts`, `auth.ts`, `store.ts`) |
| Admin login e-mail / password | `backend/.env.local` |
| Product / post fields, categories | `shared/src/types.ts`, `constants.ts`, then `backend/src/routes/admin.ts` and the dashboard forms |
| Starter products and articles | `backend/src/seed.ts` (only used the first time, when no data exists) |

## Data and images

The backend stores everything in `DATA_DIR` (default `backend/.data`): `products.json`, `posts.json`, `enquiries.json` and `uploads/`.
Put it on persistent storage and back it up. Images are served by the backend at `/uploads/<file>`; the website and dashboard pass them
through, so image URLs stay on their own domains.

## API (backend)

Public: `GET /api/products`, `GET /api/posts`, `POST /api/enquiries`, `GET /uploads/:name`, `GET /health`.
Admin (Bearer token from `POST /api/admin/login`): `/api/admin/products`, `/api/admin/posts`, `/api/admin/enquiries`, `POST /api/admin/uploads`.

## Deploying

A simple setup is one VPS (or any Node host with a persistent disk) running all three, e.g. `winefriend.in` → website,
`admin.winefriend.in` → dashboard, and the backend on a private port that only the other two can reach:

```bash
npm install
npm run start:backend      # port 4000 - start this first
npm run build              # builds website and dashboard (the backend must be running: the website reads its pages from it)
npm run start:website      # port 3000
npm run start:dashboard    # port 3001
```

Production values: `backend` → `WEBSITE_URL=https://winefriend.in`, a strong `ADMIN_PASSWORD`, a random `SESSION_SECRET` (32+ characters),
`DATA_DIR`; `website` / `dashboard` → `BACKEND_URL` pointing at the backend; `dashboard` → `WEBSITE_URL` and `NEXT_PUBLIC_WEBSITE_URL` set
to the public site (set `NEXT_PUBLIC_*` before `npm run build`).

Keep the backend off the public internet if you can (firewall it to the website and dashboard servers). Its admin routes need a login token,
but the public routes are open and the enquiry rate limit trusts the `x-forwarded-for` header the website sends.

Hosting each app on a different server works as long as the website and dashboard can reach `BACKEND_URL`. Only the backend needs the disk.
Serverless hosts (e.g. Vercel) are fine for the website and dashboard; the backend needs a long-running host with a persistent disk, or its
storage in `backend/src/store.ts` swapped for a database.

## Deploying the website and dashboard on Vercel

Create **two** Vercel projects from the same Git repository (each has its own `vercel.json`):

| | Root Directory | Environment variables |
|---|---|---|
| Website | `website` | `BACKEND_URL`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_TOUR_SITE_URL` (optional) |
| Dashboard | `dashboard` | `BACKEND_URL`, `WEBSITE_URL`, `NEXT_PUBLIC_WEBSITE_URL` |

Leave "Include source files outside of the Root Directory" switched on (the default) so `shared/` is available.
The backend must already be online and reachable at `BACKEND_URL` before the website is built. Vercel's disk is temporary,
so the backend cannot keep its data files there: host it on a server with a persistent disk (Render, Railway, Fly.io, a VPS),
set its `WEBSITE_URL` to the website's Vercel domain, and use the same `REVALIDATE_SECRET` there and in the website project.

## Good to know

- The login throttle (5 failed attempts per 15 minutes) and enquiry rate limit (5 per 10 minutes) are in memory and reset when the backend restarts.
  The login throttle only applies in production, so typos in development never lock you out.
- If the backend cannot reach the website after a save, the save still succeeds and the website catches up within about 5 minutes.
- The website reads its pages from the backend at build time too, so start the backend before `npm run build`.
