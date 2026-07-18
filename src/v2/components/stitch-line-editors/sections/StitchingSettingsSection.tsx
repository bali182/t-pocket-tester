import { useCallback, type ReactNode } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { StitchLineSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { ColorInput } from '../../common/ColorInput'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type StitchingSettingsSectionProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const StitchingSettingsSection = ({ editable, issues, onChange }: StitchingSettingsSectionProps): ReactNode => {
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
      <SectionGroup.SectionHeader>Varrás</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>Lyuk színe</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput issue={issues.stitchHoleColor} onChange={handleStitchHoleColorChange} value={editable.stitchHoleColor} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Vonal színe</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput issue={issues.stitchLineColor} onChange={handleStitchLineColorChange} value={editable.stitchLineColor} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Margó</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput issue={issues.stitchMargin} onChange={handleStitchMarginChange} step={1} unit="mm" value={editable.stitchMargin} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Lyuk hossza</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleLength}
          onChange={handleStitchHoleLengthChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleLength}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Lyuktávolság</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleDistance}
          onChange={handleStitchHoleDistanceChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleDistance}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Lyuk vastagsága</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.stitchHoleThickness}
          onChange={handleStitchHoleThicknessChange}
          step={1}
          unit="mm"
          value={editable.stitchHoleThickness}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Vonal vastagsága</SectionGroup.SectionRowTitle>
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
