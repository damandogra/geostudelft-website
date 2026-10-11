# Changelog

Notable changes to geostudelft.nl, grouped into New, Improved, Fixed and Removed.

v1.0.0 is the original site, tagged on `main`.

## 2.0.0 (2026-10-11)

The 2026 redesign: Next.js 16 and React 19, a design and accessibility pass, a new homepage hero, and the 2026–27 events.

### New

- **Point-cloud hero.** The "Welcome to GEOS!" slide has an original LiDAR-style city background: blue and green points on deep navy, with pink accents that match the buttons. `scripts/generate-hero.mjs` re-renders it from a seed and fails if white text drops below 4.5:1 contrast at phone, tablet or desktop size.
- **Carousel controls.** A pause/play button. The slideshow also holds while the pointer or keyboard focus is on it, and starts paused for visitors who prefer reduced motion.
- **Poster slides.** A `split` slide layout shows a poster whole beside the slide text, on a solid background (used for Geomatics Day 2026).
- **Current page in the navigation.** The header and mobile menu mark the page you're on, with `aria-current` and an underline.
- **Multi-photo gallery entries.** The optional `images` field shows extra photos next to the cover: side by side on desktop, stacked on phones. Gallery entries can also link to a page on this site, which opens in the same tab.
- **Events:** Welcome Event 2026, INTERGEO 2026 @ Munich, Lunch Lecture: Adrien Ravon and Geomatics Day 2026. **Gallery:** INTERGEO 2026.
- **Event page metadata.** Each event page has its own title and description for search results and link previews.
- **Closed vacancies.** A posting past its deadline keeps its page, with a "This vacancy has closed" notice and a link to current opportunities.
- **Shared styles:**
  - a `PageHeader` component for the title block on Events, About, Gallery, Careers and Partners;
  - button styles `btn-primary`, `btn-secondary` and `btn-muted`;
  - a `card` style.
- **`scripts/screenshot.mjs`** captures pages of the running site at exact viewport widths, for visual checks.

### Improved

- **Framework upgrade:**
  - Next.js 14 → 16;
  - React 18 → 19;
  - ESLint 8 → 9 with a flat config (Next core-web-vitals and TypeScript rules, jsx-a11y, Prettier).
- **Colour contrast meets WCAG AA (4.5:1).** The site keeps its pink palette but uses darker shades for text and buttons:
  - buttons are `primary-600` with white text (4.5:1);
  - links are `primary-700` (5.9:1).
- **Consistent design.** Event, career, gallery, board and partner cards share one card style, and buttons and section spacing match across pages.
- **Header.** Navigation links show inline from 768px wide, with the menu button below that. This replaces a clipped, scrolling link list between 640 and 767px.
- **Carousel on phones.** Slide text is sized down so headings and buttons fit at 375px.
- **Homepage Events photo.** It's now the GEOS group at INTERGEO. The photo is colour-corrected and cropped so everyone's face stays in view at every screen width.
- **Hero readability.** The point-cloud slide keeps its text area dark by design, so its overlay drops from 50% to 15% black. A slow drift animation is off for visitors who prefer reduced motion.
- **Images are WebP.** Converting every image cut their total size from 63.6 MB to 8.9 MB.
- **Lighter pages:**
  - the footer map loads only when scrolled into view;
  - career logos and event images declare their display size, so phones download smaller files.
- **Event status.**
  - "Upcoming" and "Past event" labels are worked out on the server, so event cards no longer flash a loading placeholder.
  - Pages re-render hourly, so the labels update without a redeploy.
- **Careers.** The careers page, homepage and sitemap list only open vacancies.
  - A posting stays open through its whole deadline day (Amsterdam time).
  - It leaves the careers page and homepage within the hour after, and the sitemap on the next deploy.
- **Content editor guide.** `README.md` covers WebP images and the gallery `images` field.

### Fixed

- **Accessibility:**
  - **Homepage headings.** The homepage has exactly one `<h1>`; carousel slide titles are `<h2>`.
  - **Carousel:**
    - slides that are off screen can't be focused or read;
    - slide changes are announced only when the visitor moves the slides;
    - the dots are 24px tap targets;
    - arrow keys no longer change slides from anywhere on the page.
  - **Event cards.** A single link styled as a button replaces a `<button>` nested inside a link. Titles are headings, and each "View event" link names its event for screen readers.
  - **Mobile menu.** It has a dialog title, visible focus rings and `aria-expanded` on the menu button.
  - **Focus rings.** Every link and button shows a visible focus ring.
  - **Smaller fixes:**
    - social icons are labelled "Email", "LinkedIn" and "Instagram";
    - decorative icons are hidden from screen readers;
    - gallery links that open a new tab say so;
    - heading levels on the partner cards and footer are corrected.
- **Event timing.** Events counted as past from their start time, in whichever time zone the server or the visitor's browser used. Now an event ends:
  - at its end time on its last day (`endDate` for multi-day events), in Amsterdam time;
  - the next morning, for time ranges that run past midnight;
  - at midnight after the last day, when it has no end time.
- **Carousel image position.** The class was built at runtime (`object-${imagePosition}`), so Tailwind could leave it out of the CSS.
- **404 page.** It used an off-brand blue button and had a "dont" typo.
- **Double slashes.** The trailing slash in `siteUrl` produced `//` in sitemap, robots.txt and RSS URLs.
- **Pre-commit hook.** It was never installed. lint-staged now runs ESLint and Prettier on every commit.
- **Wrong field.** The careers and partners pages described "geotechnical engineering" instead of geomatics and geosciences.
- **MDX rendering.** Event and gallery pages rebuilt their MDX component on every render with `useMDXComponent`, which React 19's compiler rules flag. They now render MDX with `MDXLayoutRenderer`.

### Removed

- **Dark mode.** `next-themes` and the theme provider are gone, and the site is light-only.
- **`body-scroll-lock`.** Headless UI's dialog already locks page scrolling while the mobile menu is open.
- **Unused template features:**
  - the newsletter API route;
  - site search;
  - giscus comments;
  - maths and code highlighting in MDX;
  - the Partner MDX type (partners live in `data/partnersData.ts`);
  - unused components and social icons;
  - the GitHub funding and issue templates.
- **Unneeded security-policy exceptions.** The Content Security Policy no longer allows giscus, Amazon S3 media or picsum.photos.
- **Unused images.** These include a 5.8 MB `flow.gif` and the old homepage hero and Events photos.
- **2023–24 board.** It's off the About page and kept in `data/boardMembersArchive.ts`.
- **`data/careers/kadaster-internships.md`.** The content pipeline only reads `.mdx`, so this file was never shown.
- **`npm run serve`.** Use `npm start`, which now serves the production build; it used to start the dev server, which is `npm run dev`.

## 1.0.0
