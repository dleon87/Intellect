import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { MessageComponent } from '@syncfusion/ej2-react-notifications'
import { Severity } from '@syncfusion/ej2-notifications'
import {
  Search,
  Upload,
  CirclePlus,
  X,
  ArrowUpDown,
  ChevronDown,
  Users,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  ArrowRight,
  Building2,
  Globe,
  MoreHorizontal,
} from 'lucide-react'
import { Badge } from './Badge'

type GuideData = {
  id: string
  title: string
  subtitle: string
  hubName: string
  date: string
}

/** Sample guide shared down from the hub — read-only here, per the banner below. */
const GUIDES: GuideData[] = [
  {
    id: 'g1',
    title: 'First Alert SOP v1.0',
    subtitle: 'How to LOTO…',
    hubName: 'Quality',
    date: '5 Feb, 2026',
  },
]

function FilterChip({ icon: Icon, label }: { icon: typeof Search; label: string }) {
  return (
    <ButtonComponent cssClass="chip-btn e-outline">
      <span className="flex items-center gap-1.5 text-sm">
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        {label}
        <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.75} />
      </span>
    </ButtonComponent>
  )
}

function GuideCard({ guide }: { guide: GuideData }) {
  return (
    <article className="relative rounded-lg border border-border-light bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <input
          type="checkbox"
          aria-label={`Select ${guide.title}`}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <ButtonComponent cssClass="e-flat icon-btn" aria-label="More options" title="More options">
          <MoreHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
        </ButtonComponent>
      </div>

      <div className="mb-3 flex justify-center">
        <span className="flex h-14 w-11 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
          pdf
        </span>
      </div>

      <div className="mb-2">
        <Badge label={guide.hubName} variant="hubPrimary" icon />
      </div>

      <p className="mb-2 truncate text-sm text-content-text">
        <span className="font-medium">{guide.title}</span> <span className="text-placeholder">{guide.subtitle}</span>
      </p>

      <ButtonComponent cssClass="e-flat link-btn mb-3">
        <span className="flex items-center gap-1">
          Link to units/ procedures
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      </ButtonComponent>

      <div className="flex items-center gap-2 border-t border-border-light pt-3 text-xs text-placeholder">
        <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        <span aria-hidden>•</span>
        <Globe className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        <span aria-hidden>•</span>
        <span>{guide.date}</span>
      </div>
    </article>
  )
}

/**
 * Guides tab for a from-hub (spoke) procedure — the hub owns and authors these
 * guides, so this instance can only link/assign them locally, not edit their
 * content. Local and managed procedures don't have an upstream hub to receive
 * guides from, so they keep the plain "No content yet" placeholder instead
 * (see ProcedureHeader.tsx).
 */
export function GuidesTab({ hubName }: { hubName: string }) {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-[320px] guides-search">
          <TextBoxComponent
            cssClass="e-outline"
            placeholder="Search"
            htmlAttributes={{ 'aria-label': 'Search guides' }}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Secondary Flat — the least emphasized action in this zone, per the
              button family's mode ramp (no border/fill, text + hover fill only). */}
          <ButtonComponent cssClass="e-flat toolbar-btn">
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Bulk Import
            </span>
          </ButtonComponent>
          {/* Secondary (filled, no type class) — one step up from Bulk Import,
              but neither is the zone's primary action (there's no Share/Save
              here to reserve e-primary for), so both stay Secondary. */}
          <ButtonComponent cssClass="toolbar-btn">
            <span className="flex items-center gap-2">
              <CirclePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Add New Guide
            </span>
          </ButtonComponent>
        </div>
      </div>

      {!bannerDismissed && (
        <MessageComponent
          severity={Severity.Info}
          cssClass="procedure-readonly-message mb-5"
          showIcon
          showCloseIcon
          closed={() => setBannerDismissed(true)}
        >
          <p>
            Guides are managed by <span className="font-medium">{hubName}</span> and remain read-only here.
          </p>
          <p>You can link them to your local units and procedures.</p>
          <p>Assign teams to make this guide visible to your workforce so that they can adopt it</p>
        </MessageComponent>
      )}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ButtonComponent cssClass="chip-btn e-outline e-primary">
            <span className="flex items-center gap-1.5 text-sm">
              <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} />
              Recently added
            </span>
          </ButtonComponent>
          <FilterChip icon={Users} label="Created by" />
          <FilterChip icon={Calendar} label="Date" />
          <FilterChip icon={Layers} label="DaUnits/Procedures" />
          <FilterChip icon={ChevronDown} label="Tags" />
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-md border border-border-light p-0.5">
          <button
            aria-label="Grid view"
            title="Grid view"
            className={`flex h-7 w-7 items-center justify-center rounded ${
              view === 'grid' ? 'bg-surface-alt2 text-icon-hover' : 'text-icon'
            }`}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            aria-label="List view"
            title="List view"
            className={`flex h-7 w-7 items-center justify-center rounded ${
              view === 'list' ? 'bg-surface-alt2 text-icon-hover' : 'text-icon'
            }`}
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5' : 'flex flex-col gap-3'}>
        {GUIDES.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  )
}
