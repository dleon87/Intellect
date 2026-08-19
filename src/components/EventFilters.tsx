import { useEffect, useRef, useState } from 'react'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import type { ItemModel } from '@syncfusion/ej2-splitbuttons'
import { CalendarComponent } from '@syncfusion/ej2-react-calendars'
import type { ChangedEventArgs } from '@syncfusion/ej2-calendars'
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons'
import type { ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons'
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns'
import type { MultiSelectChangeEventArgs } from '@syncfusion/ej2-dropdowns'
import { ArrowUpDown, Calendar as CalendarIcon, Tag, Users } from 'lucide-react'

const PANEL_ITEMS: ItemModel[] = [{ id: 'panel' }]

/** DropDownButton auto-closes on any click inside its popup content (it treats
 * every click as "an item was selected"). Multi-pick panels (checkboxes,
 * MultiSelect) need to stay open across many clicks, so this stops the click
 * before it bubbles out of the panel to the library's own listener — a plain
 * React onClick can't do this: Syncfusion's listener sits directly on the
 * popup DOM node, which the event reaches before React's root-delegated
 * synthetic dispatch ever runs. */
function useSuppressBubble<T extends HTMLElement>(allowSelector?: string) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const guard = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (allowSelector && target.closest(allowSelector)) return
      e.stopPropagation()
    }
    el.addEventListener('click', guard)
    return () => el.removeEventListener('click', guard)
  }, [allowSelector])
  return ref
}

function summarizeSelection(labels: string[], placeholder: string) {
  if (labels.length === 0) return placeholder
  if (labels.length === 1) return labels[0]
  return `${labels[0]} +${labels.length - 1}`
}

type SortMode = 'recent' | 'latest'

const SORT_OPTIONS: { id: SortMode; label: string; description: string }[] = [
  { id: 'recent', label: 'Recent events', description: 'See most recent events first' },
  {
    id: 'latest',
    label: 'Latest activity',
    description: 'See events with the most recent comments and actions first',
  },
]

