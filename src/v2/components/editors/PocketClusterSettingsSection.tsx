import { Toolbar, ToolbarRadioButton, ToolbarRadioGroup, type ToolbarProps } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'
import { PiCaretDown, PiCaretLeft, PiCaretRight, PiCaretUp } from 'react-icons/pi'

import type { PocketClusterSchema, PocketOrientationSchema } from '../../schemas/components'
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
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const orientation = data.checkedItems[0] as PocketOrientationSchema | undefined

      if (!orientation) {
        return
      }

      onChange({
        ...editable,
        orientation,
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
          <Toolbar
            checkedValues={{ orientation: [editable.orientation] }}
            onCheckedValueChange={handleOrientationChange}
            size="small"
          >
            <ToolbarRadioGroup>
              <ToolbarRadioButton aria-label="Felülről" icon={<PiCaretDown />} name="orientation" value="up" />
              <ToolbarRadioButton aria-label="Alulról" icon={<PiCaretUp />} name="orientation" value="down" />
              <ToolbarRadioButton aria-label="Balról" icon={<PiCaretRight />} name="orientation" value="left" />
              <ToolbarRadioButton aria-label="Jobbról" icon={<PiCaretLeft />} name="orientation" value="right" />
            </ToolbarRadioGroup>
          </Toolbar>
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
