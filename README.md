# Fit Project

A full-stack fitness application built with Next.js, featuring comprehensive authentication with both email/password and Google SSO.

## Features

- 🔐 **Dual Authentication**: Email/password and Google SSO
- 🎨 **Modern UI**: Built with Tailwind CSS
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🔒 **Secure**: Password hashing with bcrypt
- 📱 **Responsive**: Works on all devices
- 🚀 **Deploy Ready**: Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (for SSO)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fit-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/fit_project"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables Setup

### Database
- **DATABASE_URL**: Your PostgreSQL connection string
- For local development: `postgresql://username:password@localhost:5432/fit_project`
- For production: Use a service like Supabase, Railway, or Vercel Postgres

### NextAuth
- **NEXTAUTH_URL**: Your application URL
- **NEXTAUTH_SECRET**: Generate a random string for session encryption
  ```bash
   openssl rand -base64 32
   ```

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts          # NextAuth API routes
│   │       └── register/
│   │           └── route.ts          # User registration API
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx              # Sign in page
│   │   │   └── signup/
│   │   │       └── page.tsx              # Sign up page
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Protected dashboard
│   │   ├── layout.tsx                    # Root layout with SessionProvider
│   │   └── page.tsx                      # Landing page
│   ├── components/
│   │   └── SessionProvider.tsx           # NextAuth session provider
│   ├── lib/
│   │   ├── auth.ts                       # NextAuth configuration
│   │   └── prisma.ts                     # Prisma client
│   ├── types/
│   │   └── next-auth.d.ts               # NextAuth type extensions
│   └── prisma/
│       └── schema.prisma                 # Database schema
```

## Authentication Flow

### Email/Password Registration
1. User fills out signup form
2. Password is hashed with bcrypt
3. User is created in database
4. User is automatically signed in
5. Redirected to dashboard

### Email/Password Sign In
1. User enters credentials
2. Password is verified against hashed version
3. NextAuth creates session
4. User is redirected to dashboard

### Google SSO
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google returns user data
4. NextAuth creates/updates user in database
5. User is redirected to dashboard

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up database**
   - Use Vercel Postgres or external service
   - Update DATABASE_URL in Vercel environment variables
   - Run database migrations

### Environment Variables for Production

Make sure to update these in your production environment:
- `NEXTAUTH_URL`: Your production domain
- `DATABASE_URL`: Production database URL
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Update redirect URIs to include your production domain

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# Force new deployment
