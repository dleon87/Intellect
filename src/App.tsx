import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ProcedureHeader } from './components/ProcedureHeader'
import { ProceduresPage } from './components/ProceduresPage'
import { Composer } from './components/Composer'
import { EventTimeline } from './components/EventTimeline'
import { AboutPanel } from './components/AboutPanel'
import { TaskEditorPage } from './components/TaskEditorPage'
import { TrainingEditorPage } from './components/TrainingEditorPage'
import { DataManagementPage } from './components/DataManagementPage'
import { UnitTypeDetailPage } from './components/UnitTypeDetailPage'
import { UnitDetailPage } from './components/UnitDetailPage'
import { CreateUnitTypePage } from './components/CreateUnitTypePage'
import { GuidesPage, type GuideData } from './components/GuidesPage'
import { GuideDetailPage } from './components/GuideDetailPage'
import type { ProcedureCardData } from './components/ProcedureCard'
import type { TaskCategory } from './components/TasksTab'
import type { TrainingCategory } from './components/TrainingTab'
import type { UnitTypeData } from './components/DataManagementPage'
import type { ProcedureKind } from './procedureKind'
import { initialCollaborators, type Collaborator } from './collaborator'

import type { Page } from './pages'

export type Post = {
  id: string
  name: string
  avatar: number
  text: string
  timestamp: string
}

