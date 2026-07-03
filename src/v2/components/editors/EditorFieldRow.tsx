import { Caption1 } from '@fluentui/react-components'
import type { FC, ReactNode } from 'react'

type EditorFieldRowProps = {
  label: string
  children: ReactNode
}

export const EditorFieldRow: FC<EditorFieldRowProps> = ({ label, children }) => {
  return (
    <>
      <Caption1>{label}</Caption1>
      {children}
    </>
  )
}
