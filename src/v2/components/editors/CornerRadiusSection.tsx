import { Input } from '@chakra-ui/react'
import { Dropdown, makeStyles, Option, tokens, type DropdownProps } from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'

import type { CornerRadiusSchema, HasCornerRadiusSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { IssueSchema, ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type CornerRadiusSectionProps<T> = {
  component: T
  issues: ValidationIssuesSchema<HasCornerRadiusSchema>
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

export function CornerRadiusSection<T extends EditableSchema<HasCornerRadiusSchema>>({
  component,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const styles = useStyles()
  const commonRadius = getCommonRadius(component.radius)
  const customRadius = getCustomRadius(component.radius)

  const handleModeChange = useCallback<NonNullable<DropdownProps['onOptionSelect']>>(
    (_event, data) => {
      switch (data.optionValue) {
        case 'common':
          if (typeof component.radius === 'string') {
            return
          }
          onChange({
            ...component,
            radius: component.radius.topLeft,
          })
          return
        case 'custom':
          if (typeof component.radius !== 'string') {
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
    (radius: string) => {
      onChange({
        ...component,
        radius,
      })
    },
    [component, onChange],
  )

  const handleCustomRadiusChange = useCallback(
    (key: keyof CornerRadiusSchema) => (radius: string) => {
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
              selectedOptions={[typeof component.radius === 'string' ? 'common' : 'custom']}
              size="small"
              value={typeof component.radius === 'string' ? 'Közös' : 'Egyedi'}
            >
              <Option value="common">Közös</Option>
              <Option value="custom">Egyedi</Option>
            </Dropdown>

            {typeof component.radius === 'string' ? (
              <Input
                className={styles.input}
                inputMode="decimal"
                aria-invalid={isDefined(commonIssue) && commonIssue.severity === 'error'}
                onChange={(event) => handleCommonRadiusChange(event.currentTarget.value)}
                type="text"
                value={commonRadius}
              />
            ) : (
              <div className={styles.customInputs}>
                <Input
                  className={styles.input}
                  inputMode="decimal"
                  aria-invalid={isDefined(customIssues.topLeft) && customIssues.topLeft.severity === 'error'}
                  onChange={(event) => handleCustomRadiusChange('topLeft')(event.currentTarget.value)}
                  type="text"
                  value={customRadius.topLeft}
                />
                <Input
                  className={styles.input}
                  inputMode="decimal"
                  aria-invalid={isDefined(customIssues.topRight) && customIssues.topRight.severity === 'error'}
                  onChange={(event) => handleCustomRadiusChange('topRight')(event.currentTarget.value)}
                  type="text"
                  value={customRadius.topRight}
                />
                <Input
                  className={styles.input}
                  inputMode="decimal"
                  aria-invalid={isDefined(customIssues.bottomRight) && customIssues.bottomRight.severity === 'error'}
                  onChange={(event) => handleCustomRadiusChange('bottomRight')(event.currentTarget.value)}
                  type="text"
                  value={customRadius.bottomRight}
                />
                <Input
                  className={styles.input}
                  inputMode="decimal"
                  aria-invalid={isDefined(customIssues.bottomLeft) && customIssues.bottomLeft.severity === 'error'}
                  onChange={(event) => handleCustomRadiusChange('bottomLeft')(event.currentTarget.value)}
                  type="text"
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
