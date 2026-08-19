import { Lock } from 'lucide-react'
import { Badge, type BadgeSpec } from './Badge'
import type { ProcedureKind } from '../procedureKind'

export type ProcedureCardData = {
  id: string
  name: string
  lastUpdated: string
  /** Which Procedures-page section this card lives in — carried through to the
   *  detail view so it can apply that section's timeline/collaborator/banner rules. */
  kind: ProcedureKind
  /** The owning hub's name — only meaningful for `kind: 'from-hub'` cards. */
  hubName?: string
  /** Renders the title in muted gray, for unnamed placeholder procedures. */
  placeholder?: boolean
  /** Purple title — the reference uses it for the one card that is hovered/linked. */
  emphasized?: boolean
  locked?: boolean
  /** Avatar image ids (pravatar) shown as a stacked group, plus an overflow count. */
  avatars?: number[]
  avatarOverflow?: number
  badges?: BadgeSpec[]
}

type Props = {
  data: ProcedureCardData
  onOpen?: (data: ProcedureCardData) => void
}

/**
 * Syncfusion's Card (`e-card`, CSS-only, from ej2-layouts) is the closest thing
 * the library ships to the reference card, so it supplies the surface, border,
 * and radius. The internal composition (centered title, badge row, avatar
 * cluster, footer) is not something the Card component models, so those are
 * token-bound Tailwind on top rather than invented `e-card-*` structure.
 */
export function ProcedureCard({ data, onOpen }: Props) {
  const { name, lastUpdated, placeholder, emphasized, locked, avatars, avatarOverflow, badges } = data

  return (
    <button
      type="button"
      onClick={() => onOpen?.(data)}
      className="e-card procedure-card group text-left"
      aria-label={`Open ${name}`}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6">
        {avatars && avatars.length > 0 && (
          <div className="absolute left-3 top-3 flex items-center -space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
            {avatars.map((n) => (
              <img
                key={n}
                src={`https://i.pravatar.cc/64?img=${n}`}
                alt=""
                className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
              />
            ))}
            {avatarOverflow ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white ring-2 ring-white">
                +{avatarOverflow}
              </span>
            ) : null}
          </div>
        )}

        {locked && (
          <Lock className="absolute right-3 top-3 h-4 w-4 text-icon" strokeWidth={1.75} aria-hidden />
        )}

        <p
          className={`text-center text-base font-medium ${
            emphasized ? 'text-primary' : placeholder ? 'text-placeholder group-hover:text-primary' : 'text-content-text group-hover:text-primary'
          }`}
        >
          {name}
        </p>

        {badges && badges.length > 0 && (
          <div className="flex flex-col items-center gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge.label} {...badge} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border-light px-4 py-2.5 text-center text-xs text-placeholder">
        Last updated: {lastUpdated}
      </div>
    </button>
  )
}
