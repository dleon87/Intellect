import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextAreaComponent } from '@syncfusion/ej2-react-inputs'
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations'
import type { ChangeEventArgs } from '@syncfusion/ej2-inputs'
import {
  Info,
  FileText,
  MessageSquare,
  Zap,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  CheckCircle,
  Package,
} from 'lucide-react'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

type UnitKind = 'local' | 'hub-owner' | 'from-hub'

type Props = {
  unitName: string
  unitTypeName: string
  kind: UnitKind
  hubName?: string
  onClose: () => void
}

type ReportEntry = {
  id: string
  author: string
  avatar: number
  time: string
  title: string
  steps: string
  isLocal?: boolean
  isPushedFromHub?: boolean
}

const HUB_REPORTS: ReportEntry[] = [
  { id: 'r1', author: 'App User', avatar: 12, time: 'Jul 10, 2026 12:09 PM', title: 'SIC Concerns', steps: '0 Steps' },
  { id: 'r2', author: 'Shazad nasim', avatar: 33, time: 'Jul 9, 2026 6:26 PM', title: 'SIC Concerns', steps: '0 Steps' },
  { id: 'r3', author: 'Ivan Vladut', avatar: 51, time: 'Jul 9, 2026 9:09 AM', title: 'SIC Gap', steps: '0 Steps' },
  { id: 'r4', author: 'Mark Earlam', avatar: 15, time: 'Jun 29, 2026 1:34 AM', title: 'Aedificium stipes vitae necessitatibus angustus cresco coma.', steps: '2036970104 Steps' },
]

const SPOKE_LOCAL_REPORTS: ReportEntry[] = [
  { id: 's1', author: 'App User', avatar: 12, time: 'Jul 10, 2026 12:09 PM', title: 'SIC Concerns', steps: '0 Steps', isLocal: true },
  { id: 's2', author: 'Shazad nasim', avatar: 33, time: 'Jul 9, 2026 6:26 PM', title: 'SIC Concerns', steps: '0 Steps', isLocal: true },
]

const SPOKE_HUB_REPORTS: ReportEntry[] = [
  { id: 'h1', author: 'Ivan Vladut', avatar: 51, time: 'Jul 9, 2026 9:09 AM', title: 'SIC Gap', steps: '0 Steps', isPushedFromHub: true },
  { id: 'h2', author: 'Mark Earlam', avatar: 15, time: 'Jun 29, 2026 1:34 AM', title: 'Aedificium stipes vitae necessitatibus angustus cresco coma.', steps: '2036970104 Steps', isPushedFromHub: true },
]

