import { Grid, Select, Stack, createListCollection } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'

import type { CornerRadiusSchema, HasCornerRadiusSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { IssueSchema, ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
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

type CornerRadiusMode = 'common' | 'custom'

const cornerRadiusModeItems: { label: string; value: CornerRadiusMode }[] = [
  { label: 'Közös', value: 'common' },
  { label: 'Egyedi', value: 'custom' },
]

const cornerRadiusModeCollection = createListCollection({
  items: cornerRadiusModeItems,
})

export function CornerRadiusSection<T extends HasCornerRadiusSchema>({
  editable,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const commonRadius = getCommonRadius(editable.radius)
  const customRadius = getCustomRadius(editable.radius)

  const handleModeChange = useCallback(
    (details: Select.ValueChangeDetails) => {
      const nextMode = details.value[0]

      if (!isDefined(nextMode)) {
        return
      }

      if (nextMode === 'common') {
        if (typeof editable.radius === 'string') {
          return
        }
        onChange({
          ...editable,
          radius: editable.radius.topLeft,
        })
        return
      }

      if (nextMode === 'custom' && typeof editable.radius !== 'string') {
        return
      }

      if (nextMode === 'custom') {
        onChange({
          ...editable,
          radius: getCustomRadius(editable.radius),
        })
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
          <Stack gap="1" minWidth="0">
            <Select.Root
              collection={cornerRadiusModeCollection}
              onValueChange={handleModeChange}
              size="xs"
              value={[typeof editable.radius === 'string' ? 'common' : 'custom']}
              width="100%"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {cornerRadiusModeCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>

            {typeof editable.radius === 'string' ? (
              <NumberInput
                issue={commonIssue}
                onChange={handleCommonRadiusChange}
                step={1}
                unit="mm"
                value={commonRadius}
              />
            ) : (
              <Grid columnGap="1" gridTemplateColumns="repeat(4, minmax(0, 1fr))" minWidth="0">
                <NumberInput
                  issue={customIssues.topLeft}
                  onChange={handleCustomRadiusChange('topLeft')}
                  step={1}
                  value={customRadius.topLeft}
                />
                <NumberInput
                  issue={customIssues.topRight}
                  onChange={handleCustomRadiusChange('topRight')}
                  step={1}
                  value={customRadius.topRight}
                />
                <NumberInput
                  issue={customIssues.bottomRight}
                  onChange={handleCustomRadiusChange('bottomRight')}
                  step={1}
                  value={customRadius.bottomRight}
                />
                <NumberInput
                  issue={customIssues.bottomLeft}
                  onChange={handleCustomRadiusChange('bottomLeft')}
                  step={1}
                  value={customRadius.bottomLeft}
                />
              </Grid>
            )}
          </Stack>
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
