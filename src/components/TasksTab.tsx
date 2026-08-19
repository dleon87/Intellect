import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids'
import { ContextMenuComponent } from '@syncfusion/ej2-react-navigations'
import type { MenuItemModel } from '@syncfusion/ej2-navigations'
import {
  Search,
  X,
  Plus,
  User,
  Calendar,
  BarChart3,
  Box,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
} from 'lucide-react'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { ReportDetailModal } from './ReportDetailModal'
import type { ProcedureKind } from '../procedureKind'

export type TaskCategory = {
  id: string
  name: string
  lastUpdate: string
}

/** The task templates listed down the left rail — distinct from the task
 *  instances (rows) on the right, which are submissions against those templates. */
const TASK_CATEGORIES: TaskCategory[] = [
  { id: 't1', name: 'Floor Inspection', lastUpdate: '20/01/2023' },
  { id: 't2', name: 'Building Inspection', lastUpdate: '20/02/2023' },
  { id: 't3', name: 'Workplace Safety', lastUpdate: '20/01/2023' },
  { id: 't4', name: 'Safety Guides', lastUpdate: '20/05/2023' },
  { id: 't5', name: 'Floor Safety Checklist', lastUpdate: '20/03/2023' },
  { id: 't6', name: 'Floor Safety Rules', lastUpdate: '24/03/2023' },
  { id: 't7', name: 'LOTO Training', lastUpdate: '24/03/2023' },
  { id: 't8', name: 'COVID-19 Guidelines', lastUpdate: '24/03/2023' },
]

type TaskRow = {
  id: string
  reference: string
  name: string
  submittedBy: string
  /** A hub name means this task instance came from that hub; `null` means submitted locally. */
  source: string | null
  orderDate: string
  subject: string
  actions: string
  status: string
  /** 'fromSpoke' = published up from a subscribed spoke instance */
  origin?: 'local' | 'fromSpoke'
  /** The originating spoke instance name, set when origin === 'fromSpoke' */
  instanceName?: string
}

