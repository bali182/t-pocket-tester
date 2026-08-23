import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { scalingAtom } from '../state/scalingAtom'
import { SvgRoot } from './svg/SvgRoot'

export const DrawArea: FC = () => {
  const scaling = useAtomValue(scalingAtom)

  return (
    <Box boxSizing="border-box" height="100%" overflow="auto" width="100%">
      <Box alignItems="center" display="flex" justifyContent="center" minHeight="100%" minWidth="100%">
        <Box style={{ zoom: scaling }}>
          <SvgRoot />
        </Box>
      </Box>
    </Box>
  )
}
