import { Alert, Box, Button, CloseButton, Dialog, IconButton, chakra } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState, type FC, type FormEvent } from 'react'
import { PiX } from 'react-icons/pi'

import { LANGUAGE } from '../constants/language'
import { useComputedProject } from '../hooks/useComputedProject'
import { useProject } from '../hooks/useProject'
import { exportPdf } from '../logic/exports/exportPdf'
import { getComputedPdfExport } from '../logic/exports/getComputedPdfExport'
import type { EditableSchema } from '../schemas/editable'
import type { PdfExportSettingsSchema, PdfExportUnsuccessfulLayoutSchema } from '../schemas/pdfExport'
import type { BaseValidationContextSchema } from '../schemas/validation'
import { pdfExportParamsAtom } from '../state/pdfExportParamsAtom'
import { useTranslation } from '../translations/translation'
import { getEditableSchema } from '../utils/getEditableSchema'
import { hasValidationErrors } from '../utils/hasValidationErrors'
import { isDefined } from '../utils/isDefined'
import { validatePdfExportSettingsSchema } from '../validators/validatePdfExportSettingsSchema'
import { PdfExportEditor } from './pdf-export/PdfExportEditor'

type PdfExportDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

type PdfExportUnplaceableFailure = {
  type: 'unplaceable'
  layout: PdfExportUnsuccessfulLayoutSchema
}

type PdfExportRuntimeFailure = {
  type: 'runtime'
}

type PdfExportFailure = PdfExportUnplaceableFailure | PdfExportRuntimeFailure

export const PdfExportDialog: FC<PdfExportDialogProps> = ({ isOpen, onOpenChange }) => {
  const { project } = useProject()
  const computedProject = useComputedProject()
  const [storedParams, setStoredParams] = useAtom(pdfExportParamsAtom)
  const [exportParams, setExportParams] = useState<PdfExportSettingsSchema>(storedParams)
  const [editableParams, setEditableParams] = useState<EditableSchema<PdfExportSettingsSchema>>(() =>
    getEditableSchema(storedParams, { language: LANGUAGE }),
  )
  const [failure, setFailure] = useState<PdfExportFailure | undefined>(undefined)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const t = useTranslation()
  const context = useMemo<BaseValidationContextSchema>(() => ({ language: LANGUAGE, t }), [t])

  const validationResult = useMemo(
    () => validatePdfExportSettingsSchema(editableParams, exportParams, context),
    [context, editableParams, exportParams],
  )

  const hasErrors = useMemo(
    () => hasValidationErrors<PdfExportSettingsSchema>(validationResult.issues),
    [validationResult.issues],
  )

  const resetDraft = useCallback((): void => {
    setEditableParams(getEditableSchema(storedParams, context))
    setExportParams(storedParams)
    setFailure(undefined)
  }, [context, storedParams])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    resetDraft()
  }, [isOpen, resetDraft])

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      if (isExporting) {
        return
      }

      onOpenChange(details.open)
    },
    [isExporting, onOpenChange],
  )

  const handleParamsChange = useCallback(
    (updatedEditableParams: EditableSchema<PdfExportSettingsSchema>): void => {
      const updatedValidationResult = validatePdfExportSettingsSchema(updatedEditableParams, exportParams, context)

      setEditableParams(updatedEditableParams)
      setExportParams(updatedValidationResult.committedValue)
    },
    [context, exportParams],
  )

  const handleFailureDismiss = useCallback((): void => {
    setFailure(undefined)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      const submitValidationResult = validatePdfExportSettingsSchema(editableParams, exportParams, context)

      if (!submitValidationResult.isValid) {
        return
      }

      const layout = getComputedPdfExport(project, computedProject, submitValidationResult.value)

      if (layout.type === 'unsuccessful-pdf-export') {
        setFailure({ layout, type: 'unplaceable' })
        return
      }

      setIsExporting(true)

      try {
        await exportPdf(project, submitValidationResult.value, layout)
        setStoredParams(submitValidationResult.value)
        onOpenChange(false)
      } catch (error) {
        console.error('Unable to export PDF:', error)
        setFailure({ type: 'runtime' })
      } finally {
        setIsExporting(false)
      }
    },
    [computedProject, context, editableParams, exportParams, onOpenChange, project, setStoredParams],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} scrollBehavior="inside" size="lg" placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <chakra.form display="flex" flex="1" flexDirection="column" minH="0" onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>{t.pdfExport.dialog.title}</Dialog.Title>
              {!isExporting && (
                <Dialog.CloseTrigger asChild>
                  <IconButton size="sm" variant="ghost">
                    <PiX />
                  </IconButton>
                </Dialog.CloseTrigger>
              )}
            </Dialog.Header>
            <Dialog.Body px="0">
              <PdfExportFailureAlert failure={failure} onDismiss={handleFailureDismiss} />
              <PdfExportEditor
                editable={editableParams}
                issues={validationResult.issues}
                onChange={handleParamsChange}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button disabled={isExporting} variant="outline">
                  {t.common.actions.cancel}
                </Button>
              </Dialog.ActionTrigger>
              <Button disabled={hasErrors || isExporting} loading={isExporting} type="submit">
                {t.pdfExport.dialog.actions.export}
              </Button>
            </Dialog.Footer>
          </chakra.form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

type PdfExportFailureAlertProps = {
  failure: PdfExportFailure | undefined
  onDismiss: () => void
}

const PdfExportFailureAlert: FC<PdfExportFailureAlertProps> = ({ failure, onDismiss }) => {
  const t = useTranslation()

  if (!isDefined(failure)) {
    return null
  }

  return (
    <Box pb="3" pt="3" px="4">
      <Alert.Root position="relative" status="error">
        <Alert.Indicator />
        <Alert.Content pe="8">
          <Alert.Title>
            {failure.type === 'unplaceable'
              ? t.pdfExport.dialog.errors.unplaceablePanels
              : t.pdfExport.dialog.errors.exportFailed}
          </Alert.Title>
          {failure.type === 'unplaceable' && (
            <Alert.Description as="ul" mt="2" ps="4">
              {failure.layout.unplaceables.map((panel) => {
                const root = panel.subProject.components[panel.subProject.root]
                const text = isDefined(root) ? `${root.name} → ${panel.component.name}` : panel.component.name
                return <li key={`${panel.subProject.id}:${panel.component.id}`}>{text}</li>
              })}
            </Alert.Description>
          )}
        </Alert.Content>
        <CloseButton onClick={onDismiss} position="absolute" size="sm" top="2" insetEnd="2" />
      </Alert.Root>
    </Box>
  )
}
