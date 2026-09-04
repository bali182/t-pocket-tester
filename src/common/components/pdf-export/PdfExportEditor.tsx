import type { FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { PdfExportSettingsSchema } from '../../schemas/pdfExport'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { SectionGroup } from '../common/SectionGroup'
import { ExportContentSection } from '../export/ExportContentSection'
import { ExportLayoutSection } from '../export/ExportLayoutSection'
import { ExportPageSection } from '../export/ExportPageSection'

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
