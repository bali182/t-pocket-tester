import { Input } from '@chakra-ui/react'
import { Toolbar, ToolbarRadioButton, ToolbarRadioGroup, type ToolbarProps } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'
import { PiCaretDown, PiCaretLeft, PiCaretRight, PiCaretUp } from 'react-icons/pi'

import type { PocketClusterSchema, PocketOrientationSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type PocketClusterSettingsSectionProps = {
  component: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const PocketClusterSettingsSection: FC<PocketClusterSettingsSectionProps> = ({
  component,
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
        ...component,
        orientation,
      })
    },
    [component, onChange],
  )

  const handlePocketCountChange = useCallback(
    (pocketCount: string) => {
      onChange({
        ...component,
        pocketCount,
      })
    },
    [component, onChange],
  )

  const handlePocketStepChange = useCallback(
    (pocketStep: string) => {
      onChange({
        ...component,
        pocketStep,
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Nyílás iránya">
          <Toolbar
            checkedValues={{ orientation: [component.orientation] }}
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
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.pocketCount) && issues.pocketCount.severity === 'error'}
            onChange={(event) => handlePocketCountChange(event.currentTarget.value)}
            type="text"
            value={component.pocketCount}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Zseb lépés">
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.pocketStep) && issues.pocketStep.severity === 'error'}
            onChange={(event) => handlePocketStepChange(event.currentTarget.value)}
            type="text"
            value={component.pocketStep}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
