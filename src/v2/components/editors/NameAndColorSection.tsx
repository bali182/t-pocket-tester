import {
  Button,
  ColorArea,
  ColorPicker,
  ColorSlider,
  Input,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
  type ColorPickerProps,
} from '@fluentui/react-components'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import { BaseComponentSchema } from '../../schemas/components'
import { hexToHsv, hsvToHex } from '../../utils/colorConverters'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type NameAndColorSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

const useStyles = makeStyles({
  colorTrigger: {
    justifyContent: 'start',
    minWidth: 0,
    width: '100%',
  },
  colorPreview: {
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    boxSizing: 'border-box',
    display: 'inline-block',
    flexShrink: 0,
    height: '16px',
    width: '16px',
  },
  colorPopoverSurface: {
    display: 'grid',
    rowGap: tokens.spacingVerticalS,
  },
})

export function NameAndColorSection<T extends BaseComponentSchema>({
  component,
  onChange,
}: NameAndColorSectionProps<T>): ReactNode {
  const styles = useStyles()

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...component,
        name: event.target.value,
      })
    },
    [component, onChange],
  )

  const handleColorChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ColorPickerProps['onColorChange']>>[1]) => {
      onChange({
        ...component,
        color: hsvToHex(data.color),
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Name">
          <Input onChange={handleNameChange} size="small" value={component.name} />
        </EditorFieldRow>

        <EditorFieldRow label="Color">
          <Popover positioning="below-end">
            <PopoverTrigger disableButtonEnhancement>
              <Button
                aria-label="Szín kiválasztása"
                className={styles.colorTrigger}
                icon={<span className={styles.colorPreview} style={{ backgroundColor: component.color }} />}
                size="small"
              >
                {component.color}
              </Button>
            </PopoverTrigger>
            <PopoverSurface className={styles.colorPopoverSurface}>
              <ColorPicker color={hexToHsv(component.color)} onColorChange={handleColorChange}>
                <ColorArea />
                <ColorSlider channel="hue" />
              </ColorPicker>
            </PopoverSurface>
          </Popover>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
