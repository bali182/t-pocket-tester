import { Grid, Switch } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import { TbRadiusBottomLeft, TbRadiusBottomRight, TbRadiusTopLeft, TbRadiusTopRight } from 'react-icons/tb'

import type { HasCornerRadiusSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
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

type IndividualRadiusKey = 'topLeftRadius' | 'topRightRadius' | 'bottomRightRadius' | 'bottomLeftRadius'

export function CornerRadiusSection<T extends HasCornerRadiusSchema>({
  editable,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const handleIndividualRadiiChange = useCallback(
    (details: Switch.CheckedChangeDetails) => {
      onChange({
        ...editable,
        individualRadii: details.checked,
      })
    },
    [editable, onChange],
  )

  const handleBorderRadiusChange = useCallback(
    (borderRadius: string) => {
      onChange({
        ...editable,
        borderRadius,
      })
    },
    [editable, onChange],
  )

  const handleIndividualRadiusChange = useCallback(
    (key: IndividualRadiusKey) => (radius: string) => {
      onChange({
        ...editable,
        [key]: radius,
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Típus">
          <Switch.Root checked={editable.individualRadii} onCheckedChange={handleIndividualRadiiChange} size="md">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>{editable.individualRadii ? 'Egyedi lekerekítések' : 'Egységes lekerekítés'}</Switch.Label>
          </Switch.Root>
        </EditorFieldRow>

        {!editable.individualRadii && (
          <EditorFieldRow label="Lekerekítés">
            <NumberInput
              issue={issues.borderRadius}
              onChange={handleBorderRadiusChange}
              step={1}
              unit="mm"
              value={editable.borderRadius}
            />
          </EditorFieldRow>
        )}

        {editable.individualRadii && (
          <EditorFieldRow label="Lekerekítés">
            <Grid columnGap="1" gridTemplateColumns="repeat(2, minmax(0, 1fr))" minWidth="0" rowGap="1">
              <NumberInput
                issue={issues.topLeftRadius}
                onChange={handleIndividualRadiusChange('topLeftRadius')}
                startAddon={<TbRadiusTopLeft />}
                step={1}
                unit="mm"
                value={editable.topLeftRadius}
              />
              <NumberInput
                issue={issues.topRightRadius}
                onChange={handleIndividualRadiusChange('topRightRadius')}
                startAddon={<TbRadiusTopRight />}
                step={1}
                unit="mm"
                value={editable.topRightRadius}
              />
              <NumberInput
                issue={issues.bottomLeftRadius}
                onChange={handleIndividualRadiusChange('bottomLeftRadius')}
                startAddon={<TbRadiusBottomLeft />}
                step={1}
                unit="mm"
                value={editable.bottomLeftRadius}
              />
              <NumberInput
                issue={issues.bottomRightRadius}
                onChange={handleIndividualRadiusChange('bottomRightRadius')}
                startAddon={<TbRadiusBottomRight />}
                step={1}
                unit="mm"
                value={editable.bottomRightRadius}
              />
            </Grid>
          </EditorFieldRow>
        )}
      </EditorFieldGrid>
    </EditorSection>
  )
}
