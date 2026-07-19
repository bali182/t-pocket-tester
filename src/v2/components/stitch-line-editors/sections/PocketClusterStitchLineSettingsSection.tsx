import { Switch } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'

import type { EditableSchema } from '../../../schemas/editable'
import type { PocketClusterStitchLineSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type PocketClusterStitchLineSettingsSectionProps = {
  editable: EditableSchema<PocketClusterStitchLineSchema>
  issues: ValidationIssuesSchema<PocketClusterStitchLineSchema>
  onChange: (updated: EditableSchema<PocketClusterStitchLineSchema>) => void
}

export const PocketClusterStitchLineSettingsSection = ({
  editable,
  issues,
  onChange,
}: PocketClusterStitchLineSettingsSectionProps): ReactNode => {
  const t = useTranslation()
  const handleEnabledChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => {
      onChange({ ...editable, enabled: details.checked })
    },
    [editable, onChange],
  )
  const handleStartOffsetChange = useCallback(
    (startOffset: string): void => {
      onChange({ ...editable, startOffset })
    },
    [editable, onChange],
  )
  const handleEndOffsetChange = useCallback(
    (endOffset: string): void => {
      onChange({ ...editable, endOffset })
    },
    [editable, onChange],
  )
  const handleStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => {
      onChange({ ...editable, stitchDirection: details.checked ? 'start-to-end' : 'end-to-start' })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.stitchLine.editor.pocketStitch.title()}</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.pocketStitch.enabled()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Switch.Root checked={editable.enabled} onCheckedChange={handleEnabledChange} size="sm">
          <Switch.HiddenInput aria-label={t.stitchLine.editor.pocketStitch.enableAccessibility()} />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.pocketStitch.startOffset()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.startOffset} onChange={handleStartOffsetChange} step={1} unit="mm" value={editable.startOffset} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.pocketStitch.endOffset()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.endOffset} onChange={handleEndOffsetChange} step={1} unit="mm" value={editable.endOffset} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.direction()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Switch.Root
          checked={editable.stitchDirection === 'start-to-end'}
          onCheckedChange={handleStitchDirectionChange}
          size="sm"
        >
          <Switch.HiddenInput aria-label={t.stitchLine.editor.pocketStitch.directionAccessibility()} />
          <Switch.Control bg="bg.emphasized" _checked={{ bg: 'bg.emphasized' }}>
            <Switch.Thumb bg="bg.panel" _checked={{ bg: 'bg.panel' }}>
              <Switch.ThumbIndicator fallback={<PiArrowLeft />}>
                <PiArrowRight />
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Root>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
