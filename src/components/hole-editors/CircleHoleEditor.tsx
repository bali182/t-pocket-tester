import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { CircleHoleSchema } from '../../schemas/hole'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CircleHoleSizeSection } from './sections/CircleHoleSizeSection'
import { HoleBasicSettingsSection } from './sections/HoleBasicSettingsSection'
import { HolePositionSection } from './sections/HolePositionSection'

type CircleHoleEditorProps = {
  editable: EditableSchema<CircleHoleSchema>
  issues: ValidationIssuesSchema<CircleHoleSchema>
  onChange: (updated: EditableSchema<CircleHoleSchema>) => void
}

export const CircleHoleEditor: FC<CircleHoleEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <HoleBasicSettingsSection<CircleHoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <HolePositionSection<CircleHoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <CircleHoleSizeSection editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
