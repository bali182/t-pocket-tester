import { Box } from '@chakra-ui/react'
import type { FC } from 'react'

export const DropInsideIndicator: FC = () => {
  return (
    <Box
      bg="border.info/80"
      border="2px solid"
      borderColor="border.info"
      inset="0"
      pointerEvents="none"
      position="absolute"
      rounded="l2"
    />
  )
}

type ReorderDropIndicatorProps = {
  position: 'before' | 'after'
}

export const ReorderDropIndicator: FC<ReorderDropIndicatorProps> = ({ position }) => {
  const isBefore = position === 'before'

  return (
    <Box
      bg="border.info"
      bottom={isBefore ? undefined : '-1px'}
      height="2px"
      insetInline="0"
      pointerEvents="none"
      position="absolute"
      top={isBefore ? '-1px' : undefined}
      zIndex="2"
    />
  )
}
