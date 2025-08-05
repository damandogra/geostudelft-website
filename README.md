# GEOS Website - Content Management Guide

This guide explains how to add and manage content on the GEOS website. The website uses two types of content formats: MDX files for rich content and TypeScript files for structured data.

## General Guidelines

1. **Images:** Store all images in the appropriate `/public/images/` subdirectory
2. **Dates:** Use ISO format (YYYY-MM-DD) for consistency
3. **Links:** Use absolute URLs for external links, relative paths for internal content
4. **Content updates:** The website automatically rebuilds when content is added or modified

## File Structure

```
/data/
├── events/           # Event MDX files
├── careers/          # Career MDX files
├── gallery/          # Gallery MDX files (organized by year)
├── boardMembers.ts   # Board member data
└── partnersData.ts   # Partner information

/public/images/
├── events/           # Event images
├── careers/          # Career-related images
├── gallery/          # Gallery images (organized by year)
├── board/            # Board member photos
└── partners/         # Partner logos
```

## MDX Format Content

MDX files combine markdown with frontmatter metadata and support rich content including images, links, and custom components.

### Events

**Location:** [`/data/events/`](./data/events/)

Events are stored as `.mdx` files with frontmatter containing event metadata and markdown content for detailed descriptions.

**Example usage:**

```mdx
---
title: 'Lunch Lecture Enginear'
date: '2025-03-05'
time: '12:30 PM – 1:30 PM'
eventType: 'single'
location: 'Hall P'
excerpt: 'Brief description for RSS feeds and previews'
image: '/images/events/lunch-lecture.jpg'
---

Full event description goes here with markdown formatting.

## What to Expect

- Bullet points work
- **Bold text** and _italic text_
- [Links](https://example.com) are supported

Sign up using this form: [Registration Link](https://forms.gle/example)
```

**Required fields:** `title`, `date`, `location`
**Optional fields:** `endDate`, `time`, `eventType`, `excerpt`, `image`

### Careers

**Location:** [`/data/careers/`](./data/careers/)

Career postings follow a similar structure to events but with job-specific metadata.

**Example usage:**

```mdx
---
title: 'Geotechnical Engineer'
company: 'Fugro'
companyLogo: '/images/careers/fugro-logo.png'
location: 'Delft, Netherlands'
description: 'Brief job description'
applicationDeadline: '2024-04-30'
applicationLink: 'https://www.fugro.com/careers'
---

# Detailed Job Description

## About the Role

- Responsibility 1
- Responsibility 2

## Requirements

- Requirement 1
- Requirement 2
```

**Required fields:** `title`, `company`, `companyLogo`, `location`, `description`, `applicationDeadline`, `applicationLink`

### Gallery

**Location:** [`/data/gallery/`](./data/gallery/)

Gallery items are organized by academic year and contain event photos and descriptions.

**Example usage:**

```mdx
---
title: 'Board Transition'
date: '2024-07-05'
image: '/images/gallery/2024-25/board.jpeg'
link: 'https://www.instagram.com/p/example/'
---

Description of the gallery item with markdown support.

#GEOS #Geomatics #BKtudelft #TUDelft
```

**Required fields:** `title`, `date`, `image`, `link`

## TypeScript Format Content

TypeScript files contain structured data in JSON-like format with type definitions for better development experience.

### Board Members

**Location:** [`/data/boardMembers.ts`](./data/boardMembers.ts)

Board member data is organized by academic year with member details and group photos.

**Example usage:**

```typescript
{
  year: '2025 - 2026',
  installationDate: 'April 29, 2025',
  groupPhotoName: 'board_2526.jpg', // Optional group photo
  members: [
    { name: 'Carlo Cordes', role: 'Chairperson', imageName: 'Carlo.jpg' },
    { name: 'Neelabh Singh', role: 'Secretary', imageName: 'Neelabh.jpg' },
    // Add more members...
  ],
}
```

**Image storage:** Place individual photos in `/public/images/board/` and group photos in the same directory.

### Partners Data

**Location:** [`/data/partnersData.ts`](./data/partnersData.ts)

Partner information including logos and descriptions.

**Example usage:**

```typescript
{
  name: 'TU Delft',
  logo: '/images/partners/TUD.png',
  website: 'https://www.tudelft.nl',
  description: 'Delft University of Technology', // Optional but good to have
}
```

**Image storage:** Place partner logos in `/public/images/partners/`
