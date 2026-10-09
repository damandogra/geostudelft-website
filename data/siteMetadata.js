/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'GEOS Geomatics Student Association',
  author: 'GEOS',
  headerTitle: 'GEOS',
  description: 'GEOS is the Geomatics Student Association of the TU Delft. We are a student-run organization that provides a platform for geomatics students to connect, learn, and grow.',
  language: 'en-GB',
  theme: 'light', // system, dark or light
  siteUrl: 'https://www.geostudelft.nl', // no trailing slash: sitemap, robots and RSS append '/path'
  siteLogo: `${process.env.BASE_PATH || ''}/images/geos_logo_text.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/images/geos_logo_text.png`,
  email: 'geos@tudelft.nl',
  linkedin: 'https://www.linkedin.com/company/geostudelft/',
  instagram: 'https://www.instagram.com/geomaticsdelft/',

  locale: 'en-NL',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
}

module.exports = siteMetadata
