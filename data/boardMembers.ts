interface BoardMember {
  name: string
  role: string
  imageName: string // filename for the profile picture
}

interface BoardYear {
  year: string
  installationDate: string
  groupPhotoName?: string // filename for the group photo
  members: BoardMember[]
}

const boardMembers: BoardYear[] = [
  {
    year: '2025 - 2026',
    installationDate: 'April 29, 2025',
    groupPhotoName: 'board_2526.jpg',
    members: [
      { name: 'Carlo Cordes', role: 'Chairperson', imageName: 'Carlo.jpg' },
      { name: 'Neelabh Singh', role: 'Secretary', imageName: 'Neelabh.jpg' },
      { name: 'Ming-Chieh Hu', role: 'External Affairs', imageName: 'Ming-Chieh.jpg' },
      { name: 'Sara Hester Brakelé', role: 'Internal Affairs', imageName: 'Sara.jpg' },
      { name: 'Daan Schlosser', role: 'Treasurer', imageName: 'Daan.jpg' },
      { name: 'Hongyu Ye', role: 'Social Media', imageName: 'Hongyu.jpg' },
    ],
  },
  {
    year: '2024 - 2025',
    installationDate: 'June 7, 2024',
    groupPhotoName: 'board_2425.png',
    members: [
      { name: 'Michalis Michalas', role: 'Chairperson', imageName: 'Michalis.jpg' },
      { name: 'Haohua Gan', role: 'Secretary', imageName: 'Haohua.jpg' },
      { name: 'Hidemichi Baba', role: 'External Affairs', imageName: 'Hidemichi.png' },
      { name: 'Noah Alting', role: 'Events planning', imageName: 'Noah.png' },
      { name: 'Hyeji Joh', role: 'Educational Affairs', imageName: 'Hyeji.png' },
      { name: 'Victoria Tsalapati', role: 'Trips', imageName: 'Victoria.png' },
      { name: 'Shawn Tew', role: 'Treasurer', imageName: 'Shawn.png' },
      { name: 'Jessica Monahan', role: 'Website', imageName: 'Jessica.png' },
    ],
  },
  {
    year: '2023 - 2024',
    installationDate: 'February 16, 2023',
    groupPhotoName: 'board_2324.jpg',
    members: [
      { name: 'Oliver', role: 'Chairperson', imageName: 'Oliver.jpg' },
      { name: 'Chi Zhang', role: 'Secretary', imageName: 'Chi.jpg' },
      { name: 'Dimitris Mouzakidis', role: 'External Affairs', imageName: 'Dimitris.jpg' },
      { name: 'Chengzhi Rao', role: 'Events planning', imageName: 'Chengzhi.jpg' },
      { name: 'Eirini Tsipa', role: 'Educational Affairs', imageName: 'Eirini.jpg' },
      { name: 'Walter', role: 'Trips', imageName: 'Walter.jpg' },
      { name: 'Michele', role: 'Treasurer', imageName: 'Michele.jpg' },
      { name: 'Sharath Chandra', role: 'Website', imageName: 'Sharath.jpg' },
    ],
  },
  {
    year: '2022 - 2023',
    installationDate: 'February 16, 2022',
    groupPhotoName: 'board_2223.jpg',
    members: [
      { name: 'Siebren Meines', role: 'President', imageName: 'Siebren.jpg' },
      { name: 'Cynthia Cai', role: 'Secretary', imageName: 'Cynthia.jpg' },
      { name: 'Leon Powałka', role: 'Treasurer', imageName: 'Leon.jpg' },
      { name: 'Tendai Mbwanda', role: 'External affairs', imageName: 'Tendai.jpg' },
      { name: 'Tessel Kaal', role: 'Events', imageName: 'Tessel.jpg' },
    ],
  },
]

export default boardMembers
export type { BoardMember, BoardYear }
