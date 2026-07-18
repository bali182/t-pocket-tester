import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { StitchLineSchema } from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { BasicSettingsSection } from './sections/BasicSettingsSection'
import { StitchSidesAndCornersSection } from './sections/StitchSidesAndCornersSection'
import { StitchingSettingsSection } from './sections/StitchingSettingsSection'

type StitchLineEditorProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const StitchLineEditor: FC<StitchLineEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <BasicSettingsSection editable={editable} issues={issues} onChange={onChange} />
      <StitchSidesAndCornersSection editable={editable} issues={issues} onChange={onChange} />
      <StitchingSettingsSection editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
