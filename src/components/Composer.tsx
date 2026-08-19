import { useRef, useState } from 'react'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextAreaComponent } from '@syncfusion/ej2-react-inputs'
import type { ChangeEventArgs } from '@syncfusion/ej2-inputs'
import { Avatar } from './Avatar'

type Props = {
  onPost: (text: string) => void
}

export function Composer({ onPost }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<TextAreaComponent | null>(null)

  const isEmpty = value.trim().length === 0

  const handlePost = () => {
    if (isEmpty) return
    onPost(value.trim())
    setValue('')
  }

  return (
    <div className="border border-border-light rounded-lg bg-white">
      <div className="flex gap-3 p-4">
        <Avatar img={5} className="shrink-0" />
        <TextAreaComponent
          ref={textareaRef}
          cssClass="e-outline composer-textarea"
          placeholder="Share an update about this procedure"
          rows={3}
          value={value}
          change={(e: ChangeEventArgs) => setValue((e.value as string) ?? '')}
        />
      </div>
      <div className="flex justify-end px-4 py-3 border-t border-border-light">
        <ButtonComponent cssClass="e-primary" disabled={isEmpty} onClick={handlePost}>
          Post
        </ButtonComponent>
      </div>
    </div>
  )
}