export function SortFilter() {
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const selected = SORT_OPTIONS.find((o) => o.id === sortMode)!

  return (
    <DropDownButtonComponent
      items={PANEL_ITEMS}
      popupWidth="300px"
      cssClass="chip-btn rounded-full e-outline e-primary"
      itemTemplate={() => (
        <div className="w-[280px] p-3">
          <p className="text-xs font-semibold tracking-wide text-placeholder uppercase mb-2 px-1">Sort by</p>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="flex items-start gap-3 w-full text-left px-2 py-2 rounded-md hover:bg-surface-alt2"
              onClick={() => setSortMode(opt.id)}
            >
              <span
                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  sortMode === opt.id ? 'border-primary' : 'border-border'
                }`}
              >
                {sortMode === opt.id && <span className="w-2 h-2 rounded-full bg-primary" />}
              </span>
              <span>
                <span className="block text-sm font-medium text-content-text">{opt.label}</span>
                <span className="block text-xs text-placeholder">{opt.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    >
      <span className="flex items-center gap-1.5 text-sm">
        <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={1.75} />
        {selected.label}
      </span>
    </DropDownButtonComponent>
  )
}

function CalendarPanel({ onSelect }: { onSelect: (date: Date) => void }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const guard = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.e-day')) {
        e.stopPropagation()
      }
    }
    el.addEventListener('click', guard)
    return () => el.removeEventListener('click', guard)
  }, [])

  return (
    <div ref={wrapperRef} className="w-[280px] p-3">
      <p className="text-xs font-semibold tracking-wide text-placeholder uppercase mb-2 px-1">Filter by date</p>
      <CalendarComponent change={(e: ChangedEventArgs) => e.value && onSelect(e.value as Date)} />
    </div>
  )
}

export function DateFilter({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [date, setDate] = useState<Date | null>(null)

  useEffect(() => {
    onActiveChange?.(date !== null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const label = date
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date'

  return (
    <DropDownButtonComponent
      items={PANEL_ITEMS}
      popupWidth="300px"
      cssClass={`chip-btn rounded-full ${date ? 'e-outline e-primary' : 'e-outline'}`}
      itemTemplate={() => <CalendarPanel onSelect={setDate} />}
    >
      <span className="flex items-center gap-1.5 text-sm">
        <CalendarIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
        {label}
      </span>
    </DropDownButtonComponent>
  )
}

const EVENT_TYPES = ['Procedure Changes', 'Reports', 'Tasks', 'Training']

// The DropDownButton popup's itemTemplate is only INVOKED once, when the popup
// first opens — but the React tree it returns, once mounted, is a normal
// mounted subtree and re-renders normally from ITS OWN state changes. So
// selection state must live locally here, not be lifted to EventTypeFilter:
// props passed in from the one-time itemTemplate() call would freeze at
// whatever they were at open time (which is how "Clear All" ended up
// permanently disabled — its `disabled` check was reading a Set that could
// never change). `onChange` only reports the final value up, for the outer
// chip label/style, which lives in the normal (always-reactive) React tree.
function EventTypePanel({
  initial,
  onChange,
}: {
  initial: Set<string>
  onChange: (selected: Set<string>) => void
}) {
  const [selected, setSelected] = useState(initial)
  const wrapperRef = useSuppressBubble<HTMLDivElement>('.clear-all-btn')

  const toggle = (type: string) => {
    // Compute `next` up front rather than inside setSelected's updater —
    // calling the parent's onChange (another component's setState) from
    // within a functional updater triggers React's "Cannot update a
    // component while rendering a different component" warning, since
    // updaters can run during render.
    const next = new Set(selected)
    next.has(type) ? next.delete(type) : next.add(type)
    setSelected(next)
    onChange(next)
  }

  const clearAll = () => {
    setSelected(new Set())
    onChange(new Set())
  }

  return (
    <div ref={wrapperRef} className="w-[260px]">
      <div className="p-3">
        <p className="text-xs font-semibold tracking-wide text-placeholder uppercase mb-2 px-1">
          Filter by event type
        </p>
        <div className="flex flex-col gap-1">
          {EVENT_TYPES.map((type) => (
            <div key={type} className="px-2 py-1.5 rounded-md hover:bg-surface-alt2">
              <CheckBoxComponent
                label={type}
                checked={selected.has(type)}
                change={(e: CheckBoxChangeEventArgs) => {
                  if (e.checked !== selected.has(type)) toggle(type)
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end px-3 py-3 border-t border-border-light">
        {/* .clear-all-btn is the useSuppressBubble exception: ButtonComponent's
            onClick is a plain React-forwarded prop (unlike CheckBox's `change`,
            which EJ2 invokes directly) — it needs the click to actually reach
            React's root-delegated listener, so this one click is allowed to
            bubble instead of being swallowed. */}
        <ButtonComponent cssClass="e-primary clear-all-btn" disabled={selected.size === 0} onClick={clearAll}>
          Clear All
        </ButtonComponent>
      </div>
    </div>
  )
}

export function EventTypeFilter({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    onActiveChange?.(selected.size > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const label = summarizeSelection([...selected], 'Event type')

  return (
    <DropDownButtonComponent
      items={PANEL_ITEMS}
      popupWidth="260px"
      cssClass={`chip-btn rounded-full ${selected.size > 0 ? 'e-outline e-primary' : 'e-outline'}`}
      itemTemplate={() => <EventTypePanel initial={selected} onChange={setSelected} />}
    >
      <span className="flex items-center gap-1.5 text-sm">
        <Tag className="w-3.5 h-3.5" strokeWidth={1.75} />
        {label}
      </span>
    </DropDownButtonComponent>
  )
}

type Collaborator = { name: string; email: string; avatar: number }

const COLLABORATOR_OPTIONS: Collaborator[] = [
  { name: 'Andreea Anca', email: 'aanca@intellect.com', avatar: 47 },
  { name: 'Dan Tomescu', email: 'dtomescu@intellect.com', avatar: 12 },
  { name: 'Darius Clop', email: 'dclop@intellect.com', avatar: 33 },
  { name: 'Diana Leon', email: 'dleon@intellect.com', avatar: 5 },
  { name: 'Diego Zacarias', email: 'dzacarias@intellect.com', avatar: 51 },
  { name: 'Elena Atay', email: 'eatay@intellect.com', avatar: 26 },
]

// MultiSelect's own suggestion list is a SECOND Syncfusion popup, rendered
// straight onto document.body. Hosting this inside a DropDownButton (as with
// the other filters) stacks two independent Syncfusion popup-close mechanisms
// on top of each other: DropDownButton's document-level "click outside
// closes" listener doesn't recognize a click on that detached list as
// "inside," so it tears the whole panel down as an outside click before
// MultiSelect's own click-to-select logic finishes running. Rather than fight
// that, this panel skips DropDownButton entirely and manages its own
// open/close state — MultiSelect stays a genuine Syncfusion component, it's
// just not nested inside a second, competing popup layer.
export function CollaboratorFilter({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const multiSelectRef = useRef<MultiSelectComponent | null>(null)

  useEffect(() => {
    onActiveChange?.(selected.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (containerRef.current?.contains(target)) return
      if (target.closest('.e-multi-select-list-wrapper')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  const label = summarizeSelection(selected, 'Collaborator')

  return (
    <div ref={containerRef} className="relative">
      <ButtonComponent
        cssClass={`chip-btn rounded-full ${selected.length > 0 ? 'e-outline e-primary' : 'e-outline'}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-1.5 text-sm">
          <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
          {label}
        </span>
      </ButtonComponent>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[300px] rounded-lg border border-border-light bg-white shadow-lg p-3 z-10">
          <p className="text-xs font-semibold tracking-wide text-placeholder uppercase mb-2 px-1">
            Filter by collaborator
          </p>
          <MultiSelectComponent
            ref={multiSelectRef}
            dataSource={COLLABORATOR_OPTIONS}
            fields={{ text: 'name', value: 'name' }}
            mode="Box"
            placeholder="Search collaborators"
            cssClass="e-outline"
            value={selected}
            showClearButton
            allowFiltering
            popupHeight="260px"
            created={() => multiSelectRef.current?.showPopup()}
            change={(e: MultiSelectChangeEventArgs) => setSelected((e.value as string[]) ?? [])}
            itemTemplate={(data: Collaborator) => (
              <span className="flex items-center gap-2.5 py-0.5">
                <img
                  src={`https://i.pravatar.cc/64?img=${data.avatar}`}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="text-sm text-content-text">{data.name}</span>
              </span>
            )}
          />
        </div>
      )}
    </div>
  )
}
