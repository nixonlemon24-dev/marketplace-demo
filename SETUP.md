# Marketplace: Detailed Setup

A Facebook Marketplace clone built with Next.js 15, React 19, Tailwind CSS 3, shadcn/ui-style components and Supabase. This guide takes you from a fresh download to a working app, and lists the errors people most often hit on the way.

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Install dependencies](#2-install-dependencies)
3. [Create a Supabase project](#3-create-a-supabase-project)
4. [Create the database, bucket and policies](#4-create-the-database-bucket-and-policies)
5. [Configure environment variables](#5-configure-environment-variables)
6. [Run the app](#6-run-the-app)
7. [Verify everything works](#7-verify-everything-works)

---

## 1. Prerequisites

| Requirement      | Version             | Check with |
| npm              | comes with Node     | `npm -v` |
| Supabase account | free tier is enough | [supabase.com](https://supabase.com) |

## 2. Install dependencies

Open a terminal in the project folder (the one that contains `package.json`) and run:

```bash
npm install
```

This installs Next.js 15, React 19, Tailwind CSS 3, the Supabase client, lucide-react icons and the Geist font package.

## 3. Create a Supabase project

1. Sign in at [supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**.
2. Choose an organization, give the project a name, set a database password (save it somewhere), and pick the region closest to your users.
3. Wait a minute or two while the project is provisioned.

You do not need to enable anything else. The app uses the database and storage only, and does not use Supabase Auth.

## 4. Create the database, bucket and policies

All of this is in one file, `supabase-schema.sql`.

1. In your Supabase project, open **SQL Editor** in the left sidebar and click **New query**.
2. Open `supabase-schema.sql` from this project, copy the whole file, and paste it into the editor.
3. Click **Run**. You should see "Success".

The script is safe to re-run. Every statement either skips something that already exists or replaces it, so you can run it again after a failure without errors.

### What the script creates

| Item | Purpose |
| --- | --- |
| `listings` table | Title, description, price, category, seller email, image URL, location, timestamps |
| `messages` table | Buyer messages, linked to a listing, deleted automatically with it |
| `listing-images` storage bucket | Public bucket for listing photos |
| Storage policies | Anyone can upload to and view the bucket |
| Indexes | Faster category filtering, newest-first sorting, and message lookups |
| Row Level Security | Enabled on both tables; anyone can read and insert, only a signed-in owner can update a listing |
| `updated_at` trigger | Refreshes `updated_at` whenever a listing changes |
| Table privileges (`GRANT`) | Lets the public `anon` key read and insert. Without these you get "permission denied for table" |

### Check that it worked

- **Table Editor** lists `listings` and `messages`.
- **Storage** shows a bucket named `listing-images` marked **Public**.

## 5. Configure environment variables

1. In the project root, copy the example file.

   macOS or Linux:
   ```bash
   cp .env.example .env.local
   ```
   Windows PowerShell:
   ```powershell
   copy .env.example .env.local
   ```

2. Open `.env.local` and fill in the values:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://yourprojectref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key

### Where to find the values

| Variable | Where in Supabase | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Project Settings → API → Project URL** (the **Connect** button also shows it) | Use the bare URL, like `https://abcdefghijklmnop.supabase.co`.
NOTE **Do not add `/rest/v1/` or any other path.** The client adds its own paths, and an extra one breaks every request |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project Settings → API Keys** | Use the **anon / public** key (starts with `eyJ`) or the **publishable** key (starts with `sb_publishable_`). **Never use the `service_role` or secret key here.** Variables starting with `NEXT_PUBLIC_` are sent to the browser |

### Rules for the file

- No quotes around values and no spaces around `=`.
- The file must be named exactly `.env.local` and sit next to `package.json`.
- Never commit it. `.gitignore` already excludes it.
- **Restart `npm run dev` after every change.** Next.js reads the file only at startup.

## 6. Run the app

use this to command to run the web app
 `npm run dev`


Open [http://localhost:3000](http://localhost:3000). The terminal should print a line such as `Environments: .env.local`. If it does not, the file is in the wrong place or has the wrong name (see Troubleshooting).

Other scripts:

| Command         | What it does |
| `npm run dev`   | Development server with hot reload |
| `npm run build` | Production build, also type-checks |
| `npm run start` | Serves the production build (run `build` first) |

## 7. Verify everything works

Walk through the main flow once:

1. **Create a listing.** Go to `/create`, choose **Item for sale**, add a photo, fill in the title, price, category and your email, then click **Publish listing**. You should land on the listing's page.
2. **Browse.** Go to `/`. Your listing appears in the grid. Click a category in the sidebar to filter, and try the header search.
3. **Send a message.** On the listing page, enter an email and a message, then click **Message seller**. You should see a confirmation.
4. **Check the database.** In Supabase **Table Editor**, open `messages`. The message is there. In **Storage → listing-images**, the photo is there too.

