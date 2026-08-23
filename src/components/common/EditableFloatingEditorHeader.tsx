import { HStack, Input, Popover } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type FC, type ReactElement, type ReactNode } from 'react'
import type { IconType } from 'react-icons'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type EditableFloatingEditorHeaderProps = {
  icon: IconType
  menu: ReactElement
  name: string
  nameIssue: IssueSchema | undefined
  onNameChange: (name: string) => void
  rightAddon: ReactNode
}

export const EditableFloatingEditorHeader: FC<EditableFloatingEditorHeaderProps> = ({
  icon: Icon,
  menu,
  name,
  nameIssue,
  onNameChange,
  rightAddon,
}) => {
  const hasNameError = isDefined(nameIssue) && nameIssue.severity === 'error'
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onNameChange(event.currentTarget.value)
    },
    [onNameChange],
  )

  return (
    <Popover.Header p="0">
      <HStack justify="space-between" px="4" py="2">
        <HStack gap="1">
          <Icon />
          <Input
            aria-invalid={hasNameError}
            bg="transparent"
            borderColor={hasNameError ? 'border.error' : 'transparent'}
            fieldSizing="content"
            focusRing="inside"
            focusRingColor="colorPalette.focusRing"
            fontWeight="bold"
            onChange={handleNameChange}
            px="1"
            size="sm"
            value={name}
            w="auto"
          />
        </HStack>
        <HStack gap="2">
          {rightAddon}
          {menu}
        </HStack>
      </HStack>
    </Popover.Header>
  )
}
