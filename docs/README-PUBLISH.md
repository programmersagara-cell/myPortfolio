# Publishing this portfolio on GitHub Pages (static build)

This `docs/` folder is a **static-only build** of the portfolio, ready for GitHub Pages.
The original PHP version (with `/admin` panel and `api/contact.php`) stays in the project
root for XAMPP — GitHub Pages cannot run PHP, so those parts are excluded here.

## What was changed vs. the XAMPP version

- Removed `<script src="api/content.php">` from `index.html` — content comes from
  `assets/js/config.js`, `data.js`, `data2.js` (edit those files to update the site).
- Contact form (`assets/js/interactions.js`) no longer posts to PHP:
  - If `SITE_CONFIG.contact.formEndpoint` is set (e.g. a Formspree URL), it submits there.
  - Otherwise it falls back to opening the visitor's email app (`mailto:`).
- `robots.txt` / `sitemap.xml` point to `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/`
  — replace the placeholders after you know your final URL.
- `.nojekyll` added so GitHub Pages serves files as-is.
- **Excluded (never publish these):** `api/`, `admin/`, `storage/`, `.htaccess`,
  `assets/img/uploads/` — they contain the PHP backend, admin password hash, and private messages.

## How to publish

1. Put your repo on GitHub (keep only `docs/` + a README if you like, or the whole project —
   Pages will only serve `docs/`).
2. On GitHub: **Settings → Pages → Source: "Deploy from a branch" → Branch: main, Folder: /docs → Save**.
3. Your site goes live at `https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/`.
4. Replace `YOUR-GITHUB-USERNAME` / `YOUR-REPO-NAME` in `robots.txt` and `sitemap.xml`.
5. (Optional) For real contact-form emails: create a free form at https://formspree.io and set
   `formEndpoint: 'https://formspree.io/f/XXXX'` in `docs/assets/js/config.js`.
6. Fill in the `[ ... ]` placeholders in `docs/assets/js/config.js` (email, LinkedIn, GitHub, etc.).
