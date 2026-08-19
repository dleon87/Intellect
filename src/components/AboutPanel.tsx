import { useEffect, useRef, useState } from 'react'
import { Info, Pencil, X, Plus } from 'lucide-react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent, TextAreaComponent } from '@syncfusion/ej2-react-inputs'
import type { KeyboardEvent } from 'react'
import { Avatar } from './Avatar'
import type { Collaborator } from '../collaborator'
import type { ProcedureKind } from '../procedureKind'

const INITIAL_TAGS = ['Ben', 'all_proc_tag']

const TEAMS = ['Product Design', 'Growth', 'Platform Engineering', 'Customer Success', 'Data & Analytics']

type Props = {
  /** Renders the empty/first-run state of a newly created procedure. */
  isNew?: boolean
  kind?: ProcedureKind
  /** Lifted up to App.tsx so the header's avatar stack (ProcedureHeader) stays in sync with this list. */
  collaborators: Collaborator[]
  onCollaboratorsChange: (collaborators: Collaborator[]) => void
  onManageCollaborators?: () => void
  adopted?: boolean
}

export function AboutPanel({ isNew = false, kind = 'local', collaborators, onCollaboratorsChange, onManageCollaborators, adopted = true }: Props) {
  const isManaged = kind === 'managed'
  const [description, setDescription] = useState(isNew ? '' : 'Soluta iusto tergiversatio.')
  const [editingDescription, setEditingDescription] = useState(false)
  const descriptionInputRef = useRef<TextAreaComponent | null>(null)

  const [tags, setTags] = useState(isNew ? [] : INITIAL_TAGS)
  const [addingTag, setAddingTag] = useState(false)
  const tagInputRef = useRef<TextBoxComponent | null>(null)
  const tagCommittedRef = useRef(false)

  const [teams] = useState(isNew || !adopted ? [] : TEAMS)

  useEffect(() => {
    if (addingTag) {
      tagCommittedRef.current = false
      tagInputRef.current?.focusIn()
    }
  }, [addingTag])

  useEffect(() => {
    if (editingDescription) descriptionInputRef.current?.focusIn()
  }, [editingDescription])

  const commitDescription = () => {
    // Read the underlying <textarea>, not the component's `value` property:
    // with `value` passed as a prop, Syncfusion keeps that property pinned to
    // the prop it was given, so it reads back as the pre-edit text while the
    // DOM node holds what was actually typed.
    const el = descriptionInputRef.current?.element as HTMLTextAreaElement | undefined
    setDescription((el?.value ?? '').trim())
    setEditingDescription(false)
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const commitTag = () => {
    if (tagCommittedRef.current) return
    tagCommittedRef.current = true
    const value = (tagInputRef.current?.value ?? '').trim()
    if (value) setTags((prev) => (prev.includes(value) ? prev : [...prev, value]))
    setAddingTag(false)
  }

  const cancelTag = () => {
    tagCommittedRef.current = true
    setAddingTag(false)
  }

  const onTagKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') commitTag()
    if (e.key === 'Escape') cancelTag()
  }

  return (
    <div className="border border-border-light rounded-lg bg-white p-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-placeholder uppercase">
          <Info className="w-4 h-4" strokeWidth={1.75} />
          About this procedure
        </div>
        {description && !editingDescription && kind !== 'from-hub' && (
          <ButtonComponent
            cssClass="e-flat icon-btn"
            aria-label="Edit description"
            title="Edit"
            onClick={() => setEditingDescription(true)}
          >
            <Pencil className="w-4 h-4 text-icon" strokeWidth={1.75} />
          </ButtonComponent>
        )}
      </div>

      <div className="mb-5">
        {editingDescription && kind !== 'from-hub' ? (
          <div className="flex flex-col gap-2">
            <TextAreaComponent
              ref={descriptionInputRef}
              cssClass="e-outline"
              placeholder="Add a description for this procedure"
              rows={3}
              value={description}
              htmlAttributes={{ 'aria-label': 'Procedure description' }}
            />
            <div className="flex justify-end gap-2">
              <ButtonComponent cssClass="e-flat" onClick={() => setEditingDescription(false)}>
                Cancel
              </ButtonComponent>
              <ButtonComponent cssClass="e-primary" onClick={commitDescription}>
                Save
              </ButtonComponent>
            </div>
          </div>
        ) : description ? (
          <p className="text-sm text-content-text">{description}</p>
        ) : kind !== 'from-hub' ? (
          <ButtonComponent cssClass="e-flat link-btn" onClick={() => setEditingDescription(true)}>
            Add description
          </ButtonComponent>
        ) : null}
      </div>
      <hr className="border-border-light mb-5" />

      <h3 className="text-sm font-semibold text-content-text mb-3">Tags</h3>
      <div className="flex gap-2 mb-5 flex-wrap items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-medium ${isManaged ? 'px-3' : 'pl-3 pr-2'}`}
          >
            {tag}
            {!isManaged && (
              <button aria-label={`Remove ${tag}`} className="hover:text-sky-950" onClick={() => removeTag(tag)}>
                <X className="w-3 h-3" strokeWidth={2} />
              </button>
            )}
          </span>
        ))}

        {!isManaged && (
          addingTag ? (
            <div className="flex items-center gap-1" onKeyDown={onTagKeyDown}>
              <TextBoxComponent
                ref={tagInputRef}
                cssClass="e-outline tag-add-input"
                placeholder="New tag"
                autocomplete="off"
                htmlAttributes={{ 'aria-label': 'New tag', autoFocus: true }}
                blur={commitTag}
              />
            </div>
          ) : (
            <button
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
              onClick={() => setAddingTag(true)}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Add
            </button>
          )
        )}
      </div>
      <hr className="border-border-light mb-5" />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-content-text">Collaborators</h3>
        <button
          className="text-sm font-medium text-primary hover:text-primary-hover"
          onClick={onManageCollaborators}
        >
          Edit
        </button>
      </div>
      {/* First-run nudge: only the creator is on the procedure so far. The design
          shows this as a hand-lettered brush graphic; without that asset it is
          approximated with type + a tinted band. */}
      {collaborators.length <= 1 && (
        <div className="mb-4 rounded-lg bg-sky-50/70 px-4 py-3">
          <p className="text-sm italic leading-snug text-slate-600">
            We believe in teamwork!
            <br />
            Invite other people to help you out
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-3">
        {collaborators.map((c) => (
          <div key={c.email} className="flex items-center gap-3">
            <Avatar img={c.avatar} initials={c.initials} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-text truncate">{c.name}</p>
              <p className="text-xs text-placeholder truncate">{c.email}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-border-light mb-5" />

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-content-text">Teams</h3>
        <button className="text-sm font-medium text-primary hover:text-primary-hover">Edit</button>
      </div>
      {teams.length > 0 ? (
        <div className="flex flex-col gap-2">
          {teams.map((team) => (
            <p key={team} className="text-sm text-content-text">
              {team}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-placeholder">No teams have been added</p>
      )}
    </div>
  )
}
