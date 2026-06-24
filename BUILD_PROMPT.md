# K.K. Danny Enterprise — Full Build Prompt

> **Use this prompt to rebuild the entire website from scratch.**
> Hand it to an AI coding assistant (Claude Code, Cursor, etc.) along with logo assets and store photos.

---

## 1. Project Overview

Build a full-stack business website and admin dashboard for **K.K. Danny Enterprise**, a building materials and hardware supplier based in Adeiso, Eastern Region, Ghana. The site serves two audiences:

- **Public-facing storefront** — product catalogue, company info, quote requests, gallery, delivery info
- **Internal admin panel** — point-of-sale (POS), sales tracking, inventory, invoicing, analytics, CMS, and staff management

The admin panel uses a **dark navy theme**. The public site uses a **white/light theme with gold (#C8960C) and navy (#15212c) accents**. Both must be **seamlessly responsive across every device — phones, tablets, laptops, desktops, and ultra-wide screens**. Responsiveness is the single most important design requirement.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| React | React + React DOM | 19.x |
| Styling | Tailwind CSS | 4.x |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) | supabase-js 2.x, @supabase/ssr 0.5.x |
| Icons | lucide-react | latest |
| Charts | recharts | 2.x |
| Toasts | react-hot-toast | 2.x |
| Email (optional) | resend + @react-email/components | latest |
| Utilities | clsx + tailwind-merge | latest |

**No other UI libraries.** No shadcn/ui, no Material UI, no Chakra. All components are hand-built with Tailwind utility classes and custom CSS variables. This keeps the bundle lean and gives full control over responsive behaviour.

---

## 3. Responsiveness Strategy — THE KEY FEATURE

Every single page, component, layout, modal, table, and card must work flawlessly on:

- **Small phones** (320px–375px) — iPhone SE, Galaxy S series
- **Standard phones** (375px–430px) — iPhone 14/15, Pixel
- **Tablets portrait** (768px)
- **Tablets landscape / small laptops** (1024px)
- **Desktops** (1280px–1440px)
- **Ultra-wide** (1920px+)

### Responsive Rules to Follow Everywhere

1. **Mobile-first CSS** — Start with the smallest screen, add `sm:`, `md:`, `lg:`, `xl:` breakpoints upward. Never write desktop-first CSS that hides on mobile.

2. **Fluid grids** — Use Tailwind's responsive grid columns:
   - Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
   - Stat cards: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` or `lg:grid-cols-6`
   - Two-column layouts: `grid-cols-1 lg:grid-cols-2`
   - Sidebar + content: `grid-cols-1 lg:grid-cols-3` (1/3 + 2/3 split)

3. **Tables must scroll horizontally on mobile** — Wrap every `<table>` in `<div className="overflow-x-auto">` with a `min-w-[600px]` or `min-w-[800px]` on the table itself. Never let table columns collapse or wrap on small screens.

4. **Navigation** — Desktop: horizontal nav with dropdowns. Mobile (below `lg`): hamburger menu with full-screen overlay panel. Admin sidebar: fixed 256px on `lg+`, off-screen slide-in on mobile with backdrop.

5. **Modals** — Center with `fixed inset-0 z-50 flex items-center justify-center p-4`. Max width `max-w-lg` or `max-w-2xl`. Scroll content inside: `overflow-y-auto max-h-[70vh]`. On mobile the `p-4` ensures edge padding.

6. **Typography scales** — Headings: `text-3xl sm:text-5xl`. Body: `text-sm` or `text-base`. Labels: `text-xs` or `text-[10px]`. Never use fixed `px` font sizes.

7. **Spacing** — Section vertical rhythm: `py-14 sm:py-20`. Container horizontal: `px-4 sm:px-6`. Max content width: `max-w-7xl mx-auto`.

8. **Images** — Always use Next.js `<Image>` with `sizes` attribute for responsive loading:
   - Full-width hero: `sizes="100vw"`
   - Grid item: `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
   - Two-column: `sizes="(max-width: 1024px) 100vw, 50vw"`

9. **Touch targets** — All clickable elements minimum 44px touch area on mobile. Buttons: `py-2.5 px-5` minimum. Icon buttons: `p-1.5` with 14px+ icons.

