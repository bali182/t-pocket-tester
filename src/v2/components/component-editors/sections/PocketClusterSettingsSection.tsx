import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiCaretDown, PiCaretLeft, PiCaretRight, PiCaretUp } from 'react-icons/pi'

import type { PocketClusterSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type PocketClusterSettingsSectionProps = {
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const PocketClusterSettingsSection: FC<PocketClusterSettingsSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handleOrientationChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      if (details.value !== 'up' && details.value !== 'down' && details.value !== 'left' && details.value !== 'right') {
        return
      }

      onChange({
        ...editable,
        orientation: details.value,
      })
    },
    [editable, onChange],
  )

  const handlePocketCountChange = useCallback(
    (pocketCount: string) => {
      onChange({
        ...editable,
        pocketCount,
      })
    },
    [editable, onChange],
  )

  const handlePocketStepChange = useCallback(
    (pocketStep: string) => {
      onChange({
        ...editable,
        pocketStep,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.pocketCluster.title}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.pocketCluster.opening}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.orientation}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.component.editor.pocketCluster.fromTop} value="up">
            <SegmentGroup.ItemHiddenInput />
            <PiCaretDown />
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.pocketCluster.fromBottom} value="down">
            <SegmentGroup.ItemHiddenInput />
            <PiCaretUp />
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.pocketCluster.fromLeft} value="left">
            <SegmentGroup.ItemHiddenInput />
            <PiCaretRight />
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.pocketCluster.fromRight} value="right">
            <SegmentGroup.ItemHiddenInput />
            <PiCaretLeft />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.amount}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.pocketCount}
          onChange={handlePocketCountChange}
          step={1}
          unit="db"
          value={editable.pocketCount}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.spacing}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.pocketStep}
          onChange={handlePocketStepChange}
          step={1}
          unit="mm"
          value={editable.pocketStep}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
