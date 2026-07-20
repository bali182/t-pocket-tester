import { useCallback, type FC } from 'react'

import type { RootPanelSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type WidthAndHeightSizeSectionProps = {
  component: RootPanelSchema
  editable: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema>
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
}

export const WidthAndHeightSizeSection: FC<WidthAndHeightSizeSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({
        ...editable,
        width,
      })
    },
    [editable, onChange],
  )

  const handleHeightChange = useCallback(
    (height: string) => {
      onChange({
        ...editable,
        height,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.size}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.width}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.width} onChange={handleWidthChange} step={1} unit="mm" value={editable.width} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.height}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.height} onChange={handleHeightChange} step={1} unit="mm" value={editable.height} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
