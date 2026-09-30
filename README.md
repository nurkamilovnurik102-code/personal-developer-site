# NURISLAM / DEV — Personal Developer Site + CMS

React + Vite менен жасалган KG/RU жеке developer сайт. Public сайттан тышкары `/admin` CMS бар.

## Негизги функциялар

- React + Vite
- React Router
- Functional components + hooks
- react-i18next: KG / RU
- Responsive dark-blue design
- Project mock API loading/error states
- WhatsApp lead form
- Supabase-ready CMS
- Services CRUD
- Portfolio projects CRUD
- Demo/video/image media fields
- Site text/contact editor
- Music upload + player
- Supabase Auth admin login + password update
- RLS-protected database/storage
- Local demo fallback

## Run

Node.js 20.19+ сунушталат.

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

## Admin

`/admin`

Толук настройка: `ADMIN_SETUP_KG.md`

## Supabase

SQL: `supabase/setup.sql`

## Vercel

Project'ти GitHub'ка push кылып Vercel'ге import кыл. Supabase колдонсоң Environment Variables кош:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

`vercel.json` SPA routes үчүн rewrite жана security headers камтыйт.
