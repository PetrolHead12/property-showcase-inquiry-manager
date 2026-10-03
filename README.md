# Property Showcase & Inquiry Manager

An internal tool for managing and showcasing a portfolio of luxury properties
in Bengaluru, built for the sales team to present listings to prospective
buyers and track buyer inquiries.

**Repo:** github.com/username/repo-name

## Stack

| Layer    | Technology                              |
|----------|------------------------------------------|
| Frontend | React + TypeScript + Vite + Tailwind CSS v4 |
| Backend  | Python + FastAPI (async)                |
| Database | PostgreSQL + SQLAlchemy (async) + Alembic |

## Features

- **Showcase** — a public grid of properties with filtering (location,
  bedrooms) and sorting (price, size, newest), plus a detail page per
  property with an image gallery and an inquiry form.
- **Admin dashboard** (`/admin`, no auth — see [Scope decisions](#scope-decisions))
  — add, edit, and delete listings; review all buyer inquiries in one table,
  each linked back to the property it concerns.
- **Validation** — enforced both client-side (instant feedback) and
  server-side via Pydantic + DB check constraints (source of truth).

## Project structure

```
backend/
  alembic/versions/        # SQL migrations
  app/
    api/routes/            # FastAPI routers (properties, inquiries)
    core/                  # db session, settings, shared deps
    models/                # SQLAlchemy ORM models
    schemas/                # Pydantic request/response schemas
    seed.py                 # demo data script
    main.py
  requirements.txt
  .env.example

frontend/
  src/
    components/             # reusable UI pieces (cards, forms, tables)
    pages/                   # route-level views
    lib/                     # api client, types, formatting helpers
```

## Getting started

### 1. Database

Create a local PostgreSQL database, e.g.:

```bash
createdb property_showcase
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then set DATABASE_URL to your local DB
alembic upgrade head            # create tables
python -m app.seed              # optional: populate demo properties + inquiries

uvicorn app.main:app --reload   # http://localhost:8000
```

API docs (interactive): `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install

echo "VITE_API_URL=http://localhost:8000/api" > .env

npm run dev                     # http://localhost:5173
```

### 4. Try it end-to-end

1. Visit `http://localhost:5173` — browse the seeded showcase, filter by
   bedrooms/location, sort by price.
2. Open a property, submit an inquiry.
3. Visit `/admin` — see the inquiry under the **Inquiries** tab, linked to
   its property.
4. Add, edit, or delete a listing under the **Properties** tab.

## Database schema

See `backend/alembic/versions/0001_initial_schema.py` for the authoritative
migration. Summary:

- **properties** — name, location, price, size_sqft, bedrooms, description,
  status (`available` / `under_offer` / `sold`). Check constraints enforce
  price/size > 0 and bedrooms ≥ 0 at the database level, not just in the API.
- **property_images** — one-to-many on properties; `is_primary` flags the
  thumbnail shown in the grid; `display_order` controls gallery order.
- **inquiries** — one-to-many on properties (`ON DELETE RESTRICT`, meaning a
  property with existing inquiries can't be deleted until they're handled —
  see Scope decisions below).

## Architecture & trade-offs

The backend is async FastAPI over async SQLAlchemy, chosen mainly for the
tight schema-to-validation story: Pydantic models mirror the DB schema
almost field-for-field, so the same rules (positive price, required fields,
valid image URLs) are enforced at the API boundary and again as DB check
constraints, rather than trusting one layer alone. The frontend keeps a thin
typed API client (`lib/api.ts`, `lib/types.ts`) as the single boundary to the
backend, so every component works with typed data instead of loose JSON.
The biggest trade-off was choosing hard delete over soft delete for
properties and inquiries: it's a simpler schema and simpler queries (no
`is_deleted` filter needed everywhere), but it means a property with
existing inquiries can't be deleted outright — enforced via `ON DELETE
RESTRICT` and surfaced as a 409 from the API — rather than preserving a
deleted-but-recoverable history. I also scoped images to pasted URLs rather
than file uploads, since the brief explicitly allows stock/placeholder
images and file storage would be infrastructure without a stated
requirement. Given the time limit, I prioritized a fully working CRUD +
inquiry loop with real validation and empty/loading states over polishing
every interaction; the admin section intentionally has no authentication,
since the brief frames it as an internal tool rather than a product with
real user accounts.

## What I'd do next with more time

- Add authentication on `/admin` (even a simple shared-password gate) before
  this went anywhere near a real deployment.
- Pagination on the properties grid and the inquiries table — both will be
  the first thing to break as the portfolio or inquiry volume grows past a
  page.
- Soft delete (or an explicit "archive" status) instead of hard delete, so
  a property's inquiry history survives even after it's taken off the
  market.
- Image upload (to S3 or similar) instead of pasted URLs, so the sales team
  isn't dependent on an external image host.
- Basic automated tests around the validation rules and the delete/restrict
  behavior, since that's the logic most likely to regress silently.

## Scope decisions

A few deliberate calls made to keep this focused, worth being upfront about:

- **No authentication on `/admin`.** The brief describes this as an internal
  tool and doesn't ask for an auth system; adding one would be scope creep
  without a stated requirement. In a real deployment this route would sit
  behind SSO or a reverse-proxy auth layer.
- **Hard delete, not soft delete.** Simpler data model; acceptable for an
  internal tool at this scale. The trade-off: a property with inquiry
  history can't be deleted outright (DB `RESTRICT` + a 409 API response)
  rather than silently losing that history.
- **Images are URLs, not uploads.** No file storage infrastructure (S3 etc.)
  was in scope; admins paste image URLs (stock/placeholder images, per the
  brief) rather than uploading files.
- **Grid/detail price is framed as "From ₹X"**, reflecting how bespoke-build
  pricing is typically presented (a starting/base price, not a fixed final
  figure) rather than implying a fixed sale price.
