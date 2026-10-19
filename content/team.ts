// Leadership shown on /leadership.
//
// HQ's instruction: the founders are shown by role only. No names, no photos and no
// initials anywhere on the site (page, structured data, llms.txt, search), so nothing
// identifies them by name. Bios are as supplied by HQ, in British English, with the
// names taken out, and no other company, client or charity named (so they cannot be
// traced). Clients follow the site's approved wording: "a leading smartphone brand".
// `focus`, `years` and `expertise` restate what each bio says; they add no new claims.

import type { LucideIcon } from 'lucide-react'
import { FlaskConical, Landmark } from 'lucide-react'

export type TeamMember = {
  role: string
  /** What this founder leads, in a few words. */
  focus: string
  icon: LucideIcon
  /** Years of experience, as stated in the bio. */
  years: { value: string; label: string }
  expertise: string[]
  bio: string
}

export const team: TeamMember[] = [
  {
    role: 'Founder',
    focus: 'Technology and innovation',
    icon: FlaskConical,
    years: { value: '20+', label: 'years turning materials science into products' },
    expertise: ['Surface engineering', 'Coating technologies', 'Advanced manufacturing', 'Materials science'],
    bio: 'A technologist and business leader with deep expertise in surface engineering, coating technologies and advanced manufacturing. As Group CEO of the Orion Group of Companies, he drives innovation and global growth across its engineering and manufacturing divisions. With over two decades of experience, he has translated materials science into commercial success, holding over 10 patents and 100 research publications. He earned his PhD from Nanyang Technological University and is recognised for bridging scientific innovation with large-scale industrial impact.',
  },
  {
    role: 'Founder',
    focus: 'Strategy and governance',
    icon: Landmark,
    years: { value: '30+', label: 'years in materials manufacturing and industrial innovation' },
    expertise: ['Materials manufacturing', 'Industrial innovation', 'Strategic growth', 'Governance'],
    bio: 'A seasoned entrepreneur and business leader with over three decades of experience in materials manufacturing and industrial innovation. He founded and grew a manufacturing enterprise that became a key supplier to a leading smartphone brand, before leading it through a successful merger and acquisition. As Group Chairman of the Orion Group of Companies, he drives strategic growth and governance across its portfolio. He also serves as a Non-Executive Director at an investment management firm and actively supports community causes, including a charitable medical institution.',
  },
]

export const teamReady = team.length > 0
