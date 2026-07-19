import { HStack, IconButton, Menu } from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCaretDown, PiCaretUp } from 'react-icons/pi'

import { PiPlus, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import { useTranslation } from '../translations/translation'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { AddChildComponentMenu, type ChildComponentType } from './AddChildComponentMenu'

type ComponentTreeItemActionsProps = {
  component: ComponentSchema
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItemActions: FC<ComponentTreeItemActionsProps> = ({ component, onAddChild }) => {
  const t = useTranslation()
  const { project, addComponent, deleteComponent, moveComponent } = useProject()
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasChildren(component), [component])
  const siblingMoveState = useMemo(() => {
    if (component.type === 'root-panel') {
      return { canMoveUp: false, canMoveDown: false }
    }

    const parent = getParent(component.id, project)

    if (!isDefined(parent)) {
      return { canMoveUp: false, canMoveDown: false }
    }

    const index = parent.children.indexOf(component.id)

    return {
      canMoveUp: index > 0,
      canMoveDown: index >= 0 && index < parent.children.length - 1,
    }
  }, [component.id, component.type, project])

  const handleActionsClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      if (!canAdd) {
        return
      }
      addComponent(component.id, type)
      onAddChild(component.id)
    },
    [addComponent, canAdd, component.id, onAddChild],
  )

  const handleDelete = useCallback((): void => {
    if (!canDelete) {
      return
    }
    deleteComponent(component.id)
  }, [canDelete, component.id, deleteComponent])

  const handleMoveUp = useCallback((): void => {
    if (!siblingMoveState.canMoveUp) {
      return
    }
    moveComponent(component.id, 'up')
  }, [component.id, moveComponent, siblingMoveState.canMoveUp])

  const handleMoveDown = useCallback((): void => {
    if (!siblingMoveState.canMoveDown) {
      return
    }
    moveComponent(component.id, 'down')
  }, [component.id, moveComponent, siblingMoveState.canMoveDown])

  return (
    <HStack gap="0.5" onClick={handleActionsClick}>
      <IconButton
        aria-label={t.common.accessibility.componentTree.moveUp()}
        disabled={!siblingMoveState.canMoveUp}
        onClick={handleMoveUp}
        size="2xs"
        variant="ghost"
      >
        <PiCaretUp />
      </IconButton>
      <IconButton
        aria-label={t.common.accessibility.componentTree.moveDown()}
        disabled={!siblingMoveState.canMoveDown}
        onClick={handleMoveDown}
        size="2xs"
        variant="ghost"
      >
        <PiCaretDown />
      </IconButton>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            aria-label={t.common.accessibility.componentTree.add()}
            disabled={!canAdd}
            size="2xs"
            variant="ghost"
          >
            <PiPlus />
          </IconButton>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <AddChildComponentMenu onAddChild={handleAddChild} />
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      <IconButton
        aria-label={t.common.accessibility.componentTree.remove()}
        disabled={!canDelete}
        onClick={handleDelete}
        size="2xs"
        variant="ghost"
      >
        <PiTrash />
      </IconButton>
    </HStack>
  )
}
