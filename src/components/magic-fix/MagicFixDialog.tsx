import { Button, Dialog, IconButton, Separator, Spacer } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiX } from 'react-icons/pi'
import { useMagicFixWorker } from '../../hooks/useMagicFixWorker'
import { useProject } from '../../hooks/useProject'
import { useProjectOperations } from '../../hooks/useProjectOperations'
import { useSubProject } from '../../hooks/useSubProject'
import { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import { useTranslation } from '../../translations/translation'
import { createMagicFixConfig } from '../../utils/createMagicFixConfig'
import { isDefined } from '../../utils/isDefined'
import { MagicFixProgressPage } from './MagicFixProgressPage'
import { MagicFixSettingsEditorPage } from './MagicFixSettingsEditorPage'
import { MagicFixStep, MagicFixSteps } from './MagicFixSteps'
import { MagicFixReviewPage } from './MagixFixReviewPage'

type MagicFixDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const MagicFixDialog: FC<MagicFixDialogProps> = ({ isOpen, onOpenChange }) => {
  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  return (
    <Dialog.Root
      lazyMount
      onOpenChange={handleOpenChange}
      open={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="xl"
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <MagicFixDialogContent onOpenChange={onOpenChange} />
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

type MagicFixDialogContentProps = {
  onOpenChange: (isOpen: boolean) => void
}

const MagicFixDialogContent: FC<MagicFixDialogContentProps> = ({ onOpenChange }) => {
  const t = useTranslation()

  const { project } = useProject()
  const { subProject } = useSubProject()
  const { cloneSubProject, setSubProject } = useProjectOperations()
  const { cancel, progress, result, start } = useMagicFixWorker()

  const [activeStep, setActiveStep] = useState<MagicFixStep>('settings')
  const [config, setConfig] = useState<MagicFixConfigSchema>(() => createMagicFixConfig(project, subProject))
  const isFixingComplete = isDefined(result)

  const handleNext = useCallback(() => {
    switch (activeStep) {
      case 'settings': {
        start(project, subProject.id, config)
        setActiveStep('fixing')
        break
      }
    }
  }, [activeStep, config, project, start, subProject.id])

  const handleBack = useCallback((): void => {
    switch (activeStep) {
      case 'fixing':
      case 'review': {
        cancel()
        setActiveStep('settings')
        break
      }
    }
  }, [activeStep, cancel])

  const handleCompletionAnimationEnd = useCallback((): void => {
    if (isDefined(result)) {
      setActiveStep('review')
    }
  }, [result])

  const handleAddNewModule = useCallback((): void => {
    if (!isDefined(result) || result.type !== 'success') {
      return
    }

    cloneSubProject(result.data)
    onOpenChange(false)
  }, [cloneSubProject, onOpenChange, result])

  const handleOverwriteModule = useCallback((): void => {
    if (!isDefined(result) || result.type !== 'success') {
      return
    }

    setSubProject(result.data)
    onOpenChange(false)
  }, [onOpenChange, result, setSubProject])

  return (
    <Dialog.Content height="70dvh">
      <Dialog.Header flexDirection="column" alignItems="stretch">
        <Dialog.Title>{t.magicFix.dialog.title}</Dialog.Title>
        <Dialog.CloseTrigger asChild>
          <IconButton size="sm" variant="ghost">
            <PiX />
          </IconButton>
        </Dialog.CloseTrigger>
        <MagicFixSteps step={activeStep} />
      </Dialog.Header>
      <Dialog.Body p={0}>
        {activeStep === 'settings' && (
          <MagicFixSettingsEditorPage subProject={subProject} config={config} onChange={setConfig} />
        )}
        {activeStep === 'fixing' && (
          <MagicFixProgressPage
            isComplete={isFixingComplete}
            onCompletionAnimationEnd={handleCompletionAnimationEnd}
            progress={progress}
          />
        )}
        {activeStep === 'review' && isDefined(result) && <MagicFixReviewPage result={result} />}
      </Dialog.Body>
      <Separator orientation="horizontal" />
      <Dialog.Footer>
        <Button disabled={activeStep === 'settings'} onClick={handleBack} variant="outline">
          {t.magicFix.dialog.actions.back}
        </Button>
        <Spacer />
        {activeStep !== 'review' && (
          <Button disabled={activeStep === 'fixing'} onClick={handleNext}>
            {t.common.actions.next}
          </Button>
        )}
        {activeStep === 'review' && result?.type === 'success' && (
          <>
            <Button colorPalette="red" onClick={handleOverwriteModule}>
              {t.magicFix.dialog.actions.overwriteModule}
            </Button>
            <Button onClick={handleAddNewModule}>{t.magicFix.dialog.actions.addNewModule}</Button>
          </>
        )}
      </Dialog.Footer>
    </Dialog.Content>
  )
}
