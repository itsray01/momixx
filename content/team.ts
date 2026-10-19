// Leadership shown on /leadership.
//
// Add each person with their name, title and, when supplied, a 2–3 sentence bio.
// Photos: a portrait (at least 1200 px tall, 4:5) in /public/images/team/, then set
// `photo`. Until a photo is set the page shows the person's initials.
// The first entry is featured; anyone after it is shown in a grid below.

export type TeamMember = {
  /** Honorific shown before the name, e.g. 'Dr'. Kept apart so initials and structured data use the name alone. */
  honorific?: string
  name: string
  role: string
  bio?: string
  photo?: string
  linkedin?: string
  /**
   * Bios still being agreed: shown one under the other on preview deployments only
   * (never on the live site). `highlight` marks the version as supplied, for review.
   */
  draftBios?: Array<{ label: string; text: string; highlight?: boolean }>
}

export const team: TeamMember[] = [
  {
    honorific: 'Dr',
    name: 'Cheah Li Kang',
    role: 'Chief Executive Officer',
    // The only photo supplied: cropped to 4:5 above the name printed on it, then enlarged
    // (Lanczos, light sharpening; no AI, so his features are unchanged).
    photo: '/images/team/cheah-li-kang.webp',
    draftBios: [
      {
        label: 'As supplied (British English)',
        highlight: true,
        text: 'Dr Cheah is a technologist and business leader with deep expertise in surface engineering, coating technologies, and advanced manufacturing. As Group CEO of the Orion Group of Companies, he drives innovation and global growth across its engineering and manufacturing divisions. With over two decades of experience, he has translated materials science into commercial success, holding over 10 patents and 100 research publications. Dr Cheah earned his PhD from Nanyang Technological University and is recognised for bridging scientific innovation with large-scale industrial impact.',
      },
      {
        label: 'Suggested',
        text: 'Dr Cheah Li Kang is a technologist and business leader with deep expertise in surface engineering, coating technologies and advanced manufacturing. As Chief Executive Officer, he leads MoMixx’s innovation and growth across its engineering and manufacturing businesses. In more than 20 years, he has turned materials science into commercial products. He has been granted more than 10 patents and has authored or co-authored more than 100 research papers. He holds a PhD in Electrical and Electronic Engineering from Nanyang Technological University, Singapore.',
      },
    ],
  },
]

export const teamReady = team.length > 0

export const displayName = (m: TeamMember) => (m.honorific ? `${m.honorific} ${m.name}` : m.name)
