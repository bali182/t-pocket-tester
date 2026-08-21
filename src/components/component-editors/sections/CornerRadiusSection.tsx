import { Button, Grid } from '@chakra-ui/react'
import { FC, useCallback, useMemo, type ReactNode } from 'react'
import { TbRadiusBottomLeft, TbRadiusBottomRight, TbRadiusTopLeft, TbRadiusTopRight } from 'react-icons/tb'

import { IconType } from 'react-icons'
import { PiChecks, PiLink, PiLinkBreak, PiPencilLine } from 'react-icons/pi'
import { HasAutoCornerRadiusSchema, HasCornerRadiusSchema, HasCornerRadiusValuesSchema } from '../../../schemas/common'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { has } from '../../../utils/has'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type CornerRadiusSectionProps<T extends HasCornerRadiusSchema & Partial<HasAutoCornerRadiusSchema>> = {
  value: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasCornerRadiusSchema>
  onChange: (updated: EditableSchema<T>) => void
}

export function CornerRadiusSection<T extends HasCornerRadiusSchema & Partial<HasAutoCornerRadiusSchema>>({
  editable,
  issues,
  value,
  onChange,
}: CornerRadiusSectionProps<T>): ReactNode {
  const t = useTranslation()

  const hasAuto = has<Partial<HasAutoCornerRadiusSchema>>(editable, 'autoCornerRadius')
  const disabled = hasAuto && Boolean(editable.autoCornerRadius)

  const individualRadiusIssues = useMemo(
    () => [issues.topLeftRadius, issues.topRightRadius, issues.bottomLeftRadius, issues.bottomRightRadius],
    [issues.bottomLeftRadius, issues.bottomRightRadius, issues.topLeftRadius, issues.topRightRadius],
  )

  const handleRadiusTypeChange = useCallback(
    (uniformRadii: boolean) => {
      const largestRadius = [value.bottomLeftRadius, value.bottomRightRadius, value.topLeftRadius, value.topRightRadius]
        .reduce((max, radius) => Math.max(max, radius), 0)
        .toString()

      const radiusOverrides: EditableSchema<HasCornerRadiusValuesSchema> = {
        topLeftRadius: largestRadius,
        topRightRadius: largestRadius,
        bottomLeftRadius: largestRadius,
        bottomRightRadius: largestRadius,
      }
      onChange({
        ...editable,
        individualRadii: !uniformRadii,
        ...(uniformRadii ? radiusOverrides : {}),
      })
    },
    [editable, onChange, value.bottomLeftRadius, value.bottomRightRadius, value.topLeftRadius, value.topRightRadius],
  )
  const handleAutoChange = useCallback(
    (manualRadii: boolean) => {
      onChange({
        ...editable,
        autoCornerRadius: !manualRadii,
      })
    },
    [editable, onChange],
  )

  const handleIndividualRadiusChange = useCallback(
    (key: keyof HasCornerRadiusValuesSchema) => (radius: string) => {
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
        leftAddon={
          hasAuto ? (
            <SectionHeaderToggle
              onIcon={PiPencilLine}
              offIcon={PiChecks}
              onLabel={t.stitchLine.editor.autoCornerRadius.manual}
              offLabel={t.stitchLine.editor.autoCornerRadius.auto}
              value={!Boolean(editable.autoCornerRadius)}
              onChange={handleAutoChange}
            />
          ) : undefined
        }
        rightAddon={
          !disabled ? (
            <SectionHeaderToggle
              onIcon={PiLink}
              offIcon={PiLinkBreak}
              onLabel={t.component.editor.cornerRadius.uniform}
              offLabel={t.component.editor.cornerRadius.individual}
              value={!editable.individualRadii}
              onChange={handleRadiusTypeChange}
            />
          ) : undefined
        }
      >
        {t.component.editor.cornerRadius.title}
      </SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.cornerRadius.individualMeasure}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={individualRadiusIssues}>
        <Grid columnGap="1" gridTemplateColumns="repeat(2, minmax(0, 1fr))" minWidth="0" rowGap="1">
          <NumberInput
            issue={disabled ? undefined : issues.topLeftRadius}
            onChange={handleIndividualRadiusChange('topLeftRadius')}
            startAddon={<TbRadiusTopLeft />}
            unit="mm"
            disabled={disabled}
            value={disabled ? '' : editable.topLeftRadius}
            placeholder={disabled ? t.stitchLine.editor.autoCornerRadius.autoPlaceholder : undefined}
          />
          <NumberInput
            issue={disabled ? undefined : issues.topRightRadius}
            onChange={handleIndividualRadiusChange('topRightRadius')}
            startAddon={<TbRadiusTopRight />}
            unit="mm"
            disabled={disabled}
            value={disabled ? '' : editable.topRightRadius}
            placeholder={disabled ? t.stitchLine.editor.autoCornerRadius.autoPlaceholder : undefined}
          />
          <NumberInput
            issue={disabled ? undefined : issues.bottomLeftRadius}
            onChange={handleIndividualRadiusChange('bottomLeftRadius')}
            startAddon={<TbRadiusBottomLeft />}
            unit="mm"
            disabled={disabled}
            value={disabled ? '' : editable.bottomLeftRadius}
            placeholder={disabled ? t.stitchLine.editor.autoCornerRadius.autoPlaceholder : undefined}
          />
          <NumberInput
            issue={disabled ? undefined : issues.bottomRightRadius}
            onChange={handleIndividualRadiusChange('bottomRightRadius')}
            startAddon={<TbRadiusBottomRight />}
            unit="mm"
            disabled={disabled}
            value={disabled ? '' : editable.bottomRightRadius}
            placeholder={disabled ? t.stitchLine.editor.autoCornerRadius.autoPlaceholder : undefined}
          />
        </Grid>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}

type SectionHeaderToggleProps = {
  value: boolean
  onLabel: string
  offLabel: string
  onIcon: IconType
  offIcon: IconType
  onChange: (newValue: boolean) => void
}

const SectionHeaderToggle: FC<SectionHeaderToggleProps> = ({
  value,
  onIcon: OnIcon,
  offIcon: OffIcon,
  onLabel,
  offLabel,
  onChange,
}) => {
  const handleClick = useCallback(() => {
    onChange(!value)
  }, [onChange, value])

  return (
    <Button
      onClick={handleClick}
      size="2xs"
      borderRadius="full"
      height="5"
      background={value ? 'bg.emphasized' : undefined}
      variant={value ? 'ghost' : 'subtle'}
    >
      {value ? <OnIcon /> : <OffIcon />}
      {value ? onLabel : offLabel}
    </Button>
  )
}
