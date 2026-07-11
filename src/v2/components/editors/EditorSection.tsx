import { Box } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'

type EditorSectionProps = {
  children: ReactNode
}

export const EditorSection: FC<EditorSectionProps> = ({ children }) => {
  return (
    <Box as="section" borderTopWidth="1px" px="4" py="3">
      {children}
    </Box>
  )
}
