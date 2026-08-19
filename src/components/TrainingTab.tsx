import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { PivotViewComponent } from '@syncfusion/ej2-react-pivotview'
import { ContextMenuComponent } from '@syncfusion/ej2-react-navigations'
import type { MenuItemModel } from '@syncfusion/ej2-navigations'
import {
  Search,
  X,
  Plus,
  Upload,
  Layers,
  Share2,
  RotateCw,
  SlidersHorizontal,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import type { ProcedureKind } from '../procedureKind'

export type TrainingCategory = {
  id: string
  name: string
  lastUpdate: string
}

/** The training templates listed down the left rail — mirrors TasksTab.tsx's
 *  card list styling exactly, per the request. */
const TRAINING_CATEGORIES: TrainingCategory[] = [
  { id: 'tr1', name: 'Christmas Flow', lastUpdate: 'Jul 27, 2026' },
  { id: 'tr2', name: 'Conflict Resolution', lastUpdate: 'Jul 2, 2026' },
  { id: 'tr3', name: 'Cybersecurity Awareness', lastUpdate: 'Jul 27, 2026' },
  { id: 'tr4', name: 'Effective Leadership Training', lastUpdate: 'Jul 2, 2026' },
  { id: 'tr5', name: 'Environmental Sustainability Practices', lastUpdate: 'Jul 2, 2026' },
  { id: 'tr6', name: 'Equipment Calibration and Maintenance', lastUpdate: 'Jul 2, 2026' },
]

type CompletionRecord = {
  Team: string
  User: string
  Training: string
  ReportSubject: string
  Status: number
}

const TEAMS: Record<string, string[]> = {
  'Changeover Squad': ['Richard Milnes'],
  Developers: ['Alex Kim', 'Priya Nair'],
  Global: ['Sofia Torres'],
  QA: ['Matt Staddon', 'Sam Ellis', 'Shazad Nasim'],
  Zaptic: ['Owen Clarke'],
}

const TRAINING_SUBJECTS: Record<string, string[]> = {
  'Christmas Flow': ['Line 3', 'Line 5'],
  'Conflict Resolution': ['No Subject', 'Team A'],
  'Cybersecurity Awareness': ['Line 3', 'Line 7'],
}

// A per-user, per-training-subject completion record (0 or 1) — the pivot's
// "Avg of Status" then aggregates these into the completion percentages
// shown per team/training grouping, the same way the reference report does.
const COMPLETION_RECORDS: CompletionRecord[] = Object.entries(TEAMS).flatMap(([team, users], teamIndex) =>
  users.flatMap((user, userIndex) =>
    Object.entries(TRAINING_SUBJECTS).flatMap(([training, subjects]) =>
      subjects.map((subject, subjectIndex) => ({
        Team: team,
        User: user,
        Training: training,
        ReportSubject: subject,
        Status: (teamIndex + userIndex + subjectIndex) % 3 === 0 ? 1 : 0,
      })),
    ),
  ),
)

function FilterPill({ label, sortable }: { label: string; sortable?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-border-light bg-white px-3 py-1.5 text-sm text-content-text">
      {sortable && <ChevronDown className="h-3 w-3 text-icon" strokeWidth={1.75} aria-hidden />}
      {label}
      <X className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />
    </span>
  )
}

// A kebab opens a Context Menu, not a bespoke popover — same shared-instance
// pattern as TasksTab.tsx's card menu.
const CARD_MENU_ITEMS: MenuItemModel[] = [
  { text: 'Edit Name', id: 'edit' },
  { text: 'Duplicate', id: 'duplicate' },
  { text: 'Duplicate to another procedure', id: 'duplicate-other' },
  { text: 'Delete', id: 'delete' },
]

/**
 * Training tab — the left rail reuses TasksTab.tsx's exact card styling
 * (grey Background/content-bg-color-alt2 rail, white cards, per-card kebab
 * menu) per the request. The main panel is a Syncfusion PivotView ("the
 * matrix table"), grouping completion status by Team/User down the rows and
 * Training/Report Subject across the columns.
 */
export function TrainingTab({
  kind = 'local',
  hubName,
  onOpenTraining,
}: {
  kind?: ProcedureKind
  hubName?: string
  onOpenTraining?: (training: TrainingCategory) => void
}) {
  // Managed (this instance owns the hub) and from-hub (this instance is a
  // spoke) procedures both have their training set authored at the hub —
  // name/steps/content aren't locally editable, so there's nothing for a
  // kebab to act on. The badge names the hub either way: "This Hub" for the
  // owner, the actual hub name for a spoke receiving it from elsewhere.
  const readOnly = kind === 'from-hub'
  const contentReadOnly = kind === 'managed' || kind === 'from-hub'
  const hubLabel = kind === 'managed' ? 'This site' : (hubName ?? '')
  // Both sides of a hub relationship can drill into the training editor —
  // read-only either way, but still viewable.
  const openable = contentReadOnly && !!onOpenTraining
  const cardMenuRef = useRef<ContextMenuComponent>(null)

  const openCardMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    cardMenuRef.current?.open(rect.bottom + 4, rect.left)
  }

  return (
    <div className="flex gap-6 py-6">
      <aside className="w-[260px] shrink-0 rounded-lg bg-surface-alt2 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-content-text">Training ({TRAINING_CATEGORIES.length})</h2>
          {!readOnly && (
            <ButtonComponent aria-label="Add training">
              <span className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Add
              </span>
            </ButtonComponent>
          )}
        </div>

        <div className="relative mb-3">
          <TextBoxComponent
            cssClass="e-outline"
            placeholder="Search training"
            htmlAttributes={{ 'aria-label': 'Search training' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        {contentReadOnly && (
          <p className="mb-2 text-xs font-medium text-placeholder">Managed by {hubLabel}</p>
        )}

        <div className="flex flex-col gap-2">
          {TRAINING_CATEGORIES.map((category) => (
            <div
              key={category.id}
              role={openable ? 'button' : undefined}
              tabIndex={openable ? 0 : undefined}
              onClick={openable ? () => onOpenTraining?.(category) : undefined}
              onKeyDown={
                openable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') onOpenTraining?.(category)
                    }
                  : undefined
              }
              className={`flex items-start justify-between gap-2 rounded-lg border border-border-light bg-white p-3 text-left transition-colors hover:bg-surface-alt2 ${openable ? 'cursor-pointer' : ''}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-content-text">{category.name}</p>
                <p className="mt-0.5 text-xs text-placeholder">Last updated: {category.lastUpdate}</p>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  aria-label={`More options for ${category.name}`}
                  title="More options"
                  className="shrink-0 rounded p-1 text-icon hover:bg-surface-alt2 hover:text-icon-hover"
                  onClick={openCardMenu}
                >
                  <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                </button>
              )}
            </div>
          ))}
        </div>

        <ContextMenuComponent ref={cardMenuRef} items={CARD_MENU_ITEMS} cssClass="task-card-menu" />
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Export" title="Export">
              <Upload className="h-4 w-4 text-icon" strokeWidth={1.75} />
            </ButtonComponent>
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Group" title="Group">
              <Layers className="h-4 w-4 text-icon" strokeWidth={1.75} />
            </ButtonComponent>
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Share" title="Share">
              <Share2 className="h-4 w-4 text-icon" strokeWidth={1.75} />
            </ButtonComponent>
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Refresh" title="Refresh">
              <RotateCw className="h-4 w-4 text-icon" strokeWidth={1.75} />
            </ButtonComponent>
          </div>
          <ButtonComponent cssClass="e-flat icon-btn" aria-label="Report settings" title="Report settings">
            <SlidersHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterPill label="Avg of Status" sortable />
          <FilterPill label="Status (All)" />
          <FilterPill label="Training" sortable />
          <FilterPill label="Report Subject" sortable />
          <FilterPill label="Team" sortable />
          <FilterPill label="User" sortable />
        </div>

        <PivotViewComponent
          cssClass="training-pivot"
          height={520}
          dataSourceSettings={{
            dataSource: COMPLETION_RECORDS,
            expandAll: false,
            rows: [{ name: 'Team' }, { name: 'User' }],
            columns: [{ name: 'Training' }, { name: 'ReportSubject', caption: 'Report Subject' }],
            values: [{ name: 'Status', caption: 'Status', type: 'Avg' }],
            formatSettings: [{ name: 'Status', format: 'P0' }],
          }}
          gridSettings={{ columnWidth: 110 }}
        />
      </div>
    </div>
  )
}
