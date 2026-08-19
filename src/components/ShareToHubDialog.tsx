import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { CircleArrowUp } from 'lucide-react'

type Props = {
  visible: boolean
  onClose: () => void
  /** Current procedure title, quoted in the confirmation copy. */
  procedureName: string
  /** How many spoke sites are subscribed to this hub. */
  subscriberCount: number
  onConfirm: () => void
}

/**
 * Confirmation modal for the header's "Share to Hub" action. Wraps Syncfusion's
 * DialogComponent rather than a hand-rolled overlay — `isModal` gives the DS
 * scrim (`Background/overlay-bg-color`) and focus trap for free, matching the
 * governance rule that Dialog owns modal chrome app-wide (see tokens.css for
 * the token-first overrides layered on top of its defaults).
 */
export function ShareToHubDialog({ visible, onClose, procedureName, subscriberCount, onConfirm }: Props) {
  return (
    <DialogComponent
      visible={visible}
      close={onClose}
      overlayClick={onClose}
      isModal
      showCloseIcon
      width="600px"
      cssClass="share-to-hub-dialog"
      header="Share to site?"
      // Dialog's `buttons` model only supports its own primary/flat pairing;
      // footerTemplate lets the footer reuse the app's own ButtonComponent
      // styling (Secondary Cancel + Primary confirm, per DS Cancel-default
      // open decision #2) instead of the library's.
      footerTemplate={() => (
        <div className="flex justify-end gap-2">
          <ButtonComponent cssClass="e-outline" onClick={onClose}>
            Cancel
          </ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={onConfirm}>
            <span className="flex items-center gap-1.5">
              <CircleArrowUp className="h-4 w-4" strokeWidth={1.75} />
              Share
            </span>
          </ButtonComponent>
        </div>
      )}
    >
      <p className="text-sm text-content-alt1">
        '{procedureName}' will be shared read-only with your {subscriberCount} subscribed sites. You keep
        editing it here, and changes propagate to them automatically.
      </p>
    </DialogComponent>
  )
}
