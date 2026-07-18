import { Box } from '@chakra-ui/react'
import type { FC } from 'react'
import type { IconType } from 'react-icons'
import { PiArrowLineDown, PiArrowLineLeft, PiArrowLineRight, PiArrowLineUp } from 'react-icons/pi'

import type { IssueSchema } from '../../schemas/validation'
import { NumberInput } from '../common/NumberInput'

export type StitchLineOffsetField =
  | 'leftStartOffset'
  | 'topStartOffset'
  | 'topEndOffset'
  | 'rightStartOffset'
  | 'rightEndOffset'
  | 'bottomStartOffset'
  | 'bottomEndOffset'
  | 'leftEndOffset'

type StitchLineOffsetInputProps = {
  disabled: boolean
  field: StitchLineOffsetField
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  value: string
}

type StitchLineOffsetGridArea =
  | 'left-start-offset'
  | 'top-start-offset'
  | 'top-end-offset'
  | 'right-start-offset'
  | 'right-end-offset'
  | 'bottom-start-offset'
  | 'bottom-end-offset'
  | 'left-end-offset'

type StitchLineOffsetInputConfiguration = {
  gridArea: StitchLineOffsetGridArea
  icon: IconType
  label: string
}

const OFFSET_INPUT_CONFIGURATIONS: Record<StitchLineOffsetField, StitchLineOffsetInputConfiguration> = {
  bottomEndOffset: {
    gridArea: 'bottom-end-offset',
    icon: PiArrowLineRight,
    label: 'Alsó oldal végpontjának eltolása',
  },
  bottomStartOffset: {
    gridArea: 'bottom-start-offset',
    icon: PiArrowLineLeft,
    label: 'Alsó oldal kezdőpontjának eltolása',
  },
  leftEndOffset: {
    gridArea: 'left-end-offset',
    icon: PiArrowLineDown,
    label: 'Bal oldal végpontjának eltolása',
  },
  leftStartOffset: {
    gridArea: 'left-start-offset',
    icon: PiArrowLineUp,
    label: 'Bal oldal kezdőpontjának eltolása',
  },
  rightEndOffset: {
    gridArea: 'right-end-offset',
    icon: PiArrowLineDown,
    label: 'Jobb oldal végpontjának eltolása',
  },
  rightStartOffset: {
    gridArea: 'right-start-offset',
    icon: PiArrowLineUp,
    label: 'Jobb oldal kezdőpontjának eltolása',
  },
  topEndOffset: {
    gridArea: 'top-end-offset',
    icon: PiArrowLineRight,
    label: 'Felső oldal végpontjának eltolása',
  },
  topStartOffset: {
    gridArea: 'top-start-offset',
    icon: PiArrowLineLeft,
    label: 'Felső oldal kezdőpontjának eltolása',
  },
}

export const StitchLineOffsetInput: FC<StitchLineOffsetInputProps> = ({ disabled, field, issue, onChange, value }) => {
  const configuration = OFFSET_INPUT_CONFIGURATIONS[field]
  const Icon = configuration.icon

  return (
    <Box aria-label={configuration.label} gridArea={configuration.gridArea} role="group" width="20">
      <NumberInput
        disabled={disabled}
        issue={issue}
        size="2xs"
        startAddon={<Icon />}
        step={1}
        value={value}
        onChange={onChange}
      />
    </Box>
  )
}
