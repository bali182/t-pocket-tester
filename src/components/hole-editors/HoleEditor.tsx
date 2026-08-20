import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { HoleSchema } from '../../schemas/hole'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { CornerRadiusSection } from '../component-editors/sections/CornerRadiusSection'
import { WidthAndHeightSizeSection } from '../component-editors/sections/WidthAndHeightSizeSection'
import { HoleBasicSettingsSection } from './sections/HoleBasicSettingsSection'
import { HolePositionSection } from './sections/HolePositionSection'

type HoleEditorProps = {
  editable: EditableSchema<HoleSchema>
  hole: HoleSchema
  issues: ValidationIssuesSchema<HoleSchema>
  onChange: (updated: EditableSchema<HoleSchema>) => void
}

export const HoleEditor: FC<HoleEditorProps> = ({ editable, hole, issues, onChange }) => {
  return (
    <>
      <HoleBasicSettingsSection<HoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <HolePositionSection<HoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <WidthAndHeightSizeSection<HoleSchema> editable={editable} issues={issues} onChange={onChange} />
      <CornerRadiusSection<HoleSchema> value={hole} editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
