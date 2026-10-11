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
    year: '2026 - 2027',
    installationDate: 'June 1, 2026',
    groupPhotoName: 'board_2627.webp',
    members: [
      { name: 'Arda Baysal', role: 'Chairman', imageName: 'Arda.webp' },
      { name: 'Daman Dogra', role: 'Secretary', imageName: 'Daman.webp' },
      { name: 'Julia Fossa Marques', role: 'Events Manager', imageName: 'Julia.webp' },
      { name: 'Belina Aileen Santoso', role: 'External Affairs', imageName: 'Belina.webp' },
      { name: 'Niranjan Pradeep', role: 'Internal Affairs', imageName: 'Niranjan.webp' },
      { name: 'Henryk Gujda', role: 'Communications', imageName: 'Henryk.webp' },
      { name: 'Wieger van Teeffelen', role: 'Treasurer', imageName: 'Wieger.webp' },
    ],
  },
  {
    year: '2025 - 2026',
    installationDate: 'April 29, 2025',
    groupPhotoName: 'board_2526.webp',
    members: [
      { name: 'Carlo Cordes', role: 'Chairperson', imageName: 'Carlo.webp' },
      { name: 'Neelabh Singh', role: 'Secretary', imageName: 'Neelabh.webp' },
      { name: 'Ming-Chieh Hu', role: 'External Affairs', imageName: 'Ming-Chieh.webp' },
      { name: 'Sara Hester Brakelé', role: 'Internal Affairs', imageName: 'Sara.webp' },
      { name: 'Daan Schlosser', role: 'Treasurer', imageName: 'Daan.webp' },
      { name: 'Hongyu Ye', role: 'Social Media', imageName: 'Hongyu.webp' },
    ],
  },
  {
    year: '2024 - 2025',
    installationDate: 'June 7, 2024',
    groupPhotoName: 'board_2425.webp',
    members: [
      { name: 'Michalis Michalas', role: 'Chairperson', imageName: 'Michalis.webp' },
      { name: 'Haohua Gan', role: 'Secretary', imageName: 'Haohua.webp' },
      { name: 'Hidemichi Baba', role: 'External Affairs', imageName: 'Hidemichi.webp' },
      { name: 'Noah Alting', role: 'Events planning', imageName: 'Noah.webp' },
      { name: 'Hyeji Joh', role: 'Educational Affairs', imageName: 'Hyeji.webp' },
      { name: 'Victoria Tsalapati', role: 'Trips', imageName: 'Victoria.webp' },
      { name: 'Shawn Tew', role: 'Treasurer', imageName: 'Shawn.webp' },
      { name: 'Jessica Monahan', role: 'Website', imageName: 'Jessica.webp' },
    ],
  },
  // 2023 - 2024 is archived in boardMembersArchive.ts
  {
    year: '2022 - 2023',
    installationDate: 'February 16, 2022',
    groupPhotoName: 'board_2223.webp',
    members: [
      { name: 'Siebren Meines', role: 'President', imageName: 'Siebren.webp' },
      { name: 'Cynthia Cai', role: 'Secretary', imageName: 'Cynthia.webp' },
      { name: 'Leon Powałka', role: 'Treasurer', imageName: 'Leon.webp' },
      { name: 'Tendai Mbwanda', role: 'External affairs', imageName: 'Tendai.webp' },
      { name: 'Tessel Kaal', role: 'Events', imageName: 'Tessel.webp' },
    ],
  },
]

export default boardMembers
export type { BoardMember, BoardYear }
