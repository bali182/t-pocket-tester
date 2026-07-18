import { EditableSchema } from '../../../schemas/editable'
import { ComponentBoundsStitchLineSchema } from '../../../schemas/stitching'
import { ValidationIssuesSchema } from '../../../schemas/validation'
import { SectionGroup } from '../../common/SectionGroup'
import { StitchLineSidesAndCorners } from '../StitchLineSidesAndCorners'

type StitchSidesAndCornersSectionProps = {
  editable: EditableSchema<ComponentBoundsStitchLineSchema>
  issues: ValidationIssuesSchema<ComponentBoundsStitchLineSchema>
  onChange: (updated: EditableSchema<ComponentBoundsStitchLineSchema>) => void
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