10. **Flex wrapping** — Use `flex flex-col sm:flex-row` for toolbar rows. Use `flex-wrap` for button groups and filter chips. Use `gap-3` not margins for consistent spacing.

11. **Text truncation** — Long names in tables/cards: `truncate` class. Min-width zero on flex children: `min-w-0`.

12. **Print layouts** — Receipt printing: hide everything except `#receipt-print`. Report printing: A4 size, `@page { margin: 15mm 18mm }`, no navbars.

---

## 4. Design System

### 4.1 CSS Variables (defined in `globals.css` on `:root`)

```css
--gold: #C8960C;
--gold-hover: #E8B020;
--gold-muted: #D4A017;
--brown: #6B4C2A;

--navy: #15212c;
--navy-light: #29353f;
--navy-deep: #0d0f18;
--navy-alt: #111320;

--text-muted: #737a80;
--heading-dark: #1a181d;
--border: #e2e5e8;
--surface: #f8f9fa;

--foreground: #1a181d;
--background: #ffffff;
```

### 4.2 Font

**Inter** from Google Fonts — weights 400, 500, 600, 700, 800, 900. Fallback: `Segoe UI, system-ui, sans-serif`. Display: swap.

### 4.3 Custom Classes (defined in globals.css)

```
.font-display       — weight 800, letter-spacing -0.02em
.section-label       — 0.7rem uppercase, gold text, 0.15em letter-spacing
.label-chip          — gold bg, black text, uppercase, 0.65rem, pill shape

.btn-gold            — gold bg, black text, uppercase bold, 4px radius, hover lift
.btn-outline-gold    — gold border + text, transparent bg, hover to solid gold

.card                — white bg, #e2e5e8 border, 8px radius, subtle shadow

.admin-input         — #1e2a35 bg, #374d5e border, white text, gold focus ring
.admin-select        — same as admin-input

.slide-dot           — 10px circle for hero slider, gold on active
.prose-content       — styled headings, paragraphs, lists for rich text
```

### 4.4 Admin Theme

