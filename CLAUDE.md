# CLAUDE.md - AI Assistant Guide for ntan-gallery

Last updated: 2025-11-17

## Project Overview

**ntan-gallery** is a private photo gallery and letter sharing application for friends. It features a single admin account and individual access keys for each friend to view their personalized content. Built with Next.js 14 (App Router) and Supabase.

**Primary language**: Vietnamese (comments, UI text, and database content)

## Tech Stack

### Core Framework
- **Next.js 14.2.13**: App Router with React Server Components
- **React 18.3.1**: UI library
- **TypeScript 5**: Type-safe development
- **Node.js**: Target ES2017

### Styling & UI
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **shadcn/ui**: Component library (New York style)
  - Base color: neutral
  - Uses CSS variables
  - No prefix
- **lucide-react**: Icon library
- **class-variance-authority**: Component variants
- **tailwindcss-animate**: Animation utilities
- **@tailwindcss/typography**: Prose styling

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database with RLS (Row Level Security)
  - Storage for images
  - Auth for admin login
  - Service role for server operations
- **@supabase/ssr**: SSR-compatible Supabase client

### Forms & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation adapters
- **zod**: Schema validation

### Authentication & Security
- **jose**: JWT creation and verification for friend sessions
- **bcryptjs**: Password/key hashing (12 rounds)
- Custom middleware for admin route protection
- Rate limiting by IP address

### Other Libraries
- **@dnd-kit**: Drag-and-drop (for reordering friends)
- **react-dropzone**: File upload UI
- **browser-image-compression**: Client-side image optimization
- **react-markdown**: Markdown rendering
- **react-syntax-highlighter**: Code syntax highlighting
- **remark-gfm**: GitHub Flavored Markdown
- **rehype-sanitize**: HTML sanitization
- **sonner**: Toast notifications

## Project Structure

```
ntan-gallery/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts (Inter, JetBrains Mono)
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global Tailwind styles
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── layout.tsx          # Admin layout with navigation
│   │   ├── page.tsx            # Dashboard home
│   │   ├── login/page.tsx      # Supabase Auth login
│   │   ├── friends/            # Friend management
│   │   │   ├── page.tsx        # List all friends
│   │   │   ├── new/page.tsx    # Create new friend
│   │   │   ├── [id]/page.tsx   # Edit friend by ID
│   │   │   ├── actions.ts      # Server actions (save, delete, reorder, toggle)
│   │   │   └── schema.ts       # Zod validation schema
│   │   └── logs/page.tsx       # Access logs viewer
│   ├── friend/
│   │   └── [slug]/page.tsx     # Friend letter view with key verification
│   └── api/                     # API routes
│       ├── verify-key/route.ts # Friend key verification endpoint
│       └── admin/
│           └── uploads/route.ts # Image upload handler
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── ... (other shadcn components)
│   ├── admin/                   # Admin-specific components
│   │   ├── admin-nav.tsx       # Navigation menu
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── sign-out-button.tsx
│   │   └── friends/
│   │       ├── friend-form.tsx      # Create/edit friend form
│   │       ├── friend-table.tsx     # Friends list with actions
│   │       ├── gallery-list.tsx     # Photo gallery manager
│   │       └── upload-dropzone.tsx  # Drag-drop upload
│   └── friend/                  # Friend-facing components
│       ├── friend-access-form.tsx   # Key input form
│       ├── friend-letter.tsx        # Letter display
│       └── gallery-grid.tsx         # Photo grid
├── lib/
│   ├── supabase/               # Supabase clients (NEVER mix these!)
│   │   ├── client.ts          # Browser client (anon key)
│   │   ├── server.ts          # Server component client (cookies)
│   │   └── service.ts         # Service role client (admin operations)
│   ├── auth/
│   │   ├── admin.ts           # Admin session helpers (getAdminSession, requireAdminSession)
│   │   └── friend.ts          # Friend JWT tokens & cookies
│   ├── data/                  # Data access layer (server-only)
│   │   ├── friends.ts         # Friend CRUD operations
│   │   ├── access-logs.ts     # Access logging
│   │   ├── logs.ts            # General logs
│   │   └── dashboard.ts       # Dashboard stats
│   ├── env/
│   │   ├── browser.ts         # Public env vars (validated with Zod)
│   │   └── server.ts          # Server env vars (extends browser)
│   ├── http/
│   │   └── ip.ts              # IP address extraction from headers
│   ├── rate-limit.ts          # Rate limiting logic
│   └── utils.ts               # Utility functions (cn, etc.)
├── hooks/
│   └── use-toast.ts           # Toast notification hook
├── types/
│   └── database.ts            # Supabase database types
├── supabase/
│   ├── migrations/
│   │   └── 202411170001_init.sql  # Initial schema
│   └── seed.sql               # Seed data (if any)
├── public/                    # Static assets
├── middleware.ts              # Route protection for /admin/*
├── components.json            # shadcn/ui configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variable template
└── package.json               # Dependencies and scripts
```

