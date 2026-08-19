import { Share2 } from 'lucide-react'

/**
 * Syncfusion Badge (`e-badge`, CSS-only, from ej2-notifications). The library's
 * own semantic ramps cover the status pills — `e-badge-success-subtle` /
 * `e-badge-warning-subtle` — so those map straight through. The outlined "hub"
 * and "tag" pills have no library equivalent, so they layer a token-bound class
 * over the same `e-badge e-badge-pill` base rather than becoming a new element.
 */
export type BadgeVariant =
  | 'hub'
  | 'hubPrimary'
  | 'hubOwner'
  | 'status'
  | 'success'
  | 'warning'
  | 'tag'

export type BadgeSpec = {
  label: string
  variant: BadgeVariant
  /** Prefix the label with the share glyph, as the hub pills do in the design. */
  icon?: boolean
  className?: string
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  hub: 'badge-outline',
  hubPrimary: 'badge-outline badge-outline-primary',
  /** Subtle Primary tint, overlaid on a hub owner's avatar. */
  hubOwner: 'badge-hub-owner',
  /** Neutral uppercase chip for a report's completion state. */
  status: 'badge-status',
  success: 'e-badge-success-subtle',
  warning: 'e-badge-warning-subtle',
  tag: 'badge-outline',
}

export function Badge({ label, variant, icon, className = '' }: BadgeSpec) {
  return (
    <span className={`e-badge e-badge-pill ${VARIANT_CLASS[variant]} ${className}`} title={label}>
      {icon && <Share2 className="mr-1 h-3 w-3 shrink-0 align-[-2px]" strokeWidth={1.75} aria-hidden />}
      {/* min-w-0 is required inside this flex badge — a flex item's default
          min-width is auto, which would keep it from shrinking past the full
          label's width and defeat truncate entirely. */}
      <span className="min-w-0 max-w-[160px] truncate">{label}</span>
    </span>
  )
}
