import { BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbItemsDirective } from '@syncfusion/ej2-react-navigations'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import type { BreadcrumbClickEventArgs } from '@syncfusion/ej2-navigations'
import { Sparkles, Bell, ChevronDown, ChevronRight } from 'lucide-react'
import type { Page } from '../pages'

type Props = {
  page: Page
  onNavigate: (page: Page) => void
  /** The open procedure's name, e.g. "Global Defect Reporting" — the trail's last crumb. */
  procedureName?: string
  taskName?: string
  trainingName?: string
  unitTypeName?: string
  unitName?: string
  guideName?: string
}

/**
 * Breadcrumb trail per page. Level-1 destinations — the ones reachable straight
 * from the side nav (Procedures, Boards, Teams, Data Management, Guides) — map
 * to an empty trail: they are already the root, they carry their own page
 * heading, so a one-crumb breadcrumb would just restate it. Only level-2
 * drill-ins (opening a procedure, creating one) get a trail.
 */
function trailFor(
  page: Page,
  procedureName?: string,
  taskName?: string,
  trainingName?: string,
  unitTypeName?: string,
  unitName?: string,
  guideName?: string,
): string[] {
  switch (page) {
    case 'procedures':
      return []
    case 'procedure':
      return ['Procedures', procedureName ?? 'Product']
    case 'new-procedure':
      return ['Procedures', 'Untitled procedure']
    case 'task':
      return ['Procedures', procedureName ?? 'Product', taskName ?? '']
    case 'training':
      return ['Procedures', procedureName ?? 'Product', trainingName ?? '']
    case 'data-management':
      return []
    case 'unit-type':
      return ['Data', unitTypeName ?? '']
    case 'create-unit-type':
      return ['Data', 'Create unit type']
    case 'unit-detail':
      return ['Data', unitTypeName ?? '', unitName ?? '']
    case 'guides':
      return []
    case 'guide-detail':
      return ['Guides', guideName ?? '']
  }
}

export function TopBar({ page, onNavigate, procedureName, taskName, trainingName, unitTypeName, unitName, guideName }: Props) {
  const items = trailFor(page, procedureName, taskName, trainingName, unitTypeName, unitName, guideName)

  // shrink-0: this sits in a flex-column with a scrollable page body below it,
  // so without it, a tall body (e.g. Timeline's report cards) makes the flex
  // layout shrink the header itself to help everything fit — this pins it at
  // the full h-16, with the body scrolling instead.
  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between px-6 h-16 border-b border-border-light bg-white">
      <div className="flex items-center gap-2.5">
        {items.length > 0 && (
          /* enableNavigation={false} is required: left on, Syncfusion follows each
             item's `url` and rewrites its own trail DOM, which visually "worked"
             but never told React to change page. itemClick is the real hook. */
          <BreadcrumbComponent
            key={items.join('/')}
            enableNavigation={false}
            separatorTemplate={() => <ChevronRight className="w-4 h-4 text-icon" strokeWidth={1.75} />}
            itemClick={(e: BreadcrumbClickEventArgs) => {
              if (e.item?.text === 'Procedures') onNavigate('procedures')
              else if ((page === 'task' || page === 'training') && e.item?.text === procedureName) onNavigate('procedure')
              else if (e.item?.text === 'Data') onNavigate('data-management')
              else if (page === 'unit-detail' && e.item?.text === unitTypeName) onNavigate('unit-type')
              else if (e.item?.text === 'Guides') onNavigate('guides')
            }}
          >
            <BreadcrumbItemsDirective>
              {items.map((label, i) => (
                <BreadcrumbItemDirective key={label} text={label} url={i < items.length - 1 ? '#' : undefined} />
              ))}
            </BreadcrumbItemsDirective>
          </BreadcrumbComponent>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ButtonComponent cssClass="icon-btn-secondary" aria-label="AI Assistant" title="AI Assistant">
          <Sparkles className="w-4 h-4 text-icon" strokeWidth={2} />
        </ButtonComponent>

        <ButtonComponent cssClass="icon-btn-secondary" aria-label="Notifications" title="Notifications">
          <Bell className="w-5 h-5 text-icon" strokeWidth={1.75} />
        </ButtonComponent>

        <button className="flex items-center gap-1" aria-label="Account menu">
          <img
            src="https://i.pravatar.cc/64?img=68"
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDown className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
