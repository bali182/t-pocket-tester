import { useAtom } from 'jotai'
import { useCallback, useMemo, useState, type FC } from 'react'

import { LANGUAGE } from '../constants/language'
import { useProject } from '../hooks/useProject'
import { renderSvgToString } from '../logic/exports/renderSvgToString'
import { getComputedProject } from '../logic/getComputedProject'
import type { EditableSchema } from '../schemas/editable'
import type { BaseExportSettingsSchema } from '../schemas/settings'
import type { BaseValidationContextSchema } from '../schemas/validation'
import { svgExportParamsAtom } from '../state/svgExportParamsAtom'
import { useTranslation } from '../translations/translation'
import { downloadFile } from '../utils/downloadFile'
import { getEditableSchema } from '../utils/getEditableSchema'
import { hasValidationErrors } from '../utils/hasValidationErrors'
import { validateBaseExportSettingsSchema } from '../validators/validateBaseExportSettingsSchema'
import { EditDialog } from './EditDialog'
import { SvgExportEditor } from './svg-export/SvgExportEditor'

type SvgExportDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const SvgExportDialog: FC<SvgExportDialogProps> = ({ isOpen, onOpenChange }) => {
  const { project } = useProject()
  const [storedParams, setStoredParams] = useAtom(svgExportParamsAtom)
  const t = useTranslation()
  const context = useMemo<BaseValidationContextSchema>(() => ({ language: LANGUAGE, t }), [t])
  const [exportParams, setExportParams] = useState<BaseExportSettingsSchema>(storedParams)

  const [editableParams, setEditableParams] = useState<EditableSchema<BaseExportSettingsSchema>>(() =>
    getEditableSchema(storedParams, context),
  )

  const validationResult = useMemo(
    () => validateBaseExportSettingsSchema(editableParams, exportParams, context),
    [context, editableParams, exportParams],
  )

  const hasErrors = useMemo(
    () => hasValidationErrors<BaseExportSettingsSchema>(validationResult.issues),
    [validationResult.issues],
  )

  const resetDraft = useCallback((): void => {
    setExportParams(storedParams)
    setEditableParams(getEditableSchema(storedParams, context))
  }, [context, storedParams])

  const handleParamsChange = useCallback(
    (updatedEditableParams: EditableSchema<BaseExportSettingsSchema>): void => {
      const updatedValidationResult = validateBaseExportSettingsSchema(updatedEditableParams, exportParams, context)

      setEditableParams(updatedEditableParams)
      setExportParams(updatedValidationResult.committedValue)
    },
    [context, exportParams],
  )

  const handleSubmit = useCallback((): void => {
    const submitValidationResult = validateBaseExportSettingsSchema(editableParams, exportParams, context)

    if (!submitValidationResult.isValid) {
      return
    }

    const computedProject = getComputedProject(project)
    const svg = renderSvgToString(project, computedProject, submitValidationResult.value)
    downloadFile({ contentType: 'image/svg+xml', content: svg, fileName: `${project.name}.svg` })
    setStoredParams(submitValidationResult.value)
    onOpenChange(false)
  }, [context, editableParams, exportParams, onOpenChange, project, setStoredParams])

  return (
    <EditDialog
      canSubmit={!hasErrors}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onResetData={resetDraft}
      onSubmit={handleSubmit}
      submit={t.svgExport.dialog.actions.export}
      title={t.svgExport.dialog.title}
    >
      <SvgExportEditor editable={editableParams} issues={validationResult.issues} onChange={handleParamsChange} />
    </EditDialog>
  )
}
