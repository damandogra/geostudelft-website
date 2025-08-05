interface Partner {
  name: string
  logo: string
  website: string
  description?: string
}

const partnersData: Partner[] = [
  {
    name: 'TU Delft',
    logo: '/images/partners/TUD.png',
    website: 'https://www.tudelft.nl',
    description: 'Delft University of Technology',
  },
  {
    name: 'Readar',
    logo: '/images/partners/Readar.png',
    website: 'https://readar.com',
    description: 'Geotechnical engineering solutions',
  },
  {
    name: 'GeoDelta',
    logo: '/images/partners/geodelta.png',
    website: 'https://geodelta.nl',
    description: 'Geotechnical consulting services',
  },
  {
    name: 'Enginear',
    logo: '/images/partners/enginear.png',
    website: 'https://enginear.nl',
    description: 'Employment agency with a focus on Engineering and Geo-information.',
  },
  {
    name: 'CGI',
    logo: '/images/partners/CGI.png',
    website: 'https://cgi.com',
    description: 'IT consulting and services',
  },
]

export default partnersData
export type { Partner }
