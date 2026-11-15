# ioconnor930.github.io — personal academic website

Static site, no build step. Each page is a plain HTML file; shared pieces live in `assets/`.

## Pages
index.html (home), about.html (biography + career timeline), research.html, projects.html (project timeline + tables),
team.html, service.html, teaching.html, publications.html, writing.html (the Co-Optimized Silicon Stack series; posts are listed in build order inside the page — to add a post, copy one <li> block)

## Files you are most likely to edit
- `assets/publications.js` — the publication list, one entry per line.
  Fields: t type (journal, book, chapter, invited, conference, patent, talk, outreach), y year, ti title, a authors, v venue,
  d DOI (optional), u URL (optional), aw:1 Best Paper Award (optional). Order does not matter.
- `assets/timeline-data.js` — career, responsibilities, projects and events shown in both timelines and in the project tables.
  Dates are "YYYY" or "YYYY-MM"; e:null means ongoing; pt:true is a one-off event; wp:true draws a project as an outline (WP/partner role).
- `assets/citations.js` — Google Scholar figures. Add per-year counts to `byYear` and the bar chart appears on the home page.
- `assets/photo.jpg` — your portrait (square). `assets/cv.pdf` — public CV (no home address or date of birth).
- Text on the other pages: edit the HTML directly. The menu appears in every page; if you add a page, copy the menu into all of them.

## Publishing changes
On GitHub: Add file → Upload files, drop the changed files (or the whole folder), Commit changes. The site updates within a minute or two.
