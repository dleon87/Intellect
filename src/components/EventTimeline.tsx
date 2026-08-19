import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { Search, GraduationCap, ClipboardCheck, X, UsersRound } from 'lucide-react'
import { Avatar } from './Avatar'
import { HubPost, ReportCard, type HubPostData, type ReportData } from './TimelineEntry'
import { SortFilter, DateFilter, EventTypeFilter, CollaboratorFilter } from './EventFilters'
import type { Post } from '../App'

/** The hub owner's broadcast, pinned above the collaborator activity below it. */
const HUB_POST: HubPostData = {
  author: 'Debra Rice',
  initials: 'DR',
  hub: 'Quality',
  body: 'Updated the changeover checklist — please re-brief line teams before the next shift.',
  time: '2h ago',
}

const REPORTS: ReportData[] = [
  {
    id: 'r1',
    author: 'Michael Smith',
    avatar: 12,
    time: '1 hour ago',
    reference: '#1234',
    title: 'Line changeover',
    status: 'Complete',
    translatable: true,
    comments: 1,
    actions: '0',
  },
  {
    id: 'r2',
    author: 'Jack Jones',
    avatar: 33,
    time: '1 hour ago',
    reference: '#1234',
    title: 'Line changeover',
    status: 'Complete',
    comments: 2,
  },
  {
    id: 'r3',
    author: 'John Doe',
    avatar: 51,
    time: '1 hour ago',
    reference: '#1234',
    title: 'Line changeover',
    status: 'Complete',
    translatable: true,
    comments: 4,
    actions: '0/1',
  },
]

type Props = {
  posts: Post[]
  /** A brand-new procedure has no history yet beyond its creator being added. */
  isNew?: boolean
  /** False for local (not-yet-promoted) procedures, which have no hub broadcast to show. */
  showHubPost?: boolean
  /** Attribution for the hub broadcast, e.g. "Quality Hub". */
  hubName?: string
}

export function EventTimeline({ posts, isNew = false, showHubPost = true, hubName }: Props) {
  // Frozen at mount so the "added as a collaborator" stamp doesn't churn on
  // every re-render (filter clicks, new posts) the way `new Date()` inline would.
  const [createdAt] = useState(() =>
    new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  )

  // Each filter chip manages its own selection locally (see EventFilters.tsx);
  // resetting them from here remounts all four via `key` rather than reaching
  // into their state directly, and `onActiveChange` lets each one report
  // whether it currently narrows anything, so the "Clear all" button only
  // shows once a real filter (not just the sort order) is applied.
  const [resetToken, setResetToken] = useState(0)
  const [dateActive, setDateActive] = useState(false)
  const [eventTypeActive, setEventTypeActive] = useState(false)
  const [collaboratorActive, setCollaboratorActive] = useState(false)
  const anyFilterActive = dateActive || eventTypeActive || collaboratorActive

  const clearAllFilters = () => {
    setResetToken((t) => t + 1)
    setDateActive(false)
    setEventTypeActive(false)
    setCollaboratorActive(false)
  }

  return (
    <div className="mt-4">
      <div className="relative mb-3 event-search">
        <TextBoxComponent
          cssClass="e-outline"
          placeholder="Search"
          htmlAttributes={{ 'aria-label': 'Search events' }}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <SortFilter key={`sort-${resetToken}`} />
        <DateFilter key={`date-${resetToken}`} onActiveChange={setDateActive} />
        <EventTypeFilter key={`event-type-${resetToken}`} onActiveChange={setEventTypeActive} />
        <CollaboratorFilter key={`collaborator-${resetToken}`} onActiveChange={setCollaboratorActive} />
        {anyFilterActive && (
          <ButtonComponent
            cssClass="e-flat icon-btn"
            aria-label="Clear all filters"
            title="Clear all filters"
            onClick={clearAllFilters}
          >
            <X className="w-4 h-4 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-3">
            <Avatar img={post.avatar} className="shrink-0" />
            <div>
              <p className="text-sm text-content-text">
                <span className="font-semibold">{post.name}</span> {post.text}
              </p>
              <p className="text-xs text-placeholder mt-0.5">{post.timestamp}</p>
            </div>
          </div>
        ))}

        {isNew && (
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <UsersRound className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-content-text">added as a collaborator on this procedure</p>
              <p className="text-xs text-placeholder mt-0.5">{createdAt}</p>
            </div>
          </div>
        )}

        {!isNew && showHubPost && <HubPost {...HUB_POST} hub={hubName ?? HUB_POST.hub} />}

        {!isNew && REPORTS.map((r) => <ReportCard key={r.id} {...r} />)}

        {!isNew && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <ClipboardCheck className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-content-text">
                <span className="font-semibold">John Doe</span> created the task{' '}
                <span className="font-semibold">Behaviour Observation</span>
              </p>
              <p className="mt-0.5 text-xs text-placeholder">August 17 2022, 10:10 AM</p>
            </div>
          </div>
        )}

        {!isNew && (
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm text-content-text">
              scheduled <span className="font-semibold">Environmental Sustainability Practices</span> to be
              completed by Jul 27, 2026 - 10:22 am
            </p>
            <p className="text-xs text-placeholder mt-0.5">Jul 27, 2026 - 12:22 PM</p>
          </div>
        </div>
        )}

        {/* Folded into the same ReportCard as the entries above — it was a
            hand-rolled duplicate of that exact layout. */}
        {!isNew && (
          <ReportCard
            id="r-tanja"
            author="Tanja Ehrhardt"
            avatar={15}
            time="Jul 27, 2026 - 12:16 pm"
            reference="#1198"
            title="Cybersecurity Awareness"
            status="Complete"
            comments={0}
            actions="0"
          />
        )}
      </div>
    </div>
  )
}
