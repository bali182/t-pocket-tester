import {
  SpinButton,
  Toolbar,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  type SpinButtonOnChangeData,
  type ToolbarProps,
} from '@fluentui/react-components'
import { useCallback, type FC } from 'react'
import { PiCaretDown, PiCaretLeft, PiCaretRight, PiCaretUp } from 'react-icons/pi'

import { SIZE_STEP } from '../../constants/editor'
import type { PocketClusterSchema, PocketOrientation } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { getSpinButtonNumberValue } from './getSpinButtonNumberValue'

type PocketClusterSettingsSectionProps = {
  component: PocketClusterSchema
  onChange: (updated: PocketClusterSchema) => void
}

const minPocketCount = 1
const minSize = 0

const isValidPocketCount = (value: number): boolean => {
  return Number.isInteger(value) && value >= minPocketCount
}

const isValidSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minSize
}

export const PocketClusterSettingsSection: FC<PocketClusterSettingsSectionProps> = ({ component, onChange }) => {
  const handleOrientationChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const orientation = data.checkedItems[0] as PocketOrientation | undefined

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
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const pocketCount = getSpinButtonNumberValue(data)

      if (pocketCount === undefined || !isValidPocketCount(pocketCount)) {
        return
      }

      onChange({
        ...component,
        pocketCount,
      })
    },
    [component, onChange],
  )

  const handlePocketStepChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const pocketStep = getSpinButtonNumberValue(data)

      if (pocketStep === undefined || !isValidSize(pocketStep)) {
        return
      }

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
          <SpinButton
            min={minPocketCount}
            onChange={handlePocketCountChange}
            size="small"
            step={1}
            value={component.pocketCount}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Zseb lépés">
          <SpinButton
            min={minSize}
            onChange={handlePocketStepChange}
            size="small"
            step={SIZE_STEP}
            value={component.pocketStep}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
