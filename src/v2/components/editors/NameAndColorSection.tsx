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
import { converter, formatHex } from 'culori'
import { useCallback, useMemo, type ChangeEvent, type ReactNode } from 'react'

import { BaseComponentSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type ColorPickerColor = NonNullable<ColorPickerProps['color']>

type NameAndColorSectionProps<T> = {
  editable: T
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
  editable,
  onChange,
}: NameAndColorSectionProps<T>): ReactNode {
  const styles = useStyles()

  const hsvColor = useMemo<ColorPickerColor>(() => {
    const { h, s, v, alpha } = converter('hsv')(editable.color)!
    return { h: h!, s, v, a: alpha }
  }, [editable.color])

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...editable,
        name: event.target.value,
      })
    },
    [editable, onChange],
  )

  const handleColorChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ColorPickerProps['onColorChange']>>[1]) => {
      onChange({
        ...editable,
        color: formatHex({
          mode: 'hsv',
          ...data.color,
        }),
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Név">
          <Input onChange={handleNameChange} size="small" value={editable.name} />
        </EditorFieldRow>

        <EditorFieldRow label="Szín">
          <Popover positioning="below-end">
            <PopoverTrigger disableButtonEnhancement>
              <Button
                aria-label="Szín kiválasztása"
                className={styles.colorTrigger}
                icon={<span className={styles.colorPreview} style={{ backgroundColor: editable.color }} />}
                size="small"
              >
                {editable.color}
              </Button>
            </PopoverTrigger>
            <PopoverSurface className={styles.colorPopoverSurface}>
              <ColorPicker color={hsvColor} onColorChange={handleColorChange}>
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
