import { Grid, IconButton, SegmentGroup } from '@chakra-ui/react'
import { useCallback, useMemo, type ReactNode } from 'react'
import {
  TbRadiusBottomLeft,
  TbRadiusBottomRight,
  TbRadiusTopLeft,
  TbRadiusTopRight,
  TbSquareRounded,
} from 'react-icons/tb'

import { PiLink, PiLinkBreak } from 'react-icons/pi'
import { HasCornerRadiusSchema } from '../../../schemas/common'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type CornerRadiusSectionProps<T extends HasCornerRadiusSchema> = {
  value: T
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
  value,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const t = useTranslation()
  const individualRadiusIssues = useMemo(
    () => [issues.topLeftRadius, issues.topRightRadius, issues.bottomLeftRadius, issues.bottomRightRadius],
    [issues.bottomLeftRadius, issues.bottomRightRadius, issues.topLeftRadius, issues.topRightRadius],
  )
  const handleIndividualRadiiChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      const value = details.value as RadiusTypeValue
      onChange({ ...editable, individualRadii: RadiusTypeValues[value] })
    },
    [editable, onChange],
  )

  const handleRadiusTypeChange = useCallback(() => {
    const largestRadius = [value.bottomLeftRadius, value.bottomRightRadius, value.topLeftRadius, value.topRightRadius]
      .reduce((max, radius) => Math.max(max, radius), 0)
      .toString()

    onChange({
      ...editable,
      individualRadii: !editable.individualRadii,
      topLeftRadius: largestRadius,
      topRightRadius: largestRadius,
      bottomLeftRadius: largestRadius,
      bottomRightRadius: largestRadius,
    })
  }, [editable, onChange, value.bottomLeftRadius, value.bottomRightRadius, value.topLeftRadius, value.topRightRadius])

  const handleIndividualRadiusChange = useCallback(
    (key: IndividualRadiusKey) => (radius: string) => {
      if (editable.individualRadii) {
        onChange({
          ...editable,
          [key]: radius,
        })
      } else {
        onChange({
          ...editable,
          topLeftRadius: radius,
          topRightRadius: radius,
          bottomLeftRadius: radius,
          bottomRightRadius: radius,
        })
      }
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader
        rightAddon={
          <IconButton
            onClick={handleRadiusTypeChange}
            size="2xs"
            borderRadius="full"
            variant={editable.individualRadii ? 'subtle' : 'solid'}
          >
            {editable.individualRadii ? <PiLinkBreak /> : <PiLink />}
          </IconButton>
        }
      >
        {t.component.editor.cornerRadius.title}
      </SectionGroup.SectionHeader>
      {/* UI will be useful for auto/manual radius */}
      {false && (
        <>
          <SectionGroup.SectionRowTitle>{t.component.editor.cornerRadius.type}</SectionGroup.SectionRowTitle>
          <SectionGroup.SectionRowEditor issue={issues.individualRadii}>
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
        </>
      )}

      <SectionGroup.SectionRowTitle>{t.component.editor.cornerRadius.individualMeasure}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={individualRadiusIssues}>
        <Grid columnGap="1" gridTemplateColumns="repeat(2, minmax(0, 1fr))" minWidth="0" rowGap="1">
          <NumberInput
            issue={issues.topLeftRadius}
            onChange={handleIndividualRadiusChange('topLeftRadius')}
            startAddon={<TbRadiusTopLeft />}
            unit="mm"
            value={editable.topLeftRadius}
          />
          <NumberInput
            issue={issues.topRightRadius}
            onChange={handleIndividualRadiusChange('topRightRadius')}
            startAddon={<TbRadiusTopRight />}
            unit="mm"
            value={editable.topRightRadius}
          />
          <NumberInput
            issue={issues.bottomLeftRadius}
            onChange={handleIndividualRadiusChange('bottomLeftRadius')}
            startAddon={<TbRadiusBottomLeft />}
            unit="mm"
            value={editable.bottomLeftRadius}
          />
          <NumberInput
            issue={issues.bottomRightRadius}
            onChange={handleIndividualRadiusChange('bottomRightRadius')}
            startAddon={<TbRadiusBottomRight />}
            unit="mm"
            value={editable.bottomRightRadius}
          />
        </Grid>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
