// Board, committees and governance policies for /governance.
//
// Leave these lists empty until the company and its advisers supply final,
// approved details. Each section appears on /governance only when its list has
// entries. Policy PDFs go in public/governance/, e.g. '/governance/code-of-conduct.pdf'.

export type Director = {
  name: string
  role: string
  independent?: boolean
  bio?: string
}

export type Committee = {
  name: string
  chair?: string
  members: string[]
  /** What the committee is responsible for, in a sentence or two. */
  remit: string
}

export type Policy = {
  title: string
  summary: string
  href: string
}

export const board: Director[] = []

export const committees: Committee[] = []

export const policies: Policy[] = []
