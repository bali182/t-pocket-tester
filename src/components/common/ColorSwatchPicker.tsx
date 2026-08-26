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
import type { ColorValue } from '../../hooks/useColors'
import { useTranslation } from '../../translations/translation'

type ColorSwatchPickerProps = {
  value: string | undefined
  colors: ColorValue[]
  onChange: (color: string | undefined) => void
  canReset: boolean
  positioning?: PopoverRootProps['positioning']
  trigger?: ReactElement
}

export const ColorSwatchPicker = ({
  canReset,
  value: v,
  colors,
  onChange,
  positioning,
  trigger,
}: ColorSwatchPickerProps) => {
  const t = useTranslation()
  const value = v?.toLowerCase()

  return (
    <Popover.Root positioning={positioning}>
      <Popover.Trigger asChild>
        {trigger ?? (
          <IconButton size="xs" variant="outline">
            <ColorSwatch size="md" value={value ?? 'transparent'} />
          </IconButton>
        )}
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content p="3" width="fit-content">
            <Grid gap="2" gridTemplateColumns="repeat(5, minmax(0, 1fr))">
              {colors.map(({ color, key, name }) => {
                const isSelected = value === color
                return (
                  <Button
                    flexDirection="column"
                    height="auto"
                    key={key}
                    onClick={() => {
                      if (isSelected && canReset) {
                        onChange(undefined)
                      } else {
                        onChange(color)
                      }
                    }}
                    p="1"
                    variant="ghost"
                    _icon={{ boxSize: '3' }}
                  >
                    <ColorSwatch size="xl" value={color}>
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
                    <Text textStyle="2xs">{name}</Text>
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
