import { Box, Button, Dialog, IconButton, Slider, Text, VStack, type SliderValueChangeDetails } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useState, type FC } from 'react'

import { PiX } from 'react-icons/pi'
import { scalingAtom } from '../state/scalingAtom'
import { useTranslation } from '../translations/translation'
import { RulerSvg } from './svg/RulerSvg'

type ScalingDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ScalingDialog: FC<ScalingDialogProps> = ({ isOpen, onOpenChange }) => {
  const [scaling, setScaling] = useAtom(scalingAtom)
  const [draftScaling, setDraftScaling] = useState<number>(scaling)
  const t = useTranslation()
  const scalingPercent = new BigNumber(draftScaling).times(100).toNumber()

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      setDraftScaling(scaling)
      onOpenChange(details.open)
    },
    [onOpenChange, scaling],
  )

  const handleScaleChange = useCallback((details: SliderValueChangeDetails): void => {
    const nextScaling = details.value[0]

    if (typeof nextScaling === 'number') {
      setDraftScaling(nextScaling)
    }
  }, [])

  const handleApply = useCallback((): void => {
    setScaling(draftScaling)
    onOpenChange(false)
  }, [draftScaling, onOpenChange, setScaling])

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <IconButton size="sm" variant="ghost">
              <PiX />
            </IconButton>
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <VStack align="stretch" gap="2">
              <Dialog.Title>{t.editor.scalingDialog.title}</Dialog.Title>
              <Dialog.Description>{t.editor.scalingDialog.description}</Dialog.Description>
            </VStack>
          </Dialog.Header>
          <Dialog.Body>
            <VStack align="stretch" gap="12">
              <Slider.Root min={0.5} max={2} step={0.001} value={[draftScaling]} onValueChange={handleScaleChange}>
                <Text fontWeight="medium">
                  {t.common.actions.scaling}: {scalingPercent}%
                </Text>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb index={0} />
                </Slider.Control>
              </Slider.Root>
              <Box transform={`scale(${draftScaling})`} transformOrigin="left center">
                <RulerSvg />
              </Box>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">{t.common.actions.cancel}</Button>
            </Dialog.ActionTrigger>
            <Button onClick={handleApply}>{t.common.actions.apply}</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
