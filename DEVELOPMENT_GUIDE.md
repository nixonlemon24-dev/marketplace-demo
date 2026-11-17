# Step-by-Step Development Guide: Marketplace

This guide describes how the Marketplace app is put together, in the order you would build it, from an empty folder to a working application. Each step lists what was done, which files are involved, and why.

## How this project differs from the original guide

This project follows the original Test 3 guide closely. Where it differs, it's listed here so nothing is surprising.

| Original guide | This project |
| --- | --- |
| Project created with `create-next-app` | Same structure and versions, written out by hand, with Tailwind v3 from the start instead of starting on v4 |
| shadcn components added with the CLI | Components written by hand in shadcn's style. `components.json` is included, so `npx shadcn@latest add <name>` still works |
| Select from shadcn (Radix) | Native `<select>`, which is more reliable on mobile |
| Mock data in the first version of the grid | Grid reads from the API from the start |
| Static `/category/electronics` page | Not needed, the dynamic `/category/[slug]` route covers every category |
| ESLint configured | Not included |
| Image optimization with Next.js Image | Plain `<img>` tags for now |

---

## Phase 1: Project foundation

### Step 1: Project initialization

**Goal:** a modern Next.js project with the latest stable versions.

```bash
npx create-next-app@latest marketplace-demo --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd marketplace-demo
```

Key decisions:

- **Next.js 15 with the App Router**, the current standard.
- **React 19.**
- **TypeScript** for type safety.
- **Tailwind CSS 3.4.** Chosen for stability. The original build log recorded Tailwind v4 problems (a missing `lightningcss` native module on macOS ARM), so the project pins v3 with `tailwindcss-animate`.
- **`src/` directory** to keep application code separate from config files.
- **Import alias `@/*`** pointing at `src/*`.

### Step 2: UI component library

**Goal:** accessible, consistent building blocks.

```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge avatar select separator
```

The project ships these components already, in `src/components/ui/`: button, card, input, textarea, badge, avatar, select and separator. They are customizable with Tailwind and styled with CSS variables defined in `src/app/globals.css`.

### Step 3: Icons

```bash
npm install lucide-react
```

Lucide is lightweight, consistent, tree-shakeable (only the icons you import are bundled) and well typed.

---

## Phase 2: Visual foundation

### Step 4: Layout architecture

**Goal:** the core structure of Facebook Marketplace.

| File | Role |
| --- | --- |
| `src/components/layout/header.tsx` | Sticky header with logo, search and icons |
| `src/components/layout/sidebar.tsx` | Create-listing links and category navigation |
| `src/components/layout/shell.tsx` | Sidebar plus content area, used by browse pages |
| `src/app/layout.tsx` | Root layout that integrates the header and the Geist font |

Design decisions:

- **Facebook blue `#1877F2`** as the primary color, stored as the `--primary` CSS variable.
- **Mobile first.** Layouts start as a single column and add columns at wider breakpoints.
- **4 px spacing grid**, which is Tailwind's default scale (56 px header, 16 px padding, 12 px gaps).
- **Geist** font through the `geist` package, so builds don't depend on reaching Google Fonts.

### Step 5: Homepage

**Goal:** the main marketplace view.

- `src/app/page.tsx` wraps the grid in the shell.
- `src/components/marketplace/item-grid.tsx` is a client component that fetches listings, handles search and category filtering, and renders the cards.

Features: a responsive grid (1 to 5 columns), card-based items, hover zoom on photos, and loading, error and empty states.

### Step 6: Navigation structure

| Route | Purpose |
| --- | --- |
| `/create` | Listing type selection |
| `/create/item` | Item creation form |
| `/item/[id]` | Listing detail |
| `/category/[slug]` | Category pages, generated from `src/lib/categories.ts` |

In Next.js 15 the `params` and `searchParams` props are Promises, so dynamic pages are `async` and `await` them.

---

## Phase 3: Interactive components

### Step 7: Create listing form

**Goal:** a complete listing creation interface (`src/components/marketplace/listing-form.tsx`).

Features: drag-and-drop photo upload, a live preview card, validation, a category dropdown, price formatting and email validation.

Challenges and how they are handled:

