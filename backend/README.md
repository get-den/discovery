**Overview**
- Express server wired to Supabase with basic restaurants CRUD.
- Includes SQL migration to create `restaurants` table with useful indexes.

**Setup**
- Node: Install deps with `npm install`.
- Env: Copy `.env.example` to `.env` and fill:
  - `SUPABASE_URL`: Your project URL (from Supabase dashboard, e.g., https://xxxxx.supabase.co)
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (never expose to browsers; server-only)
  - `PORT`: Optional, defaults to `3000`.

**Create Schema**
- Option A (recommended): Open Supabase Dashboard → SQL Editor → run `db/migrations/0001_create_restaurants.sql`.
- Option B: Use a Postgres client with your DB connection string to run the same SQL.

**Run**
- Dev: `npm run dev` then visit `http://localhost:3000/health`.

**API**
- `GET /restaurants` → list restaurants
- `GET /restaurants/:id` → fetch one
- `POST /restaurants` → create; body: `{ name, address?, city?, state?, phone?, cuisine?, website?, rating? }`
- `PUT /restaurants/:id` → update any of the above fields
- `DELETE /restaurants/:id` → delete by id

Notes
- The server uses the Supabase service role key; it bypasses RLS. The migration enables a permissive read policy for anon/authenticated if you also read directly from client apps.
- Adjust RLS policies in `db/migrations/0001_create_restaurants.sql` to fit your needs.

