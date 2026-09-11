import { Box } from '@chakra-ui/react'
import { type FC } from 'react'

import { useGlobalSettings } from '../hooks/useGlobalSettings'
import { SvgRoot } from './svg/SvgRoot'

export const DrawArea: FC = () => {
  const { settings } = useGlobalSettings()

  return (
    <Box boxSizing="border-box" height="100%" overflow="auto" width="100%">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        minHeight="100%"
        minWidth="100%"
        py="5"
        width="max-content"
      >
        <Box style={{ zoom: settings.view.scale }}>
          <SvgRoot />
        </Box>
      </Box>
    </Box>
  )
}