- **Many inputs in one form.** A single state object holds all the fields, with one change handler per field.
- **Preview in sync with the form.** The preview reads straight from the same state, so it can't drift.
- **Photo preview.** A temporary object URL shows the chosen file, and it's released when the file changes or the component unmounts.
- **Validation without nagging.** Errors stay hidden until the first submit attempt, then update live as the person fixes them.
- **Price input.** Typing is filtered to digits, one decimal point and two decimals.

### Step 8: Item detail page

**Goal:** a detailed item view with messaging (`src/components/marketplace/item-detail.tsx`).

Features: a large photo, full details, the seller's contact, a message form and back navigation. The page is mobile responsive, shows loading and not-found states, and replaces the form with a confirmation after sending.

---

## Phase 4: Database integration

### Step 9: Supabase setup

```bash
npm install @supabase/supabase-js
```

Planning happened in this order:

1. **Schema.** Two tables, `listings` and `messages`, with a cascade delete from listing to messages.
2. **Security.** Row Level Security is enabled on both tables. The policies are open for reading and inserting because the app has no sign-in yet.
3. **Storage.** A public `listing-images` bucket with upload and view policies.
4. **Privileges.** Explicit `GRANT`s for the `anon` role, so requests made with the public key are allowed.

Files: `src/lib/supabase.ts` (client and types) and `supabase-schema.sql` (the whole schema, safe to re-run).

### Step 10: API development

| Endpoint | File | Methods |
| --- | --- | --- |
| `/api/listings` | `src/app/api/listings/route.ts` | GET (browse, search, filter), POST (create) |
| `/api/listings/[id]` | `src/app/api/listings/[id]/route.ts` | GET |
| `/api/messages` | `src/app/api/messages/route.ts` | GET (message list), POST (send) |
| `/api/upload` | `src/app/api/upload/route.ts` | POST (image to storage) |

Principles:

- RESTful methods and proper status codes: 200, 201, 400, 404, 500, plus 503 when Supabase isn't configured.
- Every input is validated on the server, whatever the browser already checked.
- The seller's email is read from the database when a message is sent, never trusted from the client.
- Uploaded images are checked for type and size, and a new listing may only reference images from your own storage.
- Message listings leave out email addresses.

---

## Phase 5: Frontend and backend integration

### Step 11: Components talking to real data

- **ItemGrid** calls `/api/listings` with the category and search text, and cancels the in-flight request if they change.
- **Listing form** uploads the photo to `/api/upload`, then posts the listing to `/api/listings`, then redirects.
- **Item detail** loads `/api/listings/[id]` and posts messages to `/api/messages`.

### Step 12: Loading and error states

The pattern used everywhere is the same: a `loading` flag shows a spinner, an `error` string shows a red message in place, empty results show a helpful prompt, and success shows a confirmation or redirects. Buttons are disabled while work is in progress.

---

## Phase 6: Build issues and solutions

### Challenge 1: Tailwind CSS v4

The original build hit missing native-module errors with v4. Solution: use stable Tailwind v3.

```bash
npm install tailwindcss@^3.4.0 postcss autoprefixer tailwindcss-animate
```

This means `tailwind.config.ts` for the theme, `@tailwind` directives in `globals.css`, and `postcss.config.mjs` listing `tailwindcss` and `autoprefixer`.

### Challenge 2: Next.js 15 route parameters

Dynamic route parameters are Promises now.

