import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { CircleHoleSchema } from '../../../schemas/hole'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type CircleHoleSizeSectionProps = {
  editable: EditableSchema<CircleHoleSchema>
  issues: ValidationIssuesSchema<CircleHoleSchema>
  onChange: (updated: EditableSchema<CircleHoleSchema>) => void
}

export const CircleHoleSizeSection: FC<CircleHoleSizeSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handleRadiusChange = useCallback(
    (radius: string): void => {
      onChange({ ...editable, radius })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.size}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.hole.editor.size.radius}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.radius} onChange={handleRadiusChange} step={1} unit="mm" value={editable.radius} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
