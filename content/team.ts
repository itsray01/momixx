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
}

export const team: TeamMember[] = [
  {
    honorific: 'Dr',
    name: 'Cheah Li Kang',
    role: 'Chief Executive Officer',
  },
]

export const teamReady = team.length > 0

export const displayName = (m: TeamMember) => (m.honorific ? `${m.honorific} ${m.name}` : m.name)
