import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns'
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { MessageComponent } from '@syncfusion/ej2-react-notifications'
import { Severity } from '@syncfusion/ej2-notifications'
import {
  Pencil,
  MoreHorizontal,
  Info,
  Settings,
  Wrench,
  X,
} from 'lucide-react'
import { Badge } from './Badge'
import type { GuideData } from './GuidesPage'

type Props = {
  guide: GuideData
  onClose: () => void
}

const ALL_UNITS = ['Machine qa 1', 'Machine qa2', 'Machine qa3', 'Machine qa4', 'Cutter Machine', 'Line 1', 'Line 2']
const ALL_PROCEDURES = ['Product', 'Argonaut', 'Global Defect Reporting', 'First Alert — Safety', 'Hygiene Audit', 'Loop Element']

const INITIAL_UNITS = ['Machine qa 1', 'Machine qa2', 'Machine qa3']
const INITIAL_PROCEDURES = ['Product', 'Argonaut']

const UNITS_AND_PROCEDURES = [
  { name: 'Cutter Machine', type: 'Machine Class', icon: Settings },
  { name: 'Hygiene Audit', type: 'Procedure', icon: Wrench },
  { name: 'Loop Element', type: 'Procedure', icon: Wrench },
]

const TAGS = ['maintenance', 'cutting machine']

function LinkModal({ onClose }: { onClose: () => void }) {
  const [units, setUnits] = useState<string[]>(INITIAL_UNITS)
  const [procedures, setProcedures] = useState<string[]>(INITIAL_PROCEDURES)

  return (
    <DialogComponent
      visible
      width="620px"
      isModal
      overlayClick={onClose}
      showCloseIcon
      header="Link units & procedures"
      footerTemplate={() => (
        <div className="flex justify-end gap-2">
          <ButtonComponent cssClass="e-outline toolbar-btn" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary toolbar-btn" onClick={onClose}>Save Changes</ButtonComponent>
        </div>
      )}
      cssClass="link-units-dialog"
      close={onClose}
    >
      <div className="pt-2 pb-4">
        <p className="mb-6 text-sm text-content-text-alt1">
          Linking makes this guide visible to frontline workers in the selected contexts.
          It's the only change you can make to a managed guide.
        </p>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-content-text">Link to units</label>
          <MultiSelectComponent
            dataSource={ALL_UNITS}
            value={units}
            mode="Box"
            cssClass="e-outline"
            placeholder="Select units..."
            change={(e: { value: string[] }) => setUnits(e.value ?? [])}
          />
          <button className="mt-1.5 text-xs text-placeholder hover:underline">
            Having trouble? View the classic picker.
          </button>
        </div>

        <div className="mb-2">
          <label className="mb-2 block text-sm font-semibold text-content-text">Link to procedures</label>
          <MultiSelectComponent
            dataSource={ALL_PROCEDURES}
            value={procedures}
            mode="Box"
            cssClass="e-outline"
            placeholder="Select procedures..."
            change={(e: { value: string[] }) => setProcedures(e.value ?? [])}
          />
          <button className="mt-1.5 text-xs text-placeholder hover:underline">
            Having trouble? View the classic picker.
          </button>
        </div>
      </div>
    </DialogComponent>
  )
}

export function GuideDetailPage({ guide, onClose }: Props) {
  const isHub = !!guide.source && guide.source !== 'Local'
  const hubName = isHub ? guide.source! : undefined
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto px-8 pb-12 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium text-content-text">{guide.title}</h1>
          {hubName && <Badge label={hubName} variant="hubPrimary" icon />}
        </div>
        <div className="flex items-center gap-2">
          {!isHub && (
            <ButtonComponent cssClass="e-outline toolbar-btn">
              <span className="flex items-center gap-1.5">
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
                Edit
              </span>
            </ButtonComponent>
          )}
          <ButtonComponent cssClass="e-flat icon-btn" aria-label="More options" title="More options">
            <MoreHorizontal className="h-5 w-5 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        </div>
      </div>

      {isHub && (
        <MessageComponent
          severity={Severity.Info}
          cssClass="procedure-readonly-message mb-5"
          showIcon
          showCloseIcon
        >
          <p>
            This guide is managed by <span className="font-medium">{hubName}</span> and read-only here.
            You can link it to your local units and procedures.
          </p>
          <p className="mt-1 text-xs text-content-text-alt2">
            Content stays in sync automatically.
          </p>
        </MessageComponent>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border-light bg-surface-alt">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[80px] w-[60px] flex-col items-center justify-center rounded bg-white shadow-sm">
                <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">pdf</span>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-border-light pt-4">
            <p className="text-sm font-medium text-content-text">{guide.title.replace('...', '')}</p>
            <p className="mt-1 text-xs text-placeholder">{guide.date}</p>
          </div>
        </div>

        <div className="col-span-1 rounded-lg border border-border-light p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-content-text-alt2">
            <Info className="h-4 w-4" strokeWidth={1.75} />
            About this guide
          </div>

          <p className="mb-5 text-sm text-content-text">Steps to using a metal cutting machine</p>

          <div className="border-t border-border-light" />

          <div className="py-4">
            <p className="mb-1 text-sm font-semibold text-content-text">Created</p>
            <p className="text-sm text-content-text-alt2">{guide.date} - 11:48 am</p>
            <div className="mt-2 flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/24?img=${guide.createdByAvatar ?? 14}`}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="text-sm text-content-text-alt2">{guide.createdBy ?? 'Deleted User'}</span>
            </div>
          </div>

          <div className="border-t border-border-light" />

          <div className="py-4">
            <p className="mb-1 text-sm font-semibold text-content-text">Last updated</p>
            <p className="text-sm text-content-text-alt2">{guide.lastUpdate ?? guide.date} - 11:48 am</p>
            <div className="mt-2 flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/24?img=${guide.ownerAvatar ?? 14}`}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="text-sm text-content-text-alt2">{guide.owner ?? 'Deleted User'}</span>
            </div>
          </div>

          <div className="border-t border-border-light" />

          <div className="py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-content-text">Units and Procedures</p>
              <button
                onClick={() => setLinkModalOpen(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Link
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {UNITS_AND_PROCEDURES.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0 text-icon" strokeWidth={1.75} />
                  <div>
                    <button className="text-sm font-medium text-link hover:underline">{item.name}</button>
                    <p className="text-xs text-placeholder">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-light" />

          <div className="py-4">
            <p className="mb-3 text-sm font-semibold text-content-text">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-content-bg-alt2 px-3 py-1 text-xs font-medium text-content-text-alt1"
                >
                  {tag}
                  <X className="h-3 w-3 cursor-pointer text-icon hover:text-icon-hover" strokeWidth={2} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {linkModalOpen && <LinkModal onClose={() => setLinkModalOpen(false)} />}
    </div>
  )
}
