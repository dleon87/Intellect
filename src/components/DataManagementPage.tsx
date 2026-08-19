import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { House, Eye, Share2, Lock, CirclePlus, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge, type BadgeSpec } from './Badge'

export type UnitTypeData = {
  id: string
  name: string
  locked?: boolean
  badges?: BadgeSpec[]
  /** The owning hub's name — only set for "From Hubs" unit types. */
  hubName?: string
  /** Set at creation time only — cannot be changed after. */
  pushUnitsToChildren?: boolean
}

const LOCAL: UnitTypeData[] = [
  { id: 'local-1', name: 'Product01' },
  { id: 'local-2', name: 'Locations' },
  { id: 'local-3', name: 'Model' },
  { id: 'local-4', name: 'Employee' },
  { id: 'local-5', name: 'Machines' },
  { id: 'local-6', name: 'Machine Class' },
]

const LOCAL_OVERFLOW: UnitTypeData[] = [
  { id: 'local-7', name: 'Suppliers' },
  { id: 'local-8', name: 'Shifts' },
  { id: 'local-9', name: 'Lines' },
  { id: 'local-10', name: 'Departments' },
  { id: 'local-11', name: 'Product Class' },
]

const FROM_HUBS: UnitTypeData[] = [
  {
    id: 'hub-1',
    name: 'Product',
    locked: true,
    hubName: 'Quality',
    badges: [{ label: 'Quality', variant: 'hubPrimary', icon: true }],
  },
  {
    id: 'hub-2',
    name: 'Machines',
    locked: true,
    hubName: 'Quality',
    badges: [{ label: 'Quality', variant: 'hubPrimary', icon: true }],
  },
]

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  count,
  metaIcon: MetaIcon,
  meta,
}: {
  icon: LucideIcon
  iconClass: string
  title: string
  count: string
  metaIcon: LucideIcon
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
        <MetaIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        {meta}
      </span>
    </div>
  )
}

function UnitTypeCard({ data, onOpen }: { data: UnitTypeData; onOpen?: (data: UnitTypeData) => void }) {
  return (
    <button
      type="button"
      onClick={onOpen ? () => onOpen(data) : undefined}
      className="e-card procedure-card text-left"
      aria-label={`Open ${data.name}`}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10">
        {data.locked && <Lock className="absolute right-3 top-3 h-4 w-4 text-icon" strokeWidth={1.75} aria-hidden />}

        <p className="text-center text-base font-medium text-content-text">{data.name}</p>

        {data.badges && data.badges.length > 0 && (
          <div className="flex flex-col items-center gap-1.5">
            {data.badges.map((badge) => (
              <Badge key={badge.label} {...badge} />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

export function DataManagementPage({ onOpenUnitType, onCreateUnitType }: { onOpenUnitType?: (data: UnitTypeData) => void; onCreateUnitType?: () => void }) {
  const [showAllLocal, setShowAllLocal] = useState(false)
  const localCards = showAllLocal ? [...LOCAL, ...LOCAL_OVERFLOW] : LOCAL

  return (
    <div className="px-8 pb-12 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-medium text-content-text">Data Management</h1>
        <ButtonComponent cssClass="e-primary toolbar-btn" onClick={onCreateUnitType}>
          <span className="flex items-center gap-2">
            <CirclePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Create unit type
          </span>
        </ButtonComponent>
      </div>

      <section className="mb-10">
        <SectionHeader
          icon={House}
          iconClass="bg-surface-alt2 text-icon"
          title="Local"
          count={`${localCards.length} unit types`}
          metaIcon={Eye}
          meta="Created in this workspace · Fully editable"
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {localCards.map((card) => (
            <UnitTypeCard key={card.id} data={card} onOpen={onOpenUnitType} />
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

      <section>
        <SectionHeader
          icon={Share2}
          iconClass="bg-[#EFE9FA] text-primary"
          title="From other sites"
          count={`${FROM_HUBS.length} unit types`}
          metaIcon={Share2}
          meta="Synced 12 m ago"
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {FROM_HUBS.map((card) => (
            <UnitTypeCard key={card.id} data={card} onOpen={onOpenUnitType} />
          ))}
        </div>
      </section>
    </div>
  )
}
