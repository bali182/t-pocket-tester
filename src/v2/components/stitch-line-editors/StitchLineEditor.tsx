import { type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { StitchLineSchema } from '../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { SectionGroup } from '../common/SectionGroup'
import { StitchLineSidesAndCorners } from './StitchLineSidesAndCorners'
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
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>Varratvonal</SectionGroup.SectionHeader>
        <SectionGroup.SectionFullWidthContent>
          <StitchLineSidesAndCorners editable={editable} issues={issues} onChange={onChange} />
        </SectionGroup.SectionFullWidthContent>
      </SectionGroup.Section>
    </>
  )
}
