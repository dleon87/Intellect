import type { ProcedureKind } from './procedureKind'

// The collaborator panel only ever lists locally-added people as plain
// avatars — never hub people, and never a HUB badge, regardless of whether
// the procedure is local, managed by this hub, or received from another hub.
// This is also the single source of truth for the header's avatar stack, so
// the two stay in sync (see ProcedureHeader.tsx and AboutPanel.tsx).
export type Collaborator = {
  name: string
  email: string
  /** pravatar id. Omit for an initials avatar. */
  avatar?: number
  initials?: string
}

/** The signed-in user — the sole collaborator on a freshly created procedure. */
export const SELF: Collaborator = { name: "Diana Leon (That's you)", email: 'dleon@intellect.com', avatar: 5 }

// Local (not-yet-promoted) procedures are the only ones seeded with sample
// collaborators here — managed procedures keep the empty "invite people"
// nudge, per the section rules on ProceduresPage.
export const LOCAL_COLLABORATORS: Collaborator[] = [
  { name: 'Andreea Anca', email: 'aanca@intellect.com', avatar: 47 },
  { name: 'Dan Tomescu', email: 'dtomescu@intellect.com', avatar: 12 },
  { name: 'Darius Clop', email: 'dclop@intellect.com', avatar: 33 },
  { name: "Diana Leon (That's you)", email: 'dleon@intellect.com', avatar: 5 },
  { name: 'Diego Zacarias', email: 'dzacarias@intellect.com', avatar: 51 },
  { name: 'Elena Atay', email: 'eatay@intellect.com', avatar: 26 },
]

// A from-hub (spoke) procedure can still have people added locally at this
// site — the banner on ProcedureHeader says as much ("add local
// collaborators"). Same plain-avatar, no-hub-badge treatment as the local set.
export const FROM_HUB_COLLABORATORS: Collaborator[] = [
  { name: "Diana Leon (That's you)", email: 'dleon@intellect.com', avatar: 5 },
  { name: 'Darius Clop', email: 'dclop@intellect.com', avatar: 33 },
  { name: 'Elena Atay', email: 'eatay@intellect.com', avatar: 26 },
]

export const MANAGED_COLLABORATORS: Collaborator[] = [
  { name: "Diana Leon (That's you)", email: 'dleon@intellect.com', avatar: 5 },
  { name: 'Darius Clop', email: 'dclop@intellect.com', avatar: 33 },
  { name: 'Elena Atay', email: 'eatay@intellect.com', avatar: 26 },
  { name: 'Dan Tomescu', email: 'dtomescu@intellect.com', avatar: 12 },
]

export const COLLABORATOR_AVATAR_POOL = [23, 8, 41, 60, 36, 19, 44]

/** The starting collaborator list for a procedure, based on its section and new/existing status. */
export function initialCollaborators(kind: ProcedureKind, isNew: boolean, adopted = true): Collaborator[] {
  if (isNew) return [SELF]
  if (kind === 'local') return LOCAL_COLLABORATORS
  if (kind === 'from-hub') return adopted ? FROM_HUB_COLLABORATORS : []
  if (kind === 'managed') return MANAGED_COLLABORATORS
  return []
}