## Key Architecture Patterns

### 1. Server-Only Code Protection

Files containing sensitive operations are marked with:

```typescript
import "server-only";
```

This ensures they never get bundled for the browser. Used in:
- `lib/auth/admin.ts`
- `lib/auth/friend.ts`
- `lib/data/*`
- `lib/env/server.ts`

### 2. Supabase Client Separation

**CRITICAL**: Never mix these clients! Each has a specific purpose:

| Client | File | Usage | Key Type |
|--------|------|-------|----------|
| Browser | `lib/supabase/client.ts` | Client components | Anon key |
| Server | `lib/supabase/server.ts` | Server components with user auth | Anon key + cookies |
| Service | `lib/supabase/service.ts` | Admin operations, bypass RLS | Service role key |

### 3. Environment Variables

All env vars are validated with Zod schemas:
- **Browser**: `lib/env/browser.ts` (public vars only)
- **Server**: `lib/env/server.ts` (includes secrets)

Never access `process.env` directly - always import from these modules.

### 4. Server Actions Pattern

Server actions follow this pattern (see `app/admin/friends/actions.ts`):

```typescript
"use server";

export async function myAction(data: FormData) {
  await requireAdminSession();           // 1. Auth check
  const validated = schema.parse(data);  // 2. Validate input
  // 3. Perform operation
  revalidatePath("/relevant/path");      // 4. Revalidate cache
  return { success: true };
}
```

### 5. Authentication Flow

**Admin Auth:**
1. Supabase Auth password login (`/admin/login`)
2. Middleware checks email matches `ADMIN_ALLOWED_EMAIL`
3. Session stored in httpOnly cookies
4. Protected routes call `requireAdminSession()` in Server Components

**Friend Auth:**
1. Friend enters access key at `/friend/[slug]`
2. API route verifies key against bcrypt hash
3. JWT token created with 30min TTL
4. Token stored in httpOnly cookie scoped to `/friend/[slug]`
5. Server component verifies token on subsequent visits

### 6. Row Level Security (RLS)

All tables use RLS policies:
- **admin_profile**: Users can only manage their own profile
- **friends**: Only admins (via `is_gallery_admin()` function)
- **uploads**: Only admins
- **access_logs**: Admins can read and insert
- **rate_limits**: Service role only

## Database Schema

### Tables

**admin_profile**
- `user_id` (uuid, FK to auth.users)
- `email` (citext, unique)
- `role` (text, default 'owner')
- `last_login_at` (timestamptz)
- `created_at` (timestamptz)

