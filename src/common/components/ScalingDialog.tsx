import { Box, Slider, Text, VStack, type SliderValueChangeDetails } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useState, type FC } from 'react'

import { scalingAtom } from '../state/scalingAtom'
import { useTranslation } from '../translations/translation'
import { EditDialog } from './EditDialog'
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

  const resetDraft = useCallback((): void => {
    setDraftScaling(scaling)
  }, [scaling])

  const handleScaleChange = useCallback((details: SliderValueChangeDetails): void => {
    const nextScaling = details.value[0]

    if (typeof nextScaling === 'number') {
      setDraftScaling(nextScaling)
    }
  }, [])

  const handleSubmit = useCallback((): void => {
    setScaling(draftScaling)
    onOpenChange(false)
  }, [draftScaling, onOpenChange, setScaling])

  return (
    <EditDialog
      canSubmit={true}
      description={t.editor.scalingDialog.description}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onResetData={resetDraft}
      onSubmit={handleSubmit}
      size="xl"
      submit={t.common.actions.apply}
      title={t.editor.scalingDialog.title}
    >
      <VStack align="stretch" gap="12" px="6">
        <Slider.Root min={0.5} max={2} step={0.001} value={[draftScaling]} onValueChange={handleScaleChange}>
          <Text fontWeight="medium">
            {t.editor.scalingDialog.title}: {scalingPercent}%
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
    </EditDialog>
  )
}
