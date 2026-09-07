# Justin Marcus Santiago — Portfolio

Professional portfolio for an IT Programmer / Cybersecurity / Systems / Infrastructure professional.
Dark-first enterprise design, zero build step, runs directly on **XAMPP** (`http://localhost/portfolio/`).

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure & SEO metadata |
| `assets/css/style.css` | Design system (dark/light themes, reduced-motion support) |
| `assets/js/config.js` | ⭐ **Edit me** — site stats, contact links, resume filename, SOC modules, skills matrix |
| `assets/js/data.js` | ⭐ **Edit me** — Engineering Lab skills, Projects, IT Operations |
| `assets/js/data2.js` | ⭐ **Edit me** — Architecture layers, workflow, secure-by-design, timeline, certifications |
| `assets/js/main.js` | Theme, navigation, scroll animations, dashboard sparklines, SOC panel, skills matrix |
| `assets/js/app.js` | Modals, projects, ops grid, architecture diagram, timeline, resume tabs |
| `assets/js/interactions.js` | Security scanner demo, terminal easter egg, contact form |
| `api/contact.php` | Secure contact endpoint (CSRF + honeypot + rate limiting + validation) |
| `.htaccess` | Security headers (CSP), caching, compression |

## How to update content

1. Open `assets/js/config.js`, `data.js`, `data2.js`.
2. Replace every `[ ... ]` placeholder (email, LinkedIn, GitHub, certifications, dates, Trend Micro product names).
3. Add real screenshots to a project: put images in `assets/img/` and set `screenshots: ['assets/img/photo.jpg']`.
4. Add GitHub/demo links to any project (`github:` / `demo:` fields).
5. For the downloadable resume: drop your PDF in the project root and set `resumeFile: 'my-resume.pdf'` in `config.js`. Until then, the button generates a printable HTML resume.
6. To receive contact messages by email, configure XAMPP sendmail and uncomment the `mail()` call in `api/contact.php`. Messages are always logged to `api/private_messages.log` (blocked from web access via `.htaccess`).

## Notes

- Dashboard figures are labeled demo data, configurable in `config.js → stats`.
- No fabricated certifications, statistics, or product experience anywhere.
- Accessibility: keyboard navigable, focus indicators, ARIA labels, `prefers-reduced-motion` respected.
