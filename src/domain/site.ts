// Address of the site, used for the absolute links search engines expect
// (canonical, sitemap). Vercel sets it at build time; locally it falls back to
// the address the dev server uses.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Public repository of the site, where visitors report a wrong shortcut.
// It must be public before the site goes live, otherwise the link 404s.
export const SUGGEST_URL =
  process.env.NEXT_PUBLIC_REPO_URL ?? "https://github.com/LucasN-ux/CMDX";
