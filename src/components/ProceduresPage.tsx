import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import type { ItemModel } from '@syncfusion/ej2-splitbuttons'
import {
  Search,
  X,
  Layers,
  Download,
  CirclePlus,
  House,
  Eye,
  Radio,
  Share2,
  TriangleAlert,
  ChevronDown,
  Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge, type BadgeSpec } from './Badge'
import { ProcedureCard, type ProcedureCardData } from './ProcedureCard'

const FILTER_TAGS: BadgeSpec[] = [
  { label: 'production process (1)', variant: 'tag' },
  { label: 'quality (1)', variant: 'tag' },
  { label: 'engineering (1)', variant: 'tag' },
]

const THIS_HUB: BadgeSpec = { label: 'This site', variant: 'hub', icon: true }

const LOCAL: ProcedureCardData[] = [
  { id: 'local-0', name: 'Line Changeover Checklist', lastUpdated: '4/4/2019', kind: 'local', avatars: [12, 33], avatarOverflow: 2 },
  { id: 'local-1', name: 'LOTO Safety Procedure', lastUpdated: '4/4/2019', kind: 'local', avatars: [47, 51, 15] },
  { id: 'local-2', name: 'Hygiene & Sanitation Audit', lastUpdated: '4/4/2019', kind: 'local' },
  { id: 'local-3', name: 'Equipment Calibration Log', lastUpdated: '4/4/2019', kind: 'local', avatars: [33] },
  { id: 'local-4', name: 'Hazard Identification Report', lastUpdated: '4/4/2019', kind: 'local' },
]

const LOCAL_OVERFLOW: ProcedureCardData[] = [
  { id: 'local-more-0', name: 'Emergency Response Plan', lastUpdated: '4/4/2019', kind: 'local', avatars: [12, 47] },
  { id: 'local-more-1', name: 'PPE Compliance Check', lastUpdated: '4/4/2019', kind: 'local' },
  { id: 'local-more-2', name: 'Machine Startup Protocol', lastUpdated: '4/4/2019', kind: 'local', avatars: [51, 15], avatarOverflow: 1 },
  { id: 'local-more-3', name: 'Near Miss Reporting', lastUpdated: '4/4/2019', kind: 'local' },
  { id: 'local-more-4', name: 'Environmental Safety Audit', lastUpdated: '4/4/2019', kind: 'local', avatars: [33] },
]

const MANAGED: ProcedureCardData[] = [
  {
    id: 'managed-1',
    name: 'Global Defect Reporting',
    lastUpdated: '4/4/2019',
    kind: 'managed',
    avatars: [12, 33, 51],
    avatarOverflow: 6,
    badges: [THIS_HUB, { label: '9 of 12 adopted', variant: 'success' }],
  },
  {
    id: 'managed-2',
    name: 'Global Defect Reporting',
    lastUpdated: '4/4/2019',
    kind: 'managed',
    avatars: [15, 47],
    avatarOverflow: 1,
    badges: [THIS_HUB, { label: '3 of 12 adopted', variant: 'success' }],
  },
  {
    id: 'managed-3',
    name: 'CIL Template — Filler',
    lastUpdated: '4/4/2019',
    kind: 'managed',
    badges: [THIS_HUB, { label: 'Not Adopted', variant: 'warning' }],
  },
]

