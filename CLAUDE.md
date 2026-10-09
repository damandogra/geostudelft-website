# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for GEOS, the Geomatics student association at TU Delft (geostudelft.nl). It is built from the `tailwind-nextjs-starter-blog` template: Next.js 16 App Router with React 19, Contentlayer2 for MDX content, Tailwind CSS v4, and `pliny` for analytics and MDX helpers. Node 22.x, npm. It deploys on Vercel.

## Commands

```bash
npm install
npm run dev        # next dev --webpack (contentlayer regenerates on content changes)
npm run build      # next build --webpack, then scripts/postbuild.mjs (writes RSS feed to public/feed.xml)
npm run serve      # serve the production build
npm run lint       # eslint --fix over app/, components/, data/, lib/, scripts/ (rewrites files)
npx eslint app components data lib scripts   # lint without fixing
npm run analyze    # build with bundle analyzer
```

**Keep `--webpack` on `dev`, `build`, and `analyze`.** Next 16 builds with Turbopack by default. `next-contentlayer2` only generates `.contentlayer/` from a webpack compiler hook, so under Turbopack no content is generated and the build fails.

There is no test suite. To verify a change, run `npm run build`: it fails on content that doesn't match the Contentlayer schema and on type errors. `next build` no longer lints, so run lint separately. Formatting is Prettier: no semicolons, single quotes, `printWidth: 200`, and Tailwind class sorting.

**ESLint.** `eslint.config.mjs` is a flat config built from `eslint-config-next`'s `core-web-vitals` and `typescript` presets, plus jsx-a11y's recommended rules and Prettier. ESLint stays on v9 because plugins bundled by `eslint-config-next` (react, import, jsx-a11y) don't support v10. The React Compiler rules are on, so don't create components during render; for example, don't call `useMDXComponent` inside a component body.

Build-time env flags read in `next.config.js` and `app/layout.tsx`: `EXPORT` (static export to `out/`), `BASE_PATH`, `UNOPTIMIZED` (disables image optimization).

## Architecture

**Content pipeline.** `contentlayer.config.ts` reads `data/` and generates typed collections into `.contentlayer/generated` (gitignored). Pages import them as `allEvents`, `allCareers`, and `allGalleries` from `contentlayer/generated`. Document types and their globs:
- `Event`: `data/events/*.mdx`. Required: `title`, `date`, `location`. Optional `eventType` is one of `single | multi-day | all-day`.
- `Career`: `data/careers/**/*.mdx`. All fields are required, including `companyLogo`, `applicationDeadline`, and `applicationLink`.
- `Gallery`: `data/gallery/**/*.mdx`, grouped by academic-year folders like `2025-26/`. Gallery cards link out to `link`, usually an Instagram post.
- `Partner` is defined, but `data/partners/` doesn't exist. The partners page reads `data/partnersData.ts`.

Only `.mdx` files match these globs. A `.md` file in a content folder, such as `data/careers/kadaster-internships.md`, is skipped with a build warning.

The computed `slug` is the file path with its first directory removed (`events/kick-off.mdx` → `kick-off`), so the file name sets the URL `/events/<slug>`. Contentlayer stores `date` fields as UTC-midnight ISO strings like `'2025-11-07T00:00:00.000Z'`.

Render MDX bodies with `<MDXLayoutRenderer code={doc.body.code} />` from `pliny/mdx-components`. Dynamic route pages are `async` and must `await params`, since `params` is a Promise in Next 16.

**Structured data in TypeScript.** Content that isn't MDX lives in `data/*.ts`:
- `boardMembers.ts`: one entry per academic year, newest first. Each entry stores image *file names*, which `components/BoardMembers.tsx` resolves to `/images/board/<name>`. If the group photo is missing, the component falls back to `groupfoto_fallback.jpg`.
- `partnersData.ts`: partner logos and links.
- `sponsorshipPackages.ts`: sponsorship packages.
- `headerNavLinks.ts`: navigation links.
- `siteMetadata.js`: site-wide config (URLs, socials, analytics). It is CommonJS because `scripts/rss.mjs` and `contentlayer.config.ts` also import it. `siteUrl` has no trailing slash because the sitemap, robots.txt, and RSS feed append `/path` to it.

**Images.** Images are static files under `public/images/{events,careers,gallery/<year>,board,partners,home}` and are referenced by absolute path, for example `/images/events/foo.jpg`.

**Event status.** `isEventPast` in `lib/events.ts` (imported as `@/lib/events`) is the single source for past/upcoming. Both `/events` (it passes `isPast` into `EventCard`) and the homepage's "Upcoming" badge call it on the server. Both pages set `revalidate = 3600` so labels update hourly without a redeploy. Rules:
- An event is past once it has *ended*, in Europe/Amsterdam time regardless of the server's time zone.
- The last day is `endDate` for `multi-day` events, otherwise `date`.
- If `time` is a range such as `'1:45 PM – 6:00 PM'` or `'18:00 – 21:00'`, the event ends at the end time on the last day. Ranges can be separated by an en dash, a hyphen, an em dash, or "to". An end at or before the start rolls over to the next day.
- With no end time (no `time`, or only a start time), the event ends at midnight after the last day.

**Security headers.** `next.config.js` sets a strict CSP. To embed a new third-party script, iframe, or media host, add it to `ContentSecurityPolicy`.

## Content authoring

`README.md` is the content-editor guide. It has frontmatter examples for each content type. Use ISO dates (`YYYY-MM-DD`) in frontmatter.
