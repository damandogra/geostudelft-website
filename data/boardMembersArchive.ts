import type { BoardYear } from './boardMembers'

// Boards taken off the About page, kept for the record. Not rendered anywhere.
// Their photos were never added to public/images/board.
const archivedBoardMembers: BoardYear[] = [
  {
    year: '2023 - 2024',
    installationDate: 'February 16, 2023',
    groupPhotoName: 'board_2324.webp',
    members: [
      { name: 'Oliver', role: 'Chairperson', imageName: 'Oliver.webp' },
      { name: 'Chi Zhang', role: 'Secretary', imageName: 'Chi.webp' },
      { name: 'Dimitris Mouzakidis', role: 'External Affairs', imageName: 'Dimitris.webp' },
      { name: 'Chengzhi Rao', role: 'Events planning', imageName: 'Chengzhi.webp' },
      { name: 'Eirini Tsipa', role: 'Educational Affairs', imageName: 'Eirini.webp' },
      { name: 'Walter', role: 'Trips', imageName: 'Walter.webp' },
      { name: 'Michele', role: 'Treasurer', imageName: 'Michele.webp' },
      { name: 'Sharath Chandra', role: 'Website', imageName: 'Sharath.webp' },
    ],
  },
]

export default archivedBoardMembers
