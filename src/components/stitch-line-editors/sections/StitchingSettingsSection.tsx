import { useCallback, type ReactNode } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { StitchLineCommonConfigSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ColorInput } from '../../common/ColorInput'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type StitchingSettingsSectionProps<T extends Partial<StitchLineCommonConfigSchema>> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
  onReset?: (key: keyof StitchLineCommonConfigSchema) => void
  resolvedEditable: EditableSchema<StitchLineCommonConfigSchema> & EditableSchema<T>
}

export const StitchingSettingsSection = <T extends Partial<StitchLineCommonConfigSchema>>({
  editable,
  issues,
  onChange,
  onReset,
  resolvedEditable,
}: StitchingSettingsSectionProps<T>): ReactNode => {
  const t = useTranslation()
  const handleStitchHoleColorChange = useCallback(
    (nextStitchHoleColor: string): void => {
      onChange({ ...editable, stitchHoleColor: nextStitchHoleColor })
    },
    [editable, onChange],
  )
  const handleStitchLineColorChange = useCallback(
    (nextStitchLineColor: string): void => {
      onChange({ ...editable, stitchLineColor: nextStitchLineColor })
    },
    [editable, onChange],
  )
  const handleStitchMarginChange = useCallback(
    (nextStitchMargin: string): void => {
      onChange({ ...editable, stitchMargin: nextStitchMargin })
    },
    [editable, onChange],
  )
  const handleStitchHoleLengthChange = useCallback(
    (nextStitchHoleLength: string): void => {
      onChange({ ...editable, stitchHoleLength: nextStitchHoleLength })
    },
    [editable, onChange],
  )
  const handleStitchHoleDistanceChange = useCallback(
    (nextStitchHoleDistance: string): void => {
      onChange({ ...editable, stitchHoleDistance: nextStitchHoleDistance })
    },
    [editable, onChange],
  )
  const handleStitchHoleThicknessChange = useCallback(
    (nextStitchHoleThickness: string): void => {
      onChange({ ...editable, stitchHoleThickness: nextStitchHoleThickness })
    },
    [editable, onChange],
  )
  const handleStitchLineThicknessChange = useCallback(
    (nextStitchLineThickness: string): void => {
      onChange({ ...editable, stitchLineThickness: nextStitchLineThickness })
    },
    [editable, onChange],
  )
  const handleStitchMarginReset = useCallback((): void => {
    onReset?.('stitchMargin')
  }, [onReset])
  const handleStitchHoleLengthReset = useCallback((): void => {
    onReset?.('stitchHoleLength')
  }, [onReset])
  const handleStitchHoleDistanceReset = useCallback((): void => {
    onReset?.('stitchHoleDistance')
  }, [onReset])
  const handleStitchHoleThicknessReset = useCallback((): void => {
    onReset?.('stitchHoleThickness')
  }, [onReset])
  const handleStitchLineThicknessReset = useCallback((): void => {
    onReset?.('stitchLineThickness')
  }, [onReset])

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.stitchLine.editor.stitching.title}</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeColor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput
          issue={issues.stitchHoleColor}
          onChange={handleStitchHoleColorChange}
          value={resolvedEditable.stitchHoleColor}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.lineColor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput
          issue={issues.stitchLineColor}
          onChange={handleStitchLineColorChange}
          value={resolvedEditable.stitchLineColor}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.margin}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchMargin}
          onChange={handleStitchMarginChange}
          onReset={isDefined(onReset) ? handleStitchMarginReset : undefined}
          isResetEnabled={isDefined(editable.stitchMargin)}
          step={1}
          unit="mm"
          value={resolvedEditable.stitchMargin}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeLength}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleLength}
          onChange={handleStitchHoleLengthChange}
          onReset={isDefined(onReset) ? handleStitchHoleLengthReset : undefined}
          isResetEnabled={isDefined(editable.stitchHoleLength)}
          step={1}
          unit="mm"
          value={resolvedEditable.stitchHoleLength}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeDistance}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleDistance}
          onChange={handleStitchHoleDistanceChange}
          onReset={isDefined(onReset) ? handleStitchHoleDistanceReset : undefined}
          isResetEnabled={isDefined(editable.stitchHoleDistance)}
          step={1}
          unit="mm"
          value={resolvedEditable.stitchHoleDistance}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeThickness}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleThickness}
          onChange={handleStitchHoleThicknessChange}
          onReset={isDefined(onReset) ? handleStitchHoleThicknessReset : undefined}
          isResetEnabled={isDefined(editable.stitchHoleThickness)}
          step={1}
          unit="mm"
          value={resolvedEditable.stitchHoleThickness}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.lineThickness}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchLineThickness}
          onChange={handleStitchLineThicknessChange}
          onReset={isDefined(onReset) ? handleStitchLineThicknessReset : undefined}
          isResetEnabled={isDefined(editable.stitchLineThickness)}
          step={1}
          unit="mm"
          value={resolvedEditable.stitchLineThickness}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