- Background: `#0d1821`
- Card/panel: `var(--navy)` (#15212c)
- Borders: `#1e2e3c`
- Table header rows: `#0d1821`
- Text: white headings, `#8a9ba8` labels, `#4a6175` muted
- Accent: gold for active nav, badges, focus states
- Status colours: green-400 (success), yellow-400 (warning), red-400 (error), blue-400 (info)

---

## 5. Project Structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout (font, metadata, Toaster)
│   ├── globals.css                   # All CSS variables and custom classes
│   ├── (public)/                     # Route group — public pages
│   │   ├── layout.tsx                # Navbar + Footer wrapper
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── delivery/page.tsx
│   │   ├── bulk-orders/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/[category]/page.tsx
│   │   ├── quote/page.tsx + QuoteForm.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   └── admin/                        # Admin panel
│       ├── layout.tsx                # Auth check + AdminShell wrapper
│       ├── AdminShell.tsx            # Sidebar + Topbar + content grid
│       ├── RevenueChart.tsx          # Recharts bar chart
│       ├── login/page.tsx
│       ├── page.tsx                  # Dashboard
│       ├── pos/                      # Point of Sale
│       ├── sales/                    # Sales management
│       ├── analytics/                # Business analytics + print report
│       ├── inventory/                # Inventory CRUD
│       ├── invoices/                 # Invoice management + print
│       ├── quotes/                   # Quote request workflow
│       ├── content/                  # CMS key-value editor
│       ├── hero-slides/              # Homepage hero slider CRUD
│       ├── page-heroes/              # Sub-page hero banners CRUD
│       ├── gallery/                  # Gallery image management
│       ├── products/                 # Product catalogue CRUD
│       ├── social-links/             # Social media links
│       ├── theme/                    # Colour customisation
│       └── staff/                    # User/staff management + server actions
├── components/
│   ├── public/
│   │   ├── Navbar.tsx                # Fixed nav with mobile hamburger
│   │   ├── Footer.tsx                # Multi-column footer (server component)
│   │   ├── HeroSlider.tsx            # Auto-rotating carousel
│   │   └── PageHero.tsx              # Reusable sub-page hero banner
│   └── admin/
│       ├── Sidebar.tsx               # Role-filtered navigation
│       ├── Topbar.tsx                # Sticky header with user menu
│       ├── ImageUpload.tsx           # Supabase Storage uploader
│       └── ReceiptModal.tsx          # Print-optimised receipt
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (cookies)
│   └── utils.ts                      # cn(), formatCurrency(), formatDate(), constants
├── types/
│   └── database.ts                   # All TypeScript interfaces and enums
├── supabase/
│   ├── schema.sql                    # Full database schema + RLS + triggers
│   ├── seed.sql                      # Seed data
│   └── migrations/                   # Incremental migrations
├── public/
│   ├── logo.png                      # Favicon and brand logo
│   └── images/                       # Store/yard photos
├── middleware.ts                      # Auth route protection
├── next.config.ts                    # Image remote patterns
└── postcss.config.mjs                # Tailwind PostCSS plugin
```

---

## 6. Database Schema (Supabase PostgreSQL)

### 6.1 Custom Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE sale_status AS ENUM ('completed', 'partial', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'mobile_money', 'bank_transfer', 'card');
CREATE TYPE quote_status AS ENUM ('new', 'reviewed', 'quoted', 'completed', 'cancelled');
CREATE TYPE stock_unit AS ENUM ('bag', 'sheet', 'roll', 'tin', 'piece', 'kg', 'metre', 'bundle', 'set');
```

### 6.2 Tables

**profiles** — Extends Supabase auth.users
- `id` UUID PK (FK → auth.users), `email` TEXT, `full_name` TEXT?, `role` user_role DEFAULT 'staff', `is_active` BOOLEAN DEFAULT true, timestamps
- Auto-created via trigger on auth signup

**products** — Public catalogue
- `id` UUID PK, `name`, `slug` UNIQUE, `category`, `description`?, `image_url`?, `unit` stock_unit, `price` NUMERIC(12,2)?, `sort_order` INT, `is_active` BOOLEAN, timestamps

**inventory_items** — POS stock (separate from public products)
- `id` UUID PK, `name`, `category`, `image_url`?, `price` NUMERIC(12,2), `cost_price` NUMERIC(12,2), `unit` stock_unit, `stock_quantity` NUMERIC(12,2), `low_stock_threshold` NUMERIC(12,2) DEFAULT 5, `is_service` BOOLEAN DEFAULT false, `is_active` BOOLEAN, timestamps

**sales**
- `id` UUID PK, `sale_ref` TEXT UNIQUE (format: KK{YYMMDD}-{RAND}), `customer_name`?, `customer_phone`?, `payment_method`, `subtotal`, `discount`, `total`, `amount_paid`, `change_due`, `balance_due`, `status` sale_status, `notes`?, `served_by` UUID? FK → profiles, timestamps

**sale_items**
- `id` UUID PK, `sale_id` FK → sales CASCADE, `inventory_item_id` FK? → inventory_items SET NULL, `item_name`, `unit`, `quantity`, `unit_price`, `line_total`, `created_at`

**invoices**
- `id` UUID PK, `invoice_number` TEXT, `customer_name`, `customer_phone`?, `customer_email`?, `customer_address`?, `status` ('draft'|'sent'|'paid'|'cancelled'), `due_date`?, `notes`?, `created_by` UUID? FK → profiles, `subtotal`, `discount`, `total`, timestamps

**invoice_items**
- `id` UUID PK, `invoice_id` FK → invoices CASCADE, `description`, `quantity`, `unit`, `unit_price`, `line_total`

**hero_slides** — Homepage carousel
- `id` UUID PK, `title`, `subtitle`?, `heading`, `body`, `button1_text` DEFAULT 'Get a Quote', `button1_href` DEFAULT '/quote', `button2_text` DEFAULT 'Browse Products', `button2_href` DEFAULT '/products', `image_url`?, `sort_order` INT, `is_active` BOOLEAN, timestamps

**page_heroes** — Sub-page header banners
- `id` UUID PK, `page_slug` TEXT UNIQUE, `label`, `subtitle`?, `heading`, `description`?, `image_url`?, `is_active` BOOLEAN, timestamps

**gallery_items**
- `id` UUID PK, `label`?, `image_url`, `category`?, `sort_order` INT, `is_active` BOOLEAN, timestamps

**site_content** — CMS key-value store
- `id` UUID PK, `key` TEXT UNIQUE, `value`?, `section` TEXT DEFAULT 'general', `updated_at`
- Sections: general, header, footer, contact, about, faq

**social_links**
- `id` UUID PK, `platform` TEXT UNIQUE, `url`, `is_active` BOOLEAN, `sort_order` INT

**quote_requests**
- `id` UUID PK, `name`, `phone`, `email`?, `project_type`?, `materials_needed`?, `quantity_volume`?, `delivery_address`?, `deadline`?, `notes`?, `status` quote_status DEFAULT 'new', timestamps

### 6.3 RLS Policies

- **Public read** (active only): products, hero_slides, gallery_items, site_content, social_links, page_heroes
- **Public insert**: quote_requests
- **Staff manage**: inventory_items, sales, sale_items, quote_requests
- **Admin manage**: hero_slides, gallery_items, site_content, social_links, profiles, page_heroes

### 6.4 Triggers

- `set_updated_at()` — Auto-updates `updated_at` on every table with timestamps
- `handle_new_user()` — Creates a profile row when a new user signs up via Supabase Auth

---

## 7. Authentication & Middleware

**Supabase Auth** with email/password. No OAuth providers.

**Middleware** (`middleware.ts`):
- Matcher: `/admin/:path*`
- Refreshes Supabase session cookies on every request
- If not authenticated → redirect to `/admin/login`
- If authenticated and on `/admin/login` → redirect to `/admin`
- Sets `x-pathname` header so the admin layout can skip the shell on the login page

**Two Supabase client factories:**
- `lib/supabase/client.ts` → `createBrowserClient()` for client components
- `lib/supabase/server.ts` → `createServerClient()` with cookie adapter for server components

---

## 8. Public Pages — Feature Specification

### 8.1 Root Layout
- Google Font: Inter (400–900)
- Metadata: title, description, keywords, Open Graph
- Favicon: `/logo.png`
- `<Toaster position="top-right" />`

### 8.2 Public Layout (`(public)/layout.tsx`)
- Server component fetches `header_phone` and `header_tagline` from `site_content`
- Renders `<Navbar phone={...} tagline={...} />`
- `<main className="pt-16">` (accounts for fixed navbar height)
- `<Footer />` (server component, fetches social links and contact info)

### 8.3 Navbar
- **Fixed** at top, navy background, z-50
- **Top strip**: phone number link + tagline (hidden on mobile)
- **Main bar**: Logo (32px) + company name, nav links, "Get Quote" CTA button
- **Nav links**: Home, About, Gallery, Contact
- **Products dropdown**: Hoverable on desktop. 11 categories (Cement & Concrete, Steel & Reinforcement, Roofing Materials, Paint & Finishes, Tiles & Flooring, Timber & Lumber, Hardware & Fasteners, Tools & Equipment, Wire & Mesh, Pipes & Plumbing) + "All Products" link + "Delivery Service" link
- **Mobile**: Hamburger icon toggles full-screen overlay menu. All links + products expand inline. Close button top-right.
- **Scroll detection**: Adds shadow when scrolled past top

### 8.4 Footer
- Navy background, 4-column grid (1 col mobile, 2 col tablet, 4 col desktop)
- **Column 1**: Logo, company name, tagline, social media icons (from `social_links` table)
- **Column 2**: Quick Links — Home, About, Products, Gallery, Contact, Delivery, Bulk Orders, Get a Quote
- **Column 3**: Products — 9 category links
- **Column 4**: Contact — address, phone numbers, email (from `site_content`)
- **Bottom bar**: Copyright year, Privacy link, Terms link, "Admin" login link (small, muted)

### 8.5 Homepage (`/`)
1. **Hero Slider** — Full viewport minus navbar. Auto-rotates 6s. Prev/next arrow buttons. Dot indicators. Each slide: background image with dark gradient overlay, title chip, large heading, body text, 2 CTA buttons. Fetches from `hero_slides` table ordered by `sort_order`. Fallback hardcoded slides if DB empty.
2. **Product Categories** — "What We Supply" section. 6-item responsive grid of category cards. Each card: image, overlay gradient, category name, arrow icon. Links to `/products/{slug}`.
3. **Why Choose Us** — 4-item grid. Each: icon, title, description. (Large Stock, Honest Prices, Same-Day Delivery, Reliable Supply)
4. **Gallery Strip** — 8-item image grid from `gallery_items` table. Aspect-square, rounded, hover scale.
5. **Quote CTA Band** — Gold background. Heading + description + two buttons (Get Quote, Call Now).
6. **FAQ Section** — Accordion. Fetches `faq_*_q` and `faq_*_a` keys from `site_content`. Click to expand/collapse answers.
7. **Contact Info Band** — Navy background. 3-column: Address, Phone numbers, Opening hours.

### 8.6 Products Page (`/products`)
- `<PageHero>` banner
- Category grid: 11 cards, each with image, name, "Browse →" link
- Products list from DB below (if any exist)
- CTA band at bottom

### 8.7 Product Category Page (`/products/[category]`)
- Breadcrumb back to `/products`
- Category name heading
- Product grid filtered by category (Supabase `ilike` query)
- Each product card: image, name, description, price, unit
- "No products yet" message with call CTA if empty

### 8.8 Quote Request Page (`/quote`)
- `<PageHero>` banner
- Client-side form with fields: name*, phone*, email, project_type (dropdown), materials_needed (textarea), quantity_volume, deadline (date), delivery_address, notes
- Project types: Residential, Commercial, Extensions, Roofing, Fencing, Flooring, Painting, Repairs, Other
- Submits to `quote_requests` table
- Success screen after submission
- Toast notifications for errors

### 8.9 About Page (`/about`)
- `<PageHero>` banner
- Story section: 2-column (text + image). Text from `about_body` site_content.
- Mission banner: navy background, quoted text from `about_mission`
- Values grid: 6 items with checkmark icons
- Photo strip: 4 images
- CTA band: gold background

### 8.10 Gallery Page (`/gallery`)
- `<PageHero>` banner
- Image grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- Images from `gallery_items` table (fallback to local images if DB empty)
- Hover: optional label overlay with gradient
- CTA band at bottom

### 8.11 Contact Page (`/contact`)
- `<PageHero>` banner
- 2-column layout: contact info (left) + map/message card (right)
- Contact info: address, phone numbers, email, opening hours (from `site_content`)
- WhatsApp + Call buttons
- Map card with "Open in Maps" link

### 8.12 Delivery Page (`/delivery`)
- `<PageHero>` banner
- How It Works: 3-step numbered process (order, prepare, deliver)
- Image: delivery vehicle photo
- Coverage areas list
- CTA buttons

### 8.13 Bulk Orders Page (`/bulk-orders`)
- `<PageHero>` banner
- 3 feature cards: Large Stock, Trade Pricing, Phased Supply
- CTA card with quote/call buttons

### 8.14 Privacy & Terms Pages
- Static prose content styled with `.prose-content`
- Business-specific legal text
- Contact info block at bottom

### 8.15 PageHero Component (reusable)
- Server component: fetches from `page_heroes` by slug
- Falls back to default props if no DB entry or inactive
- Navy background with optional hero image at 20% opacity overlay
- Renders: section label, h1 heading, description paragraph
- Used on: about, gallery, contact, delivery, products, bulk-orders, quote

---

## 9. Admin Panel — Feature Specification

### 9.1 Admin Layout
- Server component checks auth + fetches user profile
- If no user → redirect to `/admin/login`
- Skips shell on login page (checks `x-pathname` header)
- Passes `role`, `email`, `name` to `<AdminShell>`

### 9.2 AdminShell
- Client component managing sidebar open/close state
- Layout: `pl-0 lg:pl-64` (sidebar width offset)
- Contains `<Sidebar>` + `<Topbar>` + `<main>` content area
- Main content: `p-4 sm:p-6` padding

### 9.3 Sidebar
- 15 navigation items with icons from lucide-react:
  - Dashboard, Point of Sale, Sales, Analytics, Inventory, Invoices, Quote Requests, Content, Hero Slides, Page Heroes, Gallery, Products, Social Links, Theme, Staff
- **Role filtering**: Staff only sees POS, Sales, Inventory, Quotes, Invoices
- Active state: gold background, black text, chevron icon
- Desktop: fixed 256px left sidebar
- Mobile: slide-in from left with backdrop overlay, close on backdrop click or X button
- Footer: "View Public Site" link + Sign Out button

### 9.4 Topbar
- Sticky top, navy background
- Left: mobile hamburger toggle + page title (auto-derived from pathname)
- Right: user email + role badge + dropdown (View Site, Sign Out)

### 9.5 Login Page (`/admin/login`)
- Centred card on navy-deep background
- Logo image + company name
- Email + password inputs (admin-input styling)
- Show/hide password toggle (Eye icon)
- "Sign In" button (gold)
- Error handling via toast
- Supabase `signInWithPassword`

### 9.6 Dashboard (`/admin`)
- **Stat cards**: 6-column responsive grid (2 cols mobile, 3 tablet, 6 desktop)
  1. Total Revenue (gold icon)
  2. Collected Revenue (green) — revenue minus unsettled balances. Shows unsettled amount in orange text below when > 0
  3. Total Sales (green)
  4. Pending Quotes (blue)
  5. Low Stock Items (red)
  6. Outstanding Balances (orange, clickable → `/admin/sales?status=partial`)

- **Revenue Chart** (Recharts): 6-month bar chart, gold bars, navy background. Responsive `<ResponsiveContainer>`.
- **Quick Actions**: 4 link buttons (New Sale, View Quotes, Manage Inventory, Manage Hero Slides)
- **Low Stock Alert**: Red-bordered banner listing items below threshold. Only shows when items exist.
- **Recent Sales Table**: Last 8 sales. Columns: Ref (gold mono), Customer, Method, Total, Status (coloured badge), Date. Horizontal scroll on mobile.

### 9.7 Point of Sale (`/admin/pos`)
- **Split layout**: `flex-col lg:flex-row`
  - Left (2/3): Product picker grid + search. Each product card shows name, price, unit, stock. Click to add to cart.
  - Right (1/3): Cart summary, customer info, payment method, discount, amount paid, change/balance calculation, checkout button.
- **Cart**: line items with qty +/- buttons, unit price, line total, remove button
- **Checkout flow**: Insert sale + sale_items to DB, decrement stock, show receipt
- **Receipt modal**: Printable receipt with company header, items, totals, payment info, sale ref. Print via `window.print()`.
- **Staff picker**: dropdown of active staff for "served by"
- **Sale ref format**: `KK{YYMMDD}-{4-digit random}`

### 9.8 Sales Management (`/admin/sales`)
- **Filters**: status tabs (All, Completed, Partial, Cancelled) + search by ref/customer
- **Sales table**: Ref, Customer, Phone, Method, Total, Paid, Balance, Status, Date, Actions
- **Sale detail modal**: Full breakdown — items list, payment info, notes
- **Actions**: View receipt, mark balance paid, cancel sale
- Horizontal scroll table on mobile

### 9.9 Analytics (`/admin/analytics`)
- **Date presets**: Last 7 Days, Last 30 Days, This Month, This Year, All Time, Custom (date pickers)
- **Summary cards**: 7-column grid (2 mobile, 3 tablet, 4 desktop)
  1. Revenue (gold)
  2. Collected (green) — revenue minus unsettled, shows unsettled sub-text
  3. Cost of Goods (gray)
  4. Gross Profit (green/red based on sign)
  5. Profit Margin (green/yellow/red based on %)
  6. Total Sales (blue)
  7. Items Sold (purple)

- **4 ranked tables** in 2×2 grid (1 col mobile, 2 desktop):
  1. Most Sold Items — bar chart + qty + revenue
  2. Highest Profit Items — bar chart + profit + cost breakdown
  3. Lowest Sold Items — bar chart
  4. Best Customers — bar chart + spend + purchase count

- **Print Report** button: Opens new window with A4-formatted report. Company header, period info, summary cards, all 4 tables with #/Item/Qty/Revenue/Cost/Profit columns, customer table.

- **Profit calculation**: `cost = quantity × (inventory_item.cost_price || unit_price)`. When cost_price is 0/empty, falls back to selling price (0% margin, not inflated profit).

### 9.10 Inventory (`/admin/inventory`)
- **Search**: filter by name or category
- **Table**: Name (with low-stock alert icon), Category, Cost, Price, Margin %, Unit, Stock, Min Threshold, Active, Actions
- **Margin display**: green ≥30%, yellow ≥15%, red <15%. When cost_price is empty, uses selling price as effective cost (0% margin).
- **Cost display**: Shows selling price in italic when cost_price is empty
- **Add/Edit modal**: Name*, Image (upload), Category (dropdown), Unit (dropdown), Cost Price, Selling Price, Stock Qty, Low Stock Alert, Is Service checkbox, Active checkbox
- **Live margin panel** in modal: Shows profit/unit, gross margin %, markup % when price > 0
- **Number inputs**: Clearable zeros — `value={field || ''}` pattern so 0 shows as empty with placeholder
- **Delete**: confirmation dialog

### 9.11 Invoices (`/admin/invoices`)
- **Invoice list**: Number, Customer, Status (badge), Total, Due Date, Created, Actions
- **Status workflow**: draft → sent → paid / cancelled
- **Create/Edit modal**: Customer info, due date, notes, line items (pick from inventory or freeform), auto-calculate subtotal/discount/total
- **Invoice number format**: `INV{YYMMDD}-{RAND}`
- **Print**: Formatted invoice with company header, customer block, items table, totals, notes

### 9.12 Quote Requests (`/admin/quotes`)
- **List**: Name, Phone, Project Type, Status (badge), Date, Actions
- **Status workflow**: new → reviewed → quoted → completed / cancelled
- **Detail view**: All submitted fields, status change dropdown
- **Status badges**: new (blue), reviewed (yellow), quoted (purple), completed (green), cancelled (red)

### 9.13 Content CMS (`/admin/content`)
- **Grouped by section**: header, contact, about, faq, footer, general
- **Key-value pairs**: Each content item has key (read-only) + value (editable textarea/input)
- **FAQ management**: Pairs of `faq_1_q`/`faq_1_a`, `faq_2_q`/`faq_2_a`, etc.
- **Save**: Updates `site_content` table per row

### 9.14 Hero Slides (`/admin/hero-slides`)
- **Slide list**: Each slide shows heading, active badge, sort order, preview text
- **Add/Edit modal**: Tag/Title, Subtitle, Heading*, Body*, Button 1 text + link, Button 2 text + link, Background Image (upload), Sort Order, Active checkbox
- **Toggle**: Show/Hide button per slide
- **Delete**: Confirmation dialog

### 9.15 Page Heroes (`/admin/page-heroes`)
- **Hero list**: Shows page slug, heading, image thumbnail, active badge
- **Add modal**: Page dropdown (about, gallery, contact, delivery, products, bulk-orders, quote — only unused pages shown), Label/Tag, Heading*, Description, Background Image (upload), Active checkbox
- **Edit**: Same fields, page dropdown disabled
- **One per page**: Unique constraint on `page_slug`
- **Delete + Toggle**: Same pattern as hero slides

### 9.16 Gallery (`/admin/gallery`)
- **Image grid**: Thumbnails with labels, sort order, active status
- **Add**: Image upload + optional label + category + sort order
- **Edit/Delete/Toggle**: Standard CRUD

### 9.17 Products (`/admin/products`)
- **Product list**: Name, Slug, Category, Price, Unit, Active, Actions
- **Add/Edit modal**: Name*, Slug (auto-generated from name), Category (dropdown), Description (textarea), Image (upload), Unit (dropdown), Price, Sort Order, Active
- **Delete**: Confirmation
- **11 categories**: Same list as public nav

### 9.18 Social Links (`/admin/social-links`)
- **Platforms**: facebook, instagram, youtube, linkedin, twitter, whatsapp, tiktok
- **Fields**: Platform (dropdown), URL, Sort Order, Active
- **CRUD**: Standard pattern

### 9.19 Theme (`/admin/theme`)
- **Colour editor**: List of CSS variable keys with colour picker inputs
- **Live preview**: Changes applied immediately
- **Save**: Persists to database or local storage

### 9.20 Staff Management (`/admin/staff`)
- **Staff list**: Name, Email, Role (badge), Active status, Actions
- **Create**: Uses Supabase Admin API (server action) — email, password, full name, role
- **Edit**: Update name, role, active status
- **Deactivate**: Soft-disable (is_active = false)
- **Admin-only page**: Redirects non-admin users

---

## 10. Shared Components — Detailed Specs

### ImageUpload
- Props: `value` (current URL), `onChange` (callback), `folder` (storage path), `label`
- Upload zone: dashed border, drag-and-drop, click to browse
- Preview: image with overlay buttons (Change, Remove)
- Storage: Supabase `uploads` bucket, path: `{folder}/{timestamp}-{random}.{ext}`
- Accepted: image/jpeg, image/png, image/webp, image/gif
- Toast on success/error

### ReceiptModal
- Print-optimised layout for thermal printers (80mm width)
- Company header (name, address, phone)
- Sale ref + date
- Items table: qty × name, unit price, line total
- Subtotal, discount, total, amount paid, change/balance
- Status indicator
- Hidden on screen, visible only in print media query

### RevenueChart
- Recharts `<BarChart>` inside `<ResponsiveContainer>`
- Props: `data` array of `{ month: string, revenue: number }`
- Gold bars, no grid, minimal axes
- Navy background card wrapper

---

## 11. Utility Functions (`lib/utils.ts`)

```typescript
cn(...inputs)           // clsx + tailwind-merge
formatCurrency(amount)  // → "₵1,234.56" (Ghana Cedis, en-GH locale)
formatDate(dateStr)     // → "18/06/2026" (DD/MM/YYYY)
formatDateTime(dateStr) // → "18/06/2026 14:30" (24h)
generateInvoiceRef()    // → "INV260618-4821"
generateSaleRef()       // → "KK260618-3947"
slugify(text)           // → "cement-concrete"
```

**Constants:**
```typescript
PRODUCT_CATEGORIES = ['Cement & Concrete', 'Steel & Reinforcement', ...]  // 11 items
STOCK_UNITS = ['bag', 'sheet', 'roll', 'tin', 'piece', 'kg', 'metre', 'bundle', 'set']
PAYMENT_METHODS = [{ value: 'cash', label: 'Cash' }, ...]  // 4 methods
```

---

## 12. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=<optional-email-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 13. Business Context

- **Company**: K.K. Danny Enterprise
- **Location**: Adeiso, Eastern Region, Ghana (opposite Radiance Gas Filling Station, near Point 3 Hotel)
- **Business**: Building materials and hardware supply
- **Currency**: Ghana Cedis (₵ / GHS)
- **Locale**: en-GH
- **Phone numbers**: 3 lines (0244754803, 0249986118, 0240268125)
- **Hours**: Mon–Sat 7am–6pm, Sun 9am–3pm
- **Delivery**: Same-day via cargo tricycle within Adeiso area
- **Target customers**: Individual builders, contractors, housing developers

---

## 14. Critical Implementation Notes

1. **Cost price fallback**: When `cost_price` is 0 or empty, all profit/margin calculations must use the selling price as cost (0% margin). Never show inflated profits for items without cost prices.

2. **Number input clearing**: All numeric form inputs (prices, quantities, thresholds) must use `value={field || ''}` so that `0` displays as empty and shows the placeholder. Users must be able to backspace to clear a field.

3. **Server vs Client components**: Pages that only display data are server components. Pages with interactivity (forms, modals, state) have a thin server component wrapper that fetches data and passes it to a `'use client'` component (e.g., `page.tsx` → `SalesClient.tsx`).

4. **Supabase queries**: Always use `.select()` for column selection. Use `.eq()`, `.neq()`, `.ilike()` for filtering. Use `.order()` for sorting. Handle `null` data gracefully with `?? []` fallbacks.

5. **Image optimization**: Every `<Image>` must have a `sizes` attribute. Use `priority` on above-fold images only. Configure `next.config.ts` to allow Supabase storage domain.

6. **Admin auth pattern**: Every admin page.tsx: `const { data: { user } } = await supabase.auth.getUser()` → redirect if no user. For admin-only pages: also check `profile.role === 'admin'`.

7. **Receipt/report printing**: Use `window.open()` to create a new window, write the HTML, then call `window.print()`. Include company logo via `<base href>` for relative paths.

8. **Toast notifications**: Use `react-hot-toast` for all user feedback. `toast.success()` for saves/deletes, `toast.error()` for failures. Position: top-right.

9. **Delete confirmations**: Always use `window.confirm()` before destructive operations. Never delete without user confirmation.

10. **Responsive testing checklist**: After building each page, verify at 375px, 768px, 1024px, and 1440px. Every table must horizontally scroll. Every modal must be reachable. Every button must be tappable. Every text must be readable.
