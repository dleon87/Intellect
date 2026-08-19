import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import type { ProcedureKind } from '../procedureKind'
import {
  Eye,
  Lightbulb,
  CheckCircle2,
  Pencil,
  Info,
  GripVertical,
  Share2,
  CircleHelp,
  MoreHorizontal,
  Trash2,
  Plus,
  Sparkles,
  Undo2,
  Redo2,
  SquarePlus,
  AlarmClock,
  Waypoints,
  CircleCheck,
  SlidersHorizontal,
  MessageSquareText,
  Grid3x3,
  Bell,
  Zap,
  Lock,
  BookOpen,
  Upload,
  Globe,
  X,
} from 'lucide-react'

const EDITOR_TABS = [
  { label: 'Steps', icon: SquarePlus },
  { label: 'Schedules', icon: AlarmClock },
  { label: 'Triggers', icon: Waypoints },
  { label: 'Statuses', icon: CircleCheck },
  { label: 'Settings', icon: SlidersHorizontal },
]

type StepItem = {
  id: string
  text: string
  /** Which content type's glyph/color this step content uses. */
  kind: 'text' | 'media'
}

const STEP_ITEMS: StepItem[] = [
  { id: 'i1', text: 'Confirm PPE compliance for all operators', kind: 'text' },
  { id: 'i2', text: 'Verify lockout/tagout stations are stocked', kind: 'text' },
  { id: 'i3', text: 'Check emergency stop functionality', kind: 'text' },
  { id: 'i4', text: 'Attach photo of a clean workspace', kind: 'media' },
  { id: 'i5', text: 'Log defect count for the shift', kind: 'media' },
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

/**
 * Full-page task/flow editor — opened by clicking a task card in TasksTab.tsx.
 * A level below the procedure it belongs to, hence the breadcrumb-style bar
 * ("{procedureName} / {taskName}") rather than reusing the app's TopBar
 * breadcrumb, which stays empty on this page (see TopBar.tsx's trailFor).
 */
type TriggerEntry = {
  id: string
  name: string
  active: boolean
  condition?: string
  action?: string
}

const SAMPLE_TRIGGERS: TriggerEntry[] = [
  { id: 't1', name: 'test trigger', active: true, condition: 'new-report' },
]

function TriggerForm({
  kind,
  hubName,
  initialName = '',
  initialCondition,
  initialAction,
  onSave,
  onCancel,
}: {
  kind: ProcedureKind
  hubName?: string
  initialName?: string
  initialCondition?: string
  initialAction?: string
  onSave: (name: string, condition?: string, action?: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialName)
  const [selectedCondition, setSelectedCondition] = useState<string | undefined>(initialCondition)
  const [selectedAction, setSelectedAction] = useState<string | undefined>(initialAction)

  const isSpoke = kind === 'from-hub'
  const isHub = kind === 'local' || kind === 'managed' || kind === 'hub-owner'

  const conditions = [
    { id: 'new-report', label: 'A new report is submitted' },
    { id: 'status-changed', label: 'A report status is changed' },
    { id: 'actions-completed', label: 'All actions are completed' },
    ...(isHub ? [{ id: 'published-to-site', label: 'Report published to this site' }] : []),
  ]

  const actions = [
    { id: 'notification', label: 'Notification', icon: Bell },
    { id: 'action', label: 'Action', icon: Zap },
    { id: 'set-status', label: 'Set status', icon: CircleCheck },
    { id: 'confidential', label: 'Mark as Confidential', icon: Lock },
    { id: 'promote-guide', label: 'Promote to guide', icon: BookOpen },
    ...(isSpoke && hubName ? [{ id: 'publish-hub', label: `Publish to ${hubName}`, icon: Upload }] : []),
    ...(isHub ? [{ id: 'share-all', label: 'Share to all sites', icon: Globe }] : []),
  ]

  return (
    <div className="rounded-lg border border-border-light bg-white overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
        <h2 className="text-base font-semibold text-content-text">
          {initialName || 'New Trigger'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-alt2 text-icon hover:bg-surface-alt3 hover:text-icon-hover"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Card body */}
      <div className="p-8 space-y-8">
        {/* Name */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-content-text">Name</p>
          <p className="text-sm text-placeholder">Choose a name for your trigger</p>
          <TextBoxComponent
            cssClass="e-outline"
            value={name}
            change={(e: { value: string }) => setName(e.value)}
            htmlAttributes={{ 'aria-label': 'Trigger name' }}
          />
        </div>

        <div className="border-t border-border-light" />

        {/* When this happens */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Waypoints className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <p className="text-sm font-semibold text-content-text">When this happens...</p>
          </div>
          <p className="text-sm text-placeholder">Choose the event that sets the trigger in motion.</p>
          <div className="grid grid-cols-3 gap-3">
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCondition(c.id)}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selectedCondition === c.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-content-text hover:border-primary/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-placeholder">
            You can add conditions that must be met for the trigger to run. The trigger will run if and only if every condition in any group is fulfilled
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-content-text hover:bg-surface-alt2"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            Add condition
          </button>
        </div>

        <div className="border-t border-border-light" />

        {/* Then do this */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Waypoints className="h-4 w-4 text-primary" strokeWidth={1.75} style={{ transform: 'scaleX(-1)' }} />
            <p className="text-sm font-semibold text-content-text">Then do this...</p>
          </div>
          <p className="text-sm text-placeholder">Choose the response.</p>
          <div className="grid grid-cols-3 gap-3">
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAction(a.id)}
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selectedAction === a.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-content-text hover:border-primary/40'
                }`}
              >
                <a.icon
                  className={`h-4 w-4 shrink-0 ${selectedAction === a.id ? 'text-white' : 'text-warning'}`}
                  strokeWidth={1.75}
                />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border-light" />

        {/* Save */}
        <ButtonComponent
          cssClass="toolbar-btn w-full"
          onClick={() => onSave(name || 'New trigger', selectedCondition, selectedAction)}
        >
          <span className="font-semibold uppercase tracking-wide text-sm">Save trigger</span>
        </ButtonComponent>
      </div>
    </div>
  )
}

export function TaskEditorPage({
  procedureName,
  taskName,
  kind = 'local',
  hubName,
  onClose,
}: {
  procedureName: string
  taskName: string
  kind?: ProcedureKind
  hubName?: string
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [triggerListTab, setTriggerListTab] = useState<'active' | 'inactive'>('active')
  const [triggerFormOpen, setTriggerFormOpen] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<TriggerEntry | null>(null)
  const [triggers, setTriggers] = useState<TriggerEntry[]>(SAMPLE_TRIGGERS)
  const isManaged = kind === 'managed' || kind === 'from-hub'
  const visibleTabs = isManaged
    ? EDITOR_TABS.filter(t => t.label === 'Schedules' || t.label === 'Triggers')
    : EDITOR_TABS
  const currentTabLabel = visibleTabs[activeTab]?.label ?? ''

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
          {isManaged ? (
            <>
              <ButtonComponent cssClass="e-flat toolbar-btn" onClick={onClose}>
                Close
              </ButtonComponent>
              <ButtonComponent cssClass="e-primary toolbar-btn">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Save
                </span>
              </ButtonComponent>
            </>
          ) : (
            <>
              <ButtonComponent cssClass="icon-btn-secondary" aria-label="Preview" title="Preview">
                <Eye className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
              <ButtonComponent cssClass="icon-btn-secondary" aria-label="Tips" title="Tips">
                <Lightbulb className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
              <span className="flex items-center gap-1.5 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Saved
              </span>
              <ButtonComponent cssClass="toolbar-btn" onClick={onClose}>
                Close
              </ButtonComponent>
            </>
          )}
        </div>
      </div>

      {currentTabLabel === 'Steps' ? (
        <div className="flex min-h-0 flex-1">
          <div className="flex w-[104px] shrink-0 flex-col items-center gap-1 border-r border-border-light py-4">
            <LeftRailButton icon={Plus} label="Add Step" />
            <LeftRailButton icon={Sparkles} label="Create with AI" accent />
            <div className="my-2 h-px w-16 bg-border-light" />
            <LeftRailButton icon={Undo2} label="Undo" disabled />
            <LeftRailButton icon={Redo2} label="Redo" disabled />
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto bg-surface-alt2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold text-content-text">Subject:</span>{' '}
                <span className="text-placeholder">None</span>
              </p>
              <button className="text-icon hover:text-icon-hover" aria-label="Edit subject" title="Edit subject">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
              <ButtonComponent cssClass="e-flat link-btn ml-auto">
                <span className="flex items-center gap-1.5">
                  Translate flow
                  <Info className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </span>
              </ButtonComponent>
            </div>

            <div className="rounded-lg border border-border-light bg-white">
              <div className="flex items-center justify-between border-b border-border-light p-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-icon" strokeWidth={1.75} aria-hidden />
                  <p className="font-semibold text-content-text">Pre-shift safety walkthrough</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Move step">
                    <Share2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Help">
                    <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                {STEP_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border-light p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          item.kind === 'text' ? 'bg-success-lighter text-success' : 'bg-warning-lighter text-warning'
                        }`}
                      >
                        {item.kind === 'text' ? (
                          <MessageSquareText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        ) : (
                          <Grid3x3 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        )}
                      </span>
                      <p className="truncate text-sm text-content-text">{item.text}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button className="rounded p-1.5 text-icon hover:bg-surface-alt2" aria-label="Tips">
                        <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button className="rounded p-1.5 text-icon hover:text-danger" aria-label={`Delete ${item.text}`}>
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4">
                <button className="flex items-center gap-2 text-sm font-medium text-content-text">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-content-text text-white">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  Add content
                </button>
              </div>
            </div>

            {/* Peek of the next step group, matching the reference design's
                partially-visible second card below the fold. */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border-light bg-white p-4">
              <GripVertical className="h-4 w-4 shrink-0 text-icon" strokeWidth={1.75} aria-hidden />
              <p className="font-semibold text-content-text">Equipment inspection</p>
            </div>
          </div>

          <div className="flex w-[360px] shrink-0 items-start justify-center border-l border-border-light p-10">
            <p className="text-center text-sm text-placeholder">Start adding content to the left to build your task</p>
          </div>
        </div>
      ) : currentTabLabel === 'Schedules' ? (
        <div className="p-6">
          <div className="rounded-lg border border-border-light bg-white">
            <div className="flex items-center justify-between border-b border-border-light p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-content-text">Schedules</h2>
              <ButtonComponent cssClass="toolbar-btn">Add schedule</ButtonComponent>
            </div>
            <div className="p-4">
              <p className="font-medium text-content-text">{taskName}</p>
            </div>
          </div>
        </div>
      ) : currentTabLabel === 'Triggers' ? (
        <div className="flex-1 overflow-y-auto bg-surface-alt2 p-6">
          {/* Empty state — no triggers yet and form not open */}
          {triggers.length === 0 && !triggerFormOpen ? (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-lg border border-dashed border-border bg-white px-16 py-12 text-center">
                <p className="mb-4 text-sm text-content-text">
                  There are no triggers to show yet, click on 'Add Trigger' to create your first one
                </p>
                <ButtonComponent
                  cssClass="toolbar-btn"
                  onClick={() => { setEditingTrigger(null); setTriggerFormOpen(true) }}
                >
                  Add Trigger
                </ButtonComponent>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[780px] space-y-4">
              {/* Trigger list — only when triggers exist */}
              {triggers.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-border-light bg-white">
                  <div className="flex items-center justify-between border-b border-border-light px-5">
                    <div className="flex">
                      {(['active', 'inactive'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setTriggerListTab(tab)}
                          className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                            triggerListTab === tab
                              ? 'border-primary text-primary'
                              : 'border-transparent text-placeholder hover:text-content-text'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                    <ButtonComponent
                      cssClass="e-primary e-flat toolbar-btn"
                      onClick={() => { setEditingTrigger(null); setTriggerFormOpen(true) }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" strokeWidth={1.75} />
                        Add Trigger
                      </span>
                    </ButtonComponent>
                  </div>

                  {triggers
                    .filter(t => triggerListTab === 'active' ? t.active : !t.active)
                    .map(trigger => (
                      <button
                        key={trigger.id}
                        type="button"
                        onClick={() => { setEditingTrigger(trigger); setTriggerFormOpen(true) }}
                        className="flex w-full items-center justify-between border-b border-border-light px-5 py-3 text-left last:border-b-0 hover:bg-surface-alt2"
                      >
                        <span className={`text-sm font-medium ${editingTrigger?.id === trigger.id ? 'text-primary' : 'text-content-text'}`}>
                          {trigger.name}
                        </span>
                        <MoreHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
                      </button>
                    ))}
                </div>
              )}

              {/* Trigger form — new or editing */}
              {triggerFormOpen && (
                <TriggerForm
                  kind={kind}
                  hubName={hubName}
                  initialName={editingTrigger?.name ?? ''}
                  initialCondition={editingTrigger?.condition}
                  initialAction={editingTrigger?.action}
                  onSave={(name, condition, action) => {
                    if (editingTrigger) {
                      setTriggers(prev => prev.map(t =>
                        t.id === editingTrigger.id ? { ...t, name, condition, action } : t
                      ))
                    } else {
                      setTriggers(prev => [...prev, { id: `t${Date.now()}`, name, active: true, condition, action }])
                    }
                    setTriggerFormOpen(false)
                    setEditingTrigger(null)
                  }}
                  onCancel={() => { setTriggerFormOpen(false); setEditingTrigger(null) }}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-placeholder">No content yet.</div>
      )}
    </div>
  )
}
