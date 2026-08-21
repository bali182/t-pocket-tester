import { HStack, Popover, Text } from '@chakra-ui/react'
import { FC, ReactElement } from 'react'

type FloatingEditorHeaderProps = {
  menu?: ReactElement
  title: string
}

export const FloatingEditorHeader: FC<FloatingEditorHeaderProps> = ({ menu, title }) => {
  return (
    <Popover.Header p="0">
      <HStack justify="space-between" px="4" py="2">
        <Text fontWeight="semibold" textStyle="xs">
          {title}
        </Text>
        {menu}
      </HStack>
    </Popover.Header>
  )
}
