import { Switch } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixHasCornerRadiusConfigSchema, MagicFixNumericRangeSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

export type CornerRadiusSectionProps<T extends MagicFixHasCornerRadiusConfigSchema> = {
  config: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const CornerRadiusSection = <T extends MagicFixHasCornerRadiusConfigSchema>({
  editable,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReturnType<FC> => {
  const t = useTranslation()
  const handleCanConvertToIndividualRadiiChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      onChange({ ...editable, canConvertToIndividualRadii: details.checked }),
    [editable, onChange],
  )
  const handleBorderRadiusRangeChange = useCallback(
    (borderRadiusRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      onChange({ ...editable, borderRadiusRange }),
    [editable, onChange],
  )
  const handleBottomRightRadiusRangeChange = useCallback(
    (bottomRightRadiusRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      onChange({ ...editable, bottomRightRadiusRange }),
    [editable, onChange],
  )
  const handleBottomLeftRadiusRangeChange = useCallback(
    (bottomLeftRadiusRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      onChange({ ...editable, bottomLeftRadiusRange }),
    [editable, onChange],
  )
  const handleTopLeftRadiusRangeChange = useCallback(
    (topLeftRadiusRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      onChange({ ...editable, topLeftRadiusRange }),
    [editable, onChange],
  )
  const handleTopRightRadiusRangeChange = useCallback(
    (topRightRadiusRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      onChange({ ...editable, topRightRadiusRange }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>
        {t.magicFix.dialog.settings.advanced.sections.cornerRadius}
      </SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.canConvertToIndividualRadii}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Switch.Root
          checked={editable.canConvertToIndividualRadii}
          onCheckedChange={handleCanConvertToIndividualRadiiChange}
          size="sm"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.borderRadius}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor
        issue={[issues.borderRadiusRange.maxDecrease, issues.borderRadiusRange.maxIncrease]}
      >
        <MagicFixNumericRangeEditor
          issues={issues.borderRadiusRange}
          onChange={handleBorderRadiusRangeChange}
          value={editable.borderRadiusRange}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.directions.bottomRight}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor
        issue={[issues.bottomRightRadiusRange.maxDecrease, issues.bottomRightRadiusRange.maxIncrease]}
      >
        <MagicFixNumericRangeEditor
          issues={issues.bottomRightRadiusRange}
          onChange={handleBottomRightRadiusRangeChange}
          value={editable.bottomRightRadiusRange}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.directions.bottomLeft}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor
        issue={[issues.bottomLeftRadiusRange.maxDecrease, issues.bottomLeftRadiusRange.maxIncrease]}
      >
        <MagicFixNumericRangeEditor
          issues={issues.bottomLeftRadiusRange}
          onChange={handleBottomLeftRadiusRangeChange}
          value={editable.bottomLeftRadiusRange}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.directions.topLeft}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor
        issue={[issues.topLeftRadiusRange.maxDecrease, issues.topLeftRadiusRange.maxIncrease]}
      >
        <MagicFixNumericRangeEditor
          issues={issues.topLeftRadiusRange}
          onChange={handleTopLeftRadiusRangeChange}
          value={editable.topLeftRadiusRange}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.directions.topRight}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor
        issue={[issues.topRightRadiusRange.maxDecrease, issues.topRightRadiusRange.maxIncrease]}
      >
        <MagicFixNumericRangeEditor
          issues={issues.topRightRadiusRange}
          onChange={handleTopRightRadiusRangeChange}
          value={editable.topRightRadiusRange}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
