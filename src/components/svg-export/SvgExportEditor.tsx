import type { FC } from 'react'

import { ExportContentSection } from '../export/ExportContentSection'
import { ExportLayoutSection } from '../export/ExportLayoutSection'
import { SectionGroup } from '../common/SectionGroup'
import type { EditableSchema } from '../../schemas/editable'
import type { BaseExportSettingsSchema } from '../../schemas/settings'
import type { ValidationIssuesSchema } from '../../schemas/validation'

type SvgExportEditorProps = {
  editable: EditableSchema<BaseExportSettingsSchema>
  issues: ValidationIssuesSchema<BaseExportSettingsSchema>
  onChange: (updated: EditableSchema<BaseExportSettingsSchema>) => void
}

export const SvgExportEditor: FC<SvgExportEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <SectionGroup.Root>
      <ExportLayoutSection<BaseExportSettingsSchema> editable={editable} issues={issues} onChange={onChange} />
      <ExportContentSection<BaseExportSettingsSchema> editable={editable} issues={issues} onChange={onChange} />
    </SectionGroup.Root>
  )
}
