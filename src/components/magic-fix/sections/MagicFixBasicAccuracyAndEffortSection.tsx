import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiCircle, PiCircleFill, PiCircleHalf } from 'react-icons/pi'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixBaseConfigSchema, MagicFixEffortSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

export type MagicFixBasicAccuracyAndEffortSectionProps = {
  config: MagicFixBaseConfigSchema
  editable: EditableSchema<MagicFixBaseConfigSchema>
  issues: ValidationIssuesSchema<MagicFixBaseConfigSchema>
  onChange: (updated: EditableSchema<MagicFixBaseConfigSchema>) => void
}

export const MagicFixBasicAccuracyAndEffortSection: FC<MagicFixBasicAccuracyAndEffortSectionProps> = ({
  editable,
  issues,
  onChange,
}) => {
  const t = useTranslation()
  const handleAccuracyChange = useCallback(
    (accuracy: string): void => onChange({ ...editable, accuracy }),
    [editable, onChange],
  )
  const handleEffortChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails): void =>
      onChange({ ...editable, effort: details.value as MagicFixEffortSchema }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>
        {t.magicFix.dialog.settings.basic.sections.accuracyAndEffort}
      </SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.basic.labels.effort}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.effort}>
        <SegmentGroup.Root onValueChange={handleEffortChange} size="sm" value={editable.effort}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.magicFix.dialog.settings.basic.efforts.low} value="low">
            <SegmentGroup.ItemHiddenInput />
            <PiCircle /> {t.magicFix.dialog.settings.basic.efforts.low}
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.magicFix.dialog.settings.basic.efforts.medium} value="medium">
            <SegmentGroup.ItemHiddenInput />
            <PiCircleHalf /> {t.magicFix.dialog.settings.basic.efforts.medium}
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.magicFix.dialog.settings.basic.efforts.high} value="high">
            <SegmentGroup.ItemHiddenInput />
            <PiCircleFill /> {t.magicFix.dialog.settings.basic.efforts.high}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.basic.labels.accuracy}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.accuracy}>
        <NumberInput issue={issues.accuracy} onChange={handleAccuracyChange} unit="mm" value={editable.accuracy} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
