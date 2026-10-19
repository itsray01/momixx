// Leadership shown on /leadership.
//
// HQ's instruction: the founders are shown by role only. No names, no photos and no
// initials anywhere on the site (page, structured data, llms.txt, search), so nothing
// identifies them by name. Bios are as supplied by HQ, in British English, with the
// names taken out.

export type TeamMember = {
  role: string
  bio: string
}

export const team: TeamMember[] = [
  {
    role: 'Founder',
    bio: 'A technologist and business leader with deep expertise in surface engineering, coating technologies and advanced manufacturing. As Group CEO of the Orion Group of Companies, he drives innovation and global growth across its engineering and manufacturing divisions. With over two decades of experience, he has translated materials science into commercial success, holding over 10 patents and 100 research publications. He earned his PhD from Nanyang Technological University and is recognised for bridging scientific innovation with large-scale industrial impact.',
  },
  {
    role: 'Founder',
    bio: 'A seasoned entrepreneur and business leader with over three decades of experience in materials manufacturing and industrial innovation. He founded and grew a manufacturing enterprise that became one of Apple’s top 200 global suppliers before leading it through a successful merger and acquisition in 2018. As Group Chairman of the Orion Group of Companies, he drives strategic growth and governance across its portfolio. He also serves as a Non-Executive Director at Ternary Fund Management and actively supports community causes such as the Sian Chay Medical Institution.',
  },
]

export const teamReady = team.length > 0
