import { Button, Dialog } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState, type FC, type FormEvent } from 'react'

import { LANGUAGE } from '../constants/language'
import { useProject } from '../hooks/useProject'
import { renderSvgToString } from '../logic/exports/renderSvgToString'
import type { EditableSchema } from '../schemas/editable'
import type { SvgExportParamsSchema } from '../schemas/svgExport'
import type { BaseValidationContextSchema } from '../schemas/validation'
import { svgExportParamsAtom } from '../state/svgExportParamsAtom'
import { useTranslation } from '../translations/translation'
import { downloadSvg } from '../utils/downloadSvg'
import { getEditableSchema } from '../utils/getEditableSchema'
import { hasValidationErrors } from '../utils/hasValidationErrors'
import { validateSvgExportParamsSchema } from '../validators/validateSvgExportParamsSchema'
import { SvgExportEditor } from './svg-export/SvgExportEditor'

type SvgExportDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const SvgExportDialog: FC<SvgExportDialogProps> = ({ isOpen, onOpenChange }) => {
  const { computedProject, project } = useProject()
  const [storedParams, setStoredParams] = useAtom(svgExportParamsAtom)
  const t = useTranslation()
  const context = useMemo<BaseValidationContextSchema>(() => ({ language: LANGUAGE, t }), [t])
  const [exportParams, setExportParams] = useState<SvgExportParamsSchema>(storedParams)

  const [editableParams, setEditableParams] = useState<EditableSchema<SvgExportParamsSchema>>(() =>
    getEditableSchema(storedParams, context),
  )

  const validationResult = useMemo(
    () => validateSvgExportParamsSchema(editableParams, exportParams, context),
    [context, editableParams, exportParams],
  )

  const hasErrors = useMemo(
    () => hasValidationErrors<SvgExportParamsSchema>(validationResult.issues),
    [validationResult.issues],
  )

  const resetDraft = useCallback((): void => {
    setExportParams(storedParams)
    setEditableParams(getEditableSchema(storedParams, context))
  }, [context, storedParams])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    resetDraft()
  }, [isOpen, resetDraft])

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  const handleParamsChange = useCallback(
    (updatedEditableParams: EditableSchema<SvgExportParamsSchema>): void => {
      const updatedValidationResult = validateSvgExportParamsSchema(updatedEditableParams, exportParams, context)

      setEditableParams(updatedEditableParams)
      setExportParams(updatedValidationResult.committedValue)
    },
    [context, exportParams],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      const submitValidationResult = validateSvgExportParamsSchema(editableParams, exportParams, context)

      if (!submitValidationResult.isValid) {
        return
      }

      const params = submitValidationResult.value
      const svg = renderSvgToString(project, computedProject, params)
      downloadSvg(svg, `${project.name}.svg`)
      setStoredParams(params)
      onOpenChange(false)
    },
    [computedProject, context, editableParams, exportParams, onOpenChange, project, setStoredParams],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="lg">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>{t.svgExport.dialog.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body px="0">
              <SvgExportEditor
                editable={editableParams}
                issues={validationResult.issues}
                onChange={handleParamsChange}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.actions.cancel}</Button>
              </Dialog.ActionTrigger>
              <Button disabled={hasErrors} type="submit">
                {t.svgExport.dialog.actions.export}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
