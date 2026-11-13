# ianoconnor.github.io — personal academic website

A single static page (no build step, no Jekyll/Hugo needed).

## Files
- `index.html` — the whole site: text, styles, scripts, and the full publication list (422 entries, parsed from the October 2026 CV).
- `assets/photo.jpg` — **add your portrait here** (portrait ratio ~4:5). Until then a monogram is shown.
- `assets/cv.pdf` — **add a public version of your CV here** (suggest removing home address and date of birth).
- `.nojekyll` — tells GitHub Pages to serve files as-is.

## Publish on GitHub Pages
1. Create a public repository named exactly `<your-github-username>.github.io`.
2. Upload the contents of this folder (index.html, assets/, .nojekyll, README.md) to the `main` branch.
3. In the repository: Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
4. After a minute the site is live at `https://<your-github-username>.github.io/`.

## Updating
- **Text sections** (About, Research, Projects, Team, Service, Teaching, Contact): edit the HTML directly in `index.html`; each section is marked with a comment like `<!-- ===== PROJECTS ===== -->`.
- **Publications**: near the end of `index.html` is `<script id="pubdata" type="application/json">[...]</script>`. Each entry looks like
  `{"t":"journal","y":2026,"ti":"Title","a":"A. Author, I. O'Connor","v":"Journal, vol., pp., Month 2026","d":"10.xxxx/doi"}`
  - `t` type: journal, book, chapter, invited, conference, patent, talk, outreach
  - `d` (DOI), `u` (URL) and `aw:1` (Best Paper Award) are optional.
  Add new entries anywhere in the array; the page sorts by year.
