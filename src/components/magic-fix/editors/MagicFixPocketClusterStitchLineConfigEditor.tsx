import { Switch } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import { useEditableMagicFixConfigEntry } from '../../../hooks/useEditableMagicFixConfigEntry'
import type { EditableSchema } from '../../../schemas/editable'
import type {
  MagicFixNumericRangeSchema,
  MagicFixPocketClusterStitchLineConfigSchema,
} from '../../../schemas/magicFixConfig'
import { useTranslation } from '../../../translations/translation'
import { validateMagicFixPocketClusterStitchLineConfig } from '../../../validators/validateMagicFixConfig'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

type MagicFixPocketClusterStitchLineConfigEditorProps = {
  config: MagicFixPocketClusterStitchLineConfigSchema
  onChange: (config: MagicFixPocketClusterStitchLineConfigSchema) => void
}

export const MagicFixPocketClusterStitchLineConfigEditor: FC<MagicFixPocketClusterStitchLineConfigEditorProps> = ({
  config,
  onChange,
}) => {
  const t = useTranslation()
  const { editableConfig, setConfig, validationIssues } = useEditableMagicFixConfigEntry({
    config,
    onChange,
    validate: validateMagicFixPocketClusterStitchLineConfig,
  })
  const handleCanFlipStitchDirectionChange = useCallback(
    (details: Switch.CheckedChangeDetails): void =>
      setConfig({ ...editableConfig, canFlipStitchDirection: details.checked }),
    [editableConfig, setConfig],
  )
  const handleStartOffsetRangeChange = useCallback(
    (startOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, startOffsetRange }),
    [editableConfig, setConfig],
  )
  const handleEndOffsetRangeChange = useCallback(
    (endOffsetRange: EditableSchema<MagicFixNumericRangeSchema>): void =>
      setConfig({ ...editableConfig, endOffsetRange }),
    [editableConfig, setConfig],
  )

  return (
    <SectionGroup.Root>
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.offset}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.advanced.labels.start}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.startOffsetRange.maxDecrease, validationIssues.startOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.startOffsetRange}
            onChange={handleStartOffsetRangeChange}
            value={editableConfig.startOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
        <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.advanced.labels.end}</SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor
          issue={[validationIssues.endOffsetRange.maxDecrease, validationIssues.endOffsetRange.maxIncrease]}
        >
          <MagicFixNumericRangeEditor
            issues={validationIssues.endOffsetRange}
            onChange={handleEndOffsetRangeChange}
            value={editableConfig.endOffsetRange}
          />
        </SectionGroup.SectionRowEditor>
      </SectionGroup.Section>
      <SectionGroup.Section>
        <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.flip}</SectionGroup.SectionHeader>
        <SectionGroup.SectionRowTitle>
          {t.magicFix.dialog.settings.advanced.labels.canFlipStitchDirection}
        </SectionGroup.SectionRowTitle>
        <SectionGroup.SectionRowEditor>
          <Switch.Root
            checked={editableConfig.canFlipStitchDirection}
            onCheckedChange={handleCanFlipStitchDirectionChange}
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
