import { Dropdown, makeStyles, Option, tokens, type DropdownProps } from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'

import type { CornerRadiusSchema, HasCornerRadiusSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { IssueSchema, ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { NumberInput } from './NumberInput'

type CornerRadiusSectionProps<T extends HasCornerRadiusSchema> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasCornerRadiusSchema>
  onChange: (updated: EditableSchema<T>) => void
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
  root: {
    display: 'grid',
    rowGap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
})

export function CornerRadiusSection<T extends HasCornerRadiusSchema>({
  component,
  editable,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const styles = useStyles()
  const commonRadius = getCommonRadius(editable.radius)
  const customRadius = getCustomRadius(editable.radius)

  const handleModeChange = useCallback<NonNullable<DropdownProps['onOptionSelect']>>(
    (_event, data) => {
      switch (data.optionValue) {
        case 'common':
          if (typeof editable.radius === 'string') {
            return
          }
          onChange({
            ...editable,
            radius: editable.radius.topLeft,
          })
          return
        case 'custom':
          if (typeof editable.radius !== 'string') {
            return
          }
          onChange({
            ...editable,
            radius: getCustomRadius(editable.radius),
          })
          return
      }
    },
    [editable, onChange],
  )

  const handleCommonRadiusChange = useCallback(
    (radius: string) => {
      onChange({
        ...editable,
        radius,
      })
    },
    [editable, onChange],
  )

  const handleCustomRadiusChange = useCallback(
    (key: keyof CornerRadiusSchema) => (radius: string) => {
      onChange({
        ...editable,
        radius: {
          ...customRadius,
          [key]: radius,
        },
      })
    },
    [editable, customRadius, onChange],
  )

  const commonIssue = issues.radius as IssueSchema | undefined
  const customIssues = issues.radius as ValidationIssuesSchema<CornerRadiusSchema>

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Rádiusz">
          <div className={styles.root}>
            <Dropdown
              className={styles.dropdown}
              onOptionSelect={handleModeChange}
              selectedOptions={[typeof editable.radius === 'string' ? 'common' : 'custom']}
              size="small"
              value={typeof editable.radius === 'string' ? 'Közös' : 'Egyedi'}
            >
              <Option value="common">Közös</Option>
              <Option value="custom">Egyedi</Option>
            </Dropdown>

            {typeof editable.radius === 'string' ? (
              <NumberInput
                issue={commonIssue}
                lastValidValue={typeof component.radius === 'number' ? component.radius : undefined}
                onChange={handleCommonRadiusChange}
                step={1}
                unit="mm"
                value={commonRadius}
              />
            ) : (
              <div className={styles.customInputs}>
                <NumberInput
                  issue={customIssues.topLeft}
                  lastValidValue={typeof component.radius === 'object' ? component.radius.topLeft : undefined}
                  onChange={handleCustomRadiusChange('topLeft')}
                  step={1}
                  unit="mm"
                  value={customRadius.topLeft}
                />
                <NumberInput
                  issue={customIssues.topRight}
                  lastValidValue={typeof component.radius === 'object' ? component.radius.topRight : undefined}
                  onChange={handleCustomRadiusChange('topRight')}
                  step={1}
                  unit="mm"
                  value={customRadius.topRight}
                />
                <NumberInput
                  issue={customIssues.bottomRight}
                  lastValidValue={typeof component.radius === 'object' ? component.radius.bottomRight : undefined}
                  onChange={handleCustomRadiusChange('bottomRight')}
                  step={1}
                  unit="mm"
                  value={customRadius.bottomRight}
                />
                <NumberInput
                  issue={customIssues.bottomLeft}
                  lastValidValue={typeof component.radius === 'object' ? component.radius.bottomLeft : undefined}
                  onChange={handleCustomRadiusChange('bottomLeft')}
                  step={1}
                  unit="mm"
                  value={customRadius.bottomLeft}
                />
              </div>
            )}
          </div>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}

const getCommonRadius = (radius: EditableSchema<number | CornerRadiusSchema>): string => {
  return typeof radius === 'string' ? radius : radius.topLeft
}

const getCustomRadius = (radius: EditableSchema<number | CornerRadiusSchema>): EditableSchema<CornerRadiusSchema> => {
  if (typeof radius === 'string') {
    return {
      bottomLeft: radius,
      bottomRight: radius,
      topLeft: radius,
      topRight: radius,
    }
  }

  return radius
}
