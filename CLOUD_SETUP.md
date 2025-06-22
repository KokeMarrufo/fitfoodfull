# Cloud Database Setup Guide

## Option 1: Supabase (Recommended - Free Tier)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub (recommended)
4. Create a new organization

### Step 2: Create New Project
1. Click "New Project"
2. Choose your organization
3. Enter project name: `fit-project`
4. Enter database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

### Step 3: Get Database URL
1. Wait for project to be ready (2-3 minutes)
2. Go to Settings → Database
3. Scroll down to "Connection string"
4. Copy the "URI" connection string
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Step 4: Update Your Environment
Replace your `.env.local` with:
```env
DATABASE_URL="your-supabase-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 5: Push Schema to Cloud Database
```bash
npx prisma db push
```

### Step 6: Test Your App
```bash
npm run dev
```

## Option 2: Railway (Alternative - Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Add PostgreSQL service
5. Copy connection string
6. Update `.env.local`
7. Run `npx prisma db push`

## Option 3: Neon (Alternative - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up
3. Create new project
4. Copy connection string
5. Update `.env.local`
6. Run `npx prisma db push`

## Benefits of Cloud Database

✅ **No local setup** - Works immediately  
✅ **Vercel integration** - Perfect for deployment  
✅ **Free tier** - No cost to start  
✅ **Automatic backups** - Your data is safe  
✅ **Team friendly** - Share with collaborators  
✅ **Scalable** - Grows with your app  

## Next Steps After Setup

1. **Test registration** - Create an account with email/password
2. **Test Google OAuth** - Set up Google credentials
3. **Deploy to Vercel** - Add environment variables in Vercel dashboard
4. **Update production URLs** - Add your domain to Google OAuth redirect URIs 