import { Box, IconButton, Menu, Portal } from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCaretDown, PiCaretRight, PiCaretUp, PiDotsThreeVertical, PiPlus, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { AddChildComponentMenu, type ChildComponentType } from './AddChildComponentMenu'
import { AddComponentStitchLineMenu } from './AddComponentStitchLineMenu'

type ComponentTreeItemActionsProps = {
  component: ComponentSchema
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItemActions: FC<ComponentTreeItemActionsProps> = ({ component, onAddChild }) => {
  const t = useTranslation()
  const { project, addComponent, addStitchLine, deleteComponent, moveComponent } = useProject()
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

  const handleAddStitchLine = useCallback(
    (type: StitchLineSchema['type']): void => {
      addStitchLine(component.id, type)
    },
    [addStitchLine, component.id],
  )

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
    <Box onClick={handleActionsClick}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label={t.common.accessibility.componentTree.add()} size="2xs" variant="ghost">
            <PiDotsThreeVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item disabled={!canDelete} onClick={handleDelete} value="delete">
                <PiTrash />
                <Menu.ItemText>{t.common.accessibility.componentTree.remove()}</Menu.ItemText>
              </Menu.Item>
              {canAdd ? (
                <Menu.Root positioning={{ placement: 'right-start' }}>
                  <Menu.TriggerItem>
                    <PiPlus />
                    <Menu.ItemText>{t.common.accessibility.componentTree.add()}</Menu.ItemText>
                    <Menu.ItemCommand>
                      <PiCaretRight />
                    </Menu.ItemCommand>
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content _closed={{ animation: 'none' }} _open={{ animation: 'none' }}>
                        <AddChildComponentMenu onAddChild={handleAddChild} />
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              ) : (
                <Menu.Item disabled value="add">
                  <PiPlus />
                  <Menu.ItemText>{t.common.accessibility.componentTree.add()}</Menu.ItemText>
                </Menu.Item>
              )}
              <AddComponentStitchLineMenu component={component} onAddStitchLine={handleAddStitchLine} />
              <Menu.Separator />
              <Menu.Item disabled={!siblingMoveState.canMoveUp} onClick={handleMoveUp} value="move-up">
                <PiCaretUp />
                <Menu.ItemText>{t.common.accessibility.componentTree.moveUp()}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item disabled={!siblingMoveState.canMoveDown} onClick={handleMoveDown} value="move-down">
                <PiCaretDown />
                <Menu.ItemText>{t.common.accessibility.componentTree.moveDown()}</Menu.ItemText>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  )
}
