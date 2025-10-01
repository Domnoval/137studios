# Supabase Setup Guide for 137studios

## Step 1: Create Supabase Project (Browser - 2 minutes)

### 1.1 Sign Up
1. Go to **https://supabase.com**
2. Click **Start your project**
3. Sign in with GitHub (recommended) or email

### 1.2 Create Project
1. Click **New Project**
2. Fill in details:
   - **Organization:** Create new or use existing
   - **Name:** `137studios` (or `137studios-production`)
   - **Database Password:** Generate a strong password
     - ⚠️ **SAVE THIS PASSWORD!** You'll need it for the connection string
     - Example: `kX9m!pL2#vR8@qT5`
   - **Region:** Choose closest to your users
     - US East (Virginia) - `us-east-1` (most Vercel apps)
     - US West (Oregon) - `us-west-1`
     - Europe (Frankfurt) - `eu-central-1`
   - **Pricing Plan:** Free (starts automatically)
3. Click **Create new project**
4. Wait 1-2 minutes for provisioning ☕

---

## Step 2: Get Connection String (Browser - 1 minute)

### 2.1 Navigate to Database Settings
1. In Supabase dashboard, click **Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll to **Connection string** section

### 2.2 Copy Connection String
1. Select the **URI** tab (not Session mode or Transaction mode)
2. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xyzabc123.supabase.co:5432/postgres
   ```
3. **Replace `[YOUR-PASSWORD]`** with the password you saved in Step 1.2

**Example final string:**
```
postgresql://postgres:kX9m!pL2#vR8@qT5@db.xyzabc123.supabase.co:5432/postgres
```

⚠️ **Important:** Make sure there are no brackets `[]` in the final string!

---

## Step 3: Add to Local Environment (Terminal - 30 seconds)

### 3.1 Update .env.local
Open `.env.local` and update the DATABASE_URL:

```bash
# Replace the localhost URL with your Supabase URL
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xyzabc123.supabase.co:5432/postgres"
```

### 3.2 Save the file
Press `Ctrl+S` (or `Cmd+S` on Mac)

---

## Step 4: Add to Vercel (Terminal - Ready for you)

Once you have your Supabase connection string, come back here and I'll run:

```bash
vercel env add DATABASE_URL production
# Paste your connection string when prompted
```

---

## Step 5: Test Connection Locally (Terminal - Ready for you)

I'll run these commands to set up your database:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema to Supabase (creates all tables)
npx prisma db push

# 3. Open Prisma Studio (visual database browser)
npx prisma studio
```

This will open http://localhost:5555 where you can see all your tables!

---

## 🎁 Bonus: What You Get with Supabase Free Tier

### Database
- ✅ 500MB database storage
- ✅ Unlimited API requests
- ✅ Up to 2GB bandwidth/month
- ✅ Auto-backups (7 days)

### Future Features You Can Add (All Free Tier)
- **Auth:** Replace NextAuth with Supabase Auth
  - Email/password, magic links, OAuth (Google, GitHub, etc.)
  - Row Level Security (RLS) built-in
- **Storage:** Replace Vercel Blob with Supabase Storage
  - 1GB file storage
  - Image transformations
  - CDN delivery
- **Realtime:** Live updates for your gallery
  - Live comments appearing instantly
  - User presence indicators
  - Live remix gallery updates
- **Edge Functions:** Serverless functions
  - Alternative to Vercel API routes
  - Run closer to your database

---

## Next Steps After Setup

### 1. Enable Row Level Security (RLS) - Optional but Recommended
In Supabase dashboard:
1. Go to **Authentication** → **Policies**
2. Click **New Policy**
3. Secure your tables (we can do this later)

### 2. Set Up Auth (Optional - If you want to replace NextAuth)
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 3. Set Up Storage (Optional - If you want to replace Vercel Blob)
1. In Supabase dashboard → **Storage**
2. Create bucket: `artworks`
3. Set policies for public/private access

---

## Troubleshooting

### "Can't reach database server"
- Check your connection string has no `[` or `]` brackets
- Verify password is correct
- Make sure you used the **URI** format, not Session/Transaction mode

### "SSL connection required"
Add `?sslmode=require` to the end of your connection string:
```
postgresql://postgres:password@db.xyz.supabase.co:5432/postgres?sslmode=require
```

### "Too many connections"
Supabase free tier has connection limit. Add connection pooling:
```
postgresql://postgres:password@db.xyz.supabase.co:6543/postgres?pgbouncer=true
```

Note the port change: `5432` → `6543` (pgbouncer port)

---

## 📊 Free Tier Limits

| Feature | Free Tier | When You Hit Limit |
|---------|-----------|-------------------|
| Database Storage | 500MB | Upgrade to Pro ($25/mo) |
| Bandwidth | 2GB/month | Upgrade or wait for reset |
| File Storage | 1GB | Upgrade to Pro |
| Auth Users | 50,000 MAU | Upgrade to Pro |
| Edge Functions | 500K requests | Upgrade to Pro |

**Your usage estimate:**
- Database: ~50MB (orders, users, artworks)
- Bandwidth: ~500MB/month (early stage)
- You should be fine on free tier for 6-12 months 🎉

---

## Quick Reference

**Supabase Dashboard:** https://app.supabase.com
**Documentation:** https://supabase.com/docs
**API Reference:** https://supabase.com/docs/reference/javascript

---

## Ready to Continue?

Once you've completed Steps 1-3 above (create project, get connection string, add to .env.local), let me know and I'll:
1. Add it to Vercel
2. Run Prisma migrations
3. Open Prisma Studio to show you the tables
4. Test with a sample order creation

**Come back and say "done" when you have the connection string!**
