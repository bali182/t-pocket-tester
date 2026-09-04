import { EmptyState as ChakraEmptyState } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'

type CommonEmptyStateProps = {
  icon: ReactNode
  title: ReactNode
  description: ReactNode
  content?: ReactNode
}

export const CommonEmptyState: FC<CommonEmptyStateProps> = ({ content, description, icon, title }) => {
  return (
    <ChakraEmptyState.Root alignItems="center" display="flex" height="100%" justifyContent="center">
      <ChakraEmptyState.Content>
        <ChakraEmptyState.Indicator>{icon}</ChakraEmptyState.Indicator>
        <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
        <ChakraEmptyState.Description textAlign="center">{description}</ChakraEmptyState.Description>
        {content}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  )
}
