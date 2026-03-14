# Noyo OS MVP

Next.js prototype built from the local `noyo_blueprint_20260310_144429.pdf`.

## What it includes

- Overview dashboard mapped to the blueprint's MVP scope
- Enrollment workflows for new hires, terminations, and qualifying life events
- Carrier network and mapping management views
- Analytics and go-to-market signal page
- Developer portal backed by mock API routes
- Supabase auth integration and database-backed seed data

## Run

```bash
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/login`, and
successful sign-in redirects to `/dashboard`.

## Build

```bash
npm run build
```

## Supabase

See [SUPABASE_SETUP.md](D:\hackathon-1\SUPABASE_SETUP.md) for the schema,
seed, and auth redirect steps.
