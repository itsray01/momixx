// Management team shown on /team.
//
// PLACEHOLDERS: replace each entry with the real name, title and a 2–3 sentence
// bio, and put a square headshot (at least 800×800) in /public/images/team/.
// Set `placeholder: false` once an entry is real. Only management is listed.

export type TeamMember = {
  name: string
  role: string
  bio: string
  photo?: string
  linkedin?: string
  placeholder?: boolean
}

export const team: TeamMember[] = [
  {
    name: 'Name to be confirmed',
    role: 'Chief Executive Officer',
    bio: 'Short bio: background, years in the industry, and what they lead at Momixx.',
    placeholder: true,
  },
  {
    name: 'Name to be confirmed',
    role: 'Chief Financial Officer',
    bio: 'Short bio: background, years in the industry, and what they lead at Momixx.',
    placeholder: true,
  },
  {
    name: 'Name to be confirmed',
    role: 'Chief Technology Officer',
    bio: 'Short bio: background, years in the industry, and what they lead at Momixx.',
    placeholder: true,
  },
  {
    name: 'Name to be confirmed',
    role: 'Chief Operating Officer',
    bio: 'Short bio: background, years in the industry, and what they lead at Momixx.',
    placeholder: true,
  },
]

/** False while any placeholder remains; the page is then hidden from search engines. */
export const teamReady = !team.some((m) => m.placeholder)
