## Tech Stack

- Frontend: `Next.js` (App Router), TypeScript, CSS (PostCSS).
- Backend: Next.js server components, API routes (if needed).
- Database: Prisma ORM (SQLite/Postgres ready), migrations.
- Tooling: ESLint, TSConfig, modern project structure.

## Project Structure

- `app/` — Next.js App Router pages and layout.
- `app/items/` — items list, detail (`[id]`), and new item pages.
- `app/categories/` — categories list and category detail (`[id]`).
- `app/components/` — shared UI components (e.g., `header.tsx`).
- `lib/prisma.ts` — Prisma client instance.
- `prisma/schema.prisma` — database schema and relations.
- `prisma/migrations/` — migration history.
- Config files — `eslint.config.mjs`, `tsconfig.json`, `next.config.ts`, etc.

## Screenshots / Demo

- Home (items overview)
- Categories list and category details
- New item form

## Getting Started (Local)

1. Install dependencies

```powershell
npm install
```

1. Set up the database (Prisma)

```powershell
npx prisma migrate dev
```

1. Run the development server

```powershell
npm run dev
```

1. Open the app

```text
http://localhost:3000
```

## Environment Variables

- For SQLite (default), no env is required.
- For Postgres, set `DATABASE_URL` in `.env` and run migrations.

## Development Scripts

- `npm run dev` — start Next.js dev server.
- `npx prisma migrate dev` — apply dev migrations.
- `npx prisma studio` — open Prisma Studio to inspect data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
