import { Grid, SegmentGroup } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import {
  TbRadiusBottomLeft,
  TbRadiusBottomRight,
  TbRadiusTopLeft,
  TbRadiusTopRight,
  TbSquareRounded,
} from 'react-icons/tb'

import { HasCornerRadiusSchema } from '../../../schemas/common'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type CornerRadiusSectionProps<T extends HasCornerRadiusSchema> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasCornerRadiusSchema>
  onChange: (updated: EditableSchema<T>) => void
}

type IndividualRadiusKey = 'topLeftRadius' | 'topRightRadius' | 'bottomRightRadius' | 'bottomLeftRadius'
type RadiusTypeValue = 'individual' | 'uniform'

const RadiusTypeValues: Record<RadiusTypeValue, boolean> = {
  individual: true,
  uniform: false,
}

const RadiusTypes: Record<RadiusTypeValue, RadiusTypeValue> = {
  individual: 'individual',
  uniform: 'uniform',
}

export function CornerRadiusSection<T extends HasCornerRadiusSchema>({
  editable,
  issues,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const t = useTranslation()
  const handleIndividualRadiiChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      const value = details.value as RadiusTypeValue
      onChange({ ...editable, individualRadii: RadiusTypeValues[value] })
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
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.cornerRadius.title}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.cornerRadius.type}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <SegmentGroup.Root
          onValueChange={handleIndividualRadiiChange}
          size="sm"
          value={editable.individualRadii ? RadiusTypes.individual : RadiusTypes.uniform}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.component.editor.cornerRadius.uniform} value={RadiusTypes.uniform}>
            <SegmentGroup.ItemHiddenInput />
            <TbSquareRounded /> {t.component.editor.cornerRadius.uniform}
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.cornerRadius.individual} value={RadiusTypes.individual}>
            <SegmentGroup.ItemHiddenInput />
            <TbRadiusTopLeft /> {t.component.editor.cornerRadius.individual}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      {!editable.individualRadii && (
        <>
          <SectionGroup.SectionRowTitle>{t.component.editor.cornerRadius.uniformMeasure}</SectionGroup.SectionRowTitle>
          <SectionGroup.SectionRowEditor>
            <NumberInput
              issue={issues.borderRadius}
              onChange={handleBorderRadiusChange}
              step={1}
              unit="mm"
              value={editable.borderRadius}
            />
          </SectionGroup.SectionRowEditor>
        </>
      )}

      {editable.individualRadii && (
        <>
          <SectionGroup.SectionRowTitle>
            {t.component.editor.cornerRadius.individualMeasure}
          </SectionGroup.SectionRowTitle>
          <SectionGroup.SectionRowEditor>
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
          </SectionGroup.SectionRowEditor>
        </>
      )}
    </SectionGroup.Section>
  )
}
