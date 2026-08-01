import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { RectHoleSchema } from '../../schemas/hole'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from '../component-editors/sections/CornerRadiusSection'
import { WidthAndHeightSizeSection } from '../component-editors/sections/WidthAndHeightSizeSection'
import { HoleBasicSettingsSection } from './sections/HoleBasicSettingsSection'
import { HolePositionSection } from './sections/HolePositionSection'

type RectHoleEditorProps = {
  editable: EditableSchema<RectHoleSchema>
  issues: ValidationIssuesSchema<RectHoleSchema>
  onChange: (updated: EditableSchema<RectHoleSchema>) => void
}

export const RectHoleEditor: FC<RectHoleEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <HoleBasicSettingsSection<RectHoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <HolePositionSection<RectHoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <WidthAndHeightSizeSection<RectHoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection<RectHoleSchema> editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
