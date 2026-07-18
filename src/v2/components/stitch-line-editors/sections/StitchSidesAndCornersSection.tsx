import { EditableSchema } from '../../../schemas/editable'
import { StitchLineSchema } from '../../../schemas/stitching'
import { ValidationIssuesSchema } from '../../../schemas/validation'
import { SectionGroup } from '../../common/SectionGroup'
import { StitchLineSidesAndCorners } from '../StitchLineSidesAndCorners'

type StitchSidesAndCornersSectionProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const StitchSidesAndCornersSection = ({ editable, issues, onChange }: StitchSidesAndCornersSectionProps) => {
  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>Varratvonal</SectionGroup.SectionHeader>
      <SectionGroup.SectionFullWidthContent>
        <StitchLineSidesAndCorners editable={editable} issues={issues} onChange={onChange} />
      </SectionGroup.SectionFullWidthContent>
    </SectionGroup.Section>
  )
}