const FROM_HUBS: ProcedureCardData[] = [
  {
    id: 'hub-1',
    name: 'First Alert — Safety',
    lastUpdated: '4/4/2019',
    kind: 'from-hub',
    hubName: 'Quality',
    locked: true,
    avatars: [47, 12, 33],
    avatarOverflow: 5,
    badges: [
      { label: 'Quality', variant: 'hubPrimary', icon: true },
      { label: 'Adopted', variant: 'success' },
    ],
  },
  {
    id: 'hub-2',
    name: 'Asahi Centerline Loop AR',
    lastUpdated: '4/4/2019',
    kind: 'from-hub',
    hubName: 'Design Test',
    locked: true,
    badges: [
      { label: 'Design Test', variant: 'hubPrimary', icon: true },
      { label: 'Not Adopted', variant: 'warning' },
    ],
  },
  {
    id: 'hub-3',
    name: 'NCR Procedure',
    lastUpdated: '4/4/2019',
    kind: 'from-hub',
    hubName: 'Design Test',
    locked: true,
    badges: [
      { label: 'Design Test', variant: 'hubPrimary', icon: true },
      { label: 'Not Adopted', variant: 'warning' },
    ],
  },
  {
    id: 'hub-4',
    name: 'CAPAs Framework',
    lastUpdated: '4/4/2019',
    kind: 'from-hub',
    hubName: 'Design Test',
    locked: true,
    badges: [
      { label: 'Design Test', variant: 'hubPrimary', icon: true },
      { label: 'Not Adopted', variant: 'warning' },
    ],
  },
  {
    id: 'hub-5',
    name: 'Defect Management',
    lastUpdated: '4/4/2019',
    kind: 'from-hub',
    hubName: 'Design Test',
    locked: true,
    badges: [
      { label: 'Design Test', variant: 'hubPrimary', icon: true },
      { label: 'Not Adopted', variant: 'warning' },
    ],
  },
]

/** Every hub a "From Hubs" procedure can come from, in first-seen order. */
const SOURCE_HUBS = [...new Set(FROM_HUBS.map((card) => card.hubName).filter((hub): hub is string => !!hub))]

const HUB_FILTER_PANEL_ITEMS: ItemModel[] = [{ id: 'panel' }]

function HubFilter({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (hubs: string[]) => void
}) {
  const allSelected = selected.length === SOURCE_HUBS.length

  const toggleHub = (hub: string) => {
    onChange(selected.includes(hub) ? selected.filter(h => h !== hub) : [...selected, hub])
  }

  const toggleAll = () => {
    onChange(allSelected ? [] : [...SOURCE_HUBS])
  }

  const label =
    selected.length === 0 ? 'Source site'
    : selected.length === 1 ? selected[0]
    : `${selected.length} sites`

  return (
    <DropDownButtonComponent
      items={HUB_FILTER_PANEL_ITEMS}
      popupWidth="240px"
      cssClass={`chip-btn rounded-full ${selected.length > 0 ? 'e-outline e-primary' : 'e-outline'}`}
      itemTemplate={() => (
        <div className="w-[220px] p-3">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-placeholder">
            Filter by source site
          </p>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-surface-alt2"
            onClick={toggleAll}
          >
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${allSelected ? 'border-primary bg-primary' : 'border-border'}`}>
              {allSelected && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
            </span>
            <span className="text-sm text-content-text">All sites</span>
          </button>

          <div className="my-2 h-px bg-border-light" />

          <div className="flex flex-col gap-1">
            {SOURCE_HUBS.map((hub) => (
              <button
                key={hub}
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-surface-alt2"
                onClick={() => toggleHub(hub)}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected.includes(hub) ? 'border-primary bg-primary' : 'border-border'}`}>
                  {selected.includes(hub) && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
                </span>
                <span className="text-sm text-content-text">{hub}</span>
              </button>
            ))}
          </div>

          <div className="my-2 h-px bg-border-light" />

          <div className="flex justify-end">
            <ButtonComponent
              cssClass="e-flat toolbar-btn"
              disabled={selected.length === 0}
              onClick={() => onChange([])}
            >
              Clear
            </ButtonComponent>
          </div>
        </div>
      )}
    >
      <span className="flex items-center gap-1.5 text-sm">
        <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        {label}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
    </DropDownButtonComponent>
  )
}

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  count,
  metaIcon: MetaIcon,
  metaIconClass,
  meta,
}: {
  icon: LucideIcon
  iconClass: string
  title: string
  count: string
  metaIcon: LucideIcon
  metaIconClass?: string
  meta: string
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5 border-b border-border-light pb-2.5">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconClass}`}>
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <h2 className="text-base font-semibold text-content-text">{title}</h2>
      <span className="text-sm text-placeholder">{count}</span>
      <span className="text-placeholder" aria-hidden>
        •
      </span>
      <span className="flex items-center gap-1.5 text-sm text-placeholder">
        <MetaIcon className={`h-3.5 w-3.5 ${metaIconClass ?? ''}`} strokeWidth={1.75} aria-hidden />
        {meta}
      </span>
    </div>
  )
}

