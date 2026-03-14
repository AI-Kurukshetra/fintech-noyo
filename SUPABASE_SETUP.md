# Supabase Setup

The app now includes local Supabase environment variables in `.env.local` and
server-side integration for auth plus database-backed reads.

## Apply the database

1. Open your Supabase project dashboard.
2. Go to `SQL Editor`.
3. Run [schema.sql](D:\hackathon-1\supabase\schema.sql).
4. Run [seed.sql](D:\hackathon-1\supabase\seed.sql).
5. Run `npm run seed:admin` to create the fixed local admin user in Supabase Auth.

## Auth settings

For local email confirmation flows, set these in Supabase Auth settings:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`

If email confirmation is enabled, new users must confirm their email before
they can sign in.

## Notes

- The app uses the service role key only on the server for seeded demo data.
- The seed file refreshes demo tables. Run it when you want to reset sample
  content.
- The admin bootstrap uses the local values in `.env.local`:
  `admin@noyo.local` / `Admin12345!`
- If you want me to apply the schema remotely from here, I would need a direct
  Postgres connection string or database password, not only the REST keys.
