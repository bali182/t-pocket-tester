import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiCaretDown, PiCaretLeft, PiCaretRight, PiCaretUp } from 'react-icons/pi'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { NumberInput } from './NumberInput'

type PocketClusterSettingsSectionProps = {
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const PocketClusterSettingsSection: FC<PocketClusterSettingsSectionProps> = ({
  editable,
  issues,
  onChange,
}) => {
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
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Nyílás iránya">
          <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.orientation}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Item aria-label="Felülről" value="up">
              <SegmentGroup.ItemHiddenInput />
              <PiCaretDown />
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Alulról" value="down">
              <SegmentGroup.ItemHiddenInput />
              <PiCaretUp />
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Balról" value="left">
              <SegmentGroup.ItemHiddenInput />
              <PiCaretRight />
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Jobbról" value="right">
              <SegmentGroup.ItemHiddenInput />
              <PiCaretLeft />
            </SegmentGroup.Item>
          </SegmentGroup.Root>
        </EditorFieldRow>

        <EditorFieldRow label="Zsebek száma">
          <NumberInput
            issue={issues.pocketCount}
            onChange={handlePocketCountChange}
            step={1}
            unit="db"
            value={editable.pocketCount}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Zseb lépés">
          <NumberInput
            issue={issues.pocketStep}
            onChange={handlePocketStepChange}
            step={1}
            unit="mm"
            value={editable.pocketStep}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
