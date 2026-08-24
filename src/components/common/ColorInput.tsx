import { ColorSwatch, IconButton, Input, InputGroup, type PopoverRootProps } from '@chakra-ui/react'
import { useCallback, useMemo, useRef, type FC } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { ColorPopover } from './ColorPopover'

type ColorInputProps = {
  isResetEnabled?: boolean
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  onReset?: () => void
  value: string
}

export const ColorInput: FC<ColorInputProps> = ({ isResetEnabled, issue, onChange, onReset, value }) => {
  const inputGroupRef = useRef<HTMLDivElement>(null)
  const positioning = useMemo<PopoverRootProps['positioning']>(
    () => ({
      getAnchorElement: () => inputGroupRef.current,
      placement: 'bottom-start',
    }),
    [],
  )
  const handlePopoverChange = useCallback(
    (color: string | undefined): void => {
      if (isDefined(color)) {
        onChange(color)
      }
    },
    [onChange],
  )
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  return (
    <InputGroup
      ref={inputGroupRef}
      endAddon={
        isDefined(onReset) ? (
          <IconButton
            alignSelf="stretch"
            borderRadius="0"
            disabled={!isResetEnabled}
            height="auto"
            onClick={onReset}
            size="xs"
            variant="plain"
          >
            <PiArrowCounterClockwise />
          </IconButton>
        ) : undefined
      }
      endAddonProps={{ px: 0, size: 'xs' }}
      startAddon={
        <ColorPopover
          canReset={false}
          color={value}
          onChange={handlePopoverChange}
          positioning={positioning}
          trigger={
            <IconButton
              alignItems="center"
              alignSelf="stretch"
              border="0"
              borderRadius="0"
              display="flex"
              height="auto"
              justifyContent="center"
              p="0"
              unstyled
            >
              <ColorSwatch value={value} />
            </IconButton>
          }
        />
      }
      startAddonProps={{ px: '1.5', size: 'xs' }}
    >
      <Input
        aria-invalid={isInvalid}
        onChange={(event) => onChange(event.currentTarget.value)}
        size="xs"
        value={value}
      />
    </InputGroup>
  )
}
