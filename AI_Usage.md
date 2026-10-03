# AI Usage

This project was built with Claude (Anthropic) as a pair-programming
assistant throughout. Documented here per the assignment's request for
transparency on tool usage.

## Tools used

- **Claude** (via chat/this conversation) — used for architecture planning,
  scaffolding backend and frontend code, and design direction.

## How it was used, roughly in build order

1. **Schema design** — discussed trade-offs on images (separate table vs.
   JSON column vs. single field), soft vs. hard delete, and status field
   design conversationally before any code was written. Settled on hard
   delete + a separate `property_images` table + a `status` enum.
2. **Migration + models** — Claude generated the initial Alembic migration
   and SQLAlchemy models from the agreed schema. I then hand-edited the
   models afterward (switched `size_sqft` to `Integer`, removed the
   `is_deleted` soft-delete columns after deciding hard delete was
   sufficient for this scope) — Claude's next steps were built against
   those hand-edited models, not the other way around.
3. **FastAPI backend** — Claude scaffolded the DB session dependency,
   Pydantic schemas, and the Properties + Inquiries routers (filtering,
   sorting, CRUD, the inquiry-submission and admin-listing endpoints).
   I tested every endpoint manually via `/docs` before moving on, and
   caught/fixed an import-path bug and a typo in `main.py` that predated
   Claude's involvement.
4. **Frontend scaffolding** — Claude set up the typed API client
   (`lib/api.ts`), shared types mirroring the Pydantic schemas
   (`lib/types.ts`), formatting helpers for Indian currency conventions
   (`lib/format.ts`), and the React Router shell.
5. **UI build** — Claude proposed a visual direction (palette, type,
   layout) before writing component code, explicitly to avoid generic
   "AI-template" defaults (cream background + terracotta accent, SaaS
   card-with-shadow kit, etc.). I reviewed and approved the direction
   before any components were built. Built page-by-page: grid → detail →
   admin dashboard → add/edit form.
6. **Refinement pass** — after the full loop worked, asked Claude to
   benchmark the showcase page against real luxury real-estate sites
   (Sotheby's International Realty and similar) and refine the hero
   section, filter bar styling, and card layout based on concrete
   patterns observed there, rather than a vague "make it prettier" ask.
7. **Seed script** — Claude wrote `app/seed.py` to populate demo
   properties, images, and inquiries so the app has believable sample
   data on first clone, instead of an empty grid.

## What I wrote/decided myself vs. what Claude drafted

- All schema trade-off decisions (hard vs. soft delete, image modeling,
  status field) were mine; Claude implemented them and flagged
  consequences I hadn't considered (e.g. that hard delete makes the
  `ON DELETE RESTRICT` constraint load-bearing, not just a future
  safety net).
- I caught and corrected two bugs in hand-written code before Claude
  built on top of it (a wrong import path, a typo'd exception variable).
- Validation rules (positive price, non-blank fields, image URL format)
  were specified by me at the schema level; Claude mirrored them
  consistently across the DB constraints, Pydantic validators, and the
  frontend form so a user gets the same rule enforced at every layer.
- All visual/design decisions were proposed by Claude and explicitly
  approved or redirected by me (e.g. I asked for a "starting from" price
  framing instead of an exact price, and caught a file placed in the
  wrong directory during the build).

## What I'd want to walk through in a follow-up conversation

- The decision to use `ON DELETE RESTRICT` on `inquiries.property_id` and
  how that surfaces as a 409 in the API and a banner in the admin UI.
- Why `PropertyListItem` and `Property` are separate types/schemas instead
  of one shared shape.
- The image-list "replace wholesale on PUT" behavior and its trade-offs
  versus a diff-based update.