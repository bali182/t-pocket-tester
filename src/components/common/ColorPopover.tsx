import {
  Box,
  Button,
  ColorSwatch,
  Grid,
  IconButton,
  Popover,
  Portal,
  Text,
  type PopoverRootProps,
} from '@chakra-ui/react'
import type { ReactElement } from 'react'
import { PiArrowCounterClockwise, PiCheck } from 'react-icons/pi'

import { leatherColors } from '../../data/leatherColors'
import { useTranslation } from '../../translations/translation'

type ColorPopoverProps = {
  canReset: boolean
  color: string | undefined
  onChange: (color: string | undefined) => void
  positioning?: PopoverRootProps['positioning']
  trigger?: ReactElement
}

type LeatherColorEntry = [keyof typeof leatherColors, string]

const leatherColorEntries = Object.entries(leatherColors) as LeatherColorEntry[]

export const ColorPopover = ({ canReset, color, onChange, positioning, trigger }: ColorPopoverProps) => {
  const t = useTranslation()
  const defaultTrigger = (
    <IconButton aria-label={t.common.labels.color} size="xs" variant="outline">
      <ColorSwatch size="md" value={color ?? 'transparent'} />
    </IconButton>
  )

  return (
    <Popover.Root positioning={positioning}>
      <Popover.Trigger asChild>{trigger ?? defaultTrigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content p="3" width="fit-content">
            <Grid gap="2" gridTemplateColumns="repeat(5, minmax(0, 1fr))">
              {leatherColorEntries.map(([key, value]) => {
                const isSelected = color === value

                return (
                  <Button
                    aria-label={t.leatherColors[key]}
                    flexDirection="column"
                    height="auto"
                    key={key}
                    onClick={() => onChange(value)}
                    p="1"
                    variant={isSelected ? 'subtle' : 'ghost'}
                    _icon={{ boxSize: '3' }}
                  >
                    <ColorSwatch size="xl" value={value}>
                      {isSelected && (
                        <Box
                          alignItems="center"
                          background="bg.inverted"
                          borderRadius="full"
                          boxSize="5"
                          color="fg.inverted"
                          display="flex"
                          justifyContent="center"
                        >
                          <PiCheck size={8} />
                        </Box>
                      )}
                    </ColorSwatch>
                    <Text textStyle="2xs">{t.leatherColors[key]}</Text>
                  </Button>
                )
              })}
            </Grid>
            {canReset && (
              <Button marginTop="3" onClick={() => onChange(undefined)} size="xs" width="full" variant="outline">
                <PiArrowCounterClockwise />
                {t.common.actions.reset}
              </Button>
            )}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
