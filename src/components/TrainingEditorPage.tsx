import { useState } from 'react'
import type { ReactNode } from 'react'
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons'
import type { ProcedureKind } from '../procedureKind'
import {
  Eye,
  Lightbulb,
  CheckCircle2,
  Pencil,
  Info,
  GripVertical,
  ChevronRight,
  ChevronDown,
  CircleHelp,
  MoreHorizontal,
  Plus,
  Sparkles,
  Undo2,
  Redo2,
  SquarePlus,
  AlarmClock,
  Waypoints,
  CircleCheck,
  SlidersHorizontal,
  Milestone,
  Calendar,
  Camera,
  X,
  Settings,
  Trash2,
} from 'lucide-react'

const EDITOR_TABS = [
  { label: 'Steps', icon: SquarePlus },
  { label: 'Schedules', icon: AlarmClock },
  { label: 'Triggers', icon: Waypoints },
  { label: 'Statuses', icon: CircleCheck },
  { label: 'Settings', icon: SlidersHorizontal },
]

type StepBlock = {
  id: string
  label: string
  icon: typeof Calendar
  /** Branching content ("Go to section") vs a plain data-capture block. */
  kind: 'branch' | 'capture'
  /** An unconfigured block shows its label as a grey placeholder instead of real content. */
  configured: boolean
}

type StepGroupContent = {
  groupTitle: string
  subject: string
  items: StepBlock[]
}

// Each training's Steps content — keyed by name since a hub can send down
// completely different flows under this same editor shell.
const TRAINING_STEP_CONTENT: Record<string, StepGroupContent> = {
  'Christmas Flow': {
    groupTitle: 'Christmas',
    subject: 'Range +1',
    items: [
      { id: 'c1', label: 'What date is christmas?', icon: Calendar, kind: 'capture', configured: true },
      { id: 'c2', label: 'New Element', icon: Camera, kind: 'capture', configured: false },
      { id: 'c3', label: 'New Element', icon: Calendar, kind: 'capture', configured: false },
    ],
  },
  'Cybersecurity Awareness': {
    groupTitle: 'Report a security concern',
    subject: 'Machines',
    items: [
      { id: 's1', label: 'Employee recognizes a suspicious email', icon: Milestone, kind: 'branch', configured: true },
      { id: 's2', label: 'Employee reports a lost or stolen device', icon: Milestone, kind: 'branch', configured: true },
    ],
  },
}

const DEFAULT_STEP_CONTENT = TRAINING_STEP_CONTENT['Cybersecurity Awareness']

type StepDetail = {
  elementType: string
  requireResponse: boolean
  reportTitle: string
  includeSetToNow: boolean
  askFor: 'Date & Time' | 'Date' | 'Time'
  dateSelectionLimit: boolean
}

const STEP_DETAILS: Record<string, StepDetail> = {
  c1: {
    elementType: 'Date Time',
    requireResponse: false,
    reportTitle: 'Do not include',
    includeSetToNow: false,
    askFor: 'Date & Time',
    dateSelectionLimit: true,
  },
  c2: {
    elementType: 'Photo / Video',
    requireResponse: false,
    reportTitle: 'Do not include',
    includeSetToNow: false,
    askFor: 'Date & Time',
    dateSelectionLimit: false,
  },
  c3: {
    elementType: 'Date Time',
    requireResponse: false,
    reportTitle: 'Do not include',
    includeSetToNow: false,
    askFor: 'Date',
    dateSelectionLimit: false,
  },
  s1: {
    elementType: 'Go to section',
    requireResponse: true,
    reportTitle: 'Do not include',
    includeSetToNow: false,
    askFor: 'Date & Time',
    dateSelectionLimit: false,
  },
  s2: {
    elementType: 'Go to section',
    requireResponse: true,
    reportTitle: 'Do not include',
    includeSetToNow: false,
    askFor: 'Date & Time',
    dateSelectionLimit: false,
  },
}

function ReadOnlyField({ label, value, infoIcon }: { label: string; value: string; infoIcon?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-light last:border-b-0">
      <span className="flex items-center gap-1 text-sm text-content-text">
        {label}
        {infoIcon && <Info className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />}
      </span>
      <span className="rounded-md border border-border bg-surface-alt1 px-3 py-1.5 text-sm text-placeholder">
        {value}
      </span>
    </div>
  )
}