**friends**
- `id` (uuid, PK)
- `slug` (text, unique) - URL-friendly identifier
- `name` (text) - Full name
- `nickname` (text, nullable)
- `main_photo` (text, nullable) - Storage path
- `description` (text, nullable)
- `letter_content` (text, nullable) - Markdown content
- `access_key_hash` (text) - bcrypt hash
- `gallery_photos` (text[]) - Array of storage paths
- `theme_config` (jsonb) - `{primary, secondary, font}`
- `is_published` (boolean)
- `order_index` (integer) - For drag-drop sorting
- `created_at`, `updated_at` (timestamptz)

**uploads**
- `id` (uuid, PK)
- `friend_id` (uuid, FK, nullable)
- `storage_path` (text, unique)
- `file_name` (text)
- `mime_type` (text)
- `size_bytes`, `width`, `height` (integer)
- `checksum` (text)
- `uploaded_by` (uuid, FK to admin_profile)
- `created_at` (timestamptz)

**access_logs**
- `id` (uuid, PK)
- `friend_id` (uuid, FK)
- `accessed_at` (timestamptz)
- `ip_address` (inet)
- `user_agent` (text)
- `success` (boolean)
- `failure_reason` (text, nullable)

**rate_limits**
- `ip` (inet, PK)
- `attempts` (integer)
- `last_attempt` (timestamptz)
- `blocked_until` (timestamptz, nullable)

### Indexes

- `access_logs_friend_idx` on `(friend_id, accessed_at DESC)`
- `uploads_friend_idx` on `friend_id`
- `friends_order_idx` on `(order_index, created_at DESC)`

## Common Development Tasks

### Adding a New shadcn Component

```bash
npx shadcn-ui@latest add [component-name]
```

Components will be added to `components/ui/` with New York style.

### Creating a New Friend Data Field

1. Add migration in `supabase/migrations/`
2. Run `supabase db reset --local` or `supabase db push`
3. Update `types/database.ts` (regenerate with `supabase gen types`)
4. Update `app/admin/friends/schema.ts` (Zod schema)
5. Update `app/admin/friends/actions.ts` (save action)
6. Update `components/admin/friends/friend-form.tsx` (form field)

### Adding a New Admin Route

1. Create `app/admin/[route]/page.tsx`
2. Call `requireAdminSession()` at the top
3. No need to modify middleware - all `/admin/*` routes are protected
4. Add navigation link in `components/admin/admin-nav.tsx`

### Image Upload Flow

1. Client compresses image with `browser-image-compression`
2. POST to `/api/admin/uploads`
3. API validates session and size limit
4. Upload to Supabase Storage (`gallery-private` bucket)
5. Create record in `uploads` table
6. Return storage path
7. Admin associates path with friend via `gallery_photos` array

## Important Conventions

### File Naming
- **Components**: PascalCase (`FriendForm.tsx`) - but currently using kebab-case
- **Utils/Lib**: kebab-case (`rate-limit.ts`)
- **Server actions**: kebab-case (`actions.ts`)

### Import Aliases
Always use the `@/` alias (configured in `tsconfig.json`):

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth/admin";
```

### Type Imports
Use `type` imports for type-only imports:

```typescript
import type { Metadata } from "next";
import type { Database } from "@/types/database";
```

### Styling
- Use Tailwind utility classes
- Use `cn()` from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns for component variants
- CSS variables for theme colors (see `app/globals.css`)

### Error Handling
- Throw errors in server actions - Next.js will handle them
- Use try/catch in API routes and return proper status codes
- Log errors to console (future: log to database)

### Revalidation
Always revalidate affected paths after mutations:

```typescript
revalidatePath("/admin/friends");
revalidatePath(`/friend/${slug}`);
```

## Environment Variables Reference

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=         # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Anonymous/public key
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (SECRET!)
SUPABASE_JWT_SECRET=              # JWT secret (min 32 chars)
SUPABASE_STORAGE_BUCKET=          # Default: gallery-private

# Auth
ADMIN_ALLOWED_EMAIL=              # Single admin email (lowercase)
FRIEND_TOKEN_SECRET=              # JWT secret for friend tokens (min 32 chars)

# App Config
NEXT_PUBLIC_SITE_URL=             # For redirects and links
RATE_LIMIT_MAX_ATTEMPTS=5         # Max login attempts
RATE_LIMIT_WINDOW_MINUTES=10      # Rate limit window
UPLOAD_MAX_SIZE_MB=5              # Max upload size
```

