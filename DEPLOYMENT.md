# K.K. Danny Enterprise — Deployment Guide

A step-by-step guide for a novice developer or business owner to get this website live.

---

## What You Will Have When Done

- A **public website** at `kkdannyenterprise.com` (or your chosen domain) showing:
  - Home page with auto-sliding hero photos, product categories, gallery, and FAQ
  - About, Products, Gallery, Blog, Quote form, Contact, and Delivery pages
  - Fully responsive on phones, tablets, and desktop screens

- A **private admin dashboard** at `yoursite.com/admin` for:
  - **POS** — process sales and print thermal receipts
  - **Inventory** — manage stock levels and get low-stock alerts
  - **Quotes** — review and respond to customer quote requests
  - **Content** — edit website text, hero slides, gallery, products, blog posts
  - **Staff** — create and manage staff accounts

---

## Prerequisites (What You Need First)

1. A computer with internet access
2. A **free** [GitHub account](https://github.com) (for storing your code)
3. A **free** [Supabase account](https://supabase.com) (your database and authentication)
4. A **free** [Vercel account](https://vercel.com) (for hosting the website)
5. Node.js installed on your computer → download from [nodejs.org](https://nodejs.org) (choose LTS version)

---

## Part 1 — Set Up Supabase (Database)

Supabase is your database and handles staff logins. Everything is free to start.

### Step 1.1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
3. Fill in:
   - **Organisation**: your name or company name
   - **Project name**: `kkdanny-enterprise`
   - **Database password**: choose a strong password (save it!)
   - **Region**: choose closest to Ghana — **Europe West** is a good choice
4. Click **Create new project** and wait 1-2 minutes for it to be ready

### Step 1.2 — Run the Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project folder
4. Copy ALL the text in that file and paste it into the SQL editor
5. Click **Run** (the green play button)
6. You should see "Success. No rows returned." — that means it worked

### Step 1.3 — Run the Seed Data

1. Click **New Query** again in the SQL Editor
2. Open the file `supabase/seed.sql` from this project folder
3. Copy ALL the text and paste it into the SQL editor
4. Click **Run**
5. You should see "Success." — your products, slides, and content are now loaded

### Step 1.4 — Create Storage Buckets

1. In Supabase, click **Storage** in the left sidebar
2. Click **New bucket** and create these buckets (check **Public bucket** for each):
   - `hero-images`
   - `product-images`
   - `blog-covers`
   - `gallery-images`
3. For `uploads` bucket — create it but leave it **private** (unchecked)

### Step 1.5 — Get Your Supabase Keys

1. In Supabase, click **Project Settings** (gear icon at the bottom left)
2. Click **API** in the settings menu
3. You will see:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`
   - **service_role** key — another long string (keep this secret!)
4. Copy these — you will need them in Part 2

### Step 1.6 — Create Your First Admin Account

1. In Supabase, click **Authentication** in the left sidebar
2. Click **Users**, then **Add user** → **Create new user**
3. Fill in an email address and a password for the admin account
4. After creating, click on the user in the list
5. Under **User metadata**, add: `{"role": "admin", "full_name": "Your Name"}`
6. Click **Save**

> **Important:** The `role: "admin"` in metadata is what gives the account full access. Without this, the account will be created as staff.

---

## Part 2 — Configure the Project

### Step 2.1 — Install Dependencies

1. Open your computer's terminal / command prompt
2. Navigate to the website folder:
   ```
   cd "C:\Users\samam\Desktop\DEVELOPER\K.K. Danny\website"
   ```
3. Run:
   ```
   npm install
   ```
4. Wait for it to complete (may take 1-2 minutes)

### Step 2.2 — Create Your Environment File

1. In the `website` folder, find the file named `.env.local.example`
2. Make a copy of it and rename the copy to `.env.local`
3. Open `.env.local` in a text editor (Notepad, VS Code, etc.)
4. Fill in your details from Step 1.5:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-service-role-key...

RESEND_API_KEY=re_...    (optional — for email notifications)
RESEND_FROM_EMAIL=noreply@kkdannyenterprise.com

NEXT_PUBLIC_SITE_URL=https://kkdannyenterprise.com
```

Replace each value with your actual keys from Supabase.

### Step 2.3 — Test Locally

1. In the terminal, run:
   ```
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`
3. You should see the K.K. Danny Enterprise website
4. Go to `http://localhost:3000/admin/login` and sign in with the admin account you created

---

## Part 3 — Deploy to Vercel (Go Live)

Vercel hosts your website for free and gives it a public URL.

### Step 3.1 — Upload to GitHub

1. Go to [github.com](https://github.com) and log in
2. Click the **+** button → **New repository**
3. Name it `kkdanny-enterprise`
4. Keep it **Private** (unless you want it public)
5. Click **Create repository**
6. Follow the instructions on screen to upload your project, OR use the GitHub Desktop app (easier for beginners):
   - Download [GitHub Desktop](https://desktop.github.com/)
   - Open it and sign in
   - Click **File → Add Local Repository**
   - Browse to your `website` folder
   - Click **Publish repository** and choose the `kkdanny-enterprise` repo

### Step 3.2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (use your GitHub account)
2. Click **Add New → Project**
3. Select your `kkdanny-enterprise` repository from the list
4. Click **Import**
5. In the **Environment Variables** section, add all the variables from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
   - `NEXT_PUBLIC_SITE_URL` = `https://kkdanny-enterprise.vercel.app` (update after deploying)
6. Click **Deploy**
7. Wait 2-3 minutes. Vercel will build and host your site automatically.
8. When done, click **Visit** to see your live website!

---

## Part 4 — Connect a Custom Domain (Optional)

If you have a domain like `kkdannyenterprise.com`:

1. In Vercel, go to your project → **Settings → Domains**
2. Type your domain name and click **Add**
3. Vercel will show you DNS settings to configure at your domain registrar
4. Go to your domain registrar (wherever you bought the domain) and update the DNS records as instructed
5. Wait up to 48 hours for DNS to update worldwide
6. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to your full domain

---

## Part 5 — Using the Admin Dashboard

Once the site is live, visit `yoursite.com/admin/login` to sign in.

### Daily Operations

**Recording a Sale (POS)**
1. Go to **Admin → POS**
2. Click items from the left panel to add them to the cart
3. Enter customer name and phone (optional, for receipt)
4. Enter the amount paid
5. Select payment method (Cash, Mobile Money, etc.)
6. Click **Complete Sale & Print Receipt**
7. The receipt will appear. Click **Print Receipt** to print to your thermal printer.

**Reprinting a Previous Receipt**
1. Go to **Admin → Sales**
2. Find the sale in the list (search by ref or customer name)
3. Click **Print** to reprint the receipt

**Managing Inventory**
1. Go to **Admin → Inventory**
2. Click **Add Item** to add new products to sell in POS
3. Click the pencil icon to edit prices or stock quantities
4. Items with a ⚠️ icon are running low on stock

**Responding to Quote Requests**
1. Go to **Admin → Quotes**
2. New quotes from the website form appear here
3. Click the eye icon to see full details
4. Call the customer using the phone number shown
5. Update the status (Reviewed, Quoted, Completed) as you progress

**Adding Gallery Photos**
1. Go to **Admin → Gallery**
2. Click **Add Photo**
3. First upload the photo to Supabase Storage:
   - Go to Supabase → Storage → `gallery-images` bucket → Upload file
   - After uploading, right-click the file → **Copy URL**
4. Paste the URL into the Image URL field in the gallery admin
5. Add a label and click Save

**Editing Website Text**
1. Go to **Admin → Content**
2. Find the text you want to change by scrolling or searching
3. Click in the text box, make your changes
4. Click **Save** on that line

**Adding/Editing Hero Slides**
1. Go to **Admin → Hero Slides**
2. Click the pencil icon to edit a slide, or **Add Slide** for a new one
3. Upload photos to Supabase Storage (hero-images bucket) first, then paste the URL

---

## Part 6 — Adding Email Notifications (Optional)

To receive an email when someone submits a quote form:

1. Sign up at [resend.com](https://resend.com) (free tier available)
2. Verify your domain email address
3. Get your API key from the Resend dashboard
4. Add to Vercel environment variables:
   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_FROM_EMAIL` = `noreply@kkdannyenterprise.com`
5. Redeploy from Vercel dashboard (trigger a new deploy)

---

## Part 7 — Setting Up Thermal Receipt Printer

The POS is designed for 80mm thermal receipt printers (very common in Ghana).

1. Connect your thermal printer to the computer via USB or Bluetooth
2. Install the printer driver (usually comes with the printer)
3. Set the printer as your default printer, OR select it manually when printing
4. In the receipt print dialog, set:
   - **Paper size**: Custom — 80mm wide
   - **Margins**: Minimum / None
   - **Scale**: 100%
5. Test print after your first sale

> Common 80mm thermal printer brands: Xprinter, EPSON TM-T20, RP80USE, ZJ-8250

---

## Part 8 — Backup and Maintenance

- Your data is stored in Supabase which automatically backs up daily (on paid plans)
- For the free plan, periodically export data:
  - Supabase → SQL Editor → run `SELECT * FROM sales` and export as CSV
- Update the website when needed by pushing changes to GitHub — Vercel automatically redeploys
- Keep your Supabase and Vercel accounts active by logging in at least once a month

---

## Troubleshooting

**Site shows blank page / errors after deployment**
- Check that all environment variables are set correctly in Vercel
- Check Vercel → your project → **Deployments** → click latest → **View Logs**

**Admin login not working**
- Make sure the user was created in Supabase Auth with the correct email
- Check the user has `role: "admin"` in user metadata
- Try "Forgot Password" to reset

**Images not showing**
- Confirm the image URL in Supabase Storage is marked as public
- Check the bucket policy allows public reads

**Receipt not printing**
- Make sure the printer is connected and set as default
- Try `Ctrl+P` (Print) while on the receipt preview page
- Disable any browser extensions that block pop-ups

---

## File Structure Reference

```
website/
├── app/
│   ├── (public)/          ← Public website pages
│   │   ├── page.tsx         Home
│   │   ├── about/           About page
│   │   ├── products/        Products + category pages
│   │   ├── gallery/         Photo gallery
│   │   ├── blog/            Blog list + article pages
│   │   ├── quote/           Quote request form
│   │   ├── contact/         Contact page
│   │   └── delivery/        Delivery info
│   └── admin/             ← Staff-only dashboard
│       ├── login/           Sign-in page
│       ├── pos/             Point of Sale + receipt
│       ├── sales/           Sales history
│       ├── inventory/       Stock management
│       ├── quotes/          Quote requests
│       ├── content/         Website text editing
│       ├── hero-slides/     Manage hero slider
│       ├── gallery/         Manage photo gallery
│       ├── products/        Manage product listings
│       ├── blog/            Write blog posts
│       ├── social-links/    Social media URLs
│       ├── theme/           Brand colours
│       └── staff/           Staff accounts
├── supabase/
│   ├── schema.sql          Database tables + security rules
│   └── seed.sql            Starting content and products
├── public/
│   ├── logo.jpeg           Company logo
│   └── images/             Product and yard photos
└── .env.local              Your secret keys (never share this file)
```

---

## Getting Help

- Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- For website-specific issues, check the error messages in the browser console (press F12 → Console tab)

---

*Built for K.K. Danny Enterprise, Adeiso, Eastern Region, Ghana. © 2025*