function ReadOnlyToggle({ label, checked, infoIcon }: { label: string; checked: boolean; infoIcon?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-light last:border-b-0">
      <span className="flex items-center gap-1 text-sm text-content-text">
        {label}
        {infoIcon && <Info className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />}
      </span>
      <SwitchComponent checked={checked} disabled />
    </div>
  )
}

function ReadOnlySegment({ label, options, selected }: { label: string; options: string[]; selected: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-light last:border-b-0">
      <span className="text-sm text-content-text">{label}</span>
      <div className="flex overflow-hidden rounded-md border border-border opacity-50">
        {options.map((opt) => (
          <span
            key={opt}
            className={`px-3 py-1.5 text-xs font-medium ${
              opt === selected
                ? 'bg-content-disabled text-white'
                : 'bg-surface-alt1 text-placeholder'
            }`}
          >
            {opt}
          </span>
        ))}
      </div>
    </div>
  )
}

function StepDetailPanel({ item, detail }: { item: StepBlock; detail: StepDetail }) {
  const [panelTab, setPanelTab] = useState<'settings' | 'suggestions'>('settings')

  return (
    <div className="flex w-[360px] shrink-0 flex-col border-l border-border-light">
      <div className="flex items-center gap-3 border-b border-border-light px-5 pt-5 pb-0">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
          item.kind === 'branch' ? 'bg-warning-lighter text-warning' : 'bg-primary-lighter text-primary'
        }`}>
          <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-sm font-medium text-content-text">{detail.elementType}</p>
      </div>
      <div className="flex border-b border-border-light">
        <button
          type="button"
          onClick={() => setPanelTab('settings')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wide ${
            panelTab === 'settings'
              ? 'border-b-2 border-primary text-primary'
              : 'text-placeholder hover:text-content-text'
          }`}
        >
          <Settings className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Settings
        </button>
        <button
          type="button"
          onClick={() => setPanelTab('suggestions')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wide ${
            panelTab === 'suggestions'
              ? 'border-b-2 border-primary text-primary'
              : 'text-placeholder hover:text-content-text'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Suggestions
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {panelTab === 'settings' ? (
          <>
            <ReadOnlyField label="Element type" value={detail.elementType} />
            <ReadOnlyToggle label="Require a response" checked={detail.requireResponse} />
            <ReadOnlyField label="Report title" value={detail.reportTitle} infoIcon />
            <ReadOnlyToggle label="Include 'Set to Now' button" checked={detail.includeSetToNow} infoIcon />
            <ReadOnlySegment label="Ask for" options={['Date & Time', 'Date', 'Time']} selected={detail.askFor} />
            <ReadOnlyToggle label="Set date selection limit" checked={detail.dateSelectionLimit} />
            <div className="py-4">
              <p className="flex items-center gap-1 text-sm font-medium text-content-text">
                Element Tags
                <Info className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />
              </p>
              <p className="mt-1 text-xs text-placeholder">
                You can add tags to elements. To create a tag click "Add" and type a keyword.
              </p>
              <p className="mt-2 text-xs text-placeholder italic">+ Add</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-placeholder">No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  )
}

const REPORT_STATUSES = [
  { id: 'st1', name: 'Completed', isDefault: true },
  { id: 'st2', name: 'Pending', isDefault: false },
  { id: 'st3', name: 'Rejected', isDefault: false },
]

function LeftRailButton({
  icon: Icon,
  label,
  disabled,
  accent,
}: {
  icon: typeof Plus
  label: string
  disabled?: boolean
  accent?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex flex-col items-center gap-1.5 rounded-md px-2 py-3 text-xs font-medium transition-colors ${
        disabled
          ? 'cursor-not-allowed text-content-disabled'
          : accent
            ? 'text-primary hover:bg-primary-lighter'
            : 'text-content-text hover:bg-surface-alt2'
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  )
}

function DashedAddBox({ icon: Icon, label, accent }: { icon: typeof Plus; label: string; accent?: boolean }) {
  return (
    <button
      type="button"
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm font-medium transition-colors hover:bg-surface-alt2 ${
        accent ? 'text-primary' : 'text-content-text'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  )
}

/** The "Any status" / "Anyone" pills in the Statuses table — decorative, not wired. */
function InlineDropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-sm text-content-text hover:text-content-text"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">
      {label}
      <button aria-label={`Remove ${label}`} className="hover:text-sky-950">
        <X className="h-3 w-3" strokeWidth={2} />
      </button>
    </span>
  )
}

function InfoCard({
  title,
  action,
  children,
}: {
  title: string
  action?: { label: string; onClick?: () => void }
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border-light bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-base font-semibold text-content-text">
          {title}
          <Info className="h-3.5 w-3.5 text-icon" strokeWidth={1.75} aria-hidden />
        </span>
        {action && (
          <ButtonComponent cssClass="e-primary toolbar-btn">
            <span className="flex items-center gap-1.5">{action.label}</span>
          </ButtonComponent>
        )}
      </div>
      {children}
    </div>
  )
}

/**
 * Full-page training/flow editor — opened by clicking a training card in
 * TrainingTab.tsx (managed procedures only). A level below the procedure it
 * belongs to, hence the breadcrumb-style bar ("{procedureName} / {trainingName}")
 * rather than reusing the app's TopBar breadcrumb, which stays empty on this
 * page (see TopBar.tsx's trailFor).
 *
 * Steps carries its own Preview/Tips/Saved/Close toolbar; the other four tabs
 * share a plainer "Unsaved changes · Save" bar instead, matching the reference
 * screens — those tabs don't have a Close affordance of their own, so the
 * breadcrumb's procedure name stays clickable as the way back out.
 */
export function TrainingEditorPage({
  procedureName,
  trainingName,
  kind = 'local',
  onClose,
}: {
  procedureName: string
  trainingName: string
  kind?: ProcedureKind
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)
  const content = TRAINING_STEP_CONTENT[trainingName] ?? DEFAULT_STEP_CONTENT
  const readOnly = kind === 'managed' || kind === 'from-hub'
  const visibleTabs = readOnly
    ? EDITOR_TABS.filter(t => t.label === 'Schedules' || t.label === 'Triggers')
    : EDITOR_TABS
  const currentTabLabel = visibleTabs[activeTab]?.label ?? ''
  const selectedItem = selectedStepId ? content.items.find((i) => i.id === selectedStepId) : null
  const selectedDetail = selectedStepId ? STEP_DETAILS[selectedStepId] : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border-light px-6">
        <div className="flex items-center gap-6">
          {visibleTabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors ${
                activeTab === i
                  ? 'border-primary text-primary'
                  : 'border-transparent text-placeholder hover:text-content-text'
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {currentTabLabel === 'Steps' && (
            <>
              <ButtonComponent cssClass="icon-btn-secondary" aria-label="Preview" title="Preview">
                <Eye className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
              <ButtonComponent cssClass="icon-btn-secondary" aria-label="Tips" title="Tips">
                <Lightbulb className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
            </>
          )}
          <ButtonComponent cssClass="e-flat toolbar-btn" onClick={onClose}>
            Close
          </ButtonComponent>
          <ButtonComponent cssClass="e-primary toolbar-btn">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Save
            </span>
          </ButtonComponent>
        </div>
      </div>

      {currentTabLabel === 'Triggers' && (
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-content-text">
              There are no triggers to show yet, click on 'Add Trigger' to create your first one
            </p>
            <ButtonComponent cssClass="e-primary toolbar-btn">Add Trigger</ButtonComponent>
          </div>
        </div>
      )}
      {currentTabLabel === 'Steps' && (
        <div className="flex min-h-0 flex-1">
          {!readOnly && (
            <div className="flex w-[104px] shrink-0 flex-col items-center gap-1 border-r border-border-light py-4">
              <LeftRailButton icon={Plus} label="Add Step" />
              <LeftRailButton icon={Sparkles} label="Create with AI" accent />
              <div className="my-2 h-px w-16 bg-border-light" />
              <LeftRailButton icon={Undo2} label="Undo" disabled />
              <LeftRailButton icon={Redo2} label="Redo" disabled />
            </div>
          )}

          <div className="min-w-0 flex-1 overflow-y-auto bg-surface-alt2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold text-content-text">Subject:</span>{' '}
                <span className="text-content-text">{content.subject}</span>
              </p>
              {!readOnly && (
                <button className="text-icon hover:text-icon-hover" aria-label="Edit subject" title="Edit subject">
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              )}
              <ButtonComponent cssClass="e-flat link-btn ml-auto">
                <span className="flex items-center gap-1.5">
                  Translate flow
                  <Info className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </span>
              </ButtonComponent>
            </div>

            <div className="mb-4 rounded-lg border border-border-light bg-white">
              <div className="flex items-center justify-between border-b border-border-light p-4">
                <div className="flex items-center gap-3">
                  {!readOnly && <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-icon" strokeWidth={1.75} aria-hidden />}
                  <p className="font-semibold text-content-text">{content.groupTitle}</p>
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Move step">
                      <Milestone className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                    <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Help">
                      <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                    <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="More options">
                      <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                {content.items.map((item) => {
                  const isSelected = selectedStepId === item.id
                  return (
                    <div
                      key={item.id}
                      role={readOnly ? 'button' : undefined}
                      tabIndex={readOnly ? 0 : undefined}
                      onClick={readOnly ? () => setSelectedStepId(isSelected ? null : item.id) : undefined}
                      onKeyDown={readOnly ? (e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedStepId(isSelected ? null : item.id) } : undefined}
                      className={`border-b border-border-light p-4 ${readOnly ? 'cursor-pointer transition-colors hover:bg-surface-alt2' : ''} ${isSelected ? 'bg-primary-lighter' : ''}`}
                    >
                      <div className={item.kind === 'branch' ? 'mb-2 flex items-center justify-between' : 'flex items-center justify-between'}>
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                              item.kind === 'branch' ? 'bg-warning-lighter text-warning' : 'bg-primary-lighter text-primary'
                            }`}
                          >
                            <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                          </span>
                          <p className={`truncate text-sm ${item.configured ? 'text-content-text' : 'text-placeholder'}`}>
                            {item.label}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {readOnly ? (
                            <>
                              <span className="rounded p-1.5 text-icon">
                                <Settings className="h-4 w-4" strokeWidth={1.75} />
                              </span>
                              <span className="rounded p-1.5 text-icon">
                                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                              </span>
                            </>
                          ) : (
                            <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Tips">
                              <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          )}
                        </div>
                      </div>
                      {item.kind === 'branch' && (
                        <button className="flex w-full items-center justify-between rounded-md border border-border-light px-4 py-2.5 text-sm text-content-text hover:bg-surface-alt2">
                          Go to section
                          <ChevronRight className="h-4 w-4 text-icon" strokeWidth={1.75} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {!readOnly && (
                <div className="p-4">
                  <button className="flex items-center gap-2 text-sm font-medium text-content-text">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-content-text text-white">
                      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    Add content
                  </button>
                </div>
              )}
            </div>

            {!readOnly && (
              <div className="flex gap-4">
                <DashedAddBox icon={Plus} label="Add Step" />
                <DashedAddBox icon={Sparkles} label="Create with AI" accent />
              </div>
            )}
          </div>

          {readOnly && selectedItem && selectedDetail ? (
            <StepDetailPanel item={selectedItem} detail={selectedDetail} />
          ) : (
            <div className="flex w-[360px] shrink-0 items-start justify-center border-l border-border-light p-10">
              <p className="text-center text-sm text-placeholder">
                {readOnly
                  ? 'Select a step to view its settings'
                  : 'Start adding content to the left to build your task'}
              </p>
            </div>
          )}
        </div>
      )}

      {currentTabLabel === 'Schedules' && (
        <div className="p-6">
          <div className="rounded-lg border border-border-light bg-white">
            <div className="flex items-center justify-between border-b border-border-light p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-content-text">Schedules</h2>
              <ButtonComponent cssClass="toolbar-btn">Add schedule</ButtonComponent>
            </div>
            <div className="p-4">
              <p className="font-medium text-content-text">{trainingName}</p>
            </div>
          </div>
        </div>
      )}

      {currentTabLabel === 'Statuses' && (
        <div className="p-6">
          <h2 className="text-lg font-semibold text-content-text">Report Statuses</h2>
          <p className="mb-4 text-sm text-placeholder">Create custom statuses for organising your reports.</p>

          <div className="overflow-hidden rounded-lg border border-border-light bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-light text-xs font-semibold text-placeholder">
                  <th className="p-4 font-semibold">Status name</th>
                  <th className="p-4 font-semibold">Default status</th>
                  <th className="p-4 font-semibold">Can be changed to</th>
                  <th className="p-4 font-semibold">Can be changed by</th>
                  <th className="p-4 font-semibold">Notify</th>
                  <th className="p-4 font-semibold">Final status</th>
                  <th className="w-10 p-4" />
                </tr>
              </thead>
              <tbody>
                {REPORT_STATUSES.map((status) => (
                  <tr key={status.id} className="border-b border-border-light">
                    <td className="p-4 font-medium text-content-text">{status.name}</td>
                    <td className="p-4">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          status.isDefault ? (readOnly ? 'border-content-disabled' : 'border-primary') : 'border-border'
                        }`}
                      >
                        {status.isDefault && <span className={`h-2 w-2 rounded-full ${readOnly ? 'bg-content-disabled' : 'bg-primary'}`} />}
                      </span>
                    </td>
                    <td className="p-4">
                      {readOnly ? (
                        <span className="text-sm text-placeholder">Any status</span>
                      ) : (
                        <InlineDropdown label="Any status" />
                      )}
                    </td>
                    <td className="p-4">
                      {readOnly ? (
                        <span className="text-sm text-placeholder">Anyone</span>
                      ) : (
                        <InlineDropdown label="Anyone" />
                      )}
                    </td>
                    <td className="p-4">
                      <SwitchComponent disabled={readOnly} />
                    </td>
                    <td className="p-4">
                      <SwitchComponent disabled={readOnly} />
                    </td>
                    <td className="p-4">
                      {!readOnly && (
                        <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="More options">
                          <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!readOnly && (
              <button className="flex w-full items-center gap-2 p-4 text-sm font-medium text-content-text hover:bg-surface-alt2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-content-text text-white">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                Add status
              </button>
            )}
          </div>
        </div>
      )}

      {currentTabLabel === 'Settings' && (
        <div className="flex flex-col gap-4 p-6">
          <InfoCard title="Parameters" action={readOnly ? undefined : { label: 'Add' }}>
            <div className="grid grid-cols-2 gap-4 border-b border-border-light pb-2 text-xs font-semibold uppercase tracking-wide text-placeholder">
              <span>Name</span>
              <span>Unit type</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 text-sm italic text-placeholder">
              <span>E.g. Product being made</span>
              <span>SKUs</span>
            </div>
          </InfoCard>

          <InfoCard title="Flow Tags">
            <p className="mb-3 text-sm text-placeholder">
              You can add tags to your flow. To create a tag click "Add" and type a keyword.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {readOnly ? (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">Zap_Checklist</span>
              ) : (
                <TagChip label="Zap_Checklist" />
              )}
              {!readOnly && <button className="text-sm font-medium text-primary hover:text-primary-hover">+ Add</button>}
            </div>
          </InfoCard>

          <InfoCard title="Flow Tags - Internal">
            <p className="mb-3 text-sm text-placeholder">
              You can add tags to your flow. To create a tag click "Add" and type a keyword.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {readOnly ? (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">mytest</span>
              ) : (
                <TagChip label="mytest" />
              )}
              {!readOnly && <button className="text-sm font-medium text-primary hover:text-primary-hover">+ Add</button>}
            </div>
          </InfoCard>

          <InfoCard title="Report content">
            <div className="flex items-center justify-between">
              <span className="text-sm text-content-text">Display text elements</span>
              <SwitchComponent disabled={readOnly} />
            </div>
          </InfoCard>
        </div>
      )}
    </div>
  )
}
