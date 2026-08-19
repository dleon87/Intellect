import { Badge } from './Badge'

/**
 * Syncfusion Avatar (`e-avatar`, CSS-only, from ej2-layouts). Sizes map to the
 * library's own scale — xsmall 24px, small 32px, default 40px, large 48px — so
 * avatar dimensions stay on the DS scale instead of ad-hoc Tailwind sizes.
 */
type Size = 'xsmall' | 'small' | 'default' | 'large'

const SIZE_CLASS: Record<Size, string> = {
  xsmall: 'e-avatar-xsmall',
  small: 'e-avatar-small',
  default: '',
  large: 'e-avatar-large',
}

type Props = {
  /** pravatar image id. Omit to render `initials` instead. */
  img?: number
  initials?: string
  alt?: string
  size?: Size
  /** Overlays a "HUB" badge on the avatar, marking the person as a hub owner. */
  hubOwner?: boolean
  className?: string
}

export function Avatar({ img, initials, alt = '', size = 'small', hubOwner, className = '' }: Props) {
  const isInitials = img === undefined
  // `className` carries the caller's layout intent (shrink-0, self-start, …),
  // so it must land on whichever element is the flex item — the wrapper when
  // badged, the avatar itself otherwise. Putting it on the inner span while a
  // wrapper existed let the wrapper stretch to the row's full height, which
  // dragged the bottom-anchored badge away from the avatar.
  const avatar = (
    <span
      className={`e-avatar e-avatar-circle ${SIZE_CLASS[size]} ${isInitials ? 'avatar-initials' : ''} ${
        hubOwner ? '' : className
      }`}
    >
      {isInitials ? initials : <img src={`https://i.pravatar.cc/96?img=${img}`} alt={alt} />}
    </span>
  )

  if (!hubOwner) return avatar

  // The badge is positioned against this wrapper, not the avatar itself — an
  // absolutely-positioned child of `.e-avatar` would be clipped by its
  // border-radius/overflow, and the badge is meant to sit past the bottom edge.
  return (
    <span className={`avatar-with-badge ${className}`}>
      {avatar}
      <Badge label="Site" variant="hubOwner" />
    </span>
  )
}
