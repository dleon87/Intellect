import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { PanelLeftClose, Search, CalendarCheck, Wrench, BarChart2, Users, Table2, BookOpen } from 'lucide-react'
import { IntellectLogo } from './IntellectLogo'
import { SECTION, type Page } from '../pages'

// Labels/icons match the Figma "Sidebar" DS component exactly (QkVlzbj1nLEuOvXstDlhNz, node 5140-237459).
const NAV_ITEMS: { label: string; icon: typeof Wrench; page?: Page }[] = [
  { label: 'My work', icon: CalendarCheck },
  { label: 'Procedures', icon: Wrench, page: 'procedures' },
  { label: 'Boards', icon: BarChart2 },
  { label: 'Teams', icon: Users },
  { label: 'Data Management', icon: Table2, page: 'data-management' },
  { label: 'Guides', icon: BookOpen, page: 'guides' },
]

type Props = {
  collapsed: boolean
  onToggle: () => void
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ collapsed, onToggle, activePage, onNavigate }: Props) {
  return (
    <aside
      className={`shrink-0 bg-[#161328] flex flex-col py-4 px-3 gap-3 transition-[width] duration-150 ${
        collapsed ? 'w-[64px]' : 'w-[242px]'
      }`}
    >
      {collapsed ? (
        <button
          className="flex justify-center"
          onClick={onToggle}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <IntellectLogo className="w-8 h-8" />
        </button>
      ) : (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 min-w-0">
            <IntellectLogo className="w-8 h-8 shrink-0" />
            <span className="text-white font-semibold text-sm truncate">Develop</span>
          </div>
          <ButtonComponent
            cssClass="e-flat icon-btn-dark"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            onClick={onToggle}
          >
            <PanelLeftClose className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
          </ButtonComponent>
        </div>
      )}

      <div className="border-t border-white/10 -mx-3" />

      {collapsed ? (
        <ButtonComponent cssClass="e-flat icon-btn-dark" aria-label="Search" title="Search">
          <Search className="w-[18px] h-[18px] text-slate-400" strokeWidth={1.75} />
        </ButtonComponent>
      ) : (
        <div className="relative px-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={1.75} />
          <TextBoxComponent
            cssClass="e-outline sidebar-search"
            placeholder="Search"
            htmlAttributes={{ 'aria-label': 'Search' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-500 border border-slate-600 rounded px-1 pointer-events-none">
            ⌘K
          </span>
        </div>
      )}

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, page }) => {
          // A level-2 page (open procedure, new procedure) keeps its parent
          // section selected — see SECTION in pages.ts.
          const active = page !== undefined && SECTION[activePage] === page
          return (
            <button
              key={label}
              type="button"
              onClick={() => page && onNavigate(page)}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
              {!collapsed && label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
