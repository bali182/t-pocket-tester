import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { FC, useCallback } from 'react'

export type AlertDialogProps = {
  title: string
  message: string
  positiveLabel: string
  negativeLabel: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onPositiveAction: () => void
}

export const AlertDialog: FC<AlertDialogProps> = ({
  onOpenChange,
  onPositiveAction,
  isOpen,
  title,
  message,
  negativeLabel,
  positiveLabel,
}) => {
  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  return (
    <Dialog.Root role="alertdialog" onOpenChange={handleOpenChange} open={isOpen} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>{message}</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{negativeLabel}</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={onPositiveAction}>
                {positiveLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
