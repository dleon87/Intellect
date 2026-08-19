import { useState, useMemo, useEffect, useRef } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Info, Shield, Users, X } from 'lucide-react'
import { Avatar } from './Avatar'
import type { Collaborator } from '../collaborator'
import type { ProcedureKind } from '../procedureKind'

const ALL_USERS: Collaborator[] = [
  { name: 'Adam Leggett', email: 'aleggett@intellect.com', initials: 'AL' },
  { name: 'Andy Whitmore', email: 'awhitmore@intellect.com', avatar: 14 },
  { name: 'App User - Edited', email: 'igtest002@internal.intellect.com', avatar: 59 },
  { name: 'Andreea Anca', email: 'aanca@intellect.com', avatar: 47 },
  { name: 'Dan Tomescu', email: 'dtomescu@intellect.com', avatar: 12 },
  { name: 'Darius Clop', email: 'dclop@intellect.com', avatar: 33 },
  { name: 'Diana Leon (That\'s you)', email: 'dleon@intellect.com', avatar: 5 },
  { name: 'Diego Zacarias', email: 'dzacarias@intellect.com', avatar: 51 },
  { name: 'Elena Atay', email: 'eatay@intellect.com', avatar: 26 },
  { name: 'Matt Staddon', email: 'mstaddon@intellect.com', avatar: 11 },
  { name: 'Owen Clarke', email: 'oclarke@intellect.com', avatar: 57 },
  { name: 'Priya Nair', email: 'pnair@intellect.com', avatar: 32 },
  { name: 'Sofia Torres', email: 'storres@intellect.com', avatar: 20 },
]

type Props = {
  visible: boolean
  procedureName: string
  kind?: ProcedureKind
  collaborators: Collaborator[]
  onCollaboratorsChange: (collaborators: Collaborator[]) => void
  onClose: () => void
}

export function ManageCollaboratorsDialog({
  visible,
  procedureName,
  kind = 'local',
  collaborators,
  onCollaboratorsChange,
  onClose,
}: Props) {
  const isFromHub = kind === 'from-hub'
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const existingEmails = useMemo(() => new Set(collaborators.map((c) => c.email)), [collaborators])

  const suggestions = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return ALL_USERS.filter(
      (u) => !existingEmails.has(u.email) && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    ).slice(0, 6)
  }, [search, existingEmails])

  const addCollaborator = (user: Collaborator) => {
    onCollaboratorsChange([...collaborators, user])
    setSearch('')
    setShowDropdown(false)
  }

  const removeCollaborator = (email: string) => {
    onCollaboratorsChange(collaborators.filter((c) => c.email !== email))
  }

  useEffect(() => {
    if (!visible) {
      setSearch('')
      setShowDropdown(false)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !searchRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#6B7280BF]" onClick={onClose} />
      <div className="relative z-[1001] w-[560px] rounded-lg bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-content-text">
              Manage collaborators for {procedureName}
            </h2>
            <button
              onClick={onClose}
              className="rounded p-1 text-icon hover:bg-surface-alt2 hover:text-icon-hover"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <p className="mb-5 flex items-center gap-1 text-sm text-placeholder">
            {isFromHub
              ? 'Collaborators can add schedules and triggers to tasks and training locally.'
              : 'Collaborators get full visibility and editing rights in this procedure.'}
            <Info className="h-4 w-4 shrink-0 text-info" strokeWidth={1.75} aria-hidden />
          </p>

          {isFromHub && (
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-semibold text-content-text">Managed by</h3>
              <div className="flex items-start gap-3 rounded-lg border border-border-light px-4 py-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary">
                  <Shield className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-content-text">Procedure Admins</span>
                    <span className="rounded-full bg-surface-alt3 px-2 py-0.5 text-xs font-medium text-content-text-alt2">Role-based</span>
                  </div>
                  <p className="mt-0.5 text-xs text-placeholder">Can configure teams, collaborators, schedules, and triggers</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border-light px-4 py-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-lighter text-primary">
                  <Shield className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-content-text">System Admins</span>
                    <span className="rounded-full bg-surface-alt3 px-2 py-0.5 text-xs font-medium text-content-text-alt2">Role-based</span>
                  </div>
                  <p className="mt-0.5 text-xs text-placeholder">Full access by system role</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-6">
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <input
                  ref={searchRef}
                  type="text"
                  className="e-input e-outline h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-content-text placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-0"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setShowDropdown(!!e.target.value.trim())
                  }}
                  onFocus={() => { if (search.trim()) setShowDropdown(true) }}
                  aria-label="Search by name or email"
                />
              </div>
              <ButtonComponent cssClass="e-primary toolbar-btn">
                Add collaborators
              </ButtonComponent>
            </div>

            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 top-[44px] z-10 w-[calc(100%-150px)] rounded-lg border border-border-light bg-white shadow-lg"
              >
                {suggestions.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => addCollaborator(user)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-alt2 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Avatar img={user.avatar} initials={user.initials} size="sm" />
                    <div className="min-w-0">
                      {user.name && <p className="truncate text-sm font-medium text-content-text">{user.name}</p>}
                      <p className="truncate text-xs text-placeholder">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <h3 className="mb-4 text-sm font-semibold text-content-text">
            {isFromHub ? 'Locally added collaborators' : 'Who has access'}
          </h3>

          {!isFromHub && (
            <div className="border-b border-border-light pb-4 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-alt3 text-icon">
                    <Users className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-medium text-content-text">Members of Develop</span>
                </div>
                <span className="text-sm text-placeholder">View only</span>
              </div>
            </div>
          )}

          <div className="max-h-[340px] overflow-y-auto">
            {collaborators.length === 0 && isFromHub && (
              <p className="py-4 text-sm text-placeholder">No collaborators added yet.</p>
            )}
            {collaborators.map((collab) => (
              <div
                key={collab.email}
                className="flex items-center justify-between border-b border-border-light py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar img={collab.avatar} initials={collab.initials} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-content-text">{collab.name}</p>
                    <p className="truncate text-xs text-placeholder">{collab.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCollaborator(collab.email)}
                  className="shrink-0 text-sm font-medium text-danger hover:text-danger/80"
                >
                  Remove as collaborator
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
