# Han Shao Personal Website

Static files for the personal website at `https://www.han-shao.com`.

## Local Preview

This repository includes a small Node.js preview server.

```powershell
node preview.mjs
```

Then open `http://127.0.0.1:4173/`.

## Structure

- `index.html`: homepage
- `sections/blog/`: blog index and posts
- `sections/`: site index page
- `sections/travel/`: travel landing page, shared travel CSS/JS, and trip plans under `plans/`
- `home.css`: homepage styles
- `sections/site-index.css`: shared Index / Blog / Travel landing styles
- `sections/docs/site-structure.md`: site structure and non-travel layout notes
- `sections/travel/docs/travel-plan-guidelines.md`: travel plan content and layout guidelines
- `images/profile.png`: profile image
- `CNAME`: custom domain for GitHub Pages
- `preview.mjs`: local preview server

## Deployment

This repository is set up for GitHub Pages. Pushing changes to the default branch updates the published site.
