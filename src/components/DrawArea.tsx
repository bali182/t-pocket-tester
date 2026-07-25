import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { scalingAtom } from '../state/scalingAtom'
import { SvgRoot } from './svg/SvgRoot'

export const DrawArea: FC = () => {
  const scaling = useAtomValue(scalingAtom)

  return (
    <Box
      alignItems="center"
      bg="bg.emphasized"
      boxSizing="border-box"
      display="flex"
      height="100%"
      justifyContent="center"
      overflow="auto"
      width="100%"
    >
      <Box style={{ zoom: scaling }}>
        <SvgRoot />
      </Box>
    </Box>
  )
}
