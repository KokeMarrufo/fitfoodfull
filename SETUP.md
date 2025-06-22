# Setup Guide for Fit Project Authentication

## Quick Setup Options

### Option 1: Use Supabase (Recommended - Free Tier)

1. **Create a Supabase account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free
   - Create a new project

2. **Get your database URL**
   - Go to Settings → Database
   - Copy the connection string
   - Replace the DATABASE_URL in `.env.local`

3. **Update your `.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### Option 2: Use Vercel Postgres (For Production)

1. **Add Vercel Postgres to your project**
   - In Vercel dashboard, go to Storage
   - Add Postgres database
   - Copy the connection string to your environment variables

### Option 3: Use Railway (Free Tier)

1. **Create a Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up and create a new project
   - Add PostgreSQL service
   - Copy the connection string

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable APIs**
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it

3. **Create OAuth credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

4. **Update your `.env.local`**:
   ```env
   GOOGLE_CLIENT_ID="your-actual-client-id"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret"
   ```

## Database Setup

Once you have your database URL, run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Start Development Server

```bash
npm run dev
```

## Test the Authentication

1. Visit `http://localhost:3000`
2. Click "Create Account" or "Sign In"
3. Try both email/password and Google sign-in

## For Production (Vercel Deployment)

1. **Set environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add all environment variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain
   - Update Google OAuth redirect URI to include your production domain

2. **Deploy**
   ```bash
   git add .
   git commit -m "Add authentication system"
   git push origin main
   ```

## Troubleshooting

### "Prisma client not initialized"
- Run `npx prisma generate`

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure your database is running/accessible

### "Google OAuth error"
- Verify your Google Client ID and Secret
- Check redirect URI matches exactly

### "NextAuth secret not set"
- Generate a random secret: `openssl rand -base64 32`
- Update NEXTAUTH_SECRET in your environment variables 