type Props = {
  onOpenProcedure: (data: ProcedureCardData) => void
  onNewProcedure: () => void
}

export function ProceduresPage({ onOpenProcedure, onNewProcedure }: Props) {
  const [showAllLocal, setShowAllLocal] = useState(false)
  const localCards = showAllLocal ? [...LOCAL, ...LOCAL_OVERFLOW] : LOCAL

  // Scoped to From Hubs only — Local and Managed by this Hub have no source
  // hub of their own, so they're unaffected by this filter.
  const [hubFilter, setHubFilter] = useState<string[]>([])
  const fromHubCards = hubFilter.length > 0 ? FROM_HUBS.filter((card) => hubFilter.includes(card.hubName!)) : FROM_HUBS
  const notYetAdoptedCount = fromHubCards.filter((card) =>
    card.badges?.some((b) => b.label === 'Not Adopted'),
  ).length

  return (
    <div className="px-8 pb-12 pt-6">
      <h1 className="mb-5 text-xl font-medium text-content-text">Procedures</h1>

      <div className="mb-4 flex items-center gap-3 overflow-x-auto">
        {/* flex-1 + a small min-width lets the search box shrink well below its
            440px default as the viewport narrows, instead of wrapping the
            button row onto a second line (a flex item's default min-width is
            auto, which would keep it from shrinking past its content size). */}
        <div className="procedures-search relative min-w-[120px] max-w-[440px] flex-1">
          <TextBoxComponent
            cssClass="e-outline"
            placeholder="Search..."
            htmlAttributes={{ 'aria-label': 'Search procedures' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <ButtonComponent cssClass="e-flat toolbar-btn">
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Manage Clusters
            </span>
          </ButtonComponent>

          <ButtonComponent cssClass="toolbar-btn">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Export Data
            </span>
          </ButtonComponent>

          <ButtonComponent cssClass="e-primary toolbar-btn" onClick={onNewProcedure}>
            <span className="flex items-center gap-2">
              <CirclePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              New Procedure
            </span>
          </ButtonComponent>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-sm text-content-text">Filter by tags:</span>
        {FILTER_TAGS.map((tag) => (
          <Badge key={tag.label} {...tag} />
        ))}
        <span className="mx-1 h-4 w-px bg-border-light" aria-hidden />
        <HubFilter selected={hubFilter} onChange={setHubFilter} />
      </div>

      <section className="mb-10">
        <SectionHeader
          icon={House}
          iconClass="bg-surface-alt2 text-icon"
          title="Local"
          count={`${localCards.length} procedures`}
          metaIcon={Eye}
          meta="Only visible on this instance"
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {localCards.map((card) => (
            <ProcedureCard key={card.id} data={card} onOpen={onOpenProcedure} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllLocal((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
          >
            {showAllLocal ? 'View less' : 'View 5 more'}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAllLocal ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader
          icon={Radio}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Managed by this site"
          count="3 procedures"
          metaIcon={Share2}
          meta="12 sites subscribed"
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {MANAGED.map((card) => (
            <ProcedureCard key={card.id} data={card} onOpen={onOpenProcedure} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Share2}
          iconClass="bg-[#EFE9FA] text-primary"
          title="From other sites"
          count={`${fromHubCards.length} procedures`}
          metaIcon={TriangleAlert}
          metaIconClass="text-warning"
          meta={`${notYetAdoptedCount} not yet adopted`}
        />
        {fromHubCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
            {fromHubCards.map((card) => (
              <ProcedureCard key={card.id} data={card} onOpen={onOpenProcedure} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-placeholder">No procedures from the selected sites.</p>
        )}
      </section>
    </div>
  )
}
