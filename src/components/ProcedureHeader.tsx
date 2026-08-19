import { useEffect, useRef, useState } from 'react'
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations'
import type { SelectEventArgs } from '@syncfusion/ej2-navigations'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { Pencil, Users, Plus, MoreHorizontal, Check, X, CircleArrowUp, Share2 } from 'lucide-react'
import { MessageComponent } from '@syncfusion/ej2-react-notifications'
import { Severity } from '@syncfusion/ej2-notifications'
import { Avatar } from './Avatar'
import { ShareToHubDialog } from './ShareToHubDialog'
import { ManageCollaboratorsDialog } from './ManageCollaboratorsDialog'
import { GuidesTab } from './GuidesTab'
import { TasksTab, type TaskCategory } from './TasksTab'
import { TrainingTab, type TrainingCategory } from './TrainingTab'
import type { ReactNode, KeyboardEvent } from 'react'
import type { ProcedureKind } from '../procedureKind'
import type { Collaborator } from '../collaborator'

const TABS = ['Timeline', 'Tasks', 'Training', 'Guides']
const TASKS_TAB_INDEX = TABS.indexOf('Tasks')
const TRAINING_TAB_INDEX = TABS.indexOf('Training')
const GUIDES_TAB_INDEX = TABS.indexOf('Guides')

/** Beyond this many, the header stack shows a "+N" overflow avatar instead. */
const MAX_VISIBLE_AVATARS = 4

type Props = {
  timelineContent: ReactNode
  isNew?: boolean
  kind?: ProcedureKind
  /** The card's own name, e.g. "Global Defect Reporting" — shown as the title. */
  name?: string
  /** The owning hub's name — only meaningful for `kind: 'from-hub'`. */
  hubName?: string
  /** How many spoke sites this procedure is shared with — only meaningful for `kind: 'managed'`. */
  subscriberCount?: number
  adopted?: boolean
  /** Drives the avatar stack below — kept in sync with the Collaborators side panel (AboutPanel). */
  collaborators: Collaborator[]
  onCollaboratorsChange: (collaborators: Collaborator[]) => void
  managingCollaborators: boolean
  onManagingCollaboratorsChange: (open: boolean) => void
  /** Lifted to App.tsx so the Tasks tab survives opening/closing the task editor page. */
  activeTab: number
  onActiveTabChange: (index: number) => void
  onOpenTask: (task: TaskCategory) => void
  onOpenTraining: (training: TrainingCategory) => void
}

