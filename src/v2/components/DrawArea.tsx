import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { SvgRoot } from './svg/SvgRoot'

export const DrawArea: FC = () => {
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
      <SvgRoot />
    </Box>
  )
}
