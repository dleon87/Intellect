import { useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns'
import { SwitchComponent } from '@syncfusion/ej2-react-buttons'
import { X, AlertTriangle } from 'lucide-react'

const PARENT_OPTIONS = [
  'Departments',
  'Format',
  'Machine Class',
  'Machines',
  'QA Machine',
  'Range',
  'Range Category',
  'Unit with barcode',
]

type Props = {
  onClose: () => void
  onCreate: (name: string, parents: string, pushUnitsToChildren: boolean) => void
}

export function CreateUnitTypePage({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [parents, setParents] = useState('')
  const [pushToChildren, setPushToChildren] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name.trim(), parents.trim(), pushToChildren)
  }

  return (
    <div className="flex flex-1 items-start justify-center pt-24">
      <button
        onClick={onClose}
        className="absolute right-8 top-20 rounded-full border border-border-light p-2 text-icon hover:bg-surface-alt2 hover:text-icon-hover"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="w-full max-w-[680px]">
        <h1 className="mb-8 text-xl font-medium text-content-text">Create unit type</h1>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-content-text" htmlFor="unit-type-name">
            Name
          </label>
          <TextBoxComponent
            id="unit-type-name"
            cssClass="e-outline"
            placeholder=""
            value={name}
            input={(e: { value: string }) => setName(e.value)}
            htmlAttributes={{ 'aria-label': 'Unit type name' }}
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-content-text" htmlFor="unit-type-parents">
            Parents
          </label>
          <AutoCompleteComponent
            id="unit-type-parents"
            cssClass="e-outline"
            dataSource={PARENT_OPTIONS}
            placeholder=""
            value={parents}
            filterType="Contains"
            minLength={0}
            showPopupButton
            change={(e: { value: string }) => setParents(e.value ?? '')}
            htmlAttributes={{ 'aria-label': 'Parents' }}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-content-text" htmlFor="push-toggle">
              Share units with subscribed sites
            </label>
            <SwitchComponent
              id="push-toggle"
              checked={pushToChildren}
              change={(e: { checked: boolean }) => setPushToChildren(e.checked)}
            />
          </div>

          {pushToChildren && (
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-warning-lighter bg-warning-lighter px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
              <p className="text-sm text-content-text">
                This cannot be undone. Once enabled, units in this type will be pushed to all subscribed sites
                automatically and this setting cannot be disabled.
              </p>
            </div>
          )}
        </div>

        <ButtonComponent cssClass="e-primary e-block toolbar-btn" onClick={handleCreate}>
          Create unit type
        </ButtonComponent>
      </div>
    </div>
  )
}