function TimelineTab({
  isNew,
  kind,
  hubName,
  adopted,
  collaborators,
  onCollaboratorsChange,
  onManageCollaborators,
}: {
  isNew: boolean
  kind: ProcedureKind
  hubName?: string
  adopted?: boolean
  collaborators: Collaborator[]
  onCollaboratorsChange: (collaborators: Collaborator[]) => void
  onManageCollaborators?: () => void
}) {
  const [posts, setPosts] = useState<Post[]>([])

  const addPost = (text: string) => {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    setPosts((prev) => [
      { id: `${Date.now()}`, name: 'Diana Leon', avatar: 5, text, timestamp },
      ...prev,
    ])
  }

  return (
    <div className="grid grid-cols-3 gap-6 py-6">
      <div className="col-span-2">
        <Composer onPost={addPost} />
        {/* Local procedures haven't been shared into a hub yet, so there's no
            hub broadcast to show — managed and from-hub procedures both have
            one, per the section rules on ProceduresPage. */}
        <EventTimeline posts={posts} isNew={isNew} showHubPost={kind !== 'local'} hubName={hubName} />
      </div>
      <div className="col-span-1">
        <AboutPanel isNew={isNew} kind={kind} adopted={adopted} collaborators={collaborators} onCollaboratorsChange={onCollaboratorsChange} onManageCollaborators={onManageCollaborators} />

      </div>
    </div>
  )
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [page, setPage] = useState<Page>('procedures')
  const [openedProcedure, setOpenedProcedure] = useState<ProcedureCardData | null>(null)
  // Lifted above ProcedureHeader/AboutPanel so the header's avatar stack stays
  // in sync with whatever the Collaborators side panel actually has — reset
  // explicitly on navigation since, unlike ProcedureHeader, App itself doesn't
  // remount per procedure.
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => initialCollaborators('local', false))
  const [managingCollaborators, setManagingCollaborators] = useState(false)
  // Lifted the same way as collaborators: opening a task fully unmounts
  // ProcedureHeader (a sibling branch below renders TaskEditorPage instead),
  // so without lifting this, closing the task editor would always land back
  // on the Timeline tab instead of the Tasks tab it was opened from.
  const [activeTab, setActiveTab] = useState(0)
  const [openedTask, setOpenedTask] = useState<TaskCategory | null>(null)
  const [openedTraining, setOpenedTraining] = useState<TrainingCategory | null>(null)
  const [openedUnitType, setOpenedUnitType] = useState<UnitTypeData | null>(null)
  const [openedUnit, setOpenedUnit] = useState<{ name: string; unitTypeName: string; hubName?: string } | null>(null)
  const [openedGuide, setOpenedGuide] = useState<GuideData | null>(null)

  const openProcedure = (data: ProcedureCardData) => {
    setOpenedProcedure(data)
    const adopted = !data.badges?.some((b) => b.label === 'Not Adopted')
    setCollaborators(initialCollaborators(data.kind, false, adopted))
    setActiveTab(0)
    setPage('procedure')
  }

  const openNewProcedure = () => {
    setOpenedProcedure(null)
    setCollaborators(initialCollaborators('local', true))
    setActiveTab(0)
    setPage('new-procedure')
  }

  const openTask = (task: TaskCategory) => {
    setOpenedTask(task)
    setPage('task')
  }

  const closeTask = () => {
    setOpenedTask(null)
    setPage('procedure')
  }

  const openTraining = (training: TrainingCategory) => {
    setOpenedTraining(training)
    setPage('training')
  }

  const closeTraining = () => {
    setOpenedTraining(null)
    setPage('procedure')
  }

  const openUnitType = (unitType: UnitTypeData) => {
    setOpenedUnitType(unitType)
    setPage('unit-type')
  }

  const closeUnitType = () => {
    setOpenedUnitType(null)
    setPage('data-management')
  }

  const openUnit = (unitName: string) => {
    setOpenedUnit({
      name: unitName,
      unitTypeName: openedUnitType?.name ?? '',
      hubName: openedUnitType?.hubName,
    })
    setPage('unit-detail')
  }

  const closeUnit = () => {
    setOpenedUnit(null)
    setPage('unit-type')
  }

  const openGuide = (guide: GuideData) => {
    setOpenedGuide(guide)
    setPage('guide-detail')
  }

  // A brand-new procedure is always local until it's explicitly shared to a hub.
  const kind: ProcedureKind = page === 'new-procedure' ? 'local' : (openedProcedure?.kind ?? 'local')
  const hubName = openedProcedure?.kind === 'from-hub' ? openedProcedure.hubName : undefined
  const adopted = !openedProcedure?.badges?.some((b) => b.label === 'Not Adopted')

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        activePage={page}
        onNavigate={setPage}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <TopBar
          page={page}
          onNavigate={setPage}
          procedureName={openedProcedure?.name}
          taskName={openedTask?.name}
          trainingName={openedTraining?.name}
          unitTypeName={openedUnitType?.name ?? openedUnit?.unitTypeName}
          unitName={openedUnit?.name}
          guideName={openedGuide?.title}
        />
        {page === 'procedures' ? (
          <ProceduresPage onOpenProcedure={openProcedure} onNewProcedure={openNewProcedure} />
        ) : page === 'guides' ? (
          <GuidesPage onOpenGuide={openGuide} />
        ) : page === 'guide-detail' ? (
          <GuideDetailPage
            guide={openedGuide!}
            onClose={() => setPage('guides')}
          />
        ) : page === 'data-management' ? (
          <DataManagementPage onOpenUnitType={openUnitType} onCreateUnitType={() => setPage('create-unit-type')} />
        ) : page === 'create-unit-type' ? (
          <CreateUnitTypePage
            onClose={() => setPage('data-management')}
            onCreate={(name, _parents, pushUnitsToChildren) => {
              setOpenedUnitType({ id: `local-new-${Date.now()}`, name, pushUnitsToChildren })
              setPage('unit-type')
            }}
          />
        ) : page === 'unit-detail' ? (
          <UnitDetailPage
            unitName={openedUnit?.name ?? ''}
            unitTypeName={openedUnit?.unitTypeName ?? ''}
            kind={openedUnit?.hubName ? 'from-hub' : 'local'}
            hubName={openedUnit?.hubName}
            onClose={closeUnit}
          />
        ) : page === 'unit-type' ? (
          <UnitTypeDetailPage
            unitTypeName={openedUnitType?.name ?? ''}
            hubName={openedUnitType?.hubName ?? ''}
            pushUnitsToChildren={openedUnitType?.pushUnitsToChildren}
            onClose={closeUnitType}
            onOpenUnit={openUnit}
          />
        ) : page === 'task' ? (
          <TaskEditorPage
            procedureName={openedProcedure?.name ?? 'Product'}
            taskName={openedTask?.name ?? ''}
            kind={kind}
            hubName={hubName}
            onClose={closeTask}
          />
        ) : page === 'training' ? (
          <TrainingEditorPage
            procedureName={openedProcedure?.name ?? 'Product'}
            trainingName={openedTraining?.name ?? ''}
            kind={kind}
            onClose={closeTraining}
          />
        ) : (
          // Keyed on the opened procedure (or page, for a new one) so switching
          // between two different procedures — not just new-vs-existing — resets
          // local UI state (editing, tabs) instead of inheriting the last one's.
          <ProcedureHeader
            key={openedProcedure?.id ?? page}
            isNew={page === 'new-procedure'}
            kind={kind}
            name={openedProcedure?.name}
            hubName={hubName}
            adopted={adopted}
            collaborators={collaborators}
            onCollaboratorsChange={setCollaborators}
            managingCollaborators={managingCollaborators}
            onManagingCollaboratorsChange={setManagingCollaborators}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            onOpenTask={openTask}
            onOpenTraining={openTraining}
            timelineContent={
              <TimelineTab
                isNew={page === 'new-procedure'}
                kind={kind}
                hubName={hubName}
                adopted={adopted}
                collaborators={collaborators}
                onCollaboratorsChange={setCollaborators}
                onManageCollaborators={() => setManagingCollaborators(true)}
              />
            }
          />
        )}
      </div>
    </div>
  )
}
