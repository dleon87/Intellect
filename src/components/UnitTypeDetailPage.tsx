import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids'
import { MessageComponent } from '@syncfusion/ej2-react-notifications'
import { Severity } from '@syncfusion/ej2-notifications'
import { Search, X, Download, Settings, ArrowUpFromLine } from 'lucide-react'
import { Badge } from './Badge'

type UnitRow = {
  id: number
  name: string
  [key: string]: string | number
}

const UNITS: UnitRow[] = [
  { id: 1, name: 'Pizza' },
  { id: 2, name: 'Crisps' },
  { id: 3, name: 'Salad' },
  { id: 4, name: 'Bread' },
  { id: 5, name: 'Cheese' },
  { id: 6, name: 'Yoghurt' },
  { id: 7, name: 'Butter' },
  { id: 8, name: 'Milk' },
  { id: 9, name: 'Eggs' },
  { id: 10, name: 'Flour' },
  { id: 11, name: 'Sugar' },
]

const EXTRA_COLUMNS = [
  'a uter',
  'abbas calamitas',
  'abduco consequuntur',
  'abduco suffragium',
  'abeo arca',
  'abscido volva',
  'absens saepe',
  'absorbeo aestivus',
  'absorbeo bonus',
  'absorbeo cibus',
  'absque consectetur',
  'abstergo auditor',
  'abstergo pecunia',
]

export function UnitTypeDetailPage({
  unitTypeName,
  hubName,
  pushUnitsToChildren,
  onClose,
  onOpenUnit,
}: {
  unitTypeName: string
  hubName: string
  pushUnitsToChildren?: boolean
  onClose: () => void
  onOpenUnit?: (unitName: string) => void
}) {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const isLocal = !hubName

  return (
    <div className="px-8 pb-12 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-sky-200"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #E0F2FE 0, #E0F2FE 6px, #BAE6FD 6px, #BAE6FD 12px)',
            }}
            aria-hidden
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium text-content-text">{unitTypeName}</h1>
              {!isLocal && <Badge label={hubName} variant="hubPrimary" icon />}
            </div>
            <p className="text-sm text-placeholder">Unit Type</p>
          </div>
        </div>

        {isLocal && (
          <div className="flex items-center gap-3">
            <ButtonComponent cssClass="e-outline toolbar-btn">
              <span className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Settings
              </span>
            </ButtonComponent>
            <ButtonComponent cssClass="e-primary toolbar-btn">
              Create unit
            </ButtonComponent>
          </div>
        )}
      </div>

      {isLocal && pushUnitsToChildren && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-border-light bg-surface-alt2 px-4 py-3">
          <ArrowUpFromLine className="h-4 w-4 shrink-0 text-icon" strokeWidth={1.75} />
          <p className="text-sm text-content-text">
            <span className="font-medium">Share units with subscribed sites</span> is enabled. Units in this type are automatically shared with all subscribed sites.
          </p>
        </div>
      )}

      {!isLocal && !bannerDismissed && (
        <MessageComponent
          severity={Severity.Info}
          cssClass="procedure-readonly-message mb-8"
          showIcon
          showCloseIcon
          closed={() => setBannerDismissed(true)}
        >
          <p>
            This unit type is managed by <span className="font-medium">{hubName}</span> and read-only here.
          </p>
          <p>Schema, fields, naming, and units are read-only here — you can view and export, but not add or edit</p>
        </MessageComponent>
      )}

      <div className="mb-6">
        <h2 className="mb-1 text-base font-semibold text-content-text">Parents</h2>
        <p className="text-sm text-placeholder">None found.</p>
      </div>

      <div className="mb-8">
        <h2 className="mb-1 text-base font-semibold text-content-text">Children</h2>
        <button className="text-sm font-medium text-link hover:underline">Range</button>
      </div>

      <div>
        <h2 className="text-base font-semibold text-content-text">Units</h2>
        <p className="mb-4 text-sm text-placeholder">
          There are {UNITS.length} units of this type. Please use the search to help you find any units that you are
          looking for.
        </p>

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-[280px]">
            <TextBoxComponent
              cssClass="e-outline"
              placeholder="Search"
              htmlAttributes={{ 'aria-label': 'Search units' }}
            />
            <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-icon">
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <ButtonComponent cssClass="e-flat link-btn">
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Export
              </span>
            </ButtonComponent>
          </div>
        </div>

        <GridComponent dataSource={UNITS} cssClass="tasks-grid" allowPaging allowTextWrap pageSettings={{ pageSize: 100 }}>
          <ColumnsDirective>
            <ColumnDirective field="id" headerText="ID" width="70" />
            <ColumnDirective
              field="name"
              headerText="Name"
              width="120"
              template={(row: UnitRow) => (
                <button
                  className="text-link hover:underline"
                  onClick={() => onOpenUnit?.(row.name)}
                >
                  {row.name}
                </button>
              )}
            />
            {EXTRA_COLUMNS.map((col) => (
              <ColumnDirective key={col} field={col} headerText={col} width="140" />
            ))}
          </ColumnsDirective>
          <Inject services={[Page]} />
        </GridComponent>
      </div>
    </div>
  )
}
