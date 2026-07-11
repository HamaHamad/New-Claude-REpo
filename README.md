# ImmigAI — Immigration Platform

AI-powered immigration case management for law firms and corporate teams.

---

## ✅ Vercel Deployment Checklist

Follow these steps **in order** before going live.

### 1. Database (PostgreSQL required)

This project uses PostgreSQL — SQLite will not work.

Get a free database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com), then copy the connection string.

```bash
# Push schema to your database
DATABASE_URL="postgresql://..." npx prisma db push

# Seed demo data (optional)
DATABASE_URL="postgresql://..." npm run db:seed
```

### 2. Environment Variables

Set these in your Vercel project → Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Your full deployed URL, e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ | Run `openssl rand -base64 32` to generate |
| `ANTHROPIC_API_KEY` | ✅ | From [console.anthropic.com](https://console.anthropic.com) |
| `BLOB_READ_WRITE_TOKEN` | ✅ | For persistent file uploads (see step 3) |
| `CRON_SECRET` | ✅ | Run `openssl rand -hex 32` to generate |
| `NEXT_PUBLIC_APP_URL` | ✅ | Same as `NEXTAUTH_URL` |
| `NEXT_PUBLIC_DEMO_MODE` | ⚠️ | Set `"true"` only on staging/demo deployments |

### 3. File Storage (Vercel Blob)

Documents uploaded by users are stored in Vercel Blob. Without `BLOB_READ_WRITE_TOKEN`, uploads will fail.

```bash
# Blob SDK is already in package.json — no install needed.
# Link blob storage to your project:
npx vercel blob add
```

The upload route (`src/app/api/documents/upload/route.ts`) calls `put()` unconditionally, so the token is required in both dev and production.

### 4. Custom Domain

If using a custom domain, add it to `NEXT_PUBLIC_APP_URL` and ensure it's also reflected in `next.config.js` → `allowedOrigins`.

### 5. Cron Job

The daily regulatory feed fetch (`/api/regulatory/fetch`) is scheduled via `vercel.json`. Vercel automatically sends an `Authorization: Bearer <VERCEL_CRON_SECRET>` header — make sure `CRON_SECRET` in your env matches.

---

## 🧑‍💻 Local Development

```bash
# Install deps
npm install

# Copy env file and fill in values
cp .env.example .env.local

# Push schema
npm run db:push

# Seed demo data
npm run db:seed

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Login with `demo@immigai.com` / `demo1234` after seeding.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js (JWT) + bcrypt + signup/password change
- **Database**: PostgreSQL via Prisma (indexed on hot paths)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514 for chat/RFE/forms, claude-haiku-4-5 for regulatory summaries)
- **Storage**: Vercel Blob (production) — `BLOB_READ_WRITE_TOKEN` required
- **Notifications**: In-app + email (SMTP) — preferences persisted per user, deadline reminders via daily cron
- **Security**: CSP, HSTS, X-Frame-Options, rate limiting on login/chat/upload/RFE/signup, zod validation, input sanitization
- **SEO**: sitemap.xml, robots.txt, per-route metadata, OG tags, JSON-LD, server-rendered landing
- **Styling**: Tailwind CSS + Radix UI, full dark mode, ARIA labels, skip-to-content, reduced-motion support
