import { Box, HStack, IconButton, Popover, Text, usePopover } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { MouseEvent, useCallback, useEffect, useMemo, type FC } from 'react'
import { LuX } from 'react-icons/lu'

import { useEditableComponent } from '../../hooks/useEditableComponent'
import type { ComponentSchema } from '../../schemas/components'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { projectAtom } from '../../state'
import { addComponent } from '../../utils/addComponent'
import { isDefined } from '../../utils/isDefined'
import { removeComponent } from '../../utils/removeComponent'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { ComponentEditor } from './ComponentEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const [, setProject] = useAtom(projectAtom)
  const {
    component: editedComponent,
    editableComponent,
    setComponent,
    validationIssues,
  } = useEditableComponent(component.id)
  const positioningTarget = useMemo(
    () => ({
      getBoundingClientRect: () => anchorElement.getBoundingClientRect(),
      contextElement: anchorElement,
    }),
    [anchorElement],
  )
  const popover = usePopover({
    open: true,
    onOpenChange: ({ open }) => {
      if (!open) {
        onClose()
      }
    },
    positioning: {
      flip: ['left-start', 'bottom', 'top', 'right-start'],
      getAnchorElement: () => positioningTarget,
      gutter: 10,
      overflowPadding: 8,
      placement: 'right-start',
      strategy: 'fixed',
    },
  })

  useEffect(() => {
    const editorElement = anchorElement.ownerSVGElement?.parentElement

    if (!isDefined(editorElement)) {
      return
    }

    const observer = new ResizeObserver((): void => {
      popover.reposition()
    })

    observer.observe(editorElement)

    return (): void => {
      observer.disconnect()
    }
  }, [anchorElement, popover])

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      setProject((project) => addComponent(component.id, type, project))
    },
    [component.id, setProject],
  )

  const handleRemoveComponent = useCallback((): void => {
    onClose()
    setProject((project) => removeComponent(component.id, project))
  }, [component.id, onClose, setProject])

  const captureClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Popover.RootProvider value={popover}>
      <Popover.Positioner>
        <Popover.Content onClick={captureClick} width="400px" zIndex="popover">
          <Popover.Arrow />
          <Popover.Header>
            <HStack justify="space-between">
              <Text fontWeight="semibold" textStyle="xs">
                #{editedComponent.id}
              </Text>
              <IconButton aria-label="Bezárás" onClick={onClose} size="xs" variant="ghost">
                <LuX />
              </IconButton>
            </HStack>
          </Popover.Header>
          <Box>
            <ComponentEditor
              component={editedComponent}
              editable={editableComponent}
              issues={validationIssues as ValidationIssuesSchema<ComponentSchema>}
              onAddChild={handleAddChild}
              onChange={setComponent}
              onRemoveComponent={handleRemoveComponent}
            />
          </Box>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.RootProvider>
  )
}
