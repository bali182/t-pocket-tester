import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useTranslation } from '../../translations/translation'

export type MagicFixProgressPageProps = {
  progress: number
  isComplete: boolean
  onCompletionAnimationEnd: () => void
}

export const MagicFixProgressPage: FC<MagicFixProgressPageProps> = ({
  isComplete,
  onCompletionAnimationEnd,
  progress,
}) => {
  const t = useTranslation()
  const handleCompletionAnimationEnd = useCallback((): void => {
    onCompletionAnimationEnd()
  }, [onCompletionAnimationEnd])

  return (
    <Flex flexDirection="column" height="full" p="6">
      <Box position="relative">
        <Text
          animationDuration="100ms"
          animationFillMode="forwards"
          animationName={isComplete ? 'fade-out' : undefined}
          animationTimingFunction="ease-out"
        >
          {t.magicFix.dialog.progress.message}
        </Text>
        {isComplete && (
          <Text
            animationDuration="1000ms"
            animationName="fade-in"
            animationTimingFunction="ease-out"
            inset="0"
            onAnimationEnd={handleCompletionAnimationEnd}
            position="absolute"
          >
            {t.magicFix.dialog.progress.completed}
          </Text>
        )}
      </Box>
      <Flex alignItems="center" gap="3" marginTop="auto">
        <Progress.Root flex="1" value={progress}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Text fontVariantNumeric="tabular-nums" minWidth="10" textAlign="right">
          {Math.round(progress)}%
        </Text>
      </Flex>
    </Flex>
  )
}