```tsx
// Next.js 14
export default function Page({ params }: { params: { id: string } }) {}

// Next.js 15
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

The same applies to route handlers, as in `src/app/api/listings/[id]/route.ts`.

### Challenge 3: Environment variables during the build

The build runs before real keys exist. `src/lib/supabase.ts` falls back to placeholder values so the build succeeds, and a `supabaseConfigured` flag lets every API route return a clear 503 message at runtime instead of a confusing network failure.

### Challenge 4: Setup problems that came up in practice

| Problem | Cause | Fix |
| --- | --- | --- |
| "supabaseUrl is required" | `.env.local` not found or not loaded | Correct name and location, then restart the dev server |
| Requests fail with 404 | The URL ended in `/rest/v1/` | Use the bare project URL |
| "Bucket not found" | Bucket missing | Create `listing-images` as a public bucket |
| `duplicate key ... buckets_pkey` | The bucket insert failed on re-run and rolled back the whole script | The schema now uses `ON CONFLICT` |
| "Could not find the table in the schema cache" | The script never completed | Re-run it. It ends by reloading the schema cache |
| "permission denied for table" | `anon` role had no table privileges | The schema now includes the `GRANT`s |

---

## Phase 7: Testing and polish

### Step 13: Feature testing

There are no automated tests yet. The manual checklist:

1. **Create listing:** upload, form, preview, submit, redirect.
2. **Browse:** load, search, filter by category, open an item.
3. **Detail:** view an item, send a message, confirm it appears in Supabase.
4. **Errors:** submit an empty form, a bad email, an oversized photo, a missing listing id, and run with the env file removed.

### Step 14: Performance

- Photos use lazy loading.
- Database indexes on category and creation date.
- `GET /api/listings` sends a short shared-cache header.
- Loading states keep the interface responsive.
- Next steps: Next.js Image and pagination.

### Step 15: Build verification

```bash
npm run build
```

The build compiles, type-checks and generates the routes without errors.

---

## Phase 8: Documentation

| Document | Contents |
| --- | --- |
| `README.md` | Overview and quick start |
| `SETUP.md` | Detailed setup and troubleshooting |
| `FEATURES.md` | What the app does, the API and the limits |
| `DEVELOPMENT_GUIDE.md` | This guide |

---

## Architecture

### Frontend

```
src/
├── app/                    Next.js App Router pages
│   ├── api/                API route handlers
│   ├── category/[slug]/    Category pages
│   ├── create/             Listing creation flow
│   ├── item/[id]/          Listing detail
│   └── globals.css         Theme variables and Tailwind layers
├── components/
│   ├── ui/                 Reusable UI components
│   ├── layout/             Header, sidebar, shell
│   └── marketplace/        Item grid, listing form, item detail
└── lib/                    Client, categories, helpers
```

### Database

```
listings
├── id (UUID, primary key)
├── title, description, price
├── category, location
├── seller_email
├── image_url
└── created_at, updated_at

messages
├── id (UUID, primary key)
├── listing_id (foreign key, cascades on delete)
├── buyer_email, seller_email
├── message
└── created_at

storage: listing-images (public bucket)
```

### Technical decisions

- **Supabase instead of a custom backend:** faster to build, with security policies built in.
- **App Router:** file-based routing with server and client components.
- **Tailwind:** utility-first styling for quick iteration.
- **API routes between browser and database:** validation and the seller-email lookup live on the server.

---

## Production readiness

**Security**

- [x] Input validation on every API route
- [x] No string-built SQL (queries go through the Supabase client)
- [x] File upload type, size and destination checks
- [x] Row Level Security enabled
- [ ] Sign-in. Policies are open because there are no accounts
- [ ] Spam protection and rate limiting

**Performance**

- [x] Lazy-loaded photos
- [x] Database indexes
- [x] Loading states throughout
- [ ] Next.js Image
- [ ] Pagination

**User experience**

- [x] Responsive layout
- [x] Error, empty and success states
- [x] Labels, alerts and focus rings (a baseline, not an audit)

**Development**

- [x] TypeScript throughout
- [x] Working production build
- [x] Documentation
- [ ] ESLint configuration
- [ ] Automated tests

---

## Next steps

**Immediate**

1. **Authentication** (Supabase Auth), then tighten the policies so only owners can edit and only participants can read messages.
2. **Seller inbox** so sellers can read messages in the app.
3. **Next.js Image** and pagination.
4. **Advanced filters:** price range, sort order.

**Later**

- Real-time chat
- Payments with Stripe
- Maps for item locations
- Push notifications
- An admin dashboard

---

## Lessons learned

**Technical**

- Prefer stable releases over bleeding-edge ones when a build must be reproducible.
- Plan the database early. The schema shapes everything downstream.
- Build components in isolation so they're easy to test.
- Design error states from the beginning, not at the end.
- Make scripts safe to re-run. It turns failed setups from emergencies into retries.

**Product**

- Design the user journey before the implementation.
- Start mobile first.
- Confirm every action to the user.
- Build the core flow first, then enhance it.

**Process**

- Documentation prevents repeated questions.
- Test as you go rather than at the end.
- Commit often, with descriptive messages.
- Even solo projects benefit from a review checklist.