## Scripts

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint check
```

## Testing Checklist

When making changes, manually verify:

1. **Landing page** (`/`): Hero and features render
2. **Admin login** (`/admin/login`): Redirects if not authenticated
3. **Admin dashboard** (`/admin`): Shows stats and friend list
4. **Friend CRUD** (`/admin/friends`):
   - Create new friend with access key
   - Edit existing friend (key is optional)
   - Delete friend (cascades to access_logs)
   - Reorder friends via drag-drop
   - Toggle publish status
5. **Upload flow** (`/admin/friends/[id]`):
   - Drag-drop images
   - Verify storage upload
   - Check `uploads` table record
   - Verify association with friend
6. **Friend access** (`/friend/[slug]`):
   - Unpublished friends return 404
   - Key form shows if no valid token
   - Wrong key shows error
   - Correct key sets cookie and shows letter
   - Refresh page should remember session (30min)
   - Gallery photos render
7. **Middleware**:
   - `/admin` without auth redirects to `/admin/login`
   - Wrong email can't access admin routes
   - Logged-in admin redirected from `/admin/login` to `/admin`

## AI Assistant Guidelines

### When Reading Code
1. Pay attention to "server-only" imports - this code never runs in browser
2. Check which Supabase client is being used (client/server/service)
3. Note Vietnamese comments and content
4. Understand RLS policies before suggesting database changes

### When Writing Code
1. **Always validate inputs** with Zod schemas
2. **Always check auth** in Server Components and API routes
3. **Never expose secrets** to the browser
4. **Use Server Actions** for mutations (not API routes unless necessary)
5. **Revalidate paths** after mutations
6. **Follow existing patterns** (see similar files for reference)
7. **Use TypeScript strictly** - no `any` types
8. **Test RLS policies** - ensure service role is used for admin operations

### When Modifying Database
1. Create migration file in `supabase/migrations/`
2. Use descriptive filename: `YYYYMMDDNNNN_description.sql`
3. Update `types/database.ts` after running migration
4. Consider RLS policies for new tables
5. Add indexes for frequently queried columns

### When Adding Dependencies
1. Check if similar functionality exists
2. Prefer lightweight libraries
3. Update this document if adding major dependencies

### Common Pitfalls to Avoid
1. Using browser client for admin operations (bypasses RLS!)
2. Forgetting to call `requireAdminSession()` in protected routes
3. Not revalidating paths after mutations
4. Exposing service role key in client code
5. Forgetting to hash friend access keys with bcrypt
6. Not validating env vars (use Zod schemas)
7. Mixing Vietnamese and English inconsistently

### Best Practices
1. Keep Server Components simple - offload logic to `lib/data/*`
2. Use Server Actions for forms (automatic progressive enhancement)
3. Leverage Next.js caching - revalidate strategically
4. Keep components small and focused
5. Extract reusable logic to `lib/` utilities
6. Write descriptive commit messages in English
7. Test RLS policies with both admin and service role clients

## Project Status

Based on README.md progress:

- [x] Base project setup with Tailwind 3 and shadcn/ui
- [x] Landing page with architecture description
- [x] Environment configuration template
- [x] Supabase schema and migrations
- [x] Friend key verification flow
- [x] Admin panel with CRUD operations
- [x] Upload pipeline with drag-drop
- [x] Testing checklist

### Next Steps (from README)
- Supabase Auth configuration (whitelist admin email)
- Rate limiting implementation completion
- Real-time upload progress
- Deployment to Vercel

## Additional Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)

---

**Last Updated**: 2025-11-17
**Maintained By**: AI assistants should update this file when making significant architectural changes.
