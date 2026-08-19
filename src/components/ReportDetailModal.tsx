import { useState, useRef } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { X, Pencil, MoreHorizontal, Info, CheckCircle2, CheckCircle, ClipboardList, History, Send, Sparkles, Share2 } from 'lucide-react'
import { Avatar } from './Avatar'
import type { ProcedureKind } from '../procedureKind'

type ReportRow = {
  id: string
  reference: string
  name: string
  submittedBy: string
  source: string | null
  orderDate: string
  subject: string
  status: string
  origin?: 'local' | 'fromSpoke'
  instanceName?: string
}

type Props = {
  visible: boolean
  row: ReportRow | null
  kind?: ProcedureKind
  hubName?: string
  onClose: () => void
}

const STATUSES = ['Completed', 'In Progress', 'Pending', 'Rejected']

const REPORT_FIELDS = [
  { label: 'priority', value: '1' },
  { label: 'type', value: '2' },
  { label: 'description', value: 'cunctatio audax officiis abbas sub' },
  { label: 'root cause', value: 'Equipment malfunction' },
  { label: 'corrective action', value: 'Replaced faulty sensor on Line 2' },
]

export function ReportDetailModal({ visible, row, kind = 'local', hubName, onClose }: Props) {
  const [status, setStatus] = useState('Completed')
  const [published, setPublished] = useState(false)
  const [editedSincePublish, setEditedSincePublish] = useState(false)
  const [sharedToSpokes, setSharedToSpokes] = useState(false)

  const isFromHub = kind === 'from-hub'
  const isFromSpoke = row?.origin === 'fromSpoke'
  const instanceName = row?.instanceName ?? 'Unknown site'
  const pushDisabled = published && !editedSincePublish

  const handlePush = () => {
    setPublished(true)
    setEditedSincePublish(false)
  }

  const handleEdit = () => {
    if (published) setEditedSincePublish(true)
  }

  const handleShareToSpokes = () => {
    setSharedToSpokes(true)
  }

  const handleClose = () => {
    setPublished(false)
    setEditedSincePublish(false)
    setSharedToSpokes(false)
    onClose()
  }

  if (!visible || !row) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-10">
      <div className="absolute inset-0 bg-[#6B7280BF]" onClick={handleClose} />
      <div className="relative z-[1001] flex w-[1100px] max-h-[calc(100vh-5rem)] rounded-lg bg-white shadow-lg">
        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-y-auto border-r border-border-light">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light bg-white px-6 py-4">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg font-semibold text-content-text truncate">{row.name}</h2>
              {/* Point 1 — origin badge for fromSpoke reports */}
              {isFromSpoke && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-[#EFE9FA] px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Share2 className="h-3 w-3" strokeWidth={1.75} />
                  {instanceName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Point 4 — edit always visible */}
              <ButtonComponent cssClass="e-outline icon-btn" aria-label="Edit report" title="Edit" onClick={handleEdit}>
                <Pencil className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
              <DropDownListComponent
                dataSource={STATUSES}
                value={status}
                change={(e: { value: string }) => setStatus(e.value)}
                cssClass="e-outline"
                width="150px"
                popupWidth="150px"
              />
              {/* Point 3 — "Share to sites" for fromSpoke; Publish for fromHub */}
              {isFromSpoke && !sharedToSpokes && (
                <ButtonComponent cssClass="e-primary toolbar-btn" onClick={handleShareToSpokes}>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" strokeWidth={1.75} />
                    Share to sites
                  </span>
                </ButtonComponent>
              )}
              {isFromSpoke && sharedToSpokes && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-lighter px-3 py-1.5 text-xs font-medium text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Shared with all sites
                </span>
              )}
              {isFromHub && !isFromSpoke && (
                <ButtonComponent cssClass="e-primary team-pill" disabled={pushDisabled} onClick={handlePush}>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" strokeWidth={1.75} />
                    Publish
                  </span>
                </ButtonComponent>
              )}
              <ButtonComponent cssClass="e-flat icon-btn" aria-label="More options" title="More options">
                <MoreHorizontal className="h-4 w-4 text-icon" strokeWidth={1.75} />
              </ButtonComponent>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Point 2 — fromSpoke info / shared banner */}
            {isFromSpoke && !sharedToSpokes && (
              <div className="flex items-start gap-3 rounded-lg border border-info-lighter bg-info-lighter px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" strokeWidth={1.75} />
                <p className="text-sm text-content-text">
                  Received from <span className="font-medium">{instanceName}</span>. After reviewing, you can share it with your connected sites.
                </p>
              </div>
            )}
            {isFromSpoke && sharedToSpokes && (
              <div className="flex items-start gap-3 rounded-lg border border-info-lighter bg-info-lighter px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" strokeWidth={1.75} />
                <p className="text-sm text-content-text">Shared with all connected sites.</p>
              </div>
            )}

            {/* fromHub banners — only when not a fromSpoke report */}
            {isFromHub && !isFromSpoke && !published && (
              <div className="flex items-start gap-3 rounded-lg border border-info-lighter bg-info-lighter px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" strokeWidth={1.75} />
                <p className="text-sm text-content-text">
                  Source: Local report — not yet published. Publish to share it with other sites.
                </p>
                <button className="ml-auto shrink-0 text-icon hover:text-icon-hover" aria-label="Dismiss">
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            )}
            {isFromHub && !isFromSpoke && published && (
              <div className="flex items-start gap-3 rounded-lg border border-success-lighter bg-success-lighter px-4 py-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={1.75} />
                <p className="text-sm text-content-text">
                  Published to <span className="font-medium">{hubName ?? 'the site'}</span>. This report is now visible on this site.
                </p>
              </div>
            )}

            {/* About this report */}
            <div className="rounded-lg border border-border-light">
              <div className="flex items-center gap-2 border-b border-border-light px-5 py-3">
                <Info className="h-4 w-4 text-icon" strokeWidth={1.75} />
                <span className="text-sm font-semibold text-content-text">About this report</span>
                <span className="text-sm text-placeholder">({row.reference})</span>
              </div>

              <div className="grid grid-cols-3 gap-y-5 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Workflow</p>
                  <p className="text-sm text-primary">{row.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Type</p>
                  <p className="text-sm text-content-text">Task (Integration)</p>
                </div>
                {/* Point 6 — location shows originating instance for fromSpoke */}
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Location</p>
                  <p className="text-sm text-content-text">{isFromSpoke ? instanceName : 'Develop'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Created by</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar initials="IV" size="xsmall" />
                    <span className="text-sm text-content-text">{row.submittedBy}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Date and Time</p>
                  <p className="text-sm text-content-text">Jul 9, 2026, 9:08</p>
                  <p className="text-sm text-content-text">Jul 20, 2026, 10:03</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-content-text-alt2 mb-1">Duration</p>
                  <p className="text-sm text-content-text">264 hours 54 minutes</p>
                </div>
              </div>
            </div>

            {/* Report's answers */}
            <div className="rounded-lg border border-border-light">
              <div className="flex items-center gap-2 border-b border-border-light px-5 py-3">
                <ClipboardList className="h-4 w-4 text-icon" strokeWidth={1.75} />
                <span className="text-sm font-semibold text-content-text">Report's answers</span>
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt2 text-icon">
                    <ClipboardList className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-xs text-placeholder">Report subject</p>
                    {/* Point 5 — plain text (no link) when subject unit doesn't exist on hub */}
                    {isFromSpoke ? (
                      <p className="text-sm font-medium text-content-text">{row.subject}</p>
                    ) : (
                      <p className={`text-sm font-medium ${isFromHub ? 'text-content-text' : 'text-primary'}`}>{row.subject}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border-light pt-4">
                  <p className="text-sm font-semibold text-content-text mb-4">cunctatio audax officiis abbas sub</p>

                  {REPORT_FIELDS.map((field) => (
                    <div key={field.label} className="flex items-start justify-between border-b border-border-light py-3 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                        <div>
                          <p className="text-xs text-placeholder">{field.label}</p>
                          <p className="text-sm text-content-text">{field.value}</p>
                        </div>
                      </div>
                      <button className="shrink-0 p-1 text-icon hover:text-icon-hover" aria-label="View history">
                        <History className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right activity panel */}
        <div className="w-[320px] shrink-0 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-semibold text-content-text">Activity</span>
            <button
              onClick={handleClose}
              className="rounded p-1 text-icon hover:bg-surface-alt2 hover:text-icon-hover"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <div className="flex items-start gap-3 border-b border-border-light pb-4 mb-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-lighter text-success">
                <Pencil className="h-3 w-3" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm text-content-text">
                  <span className="font-medium text-primary">{row.submittedBy}</span> edited the report
                </p>
                <p className="text-xs text-placeholder mt-0.5">Jul 20, 2026 - 10:03 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-border-light pb-4 mb-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-info-lighter text-info">
                <ClipboardList className="h-3 w-3" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm text-content-text">
                  <span className="font-medium text-primary">{row.submittedBy}</span> submitted the report
                </p>
                <p className="text-xs text-placeholder mt-0.5">Jul 9, 2026 - 9:08 AM</p>
              </div>
            </div>
          </div>

          {/* Comment input */}
          <div className="border-t border-border-light px-4 py-3">
            {isFromHub && (
              <p className="mb-2 text-xs text-placeholder">Comments are local to this site and not visible to other sites.</p>
            )}
            <div className="flex items-center gap-2">
              <Avatar avatar={5} size="xsmall" />
              <div className="flex flex-1 items-center gap-1 rounded-full border border-border bg-white px-3 py-2">
                <input
                  type="text"
                  className="min-w-0 flex-1 bg-transparent text-sm text-content-text placeholder:text-placeholder outline-none"
                  placeholder="Write a comment..."
                />
                <button className="text-primary hover:text-primary-hover" aria-label="AI assist">
                  <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <button className="text-primary hover:text-primary-hover" aria-label="Send comment">
                <Send className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
