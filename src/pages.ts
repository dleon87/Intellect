/**
 * The app's page model. Lives in its own module (rather than in App.tsx) so
 * both the side nav and the top bar can import the runtime map without a
 * circular dependency back through App.
 */
export type Page =
  | 'procedures'
  | 'procedure'
  | 'new-procedure'
  | 'task'
  | 'training'
  | 'data-management'
  | 'unit-type'
  | 'create-unit-type'
  | 'unit-detail'
  | 'guides'
  | 'guide-detail'

/**
 * Every page's owning level-1 section. Level-1 pages map to themselves; level-2
 * drill-ins map to the section they were opened from.
 *
 * This is the single source of truth for "where am I in the nav": the side bar
 * highlights `SECTION[currentPage]`, so a level-2 page keeps its parent
 * selected. Declaring a new page here is what wires that up — previously the
 * side bar hardcoded which pages counted as "inside Procedures", so adding
 * `new-procedure` silently left the nav with nothing selected.
 */
export const SECTION: Record<Page, Page> = {
  procedures: 'procedures',
  procedure: 'procedures',
  'new-procedure': 'procedures',
  // A task is a level-3 drill-in (Procedures > procedure > task) — still owned
  // by the Procedures section in the side nav.
  task: 'procedures',
  // Same depth as task, opened from a training card instead.
  training: 'procedures',
  // A level-1 page like 'procedures' — reachable straight from the side nav.
  'data-management': 'data-management',
  // A level-2 drill-in opened from a unit type card, same depth as 'procedure'.
  'unit-type': 'data-management',
  'create-unit-type': 'data-management',
  'unit-detail': 'data-management',
  guides: 'guides',
  'guide-detail': 'guides',
}
