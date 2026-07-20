import { useCallback, type ReactNode } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { StitchLineCommonConfigSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { ColorInput } from '../../common/ColorInput'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type StitchingSettingsSectionProps<T extends StitchLineCommonConfigSchema> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const StitchingSettingsSection = <T extends StitchLineCommonConfigSchema>({
  editable,
  issues,
  onChange,
}: StitchingSettingsSectionProps<T>): ReactNode => {
  const t = useTranslation()
  const handleStitchHoleColorChange = useCallback(
    (stitchHoleColor: string): void => {
      onChange({ ...editable, stitchHoleColor })
    },
    [editable, onChange],
  )
  const handleStitchLineColorChange = useCallback(
    (stitchLineColor: string): void => {
      onChange({ ...editable, stitchLineColor })
    },
    [editable, onChange],
  )
  const handleStitchMarginChange = useCallback(
    (stitchMargin: string): void => {
      onChange({ ...editable, stitchMargin })
    },
    [editable, onChange],
  )
  const handleStitchHoleLengthChange = useCallback(
    (stitchHoleLength: string): void => {
      onChange({ ...editable, stitchHoleLength })
    },
    [editable, onChange],
  )
  const handleStitchHoleDistanceChange = useCallback(
    (stitchHoleDistance: string): void => {
      onChange({ ...editable, stitchHoleDistance })
    },
    [editable, onChange],
  )
  const handleStitchHoleThicknessChange = useCallback(
    (stitchHoleThickness: string): void => {
      onChange({ ...editable, stitchHoleThickness })
    },
    [editable, onChange],
  )
  const handleStitchLineThicknessChange = useCallback(
    (stitchLineThickness: string): void => {
      onChange({ ...editable, stitchLineThickness })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.stitchLine.editor.stitching.title}</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeColor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput issue={issues.stitchHoleColor} onChange={handleStitchHoleColorChange} value={editable.stitchHoleColor} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.lineColor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput issue={issues.stitchLineColor} onChange={handleStitchLineColorChange} value={editable.stitchLineColor} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.margin}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.stitchMargin} onChange={handleStitchMarginChange} step={1} unit="mm" value={editable.stitchMargin} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeLength}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleLength}
          onChange={handleStitchHoleLengthChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleLength}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeDistance}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleDistance}
          onChange={handleStitchHoleDistanceChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleDistance}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.holeThickness}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleThickness}
          onChange={handleStitchHoleThicknessChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleThickness}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.stitchLine.editor.stitching.lineThickness}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchLineThickness}
          onChange={handleStitchLineThicknessChange}
          step={1}
          unit="mm"
          value={editable.stitchLineThickness}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
