import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { scaleAtom } from '../state'

export const ScaledSvgPreview: FC<PropsWithChildren> = ({ children }) => {
  const scale = useAtomValue(scaleAtom)

  return (
    <Box transform={`scale(${scale})`} transformOrigin="center center">
      {children}
    </Box>
  )
}
