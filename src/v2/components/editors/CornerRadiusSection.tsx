import {
  Dropdown,
  Input,
  makeStyles,
  Option,
  tokens,
  type DropdownProps,
  type InputOnChangeData,
} from '@fluentui/react-components'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'
import { TbRadiusBottomLeft, TbRadiusBottomRight, TbRadiusTopLeft, TbRadiusTopRight } from 'react-icons/tb'

import type { CornerRadius, HasCornerRadius } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type CornerRadiusSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

const useStyles = makeStyles({
  customInputs: {
    columnGap: tokens.spacingHorizontalXS,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    minWidth: 0,
  },
  dropdown: {
    minWidth: 0,
    width: '100%',
  },
  input: {
    minWidth: 0,
    width: '100%',
  },
  root: {
    display: 'grid',
    rowGap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
})

const isValidRadius = (value: number): boolean => {
  return Number.isFinite(value) && value >= 0
}

const parseRadius = (value: string): number | undefined => {
  const radius = Number(value.replace(',', '.'))

  return isValidRadius(radius) ? radius : undefined
}

const getCommonRadius = (radius: number | CornerRadius): number => {
  return typeof radius === 'number' ? radius : radius.topLeft
}

const getCustomRadius = (radius: number | CornerRadius): CornerRadius => {
  if (typeof radius === 'number') {
    return {
      topLeft: radius,
      topRight: radius,
      bottomRight: radius,
      bottomLeft: radius,
    }
  }

  return radius
}

export function CornerRadiusSection<T extends HasCornerRadius>({
  component,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const styles = useStyles()
  const commonRadius = getCommonRadius(component.radius)
  const customRadius = getCustomRadius(component.radius)

  const handleModeChange = useCallback<NonNullable<DropdownProps['onOptionSelect']>>(
    (_event, data) => {
      switch (data.optionValue) {
        case 'common':
          if (typeof component.radius === 'number') {
            return
          }
          onChange({
            ...component,
            radius: component.radius.topLeft,
          })
          return
        case 'custom':
          if (typeof component.radius !== 'number') {
            return
          }
          onChange({
            ...component,
            radius: getCustomRadius(component.radius),
          })
          return
      }
    },
    [component, onChange],
  )

  const handleCommonRadiusChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, _data: InputOnChangeData) => {
      const radius = parseRadius(event.currentTarget.value)

      if (radius === undefined) {
        return
      }

      onChange({
        ...component,
        radius,
      })
    },
    [component, onChange],
  )

  const handleCustomRadiusChange = useCallback(
    (key: keyof CornerRadius) => (event: ChangeEvent<HTMLInputElement>, _data: InputOnChangeData) => {
      const radius = parseRadius(event.currentTarget.value)

      if (radius === undefined) {
        return
      }

      onChange({
        ...component,
        radius: {
          ...customRadius,
          [key]: radius,
        },
      })
    },
    [component, customRadius, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Rádiusz">
          <div className={styles.root}>
            <Dropdown
              className={styles.dropdown}
              onOptionSelect={handleModeChange}
              selectedOptions={[typeof component.radius === 'number' ? 'common' : 'custom']}
              size="small"
              value={typeof component.radius === 'number' ? 'Közös' : 'Egyedi'}
            >
              <Option value="common">Közös</Option>
              <Option value="custom">Egyedi</Option>
            </Dropdown>

            {typeof component.radius === 'number' ? (
              <Input
                className={styles.input}
                onChange={handleCommonRadiusChange}
                size="small"
                value={String(commonRadius)}
              />
            ) : (
              <div className={styles.customInputs}>
                <Input
                  className={styles.input}
                  contentBefore={<TbRadiusTopLeft />}
                  onChange={handleCustomRadiusChange('topLeft')}
                  size="small"
                  value={String(customRadius.topLeft)}
                />
                <Input
                  className={styles.input}
                  contentBefore={<TbRadiusTopRight />}
                  onChange={handleCustomRadiusChange('topRight')}
                  size="small"
                  value={String(customRadius.topRight)}
                />
                <Input
                  className={styles.input}
                  contentBefore={<TbRadiusBottomRight />}
                  onChange={handleCustomRadiusChange('bottomRight')}
                  size="small"
                  value={String(customRadius.bottomRight)}
                />
                <Input
                  className={styles.input}
                  contentBefore={<TbRadiusBottomLeft />}
                  onChange={handleCustomRadiusChange('bottomLeft')}
                  size="small"
                  value={String(customRadius.bottomLeft)}
                />
              </div>
            )}
          </div>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
