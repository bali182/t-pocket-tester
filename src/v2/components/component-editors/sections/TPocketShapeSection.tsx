import { useCallback, type FC } from 'react'

import type { PocketClusterSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'
type TPocketShapeSectionProps = {
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const TPocketShapeSection: FC<TPocketShapeSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handleTPocketTabWidthChange = useCallback(
    (tPocketTabWidth: string) => {
      onChange({
        ...editable,
        tPocketTabWidth,
      })
    },
    [editable, onChange],
  )

  const handleTPocketTaperChange = useCallback(
    (tPocketTaper: string) => {
      onChange({
        ...editable,
        tPocketTaper,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.tPocket.title()}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.tPocket.flapWidth()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.tPocketTabWidth}
          onChange={handleTPocketTabWidthChange}
          step={1}
          unit="mm"
          value={editable.tPocketTabWidth}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.tPocket.taper()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.tPocketTaper}
          onChange={handleTPocketTaperChange}
          step={1}
          unit="mm"
          value={editable.tPocketTaper}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