function UnitReportCard({
  report,
  kind,
  hubName,
}: {
  report: ReportEntry
  kind: UnitKind
  hubName?: string
}) {
  const [pushed, setPushed] = useState(false)

  const showPushToSpokes = kind === 'hub-owner'
  const showPushToHub = kind === 'from-hub' && report.isLocal
  const isCrossSite = kind === 'from-hub' && report.isPushedFromHub

  return (
    <article
      className={`overflow-hidden rounded-lg border ${
        isCrossSite
          ? 'border-blue-200 bg-blue-50'
          : 'border-border-light bg-white'
      }`}
    >
      <header className="flex items-center gap-3 p-4">
        <Avatar img={report.avatar} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-content-text">
            <span className="font-semibold">{report.author}</span>
            {report.isLocal
              ? ' submitted a report'
              : report.isPushedFromHub
                ? ' - Edited submitted a report'
                : ' - Edited submitted a report'}
          </p>
          <p className="text-xs text-placeholder">{report.time}</p>
        </div>
        {!isCrossSite && (
          <ButtonComponent
            cssClass="e-flat icon-btn"
            aria-label={`More options for ${report.author}'s report`}
            title="More options"
          >
            <MoreHorizontal className="h-5 w-5 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        )}
      </header>

      <div className="flex items-center gap-3 border-t border-border-light p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-alt2">
          <FileText className="h-4 w-4 text-icon" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-content-text">{report.title}</p>
          <p className="text-xs text-placeholder">{report.steps}</p>
        </div>
      </div>

      {isCrossSite && (
        <div className="border-t border-blue-200 px-4 py-3">
          <p className="text-xs text-blue-600">
            Synced from the managing site — visible on this unit across sites.
          </p>
        </div>
      )}

      {pushed && showPushToHub && (
        <div className="border-t border-border-light px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-success-lighter px-3 py-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-success" strokeWidth={1.75} />
            <p className="text-sm text-content-text">
              Published to <span className="font-medium">{hubName}</span>. This report is now visible on this site.
            </p>
          </div>
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-border-light px-4 py-3">
        <div className="flex items-center gap-4 text-placeholder">
          <span className="flex items-center gap-1 text-xs">
            <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.75} />
            0
          </span>
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
            0
          </span>
          {!isCrossSite && (
            <span className="flex items-center gap-1 text-xs">
              <Zap className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />
              0
            </span>
          )}
        </div>

        {showPushToSpokes && !pushed && (
          <ButtonComponent cssClass="e-primary" onClick={() => setPushed(true)}>
            <span className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Share
            </span>
          </ButtonComponent>
        )}
        {showPushToSpokes && pushed && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-lighter px-3 py-1.5 text-xs font-medium text-success">
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
            Pushed to sites
          </span>
        )}

        {showPushToHub && !pushed && (
          <ButtonComponent cssClass="e-flat e-primary" onClick={() => setPushed(true)}>
            <span className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Share
            </span>
          </ButtonComponent>
        )}
        {showPushToHub && pushed && (
          <ButtonComponent cssClass="e-flat e-primary" disabled>
            <span className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Share
            </span>
          </ButtonComponent>
        )}
      </footer>
    </article>
  )
}

function UnitAboutPanel({ kind, hubName }: { kind: UnitKind; hubName?: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-placeholder">
        <Info className="h-4 w-4" strokeWidth={1.75} />
        About this unit
      </div>

      {kind === 'local' && (
        <>
          <Section title="Image">
            <p className="text-sm text-placeholder">No image available</p>
          </Section>
          <Section title="Parents">
            <button className="text-sm font-medium text-link hover:underline">Zone A</button>
          </Section>
          <Section title="Children">
            <div className="flex flex-wrap gap-4">
              <button className="text-sm font-medium text-link hover:underline">Cutter Machine</button>
              <button className="text-sm font-medium text-link hover:underline">Filler Machine</button>
              <button className="text-sm font-medium text-link hover:underline">Mixer Machine</button>
            </div>
          </Section>
          <Section title="Experts" action="Add">
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Package className="h-12 w-12 text-placeholder" strokeWidth={1} />
              <p className="text-sm text-placeholder">
                No experts have been added to this unit yet.
                <br />
                Click &quot;Add&quot; to add an expert.
              </p>
            </div>
          </Section>
          <Section title="Identification codes">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="pb-2 text-left font-semibold text-content-text">Name</th>
                  <th className="pb-2 text-left font-semibold text-content-text">Code</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-content-text">sku</td>
                  <td className="py-2 text-content-text">-42</td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section title="Data">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="pb-2 text-left font-semibold text-content-text">Name</th>
                  <th className="pb-2 text-left font-semibold text-content-text">Value</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </Section>
        </>
      )}

      {kind === 'hub-owner' && (
        <p className="text-sm text-content-text">
          This is a managed unit. Fields and identification codes are managed here and pushed to all subscribed sites.
        </p>
      )}

      {kind === 'from-hub' && (
        <p className="text-sm text-content-text">
          Managed by <span className="font-medium">{hubName}</span>. Fields and identification codes are read-only.
        </p>
      )}
    </div>
  )
}

function Section({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-text">{title}</h3>
        {action && (
          <button className="text-sm font-medium text-link hover:underline">{action}</button>
        )}
      </div>
      {children}
    </div>
  )
}

function UnitComposer({ kind }: { kind: UnitKind }) {
  const [value, setValue] = useState('')
  const isEmpty = value.trim().length === 0

  const placeholder =
    kind === 'local'
      ? 'Share an update about this unit'
      : kind === 'hub-owner'
        ? 'Share an update about this unit'
        : 'Share an update about this unit'

  return (
    <div className="rounded-lg border border-border-light bg-white">
      <div className="flex gap-3 p-4">
        <Avatar img={5} className="shrink-0" />
        <TextAreaComponent
          cssClass="e-outline composer-textarea"
          placeholder={placeholder}
          rows={3}
          value={value}
          change={(e: ChangeEventArgs) => setValue((e.value as string) ?? '')}
        />
      </div>
      <div className="flex justify-end border-t border-border-light px-4 py-3">
        <ButtonComponent cssClass="e-primary" disabled={isEmpty}>
          Post
        </ButtonComponent>
      </div>
    </div>
  )
}

function UnitTimeline({ kind, hubName }: { kind: UnitKind; hubName?: string }) {
  const reports =
    kind === 'hub-owner'
      ? HUB_REPORTS
      : kind === 'from-hub'
        ? [...SPOKE_LOCAL_REPORTS, ...SPOKE_HUB_REPORTS]
        : HUB_REPORTS

  return (
    <div className="grid grid-cols-3 gap-6 py-6">
      <div className="col-span-2">
        <UnitComposer kind={kind} />
        <div className="mt-6 flex flex-col gap-6">
          {reports.map((r) => (
            <UnitReportCard key={r.id} report={r} kind={kind} hubName={hubName} />
          ))}
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <FileText className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-content-text">created this unit</p>
              <p className="mt-0.5 text-xs text-placeholder">Jul 2, 2026 - 10:35 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <UnitAboutPanel kind={kind} hubName={hubName} />
      </div>
    </div>
  )
}

export function UnitDetailPage({ unitName, unitTypeName, kind, hubName, onClose }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="px-8 pb-12 pt-6">
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-xl font-medium text-content-text">{unitName}</h1>
        {(kind === 'hub-owner' || kind === 'from-hub') && hubName && (
          <Badge label={`${hubName} unit`} variant="hubPrimary" icon />
        )}
      </div>

      <div className="procedure-tabs">
        <TabComponent
          selectedItem={activeTab}
          selected={(e: { selectedIndex: number }) => setActiveTab(e.selectedIndex)}
        >
          <TabItemsDirective>
            <TabItemDirective header={{ text: 'Timeline' }} content={() => null} />
            <TabItemDirective header={{ text: 'Info' }} content={() => null} />
            <TabItemDirective header={{ text: 'Guides' }} content={() => null} />
          </TabItemsDirective>
        </TabComponent>
      </div>

      {activeTab === 0 && <UnitTimeline kind={kind} hubName={hubName} />}
      {activeTab === 1 && (
        <div className="py-6 text-sm text-placeholder">Info tab content</div>
      )}
      {activeTab === 2 && (
        <div className="py-6 text-sm text-placeholder">Guides tab content</div>
      )}
    </div>
  )
}
