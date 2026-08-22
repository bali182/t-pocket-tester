import { useCallback, useMemo, type ReactNode } from 'react'

import { HStack } from '@chakra-ui/react'
import { PiArrowLineDown, PiArrowLineLeft, PiArrowLineRight, PiArrowLineUp } from 'react-icons/pi'
import { HasSqueezeSchema } from '../../../schemas/common'
import { HasAutoDimensionsSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type SqueezeSectionProps<T> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export function SqueezeSection<T extends HasSqueezeSchema & HasAutoDimensionsSchema>({
  editable,
  issues,
  onChange,
}: SqueezeSectionProps<T>): ReactNode {
  const t = useTranslation()

  const horizontalIssues = useMemo(
    () => [issues.leftSqueeze, issues.rightSqueeze],
    [issues.leftSqueeze, issues.rightSqueeze],
  )
  const verticalIssues = useMemo(
    () => [issues.topSqueeze, issues.bottomSqueeze],
    [issues.bottomSqueeze, issues.topSqueeze],
  )

  const handleLeftSqueezeChange = useCallback(
    (leftSqueeze: string) => {
      onChange({ ...editable, leftSqueeze })
    },
    [editable, onChange],
  )
  const handleRightSqueezeChange = useCallback(
    (rightSqueeze: string) => {
      onChange({ ...editable, rightSqueeze })
    },
    [editable, onChange],
  )
  const handleTopSqueezeChange = useCallback(
    (topSqueeze: string) => {
      onChange({ ...editable, topSqueeze })
    },
    [editable, onChange],
  )
  const handleBottomSqueezeChange = useCallback(
    (bottomSqueeze: string) => {
      onChange({ ...editable, bottomSqueeze })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.squeeze.title}</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>{t.component.editor.squeeze.vertical}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={verticalIssues}>
        <HStack gap="3">
          <NumberInput
            disabled={!editable.autoHeight}
            issue={issues.topSqueeze}
            onChange={handleTopSqueezeChange}
            startAddon={<PiArrowLineDown />}
            unit="mm"
            value={editable.topSqueeze}
          />
          <NumberInput
            disabled={!editable.autoHeight}
            issue={issues.bottomSqueeze}
            onChange={handleBottomSqueezeChange}
            startAddon={<PiArrowLineUp />}
            unit="mm"
            value={editable.bottomSqueeze}
          />
        </HStack>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.squeeze.horizontal}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={horizontalIssues}>
        <HStack gap="3">
          <NumberInput
            disabled={!editable.autoWidth}
            issue={issues.leftSqueeze}
            onChange={handleLeftSqueezeChange}
            startAddon={<PiArrowLineRight />}
            unit="mm"
            value={editable.leftSqueeze}
          />
          <NumberInput
            disabled={!editable.autoWidth}
            issue={issues.rightSqueeze}
            onChange={handleRightSqueezeChange}
            startAddon={<PiArrowLineLeft />}
            unit="mm"
            value={editable.rightSqueeze}
          />
        </HStack>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
