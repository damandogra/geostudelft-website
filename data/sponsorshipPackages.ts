export interface SponsorshipPackage {
  name: string
  contribution: string
  logoOn: {
    website: string
    geolab: string
    otherMaterial: string
  }
  vacancyPosts: {
    website: string
    geolab: string
    socialMedia: string
  }
  promotionalText: {
    website: string
    geolab: string
    socialMedia: string
  }
  eventsCollab: string
}

export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    name: '1-time vacancy',
    contribution: '€150',
    logoOn: {
      website: 'No',
      geolab: 'No',
      otherMaterial: 'No',
    },
    vacancyPosts: {
      website: 'Once',
      geolab: 'Once',
      socialMedia: 'Once',
    },
    promotionalText: {
      website: 'No',
      geolab: 'No',
      socialMedia: 'No',
    },
    eventsCollab: 'No',
  },
  {
    name: '1-event partner',
    contribution: '€500',
    logoOn: {
      website: 'Once',
      geolab: 'Once',
      otherMaterial: 'Once',
    },
    vacancyPosts: {
      website: 'No',
      geolab: 'No',
      socialMedia: 'No',
    },
    promotionalText: {
      website: 'No',
      geolab: 'No',
      socialMedia: 'No',
    },
    eventsCollab: '1',
  },
  {
    name: 'Silver',
    contribution: '€750',
    logoOn: {
      website: 'Yes',
      geolab: 'Yes',
      otherMaterial: 'Yes',
    },
    vacancyPosts: {
      website: 'Yes',
      geolab: 'Yes - A3 size',
      socialMedia: 'Yes',
    },
    promotionalText: {
      website: 'Yes - 250 words',
      geolab: 'Yes - A3 size',
      socialMedia: '2 / year',
    },
    eventsCollab: '1',
  },
  {
    name: 'Gold',
    contribution: '€1000',
    logoOn: {
      website: 'Yes',
      geolab: 'Yes',
      otherMaterial: 'Yes',
    },
    vacancyPosts: {
      website: 'Yes',
      geolab: 'Yes - A3 size',
      socialMedia: 'Yes',
    },
    promotionalText: {
      website: 'Yes - 250 words',
      geolab: 'Yes - A3 size',
      socialMedia: '4 / year',
    },
    eventsCollab: '2 / year',
  },
]
