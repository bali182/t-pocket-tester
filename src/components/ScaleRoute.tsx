import { Slider, Text, VStack, type SliderValueChangeDetails } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import { scaleAtom } from '../state'
import { CenteredLayout } from './CenteredLayout'
import { ScaledSvgPreview } from './ScaledSvgPreview'
import { RulerSvg } from './svg/RulerSvg'

export const ScaleRoute: FC = () => {
  const [scale, setScale] = useAtom(scaleAtom)
  const scalePercent = Math.round(scale * 100)

  const handleScaleChange = useCallback(
    (details: SliderValueChangeDetails) => {
      const nextValue = details.value[0]

      if (typeof nextValue === 'number') {
        setScale(nextValue)
      }
    },
    [setScale],
  )

  return (
    <CenteredLayout>
      <VStack gap="8" width="min(100%, 480px)">
        <ScaledSvgPreview>
          <RulerSvg />
        </ScaledSvgPreview>

        <VStack align="stretch" gap="3" width="100%">
          <Text fontWeight="medium">Skálázás: {scalePercent}%</Text>
          <Slider.Root min={0.5} max={2} step={0.001} value={[scale]} onValueChange={handleScaleChange}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} />
            </Slider.Control>
          </Slider.Root>
        </VStack>
      </VStack>
    </CenteredLayout>
  )
}
