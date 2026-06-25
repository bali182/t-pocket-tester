import { Box } from '@chakra-ui/react'
import type { FC, PropsWithChildren } from 'react'

export const CenteredLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box alignItems="center" display="flex" height="100%" justifyContent="center" width="100%">
      {children}
    </Box>
  )
}
