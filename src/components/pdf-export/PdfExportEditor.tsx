import type { FC } from 'react'

import { ExportContentSection } from '../export/ExportContentSection'
import { ExportLayoutSection } from '../export/ExportLayoutSection'
import { ExportPageSection } from '../export/ExportPageSection'
import { SectionGroup } from '../common/SectionGroup'
import type { EditableSchema } from '../../schemas/editable'
import type { PdfExportSettingsSchema } from '../../schemas/pdfExport'
import type { ValidationIssuesSchema } from '../../schemas/validation'

type PdfExportEditorProps = {
  editable: EditableSchema<PdfExportSettingsSchema>
  issues: ValidationIssuesSchema<PdfExportSettingsSchema>
  onChange: (updated: EditableSchema<PdfExportSettingsSchema>) => void
}

export const PdfExportEditor: FC<PdfExportEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <SectionGroup.Root>
      <ExportPageSection<PdfExportSettingsSchema> editable={editable} issues={issues} onChange={onChange} />
      <ExportLayoutSection<PdfExportSettingsSchema> editable={editable} issues={issues} onChange={onChange} />
      <ExportContentSection<PdfExportSettingsSchema> editable={editable} issues={issues} onChange={onChange} />
    </SectionGroup.Root>
  )
}
