import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Inject } from '@syncfusion/ej2-react-grids'
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Lock,
  LayoutGrid,
  List,
  Settings,
  Columns3,
  Home,
  Share2,
  ArrowRight,
  Building2,
  Globe,
} from 'lucide-react'
import { Badge } from './Badge'

export type GuideData = {
  id: string
  title: string
  procedure?: string
  date: string
  badge?: { label: string; variant: 'hubPrimary' | 'danger' }
  hasImage?: boolean
  icons?: { users?: boolean; globe?: boolean }
  createdBy?: string
  createdByAvatar?: number
  owner?: string
  ownerAvatar?: number
  lastUpdate?: string
  unitsProcedures?: string
  tags?: string
  source?: string
}

const LOCAL_GUIDES: GuideData[] = [
  {
    id: 'l2',
    title: 'Anderson LOTO for GL1 S...',
    procedure: 'Peter Sandbox',
    date: '27 Mar, 2026',
    createdBy: 'John Pearson',
    createdByAvatar: 14,
    owner: 'John Pearson',
    ownerAvatar: 14,
    lastUpdate: '27 Mar, 2026',
    unitsProcedures: 'Argonaut ... 6+',
    tags: 'Assist Chip',
    source: 'Local',
  },
  {
    id: 'l5',
    title: 'OPL3- Dryer temperature...',
    procedure: '5.Can explain how the dr..',
    date: '5 Feb, 2026',
    createdBy: 'John Pearson',
    createdByAvatar: 14,
    owner: 'John Pearson',
    ownerAvatar: 14,
    lastUpdate: '5 Feb, 2026',
    unitsProcedures: 'Product 1+',
    tags: 'Assist Chip',
    source: 'Local',
  },
]

const FROM_HUB_GUIDES: GuideData[] = [
  {
    id: 'h1',
    title: 'WI09CG4384 GL1 Start ...',
    procedure: 'Peter Sandbox',
    date: '27 Mar, 2026',
    badge: { label: 'Cork Site', variant: 'hubPrimary' },
    createdBy: 'John Pearson',
    createdByAvatar: 14,
    owner: 'John Pearson',
    ownerAvatar: 14,
    lastUpdate: '27 Mar, 2026',
    unitsProcedures: 'Machine Q.. 2+',
    tags: 'Assist Chip',
    source: 'Cork Site',
  },
  {
    id: 'h4',
    title: 'First Alert SOP v1.0',
    procedure: 'Peter Sandbox',
    date: '5 Feb, 2026',
    badge: { label: 'Quality', variant: 'hubPrimary' },
    icons: { users: true, globe: true },
    createdBy: 'John Pearson',
    createdByAvatar: 14,
    owner: 'John Pearson',
    ownerAvatar: 14,
    lastUpdate: '5 Feb, 2026',
    unitsProcedures: 'Machine bc2  3+',
    tags: 'Assist Chip',
    source: 'Quality',
  },
  {
    id: 'h3',
    title: 'OPL3',
    procedure: '5. Can explain how the dr...',
    date: '9 Feb, 2026',
    hasImage: true,
    badge: { label: 'Leeds Pland site', variant: 'hubPrimary' },
    createdBy: 'John Pearson',
    createdByAvatar: 14,
    owner: 'John Pearson',
    ownerAvatar: 14,
    lastUpdate: '9 Feb, 2026',
    unitsProcedures: 'Machine bc2  3+',
    tags: 'Assist Chip',
    source: 'Leeds Pland site',
  },
]

function GuideTile({ guide, onClick }: { guide: GuideData; onClick?: () => void }) {
  return (
    <article className="relative flex cursor-pointer flex-col rounded-lg border border-border-light bg-white p-4" onClick={onClick}>
      <div className="mb-3 flex items-center justify-between">
        <input
          type="checkbox"
          aria-label={`Select ${guide.title}`}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          onClick={e => e.stopPropagation()}
        />
        <ButtonComponent cssClass="e-flat icon-btn" aria-label="More options" title="More options">
          <MoreHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
        </ButtonComponent>
      </div>

      <div className="mb-3 flex justify-center">
        {guide.hasImage ? (
          <div
            className="h-14 w-11 rounded"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #92613a 0, #92613a 6px, #7a5330 6px, #7a5330 12px)' }}
          />
        ) : (
          <span className="flex h-14 w-11 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
            pdf
          </span>
        )}
      </div>

      {guide.badge && (
        <div className="mb-2">
          <Badge label={guide.badge.label} variant={guide.badge.variant} icon={guide.badge.variant === 'hubPrimary'} />
        </div>
      )}

      <p className="mb-2 truncate text-sm text-content-text">
        <span className="font-medium">{guide.title}</span>
        {guide.procedure && <span className="text-placeholder"> {guide.procedure}</span>}
      </p>

      {guide.badge && (
        <ButtonComponent cssClass="e-flat link-btn mb-3">
          <span className="flex items-center gap-1">
            Link to units/ procedures
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </ButtonComponent>
      )}

      <div className="flex items-center gap-2 border-t border-border-light pt-3 text-xs text-placeholder">
        {guide.icons?.users && <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />}
        {guide.icons?.users && <span aria-hidden>•</span>}
        {guide.icons?.globe && <Globe className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />}
        {guide.icons?.globe && <span aria-hidden>•</span>}
        <span>{guide.date}</span>
      </div>
    </article>
  )
}

const ALL_GUIDES = [...LOCAL_GUIDES, ...FROM_HUB_GUIDES]

