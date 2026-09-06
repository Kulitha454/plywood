# Plywood Sandakelum — Website & GA4 Learning Laboratory

Modernized, mobile-first static website for **Plywood Sandakelum** (Ganemulla, Sri Lanka), supplier of quality plywood boards, shutter sheets, and engineered wood materials.

Built with semantic HTML5, modern vanilla CSS (fluid CSS Grid/Flexbox, custom design tokens, dark/light mode), vanilla JavaScript, and Google Analytics 4 (GA4) instrumentation.

---

## 1. GitHub Pages Deployment

This repository is built with **zero build steps** and **purely relative paths**, meaning it deploys immediately to GitHub Pages.

### Setup Instructions:
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Modernize Plywood Sandakelum website and instrument GA4"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **Deploy from a branch**.
   - Select the `main` branch and `/ (root)` folder.
   - Click **Save**.
3. Your live site will be published at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
   *(All internal links, images, and stylesheets use relative paths with no leading slashes, so they function seamlessly on both root domains and subpaths).*
4. The `.nojekyll` file at the root ensures GitHub Pages bypasses Jekyll processing.

---

## 2. Google Analytics 4 (GA4) Setup & Measurement

All 4 HTML pages (`index.html`, `aboutus.html`, `all.html`, `contact.html`) include the official Google `gtag.js` snippet with a placeholder ID (`G-XXXXXXX`).

### Connecting Your Real GA4 Property:
1. In [Google Analytics](https://analytics.google.com/), create a GA4 property and Web Data Stream.
2. Copy your Measurement ID (formatted as `G-XXXXXXXXXX`).
3. In `index.html`, `aboutus.html`, `all.html`, and `contact.html`, replace all occurrences of `G-XXXXXXX` with your real Measurement ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true });
   </script>
   ```

### Console Debug Mode:
`main.js` contains a built-in console logger. Even before swapping `G-XXXXXXX`, open your browser DevTools Console to inspect events as they fire with `[GA4 Event]` group tables!

---

## 3. GA4 Events & Conversions Reference

| Event Name | Trigger | Captured Parameters | Purpose |
| :--- | :--- | :--- | :--- |
| **`generate_lead`** ⭐ | Quote request submitted on `contact.html` | `currency: 'LKR'`, `value: 1`, `lead_type: 'quote_request'`, `product_interest`, `customer_name`, `phone_provided` | **Primary Key Conversion** |
| **`phone_click`** | Click on any `tel:` phone link | `phone_number`, `link_location` (`header`, `footer`, `contact_ribbon`, `contact_cards`), `page_path` | Lead intent tracking |
| **`whatsapp_click`** | Click on WhatsApp link / chat button | `phone_number`, `link_location`, `page_path` | Direct chat conversion |
| **`view_item`** | Product card scrolled into view (50% threshold) | `item_id`, `item_name`, `item_category`, `page_path` | Product interest & catalog engagement |
| **`select_item`** | Click on product card or quote button | `item_id`, `item_name`, `item_category`, `page_path` | Product selection |
| **`select_content`** | Nav link click or theme toggle | `content_type` (`navigation`, `theme_toggle`, `scroll_to_top`), `item_id` | Navigation flow |

> [!IMPORTANT]
> ### Marking `generate_lead` as a Key Conversion in GA4:
> In the Google Analytics 4 interface:
> 1. Go to **Admin** (gear icon) → **Data display** → **Events**.
> 2. Once your first test submission sends a `generate_lead` event (or under **Admin** → **Key events**), toggle the switch next to **`generate_lead`** to **Mark as key event / conversion**.
> 3. You can watch this event in real time under **Admin** → **DebugView**!

---

## 4. Business Information Standard

- **Business Name**: Plywood Sandakelum
- **Address**: No. 241/A, Kadawatha-Ganemulla Road, Ganemulla, Sri Lanka
- **Primary Phone**: 070 366 2466 (`+94 70 366 2466`)
- **Hotline & WhatsApp**: 074 150 2503 (`+94 74 150 2503`)
- **Hours**: Monday – Sunday, 9:00 AM – 6:00 PM
