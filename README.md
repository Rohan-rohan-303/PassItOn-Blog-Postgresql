# PassItOn — Blog Platform

PassItOn is a full-stack blogging platform built with a TypeScript/Node.js backend and a React + Vite + shadcn TypeScript frontend. It provides user authentication, blog and category management, comments, image uploads (via Cloudinary), and a Supabase client integration for storage/auth where applicable.

**Repository structure**
- `backend/` — Express (TypeScript) API server with controllers, models, routes, and config.
- `frontend/` — Vite + React + shadcn (TypeScript) with pages, components, and Redux user state.

Quick file references:
- Backend entry: [backend/index.ts]
- Frontend entry: [frontend/src/main.tsx]
- DB init script: [backend/scripts/initDb.js]

Tech stack
- Backend: Node.js, TypeScript, Express, Supabase client, Cloudinary, PostgreSQL (SQL in `db/init.sql`).
- Frontend: React, TypeScript, Vite, Redux (minimal), shadcn, Supabase client integration.

Features
- User authentication and authorization (including admin-only routes).
- CRUD for blogs and categories.
- Commenting system with counts and lists.
- Rich-text editor for blog content (ckeditor).
- Image upload handling via Cloudinary and multer.

Local setup

1. Clone the repository and open a terminal at the project root.

2. Backend

```bash
cd backend
npm install
# create a .env file (see Environment variables below)
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
# create a .env file (see Environment variables below)
npm run dev
```

Environment variables (overview)
```
- Backend:
  Create `backend/.env` with entries

     For localhost
	PG_USER=
	PG_HOST=
	PG_DATABASE=
	PG_PASSWORD=	
	PG_PORT=

    Genearal for both local and cloud
	JWT_SECRET=
	FRONTEND_URL=
	PORT=
	CLOUDINARY_APP_NAME=
	CLOUDINARY_API_KEY=
	CLOUDINARY_API_SECRET=

    For cloud
	DATABASE_URL=

 ```

```
- Frontend:
   Create `frontend/.env` with 
      VITE_API_BASE_URL=

```

Database initialization
- The SQL for initial schema lives in `backend/db/init.sql` and there is a helper script at `backend/scripts/initDb.js` to run it against your Postgres instance. Inspect those files and run the script after setting DB credentials in `backend/.env`.


Notes & pointers
- Inspect `backend/routes/` for available endpoints and `frontend/src/pages/` for how the UI consumes them.
- Image uploads are handled through `backend/config/cloudinary.ts` and `backend/config/multer.ts`.


Contact
- For questions about this codebase, inspect the controllers and models in `backend/controllers/` and `backend/models/`, and the frontend pages/components in `frontend/src/`.

---


