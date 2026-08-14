import { Switch } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixHasAutoDimensionsConfigSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'

export type AutoDimensionsSectionProps<T extends MagicFixHasAutoDimensionsConfigSchema> = {
  config: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const AutoDimensionsSection = <T extends MagicFixHasAutoDimensionsConfigSchema>({
  editable,
  issues: _issues,
  onChange,
}: AutoDimensionsSectionProps<T>): ReturnType<FC> => {
  const t = useTranslation()
  const handleCanConvertToFixedHeightChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => onChange({ ...editable, canConvertToFixedHeight: details.checked }),
    [editable, onChange],
  )
  const handleCanConvertToFixedWidthChange = useCallback(
    (details: Switch.CheckedChangeDetails): void => onChange({ ...editable, canConvertToFixedWidth: details.checked }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>
        {t.magicFix.dialog.settings.advanced.sections.autoDimensions}
      </SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.canConvertToFixedHeight}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Switch.Root
          checked={editable.canConvertToFixedHeight}
          onCheckedChange={handleCanConvertToFixedHeightChange}
          size="sm"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.canConvertToFixedWidth}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Switch.Root
          checked={editable.canConvertToFixedWidth}
          onCheckedChange={handleCanConvertToFixedWidthChange}
          size="sm"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