function personTemplate(field: 'createdBy' | 'owner', avatarField: 'createdByAvatar' | 'ownerAvatar') {
  return (row: GuideData) => {
    const name = row[field] ?? ''
    const avatar = row[avatarField]
    return (
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={`https://i.pravatar.cc/32?img=${avatar}`}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
        )}
        <span className="truncate text-sm text-content-text">{name}</span>
      </div>
    )
  }
}

function unitsProceduresTemplate(row: GuideData) {
  return (
    <span className="flex items-center gap-1 text-sm text-content-text">
      <Settings className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} />
      {row.unitsProcedures}
    </span>
  )
}

function sourceTemplate(row: GuideData) {
  if (!row.source) return null
  return row.source === 'Local' ? (
    <span className="inline-flex items-center rounded-full bg-content-bg-alt2 px-3 py-1 text-xs font-medium text-content-text-alt1">
      Local
    </span>
  ) : (
    <Badge label={row.source} variant="hubPrimary" icon />
  )
}

function tagsTemplate(row: GuideData) {
  if (!row.tags) return null
  return <Badge label={row.tags} variant="hubPrimary" />
}

function actionsTemplate() {
  return (
    <button aria-label="More options" className="flex h-7 w-7 items-center justify-center rounded hover:bg-content-bg-hover">
      <MoreHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
    </button>
  )
}

function GuidesTable({ guides, onOpenGuide }: { guides: GuideData[]; onOpenGuide?: (guide: GuideData) => void }) {
  return (
    <GridComponent
      dataSource={guides}
      cssClass="guides-grid"
      allowSorting
      rowSelected={(args: { data?: GuideData }) => {
        if (args.data && onOpenGuide) onOpenGuide(args.data)
      }}
    >
      <ColumnsDirective>
        <ColumnDirective type="checkbox" width="46" />
        <ColumnDirective field="title" headerText="NAME" width="180" />
        <ColumnDirective field="createdBy" headerText="CREATED BY" width="160" template={personTemplate('createdBy', 'createdByAvatar')} />
        <ColumnDirective field="owner" headerText="OWNER" width="160" template={personTemplate('owner', 'ownerAvatar')} />
        <ColumnDirective field="date" headerText="DATE ADDED" width="120" />
        <ColumnDirective field="lastUpdate" headerText="LAST UPDATE" width="120" />
        <ColumnDirective field="unitsProcedures" headerText="UNITS/ PROCEDURES" width="160" template={unitsProceduresTemplate} />
        <ColumnDirective field="source" headerText="SOURCE" width="160" template={sourceTemplate} />
        <ColumnDirective field="tags" headerText="TAGS" width="120" template={tagsTemplate} />
        <ColumnDirective headerText="ACTIONS" width="80" template={actionsTemplate} />
      </ColumnsDirective>
      <Inject services={[Sort]} />
    </GridComponent>
  )
}

function SectionHeader({
  icon,
  title,
  meta,
}: {
  icon: React.ReactNode
  title: string
  meta: string
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 py-1.5">
        {icon}
        <span className="text-base font-semibold text-content-text">{title}</span>
        <span className="text-sm text-placeholder">{meta}</span>
      </div>
      <div className="border-b border-border-light" />
    </>
  )
}

export function GuidesPage({ onOpenGuide }: { onOpenGuide?: (guide: GuideData) => void }) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="px-8 pb-12 pt-6">
      <h1 className="mb-5 text-xl font-medium text-content-text">Guides</h1>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-[240px] guides-search">
          <TextBoxComponent
            cssClass="e-outline"
            placeholder="Search..."
            htmlAttributes={{ 'aria-label': 'Search guides' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ButtonComponent cssClass="e-flat icon-btn" aria-label="Columns" title="Columns">
            <Columns3 className="h-5 w-5 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
          <ButtonComponent cssClass="e-flat icon-btn" aria-label="Settings" title="Settings">
            <Settings className="h-5 w-5 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
          <ButtonComponent cssClass="e-primary toolbar-btn">
            <span className="flex items-center gap-1.5">
              Add new guide
              <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </ButtonComponent>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-end">
        <div className="flex items-center gap-0.5 rounded-md border border-border-light p-0.5">
          <button
            aria-label="Grid view"
            title="Grid view"
            className={`flex h-8 w-8 items-center justify-center rounded ${
              view === 'grid' ? 'bg-surface-alt2 text-icon-hover' : 'text-icon'
            }`}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            aria-label="List view"
            title="List view"
            className={`flex h-8 w-8 items-center justify-center rounded ${
              view === 'list' ? 'bg-surface-alt2 text-icon-hover' : 'text-icon'
            }`}
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <GuidesTable guides={ALL_GUIDES} onOpenGuide={onOpenGuide} />
      ) : (
        <>
          <SectionHeader
            icon={<Home className="h-5 w-5 text-icon" strokeWidth={1.75} />}
            title="Local"
            meta="5 procedures • Created in this workspace · Fully editable"
          />
          <div className="grid grid-cols-2 gap-5 py-6 sm:grid-cols-3 xl:grid-cols-5">
            {LOCAL_GUIDES.map((guide) => (
              <GuideTile key={guide.id} guide={guide} onClick={() => onOpenGuide?.(guide)} />
            ))}
          </div>
          <SectionHeader
            icon={<Share2 className="h-5 w-5 text-icon" strokeWidth={1.75} />}
            title="From other sites"
            meta="4 unit types • Synced 12 m ago"
          />
          <div className="grid grid-cols-2 gap-5 py-6 sm:grid-cols-3 xl:grid-cols-5">
            {FROM_HUB_GUIDES.map((guide) => (
              <GuideTile key={guide.id} guide={guide} onClick={() => onOpenGuide?.(guide)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
