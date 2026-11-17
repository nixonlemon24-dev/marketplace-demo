# Marketplace: Feature Documentation

Everything the app does today, how it behaves, and what is deliberately not built yet.

## Contents

1. [Overview](#1-overview)
2. [Browsing and search](#2-browsing-and-search)
3. [Categories](#3-categories)
4. [Creating a listing](#4-creating-a-listing)
5. [Listing detail](#5-listing-detail)
6. [Messaging sellers](#6-messaging-sellers)
7. [Layout and navigation](#7-layout-and-navigation)
8. [API reference](#8-api-reference)
9. [Validation rules](#9-validation-rules)
10. [Loading, error and empty states](#10-loading-error-and-empty-states)
11. [Responsive design and accessibility](#11-responsive-design-and-accessibility)
12. [Not built yet](#12-not-built-yet)

---

## 1. Overview

| Feature | Where | Summary |
| --- | --- | --- |
| Browse | `/` | Newest listings in a responsive grid |
| Search | Header search box | Matches title and description |
| Category filter | `/category/[slug]` | One page per category |
| Create listing | `/create`, `/create/item` | Pick a type, then fill in a form with a photo |
| Listing detail | `/item/[id]` | Photo, price, description, seller, message form |
| Message seller | `/item/[id]` | Saves the message and emails the seller if email is configured |

There are no user accounts. Anyone can browse, post and message.

## 2. Browsing and search

- The home page shows listings newest first, up to 50 at a time.
- Each card shows the photo (4:3), price, title and location. Hovering zooms the photo slightly. Clicking opens the listing.
- **Search** is the box in the header. It matches the **title or description** of a listing, ignoring case. Results show under the heading "Results for “your search”".
- On a category page, searching stays inside that category. From any other page, searching goes to the home page.
- Clearing the box and pressing Enter removes the search.
- Special characters in the search text are stripped on the server so they can't break the query.

## 3. Categories

There are 19 categories: Vehicles, Property Rentals, Apparel, Classifieds, Electronics, Entertainment, Family, Free Stuff, Garden & Outdoor, Hobbies, Home Goods, Home Improvement, Home Sales, Musical Instruments, Office Supplies, Pet Supplies, Sporting Goods, Toys & Games, and Buy and sell groups.

- The sidebar lists them all, with the current one highlighted. "All listings" returns to the home page.
- Each category has a page at `/category/[slug]`. The slug is the name in lowercase with punctuation replaced by hyphens, for example `garden-outdoor` and `toys-games`.
- An unknown slug shows the "Page not found" page.
- To add or rename a category, edit the list in `src/lib/categories.ts`. The sidebar, the form and API validation all read from it.

## 4. Creating a listing

### Step 1: choose a type (`/create`)

| Card | Result |
| --- | --- |
| Item for sale | Opens the form |
| Vehicle for sale | Opens the form with **Vehicles** preselected |
| Home for sale or rent | Opens the form with **Home Sales** preselected (change it to Property Rentals if needed) |
| Create multiple listings | Shown as "Coming soon" and not clickable |

### Step 2: fill in the form (`/create/item`)

| Field | Required | Notes |
| --- | --- | --- |
| Photo | No | Click to choose or drag and drop. JPG, PNG, WebP or GIF, up to 5 MB. A remove button clears it |
| Title | Yes | Up to 255 characters |
| Description | No | Free text |
| Price (USD) | Yes | Must be above 0. Typing is filtered to digits and one decimal point, with at most two decimals |
| Category | Yes | Dropdown of the 19 categories |
| Your email | Yes | Must look like an email address. Shown to buyers as the seller contact |

Behavior:

- **Live preview.** A card beside the form (below it on mobile) updates as you type and shows the photo, formatted price, title, location and category.
- **Validation.** Errors appear under the fields after the first click on **Publish listing**, then update live as you fix them.
- **Publishing.** The photo is uploaded first, then the listing is saved. The button shows a spinner and "Publishing…" and is disabled to prevent double submits.
- **Success.** You are taken straight to the new listing's page.
- **Failure.** An error message appears above the button, and your input is kept.
- The location is set by the database default, "Palo Alto, CA". The form has no location field.

## 5. Listing detail

`/item/[id]` shows:

- A large photo (4:3).
- The category badge, title and price.
- Location and the date it was listed.
- The description, with line breaks preserved.
- The seller: an avatar with their initial and their email as a clickable `mailto:` link.
- The message form (see below).
- A "Back to Marketplace" link.

A link to a listing that doesn't exist shows "Listing not found" with the back link.

## 6. Messaging sellers

The form on the detail page asks for the buyer's email and a message.

1. The message is validated: valid email, and message text between 1 and 2000 characters.
2. The server looks up the **seller's email from the database**, so it can't be spoofed from the browser.
3. The message is saved in the `messages` table with the listing, buyer and seller.
4. The buyer sees "Message sent. The seller will reply to your email."

If the email service fails or isn't configured, the message is still saved and the buyer still sees the confirmation. Email setup is in `SETUP.md`.

## 7. Layout and navigation

- **Header.** Sticky, 56 px tall: the blue "F" logo and Marketplace name (name hidden on small screens), the search box, and mail, bell and profile icons. The three icons are placeholders and do nothing yet.
- **Sidebar.** A "Create new listing" heading with a "Choose listing type" link, followed by the category list. On mobile it becomes a scrolling row of category pills above the content.
- **Create pages** use their own centered layout without the sidebar.
- **Colors and type.** Facebook blue `#1877F2` is the primary color, and the font is Geist. Spacing follows Tailwind's 4 px steps.

## 8. API reference

All endpoints return JSON. Errors look like `{ "error": "message" }`. Every endpoint returns **503** with setup instructions if the Supabase environment variables are missing.

### `GET /api/listings`

| Query parameter | Meaning |
| --- | --- |
| `category` | Exact category name, such as `Vehicles` |
| `q` | Search text (title or description) |
| `limit` | Maximum results, default 50, capped at 100 |

Returns `{ "listings": [...] }`, newest first, with a short shared-cache header (`s-maxage=10`).

### `POST /api/listings`

Body: `{ title, description, price, category, seller_email, image_url }`. `image_url` is optional. Returns **201** with `{ "listing": {...} }`, or **400** with the reason.

### `GET /api/listings/[id]`

Returns `{ "listing": {...} }`, or **404** if the id is not a valid UUID or no listing has it.

### `GET /api/messages?listing_id=<uuid>`

Returns `{ "messages": [{ id, message, created_at }] }`, oldest first. Email addresses are deliberately left out. The app's pages don't use this endpoint yet.

<!-- ### `POST /api/messages`

Body: `{ listing_id, buyer_email, message }`. Returns **201** with `{ id, emailed }`, where `emailed` says whether the notification email was accepted by Resend. Returns **404** if the listing doesn't exist. -->

### `POST /api/upload`

Multipart form with a `file` field. Returns **201** with `{ "url": "<public image url>" }`.

## 9. Validation rules

Checks run in the browser for quick feedback and again on the server, which is the one that counts.

| Rule | Limit |
| --- | --- |
| Title | Required, up to 255 characters |
| Price | A number from 0 to 99,999,999.99 (the form additionally requires above 0) |
| Category | Must be one of the 19 listed |
| Seller and buyer email | Must match a basic `name@domain.tld` pattern |
| Message | 1 to 2000 characters |
| Image type | JPEG, PNG, WebP or GIF, checked by file type |
| Image size | Up to 5 MB |
| `image_url` on a new listing | Must point at your own Supabase storage, so listings can't hotlink other sites |

## 10. Loading, error and empty states

- **Loading.** A spinner with "Loading listings…" on the grid and "Loading…" on the detail page. Buttons show a spinner while working.
- **Errors.** Failed requests show a red message in place: on the grid, on the detail page, under the form, and under the message form.
- **Empty.** With no results the grid shows an icon, "No listings yet" (or "Nothing matches yet" for a search or category) and a **Create the first listing** button.
- **Success.** Publishing redirects to the listing, and sending a message replaces the form with a confirmation.

## 11. Responsive design and accessibility

- **Grid columns:** 1 on very small phones, 2 from 480 px, 3 from tablet width, 4 on desktop and 5 on large screens.
- The create form and preview stack on mobile and sit side by side on large screens.
- Every form field has a label, errors are announced as alerts, icon buttons have accessible names, and focus rings are visible.
- This is a baseline, not an audit. A full accessibility review hasn't been done.

## 12. Not built yet

| Missing | Notes |
| --- | --- |
| Sign-in and accounts | Nothing is tied to a user, so anyone can post and message |
| Edit or delete a listing | The database allows signed-in updates, but there is no UI |
| Your listings, Seller help | Not part of the current build |
| Create multiple listings | Card is shown as "Coming soon" |
| Header icons | Messages, notifications and account are placeholders |
| Seller inbox | Sellers only receive email, they can't read messages in the app |
| Pagination | The grid loads up to 50 listings at once |
| Image optimization | Photos use plain `<img>` tags rather than Next.js Image |
| Real-time chat, payments, maps, push notifications | Future ideas |
| Spam protection | No rate limiting or CAPTCHA |
| Automated tests and ESLint config | Not included |