export function ProcedureHeader({
  timelineContent,
  isNew = false,
  kind = 'local',
  name,
  hubName,
  subscriberCount = 12,
  adopted = true,
  collaborators,
  onCollaboratorsChange,
  managingCollaborators,
  onManagingCollaboratorsChange,
  activeTab,
  onActiveTabChange,
  onOpenTask,
  onOpenTraining,
}: Props) {
  const [title, setTitle] = useState(isNew ? 'Untitled procedure' : (name ?? 'Product'))
  const [editing, setEditing] = useState(false)
  const [sharingToHub, setSharingToHub] = useState(false)
  const inputRef = useRef<TextBoxComponent | null>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focusIn()
  }, [editing])

  const startEditing = () => {
    setEditing(true)
  }

  const commit = () => {
    const trimmed = (inputRef.current?.value ?? '').trim()
    if (trimmed) setTitle(trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') cancel()
  }

  return (
    <div>
      <div className="flex items-center justify-between px-8 pt-6">
        {editing ? (
          <div className="flex items-center gap-2" onKeyDown={onKeyDown}>
            <TextBoxComponent
              ref={inputRef}
              cssClass="e-outline title-edit-input"
              value={title}
              autocomplete="off"
              htmlAttributes={{ 'aria-label': 'Procedure title', autoFocus: true }}
            />
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Save title" title="Save" onClick={commit}>
              <Check className="w-4 h-4 text-success" strokeWidth={2} />
            </ButtonComponent>
            <ButtonComponent cssClass="e-flat icon-btn" aria-label="Cancel edit" title="Cancel" onClick={cancel}>
              <X className="w-4 h-4 text-icon" strokeWidth={2} />
            </ButtonComponent>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium text-content-text">{title}</h1>
            {/* A procedure received from another hub is read-only here — only
                the owning hub can rename it. */}
            {kind !== 'from-hub' && (
              <ButtonComponent
                cssClass="e-flat icon-btn"
                aria-label="Edit procedure name"
                title="Edit"
                onClick={startEditing}
              >
                <Pencil className="w-4 h-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            {/* No collaborators yet (e.g. a procedure managed by this hub, before
                anyone local is added) means no avatars here at all — just the
                add button below — instead of showing stale placeholder people. */}
            {collaborators.slice(0, MAX_VISIBLE_AVATARS).map((c) => (
              <Avatar key={c.email} img={c.avatar} initials={c.initials} className="ring-2 ring-white" />
            ))}
            {collaborators.length > MAX_VISIBLE_AVATARS && (
              <Avatar
                initials={`+${collaborators.length - MAX_VISIBLE_AVATARS}`}
                className="ring-2 ring-white avatar-overflow"
              />
            )}
            <button
              aria-label="Add collaborator"
              title="Add collaborator"
              className="w-8 h-8 rounded-full ring-2 ring-white border border-dashed border-border flex items-center justify-center text-icon hover:bg-surface-alt2"
              onClick={() => onManagingCollaboratorsChange(true)}
            >
              <Plus className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <ButtonComponent cssClass="e-outline team-pill">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" strokeWidth={1.75} />
              {isNew || !adopted ? '0 teams' : '5 teams'}
            </span>
          </ButtonComponent>

          {kind !== 'from-hub' && (
            <ButtonComponent cssClass="e-primary team-pill" onClick={() => setSharingToHub(true)}>
              <span className="flex items-center gap-1.5">
                <CircleArrowUp className="w-4 h-4" strokeWidth={1.75} />
                Share
              </span>
            </ButtonComponent>
          )}

          <ButtonComponent cssClass="e-flat icon-btn" aria-label="More options" title="More options">
            <MoreHorizontal className="w-5 h-5 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        </div>
      </div>

      {kind === 'managed' && (
        <div className="mx-8 mt-4 flex items-center gap-2 rounded-md border border-border-light bg-surface-alt2 px-4 py-2.5 text-sm text-content-text">
          <Share2 className="h-4 w-4 shrink-0 text-icon" strokeWidth={1.75} />
          <p>
            <span className="font-medium">Promoted to site</span> · shared read-only with {subscriberCount}{' '}
            subscribed sites. Your edits propagate automatically.
          </p>
        </div>
      )}

      <div className="px-8 mt-2">
        <TabComponent
          heightAdjustMode="None"
          cssClass="procedure-tabs"
          selectedItem={activeTab}
          selected={(e: SelectEventArgs) => onActiveTabChange(e.selectedIndex)}
        >
          <TabItemsDirective>
            {TABS.map((label) => (
              <TabItemDirective key={label} header={{ text: label }} content={() => <div />} />
            ))}
          </TabItemsDirective>
        </TabComponent>

        {/* Read-only notice only matters while looking at the timeline — the
            other tabs (Tasks/Training/Guides) don't need it repeated on every
            tab, and Guides already states the same constraint itself. */}
        {kind === 'from-hub' && activeTab === 0 && (
          <MessageComponent severity={Severity.Info} cssClass="procedure-readonly-message mt-4" showIcon>
            This procedure is managed by <span className="font-medium">{hubName}</span> and read-only here. You can
            assign teams, add local collaborators, and comment.
          </MessageComponent>
        )}

        {activeTab === 0 ? (
          timelineContent
        ) : activeTab === TASKS_TAB_INDEX && kind !== 'local' ? (
          // Task submissions roll up across a hub relationship either way:
          // a from-hub (spoke) procedure rolls its own submissions up to the
          // owning hub, and a managed (hub-owner) procedure rolls submissions
          // in from every subscribed site — so the per-row "Source" column
          // applies to both. A purely local procedure has no hub relationship
          // at all, so it keeps the plain placeholder.
          <TasksTab onOpenTask={onOpenTask} kind={kind} hubName={hubName} />
        ) : activeTab === TRAINING_TAB_INDEX ? (
          // Unlike Tasks/Guides, training has no hub-rollup concept — the
          // same matrix report applies regardless of procedure kind.
          <TrainingTab kind={kind} hubName={hubName} onOpenTraining={onOpenTraining} />
        ) : activeTab === GUIDES_TAB_INDEX && kind === 'from-hub' ? (
          <GuidesTab hubName={hubName ?? ''} />
        ) : (
          <div className="py-10 text-sm text-placeholder">No content yet.</div>
        )}
      </div>

      <ShareToHubDialog
        visible={sharingToHub}
        onClose={() => setSharingToHub(false)}
        procedureName={title}
        subscriberCount={12}
        onConfirm={() => setSharingToHub(false)}
      />

      <ManageCollaboratorsDialog
        visible={managingCollaborators}
        procedureName={title}
        kind={kind}
        collaborators={collaborators}
        onCollaboratorsChange={onCollaboratorsChange}
        onClose={() => onManagingCollaboratorsChange(false)}
      />
    </div>
  )
}
