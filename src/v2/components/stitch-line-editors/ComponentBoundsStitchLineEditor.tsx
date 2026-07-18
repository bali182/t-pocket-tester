import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { ComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { BasicSettingsSection } from './sections/BasicSettingsSection'
import { StitchSidesAndCornersSection } from './sections/StitchSidesAndCornersSection'
import { StitchingSettingsSection } from './sections/StitchingSettingsSection'

type ComponentBoundsStitchLineEditorProps = {
  editable: EditableSchema<ComponentBoundsStitchLineSchema>
  issues: ValidationIssuesSchema<ComponentBoundsStitchLineSchema>
  onChange: (updated: EditableSchema<ComponentBoundsStitchLineSchema>) => void
}

export const ComponentBoundsStitchLineEditor: FC<ComponentBoundsStitchLineEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <BasicSettingsSection editable={editable} issues={issues} onChange={onChange} />
      <StitchSidesAndCornersSection editable={editable} issues={issues} onChange={onChange} />
      <StitchingSettingsSection editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
