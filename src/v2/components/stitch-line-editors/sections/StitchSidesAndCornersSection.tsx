import { EditableSchema } from '../../../schemas/editable'
import { ComponentBoundsStitchLineSchema } from '../../../schemas/stitching'
import { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'
import { StitchLineSidesAndCorners } from '../StitchLineSidesAndCorners'

type StitchSidesAndCornersSectionProps = {
  editable: EditableSchema<ComponentBoundsStitchLineSchema>
  issues: ValidationIssuesSchema<ComponentBoundsStitchLineSchema>
  onChange: (updated: EditableSchema<ComponentBoundsStitchLineSchema>) => void
}

export const StitchSidesAndCornersSection = ({ editable, issues, onChange }: StitchSidesAndCornersSectionProps) => {
  const t = useTranslation()
  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.stitchLine.editor.seamLine.title()}</SectionGroup.SectionHeader>
      <SectionGroup.SectionFullWidthContent>
        <StitchLineSidesAndCorners editable={editable} issues={issues} onChange={onChange} />
      </SectionGroup.SectionFullWidthContent>
    </SectionGroup.Section>
  )
}
