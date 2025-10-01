# Database Setup Guide

## 🚨 Critical: Database Connection Required

Your application currently has **no database connection** configured for production. This will cause:
- ❌ Stripe orders to fail (customers charged but no record created)
- ❌ Admin dashboard to crash
- ❌ User data loss on every deployment

## Current Status

- ✅ Prisma schema defined (`prisma/schema.prisma`)
- ✅ Local DATABASE_URL in `.env.local` (PostgreSQL localhost)
- ❌ No production database configured
- ❌ No migrations created yet

## Recommended: Vercel Postgres

### Step 1: Create Database in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your **137studios** project
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a region (closest to your users)
7. Database name: `137studios-production`
8. Click **Create**

### Step 2: Connect Database to Project

Vercel will automatically add these environment variables to your project:
```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
```

### Step 3: Update Local Environment

Pull the environment variables locally:
```bash
vercel env pull .env.vercel.local
```

### Step 4: Run Prisma Migrations

Initialize the database schema:
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# OR create a migration (for production)
npx prisma migrate dev --name init
```

### Step 5: Verify Connection

Test the database connection:
```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can view your database.

### Step 6: Deploy

```bash
git add .
git commit -m "Add database migrations"
git push
vercel --prod
```

---

## Alternative: Supabase (Free Tier Available)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **New Project**
3. Name: `137studios`
4. Database Password: (save this!)
5. Region: Closest to your users
6. Click **Create**

### Step 2: Get Connection String

1. Go to Project Settings → Database
2. Copy **Connection string** → **URI**
3. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Add to Vercel

```bash
# Add to production
vercel env add DATABASE_URL production

# Paste the connection string when prompted
# Format: postgresql://postgres:[password]@[host]:5432/postgres
```

### Step 4: Add to Local Environment

Add to `.env.local`:
```
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### Step 5: Run Migrations

```bash
npx prisma db push
```

---

## Alternative: Neon (Serverless Postgres)

### Step 1: Create Neon Project

1. Go to https://neon.tech
2. Sign in with GitHub
3. Click **New Project**
4. Name: `137studios`
5. Region: Auto or choose closest
6. Click **Create**

### Step 2: Get Connection String

1. Copy the connection string from the dashboard
2. It looks like: `postgresql://username:password@ep-xyz.region.aws.neon.tech/neondb`

### Step 3: Configure Vercel

```bash
vercel env add DATABASE_URL production
# Paste connection string
```

### Step 4: Local Setup

Add to `.env.local`:
```
DATABASE_URL="postgresql://username:password@ep-xyz.region.aws.neon.tech/neondb"
```

### Step 5: Run Migrations

```bash
npx prisma db push
```

---

## Prisma Schema Overview

Your database includes:

- **User** - Admin and customer accounts
- **Artwork** - Gallery pieces with metadata
- **Order** - Purchase records
- **OrderItem** - Individual items in orders
- **Remix** - User-generated AI remixes
- **Comment** - Artwork comments
- **Reaction** - Likes/favorites
- **Tag** - Artwork categorization
- **Collection** - User saved collections

## Testing Locally

To test with a local PostgreSQL database:

1. Install PostgreSQL
2. Create database: `createdb 137studios`
3. Use existing `.env.local` DATABASE_URL
4. Run: `npx prisma db push`

---

## Post-Setup Checklist

- [ ] Database created in cloud provider
- [ ] DATABASE_URL added to Vercel environment variables
- [ ] DATABASE_URL added to `.env.local`
- [ ] `npx prisma generate` completed successfully
- [ ] `npx prisma db push` completed successfully
- [ ] `npx prisma studio` shows empty tables
- [ ] Test order creation via Stripe webhook
- [ ] Verify admin dashboard loads
- [ ] Deploy to production

---

## Troubleshooting

### "Error: P1001: Can't reach database server"
- Check your connection string format
- Verify database is running
- Check firewall rules (allow your IP)

### "Error: P3009: migrate found failed migrations"
- Reset: `npx prisma migrate reset`
- Or manually delete migrations folder and start fresh

### "Error: Environment variable not found: DATABASE_URL"
- Ensure `.env.local` exists and contains DATABASE_URL
- Restart dev server: `npm run dev`

### Stripe Webhook Failing After Database Setup
- Check webhook logs in Vercel dashboard
- Verify Prisma Client is generated: `npx prisma generate`
- Check order creation logic in `app/api/stripe/webhook/route.ts`

---

## Monthly Costs Estimate

| Provider | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel Postgres | No | $20/month |
| Supabase | 500MB, 2GB bandwidth | $25/month unlimited |
| Neon | 10GB storage | $19/month |

**Recommendation:** Start with **Supabase free tier** to test, then upgrade to **Vercel Postgres** for production integration.

---

## Next Steps

1. Choose database provider (recommended: Vercel Postgres)
2. Follow setup steps above
3. Run migrations
4. Test locally with `npx prisma studio`
5. Deploy to production
6. Test Stripe order creation end-to-end

**Estimated Setup Time:** 15-30 minutes