const TASK_ROWS: TaskRow[] = [
  {
    id: 'r1',
    reference: '#1234',
    name: 'SIC Concern',
    submittedBy: 'Diana Leon',
    source: 'Cork Site',
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
  {
    id: 'r2',
    reference: '#1234',
    name: 'SIC Gap',
    submittedBy: 'Andreea Anca',
    source: null,
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
  {
    id: 'r3',
    reference: '#1234',
    name: 'Test',
    submittedBy: 'Darius Clop',
    source: 'Quality',
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
  {
    id: 'r4',
    reference: '#1234',
    name: 'SIC Concerna',
    submittedBy: 'Dan Tomescu',
    source: 'Leeds Plant Site',
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
    origin: 'fromSpoke',
    instanceName: 'Leeds Plant Site',
  },
  {
    id: 'r5',
    reference: '#1234',
    name: 'SIC Gap',
    submittedBy: 'Diego Zacarias',
    source: null,
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
  {
    id: 'r6',
    reference: '#1234',
    name: 'Test',
    submittedBy: 'Elena Atay',
    source: null,
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
  {
    id: 'r7',
    reference: '#1234',
    name: 'SIC Concerna',
    submittedBy: 'Diana Leon',
    source: null,
    orderDate: '4 Jul, 10:37 am',
    subject: 'Line 3',
    actions: '0/0',
    status: 'Completed',
  },
]

function FilterChip({ icon: Icon, label }: { icon: typeof User; label: string }) {
  return (
    <ButtonComponent cssClass="chip-btn e-outline">
      <span className="flex items-center gap-1.5 text-sm">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        {label}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
    </ButtonComponent>
  )
}

function SortableHeader({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1">
      {label}
      <ArrowUpDown className="h-3 w-3 text-placeholder" strokeWidth={1.75} aria-hidden />
    </span>
  )
}

// A kebab opens a Context Menu, not a bespoke popover (DS anti-misuse rule) —
// shared across every card rather than one instance each, since Syncfusion's
// ContextMenu is opened imperatively at a position rather than mounted inline.
const CARD_MENU_ITEMS: MenuItemModel[] = [
  { text: 'Duplicate to another procedure', id: 'duplicate-other' },
]

/**
 * Tasks tab for a from-hub (spoke) procedure — task submissions here can come
 * from this site or be rolled up from other sites subscribed to the same hub,
 * hence the per-row "Source" column. Local and managed procedures have no such
 * cross-site rollup, so they keep the plain "No content yet" placeholder
 * (see ProcedureHeader.tsx).
 */
export function TasksTab({ onOpenTask, kind = 'local', hubName }: { onOpenTask: (task: TaskCategory) => void; kind?: ProcedureKind; hubName?: string }) {
  const cardMenuRef = useRef<ContextMenuComponent>(null)
  const [selectedRow, setSelectedRow] = useState<TaskRow | null>(null)

  const openCardMenu = (e: MouseEvent<HTMLButtonElement>) => {
    // Stop the card's own onClick (selection) from firing underneath the "…" button.
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    cardMenuRef.current?.open(rect.bottom + 4, rect.left)
  }

  return (
    <div className="flex gap-6 py-6">
      {/* Background/content-bg-color-alt2 — sets this rail apart from the
          white grid side, matching only the left column per the request. */}
      <aside className="w-[260px] shrink-0 rounded-lg bg-surface-alt2 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-content-text">Tasks (33)</h2>
          {kind !== 'from-hub' && (
            <ButtonComponent aria-label="Add task">
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
            placeholder="Search..."
            htmlAttributes={{ 'aria-label': 'Search task categories' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {TASK_CATEGORIES.map((category) => (
            <div
              key={category.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenTask(category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenTask(category)
              }}
              className="flex cursor-pointer items-start justify-between gap-2 rounded-lg border border-border-light bg-white p-3 text-left transition-colors hover:bg-surface-alt2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-content-text">{category.name}</p>
                <p className="mt-0.5 text-xs text-placeholder">Last update: {category.lastUpdate}</p>
              </div>
              <button
                type="button"
                aria-label={`More options for ${category.name}`}
                title="More options"
                className="shrink-0 rounded p-1 text-icon hover:bg-surface-alt2 hover:text-icon-hover"
                onClick={openCardMenu}
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>

        <ContextMenuComponent ref={cardMenuRef} items={CARD_MENU_ITEMS} cssClass="task-card-menu" />
      </aside>

      <div className="min-w-0 flex-1">
        <div className="relative mb-4">
          <TextBoxComponent
            cssClass="e-outline"
            placeholder="Search"
            htmlAttributes={{ 'aria-label': 'Search tasks' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterChip icon={User} label="Submitted by" />
          <FilterChip icon={Calendar} label="Date" />
          <FilterChip icon={BarChart3} label="Status" />
          <FilterChip icon={Box} label="Unit" />
        </div>

        <GridComponent
          dataSource={TASK_ROWS}
          cssClass="tasks-grid"
          allowTextWrap
          rowSelected={(e: { data: TaskRow }) => setSelectedRow(e.data)}
        >
          <ColumnsDirective>
            <ColumnDirective field="reference" headerText="ID" width="90" headerTemplate={() => <SortableHeader label="ID" />} />
            <ColumnDirective
              field="name"
              headerText="Name"
              width="140"
              headerTemplate={() => <SortableHeader label="Name" />}
            />
            <ColumnDirective
              field="submittedBy"
              headerText="Submitted by"
              width="180"
              template={(row: TaskRow) => (
                <span className="flex items-center gap-2.5">
                  <Avatar initials="JP" size="xsmall" />
                  <span className="text-sm text-content-text">{row.submittedBy}</span>
                </span>
              )}
            />
            <ColumnDirective
              field="source"
              headerText="Source"
              width="170"
              headerTemplate={() => <SortableHeader label="Source" />}
              template={(row: TaskRow) =>
                row.source ? (
                  <Badge label={row.source} variant="hubPrimary" icon />
                ) : (
                  <span className="text-sm text-placeholder">Local</span>
                )
              }
            />
            <ColumnDirective field="orderDate" headerText="Order Date" width="150" />
            <ColumnDirective
              field="subject"
              headerText="Subject"
              width="130"
              template={(row: TaskRow) => (
                <span className="flex items-center gap-1.5 text-sm text-content-text">
                  <Box className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />
                  {row.subject}
                </span>
              )}
            />
            <ColumnDirective field="actions" headerText="Actions" width="100" />
            <ColumnDirective
              field="status"
              headerText="Status"
              width="120"
              template={(row: TaskRow) => <Badge label={row.status} variant="status" />}
            />
          </ColumnsDirective>
        </GridComponent>
      </div>

      <ReportDetailModal
        visible={!!selectedRow}
        row={selectedRow}
        kind={kind}
        hubName={hubName}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  )
}
