import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { StitchLineSchema } from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { NameAndColorsSection } from './sections/NameAndColorsSection'

type StitchLineEditorProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const StitchLineEditor: FC<StitchLineEditorProps> = ({ editable, issues, onChange }) => {
  return (
    <>
      <NameAndColorsSection editable={editable} issues={issues} onChange={onChange} />
    </>
  )
}
