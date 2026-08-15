import { Button, Dialog, IconButton, Separator } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiX } from 'react-icons/pi'
import { useProject } from '../../hooks/useProject'
import { useSubProject } from '../../hooks/useSubProject'
import { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import { useTranslation } from '../../translations/translation'
import { createMagicFixConfig } from '../../utils/createMagicFixConfig'
import { MagicFixProgressPage } from './MagicFixProgressPage'
import { MagicFixSettingsEditorPage } from './MagicFixSettingsEditorPage'
import { MagicFixStep, MagicFixSteps } from './MagicFixSteps'

type MagicFixDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const MagicFixDialog: FC<MagicFixDialogProps> = ({ isOpen, onOpenChange }) => {
  const t = useTranslation()

  const { project } = useProject()
  const { subProject } = useSubProject()

  const [activeStep, setActiveStep] = useState<MagicFixStep>('settings')
  const [config, setConfig] = useState<MagicFixConfigSchema>(() => createMagicFixConfig(project, subProject))

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  const handleNext = useCallback(() => {
    switch (activeStep) {
      case 'settings': {
        setActiveStep('fixing')
        break
      }
    }
  }, [activeStep])

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} scrollBehavior="inside" size="xl" placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content height="70dvh">
          <Dialog.Header flexDirection="column" alignItems="stretch">
            <Dialog.Title>{t.magicFix.dialog.title}</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <IconButton size="sm" variant="ghost">
                <PiX />
              </IconButton>
            </Dialog.CloseTrigger>
            <MagicFixSteps step={activeStep} onStepChange={setActiveStep} />
          </Dialog.Header>
          <Dialog.Body p={0}>
            {activeStep === 'settings' && (
              <MagicFixSettingsEditorPage subProject={subProject} config={config} onChange={setConfig} />
            )}
            {activeStep === 'fixing' && (
              <MagicFixProgressPage project={project} subProject={subProject} config={config} />
            )}
            {activeStep === 'review' && <>TODO Review</>}
          </Dialog.Body>
          <Separator orientation="horizontal" />
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">{t.common.actions.cancel}</Button>
            </Dialog.ActionTrigger>
            <Button onClick={handleNext}>{t.common.actions.next}</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
