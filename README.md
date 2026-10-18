# JobHub — Full-Stack Job Portal

A modern, production-ready job portal built with Next.js 16, MongoDB, and Tailwind CSS. Connects job seekers with employers through a clean, role-based platform.

---

## Features

### Job Seekers
- Browse and search jobs with filters (keyword, location, type, salary, remote)
- Apply with resume upload (Cloudinary)
- Track application status
- Save jobs for later
- Manage profile and notifications

### Employers
- Post and manage job listings
- Review and update applicant status
- Company profile with logo/cover image upload
- Analytics dashboard

### Admins
- Approve/reject job listings
- Manage users and companies
- Platform analytics with charts
- CMS for pages, FAQs, and blog posts
- Reports and content moderation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | MongoDB Atlas (via Prisma ORM) |
| Auth | NextAuth.js v4 (Credentials + Google + GitHub) |
| File Upload | Cloudinary |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | Zustand + React Query |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/jobhub.git
cd jobhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/jobhub?appName=Cluster0"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Generate Prisma client and push schema

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the database

```bash
npm run seed
```

This creates sample companies, jobs, and an admin user.

**Admin credentials:**
- Email: `admin@jobhub.com`
- Password: `Admin@123456`

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
jobhub/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth
│   │   ├── admin/            # Admin APIs
│   │   ├── employer/         # Employer APIs
│   │   └── jobs/             # Job APIs
│   ├── auth/                 # Sign in / Register pages
│   ├── dashboard/
│   │   ├── seeker/           # Job seeker dashboard
│   │   ├── employer/         # Employer dashboard
│   │   └── admin/            # Admin dashboard
│   ├── jobs/                 # Job listing & detail
│   └── companies/            # Company pages
├── components/
│   ├── dashboard/            # Shared dashboard layouts
│   ├── employer/             # Employer-specific components
│   ├── admin/                # Admin-specific components
│   ├── jobs/                 # Job cards, filters, list
│   └── ui/                   # shadcn/ui components
├── actions/                  # Server actions
├── lib/                      # Prisma, auth config, utils
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts               # Seed data
```

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Update `NEXTAUTH_URL` to your Vercel deployment URL
5. Update Google/GitHub OAuth callback URLs to include your Vercel domain

---

## User Roles

| Role | Access |
|------|--------|
| Job Seeker | Browse jobs, apply, manage profile |
| Employer | Post jobs, manage applicants, company profile |
| Admin | Full platform management (`admin@jobhub.com`) |

---

## License

MIT
