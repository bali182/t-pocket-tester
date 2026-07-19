import { HStack, IconButton, Menu } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCaretDown, PiCaretUp } from 'react-icons/pi'

import { PiPlus, PiTrash } from 'react-icons/pi'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state/projectAtom'
import { addComponent } from '../utils/addComponent'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { moveComponentWithinParent } from '../utils/moveComponentWithinParent'
import { removeComponent } from '../utils/removeComponent'
import { AddChildComponentMenu, type ChildComponentType } from './AddChildComponentMenu'

type ComponentTreeItemActionsProps = {
  component: ComponentSchema
  onAddChild: (parentId: string) => void
}

export const ComponentTreeItemActions: FC<ComponentTreeItemActionsProps> = ({ component, onAddChild }) => {
  const [project, setProject] = useAtom(projectAtom)
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
      setProject((project) => addComponent(component.id, type, project))
      onAddChild(component.id)
    },
    [canAdd, component.id, onAddChild, setProject],
  )

  const handleDelete = useCallback((): void => {
    if (!canDelete) {
      return
    }
    setProject((project) => removeComponent(component.id, project))
  }, [canDelete, component.id, setProject])

  const handleMoveUp = useCallback((): void => {
    if (!siblingMoveState.canMoveUp) {
      return
    }
    setProject((project) => moveComponentWithinParent(component.id, 'up', project))
  }, [component.id, setProject, siblingMoveState.canMoveUp])

  const handleMoveDown = useCallback((): void => {
    if (!siblingMoveState.canMoveDown) {
      return
    }
    setProject((project) => moveComponentWithinParent(component.id, 'down', project))
  }, [component.id, setProject, siblingMoveState.canMoveDown])

  return (
    <HStack gap="0.5" onClick={handleActionsClick}>
      <IconButton
        aria-label="Elem mozgatása fel"
        disabled={!siblingMoveState.canMoveUp}
        onClick={handleMoveUp}
        size="2xs"
        variant="ghost"
      >
        <PiCaretUp />
      </IconButton>
      <IconButton
        aria-label="Elem mozgatása le"
        disabled={!siblingMoveState.canMoveDown}
        onClick={handleMoveDown}
        size="2xs"
        variant="ghost"
      >
        <PiCaretDown />
      </IconButton>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Elem hozzáadása" disabled={!canAdd} size="2xs" variant="ghost">
            <PiPlus />
          </IconButton>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <AddChildComponentMenu onAddChild={handleAddChild} />
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      <IconButton aria-label="Elem törlése" disabled={!canDelete} onClick={handleDelete} size="2xs" variant="ghost">
        <PiTrash />
      </IconButton>
    </HStack>
  )
}
