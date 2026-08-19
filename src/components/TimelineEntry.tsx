import { FileText, Zap, MessageSquare, MoreHorizontal } from 'lucide-react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

/**
 * A post broadcast by the owner of a hub this procedure is shared into.
 *
 * Values below are read from the Hub & Spoke Figma file (node 8162-11434,
 * component `timeline-events`, post type "collaborator"):
 *   container  padding 8px 15px · radius 8px · 1px Border/border-light
 *              · Grey/grey-100 surface · column, gap 8px
 *   body copy  Text-Base/Normal — 16/24, weight 400, primary/dark-grey
 *   author     text/colour/link
 *
 * What sets it apart from ordinary activity is the HUB-badged avatar and the
 * explicit "From <hub>" attribution, not the surface alone — so the meaning
 * survives without colour (DS C5).
 */
export type HubPostData = {
  author: string
  initials: string
  hub: string
  body: string
  time: string
}

export function HubPost({ author, initials, hub, body, time }: HubPostData) {
  return (
    // Same chrome and header/divider sectioning as ReportCard below, so hub
    // posts read as part of the same timeline family. No kebab — a broadcast
    // from the hub isn't yours to act on.
    <article className="overflow-hidden rounded-lg border border-border-light bg-white">
      <header className="flex items-center gap-3 p-4">
        <Avatar initials={initials} hubOwner className="shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm text-content-text">
            <span className="font-semibold text-link">{author}</span> From{' '}
            <span className="font-semibold">{hub}</span>
          </p>
          <p className="text-xs text-placeholder">{time}</p>
        </div>
      </header>
      <div className="border-t border-border-light p-4">
        <p className="text-sm text-dark-grey">{body}</p>
      </div>
    </article>
  )
}

export type ReportData = {
  id: string
  author: string
  avatar: number
  time: string
  /** Report reference, e.g. "#1234". Not named `ref` — React reserves that. */
  reference: string
  title: string
  status: string
  /** Shows the "See translation" affordance when the post is in another language. */
  translatable?: boolean
  comments: number
  /** Completed-vs-required actions, e.g. "0/1". Omitted when the report has none. */
  actions?: string
}

export function ReportCard({
  author,
  avatar,
  time,
  reference,
  title,
  status,
  translatable,
  comments,
  actions,
}: ReportData) {
  return (
    <article className="overflow-hidden rounded-lg border border-border-light bg-white">
      <header className="flex items-center gap-3 p-4">
        <Avatar img={avatar} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-content-text">{author}</p>
          <p className="text-xs text-placeholder">{time}</p>
        </div>
        <ButtonComponent
          cssClass="e-flat icon-btn"
          aria-label={`More options for ${author}'s report`}
          title="More options"
        >
          <MoreHorizontal className="h-5 w-5 text-icon" strokeWidth={1.75} />
        </ButtonComponent>
      </header>

      <div className="flex items-center gap-3 border-t border-border-light p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-alt2">
          <FileText className="h-4 w-4 text-icon" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-content-text">
            <span className="font-semibold">{reference}</span> - {title}
          </p>
          <div className="mt-1">
            <Badge label={status} variant="status" />
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-border-light px-4 py-3">
        {translatable ? (
          <ButtonComponent cssClass="e-flat link-btn">See translation</ButtonComponent>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4 text-placeholder">
          <span className="flex items-center gap-1 text-xs">
            {comments}
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          {actions !== undefined && (
            <span className="flex items-center gap-1 text-xs">
              {actions}
              <Zap className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />
            </span>
          )}
        </div>
      </footer>
    </article>
  )
}
