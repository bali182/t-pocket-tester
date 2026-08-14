import { Switch } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type { EditableSchema } from '../../../schemas/editable'
import type {
  MagicFixComponentBoundsStitchLineConfigSchema,
  MagicFixNumericRangeSchema,
} from '../../../schemas/magicFixConfig'
import { useTranslation } from '../../../translations/translation'
import { validateMagicFixComponentBoundsStitchLineConfig } from '../../../validators/validateMagicFixConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

type MagicFixComponentBoundsStitchLineConfigEditorProps = {
  config: MagicFixComponentBoundsStitchLineConfigSchema
  onChange: (config: MagicFixComponentBoundsStitchLineConfigSchema) => void
}

export const MagicFixComponentBoundsStitchLineConfigEditor: FC<MagicFixComponentBoundsStitchLineConfigEditorProps> = ({
  config,
  onChange,
}) => {
  const t = useTranslation()
  const { editableConfig, setConfig, validationIssues } = useEditableMagicFixConfigEntry({
    config,
    onChange,
    validate: validateMagicFixComponentBoundsStitchLineConfig,
  })
  const handleTopStartOffsetRangeChange = useCallback(
    (topStartOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, topStartOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleTopEndOffsetRangeChange = useCallback(
    (topEndOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, topEndOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleRightStartOffsetRangeChange = useCallback(
    (rightStartOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, rightStartOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleRightEndOffsetRangeChange = useCallback(
    (rightEndOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, rightEndOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleBottomStartOffsetRangeChange = useCallback(
    (bottomStartOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, bottomStartOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleBottomEndOffsetRangeChange = useCallback(
    (bottomEndOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, bottomEndOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleLeftStartOffsetRangeChange = useCallback(
    (leftStartOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, leftStartOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleLeftEndOffsetRangeChange = useCallback(
    (leftEndOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, leftEndOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleCanFlipBottomStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      setConfig({ ...editableConfig, canFlipBottomStitchDirection: details.checked }),
    [editableConfig, setConfig],
  )
  const handleCanFlipLeftStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      setConfig({ ...editableConfig, canFlipLeftStitchDirection: details.checked }),
    [editableConfig, setConfig],
  )
  const handleCanFlipRightStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      setConfig({ ...editableConfig, canFlipRightStitchDirection: details.checked }),
    [editableConfig, setConfig],
  )
  const handleCanFlipTopStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      setConfig({ ...editableConfig, canFlipTopStitchDirection: details.checked }),
    [editableConfig, setConfig],
  )

  return (
    <SectionGroup.Root>
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.offset}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.topStart}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.topStartOffsetRange.maxDecrease, validationIssues.topStartOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.topStartOffsetRange}
            onChange={handleTopStartOffsetRangeChange}
            value={editableConfig.topStartOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.advanced.labels.topEnd}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.topEndOffsetRange.maxDecrease, validationIssues.topEndOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.topEndOffsetRange}
            onChange={handleTopEndOffsetRangeChange}
            value={editableConfig.topEndOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.rightStart}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[
            validationIssues.rightStartOffsetRange.maxDecrease,
            validationIssues.rightStartOffsetRange.maxIncrease,
          ]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.rightStartOffsetRange}
            onChange={handleRightStartOffsetRangeChange}
            value={editableConfig.rightStartOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.rightEnd}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.rightEndOffsetRange.maxDecrease, validationIssues.rightEndOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.rightEndOffsetRange}
            onChange={handleRightEndOffsetRangeChange}
            value={editableConfig.rightEndOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.bottomStart}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[
            validationIssues.bottomStartOffsetRange.maxDecrease,
            validationIssues.bottomStartOffsetRange.maxIncrease,
          ]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.bottomStartOffsetRange}
            onChange={handleBottomStartOffsetRangeChange}
            value={editableConfig.bottomStartOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.bottomEnd}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.bottomEndOffsetRange.maxDecrease, validationIssues.bottomEndOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.bottomEndOffsetRange}
            onChange={handleBottomEndOffsetRangeChange}
            value={editableConfig.bottomEndOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.leftStart}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.leftStartOffsetRange.maxDecrease, validationIssues.leftStartOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.leftStartOffsetRange}
            onChange={handleLeftStartOffsetRangeChange}
            value={editableConfig.leftStartOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.leftEnd}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.leftEndOffsetRange.maxDecrease, validationIssues.leftEndOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.leftEndOffsetRange}
            onChange={handleLeftEndOffsetRangeChange}
            value={editableConfig.leftEndOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
      </SectionGroup.Section>
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.flip}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>{t.common.directions.bottom}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root
            checked={editableConfig.canFlipBottomStitchDirection}
            onCheckedChange={handleCanFlipBottomStitchDirectionChange}
            size="sm"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.common.directions.left}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root
            checked={editableConfig.canFlipLeftStitchDirection}
            onCheckedChange={handleCanFlipLeftStitchDirectionChange}
            size="sm"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.common.directions.right}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root
            checked={editableConfig.canFlipRightStitchDirection}
            onCheckedChange={handleCanFlipRightStitchDirectionChange}
            size="sm"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.common.directions.top}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root
            checked={editableConfig.canFlipTopStitchDirection}
            onCheckedChange={handleCanFlipTopStitchDirectionChange}
            size="sm"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </SectionGroup.SectionRowEditor>
      </SectionGroup.Section>
    </SectionGroup.Root>
  )
}
