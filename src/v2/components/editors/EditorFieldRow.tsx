import { Text } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'

type EditorFieldRowProps = {
  label: string
  children: ReactNode
}

export const EditorFieldRow: FC<EditorFieldRowProps> = ({ label, children }) => {
  return (
    <>
      <Text textStyle="sm">{label}</Text>
      {children}
    </>
  )
}
