import { Box, IconButton, IconButtonProps, Menu, Portal } from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCaretDown, PiCaretUp, PiDotsThreeVertical, PiNeedle, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { getComponentIcon } from '../utils/getComponentIcon'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { noop } from '../utils/noop'

type ComponentActionsProps = {
  component: ComponentSchema
  size: IconButtonProps['size']
  onAddChild?: (parentId: string, type: ComponentSchema['type']) => void
  onAddStitchLine?: (componentId: string, type: StitchLineSchema['type']) => void
  onDelete?: (componentId: string) => void
  onMoveDown?: (componentId: string) => void
  onMoveUp?: (componentId: string) => void
}

type SiblingMoveState = {
  canMoveUp: boolean
  canMoveDown: boolean
}

export const ComponentActionsMenu: FC<ComponentActionsProps> = ({
  component,
  size,
  onAddChild = noop,
  onAddStitchLine = noop,
  onDelete = noop,
  onMoveDown = noop,
  onMoveUp = noop,
}) => {
  const t = useTranslation()
  const { project, addComponent, addStitchLine, deleteComponent, moveComponent } = useProject()
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasChildren(component), [component])

  const siblingMoveState = useMemo<SiblingMoveState>(() => {
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
    (type: ComponentSchema['type']): void => {
      if (!canAdd) {
        return
      }
      addComponent(component.id, type)
      onAddChild(component.id, type)
    },
    [addComponent, canAdd, component.id, onAddChild],
  )

  const handleDelete = useCallback((): void => {
    if (!canDelete) {
      return
    }
    deleteComponent(component.id)
    onDelete(component.id)
  }, [canDelete, component.id, deleteComponent, onDelete])

  const handleAddStitchLine = useCallback(
    (type: StitchLineSchema['type']): void => {
      addStitchLine(component, type)
      onAddStitchLine(component.id, type)
    },
    [addStitchLine, component, onAddStitchLine],
  )

  const handleMoveUp = useCallback((): void => {
    if (!siblingMoveState.canMoveUp) {
      return
    }
    moveComponent(component.id, 'up')
    onMoveUp(component.id)
  }, [component.id, moveComponent, onMoveUp, siblingMoveState.canMoveUp])

  const handleMoveDown = useCallback((): void => {
    if (!siblingMoveState.canMoveDown) {
      return
    }
    moveComponent(component.id, 'down')
    onMoveDown(component.id)
  }, [component.id, moveComponent, onMoveDown, siblingMoveState.canMoveDown])

  return (
    <Box onClick={handleActionsClick}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size={size} variant="ghost">
            <PiDotsThreeVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <AddChildComponentMenuSection component={component} onAddChild={handleAddChild} />
              <AddComponentStitchLineMenu component={component} onAddStitchLine={handleAddStitchLine} />
              <MoveComponentMenuSection
                siblingMoveState={siblingMoveState}
                onMoveDown={handleMoveDown}
                onMoveUp={handleMoveUp}
              />
              <Menu.Item
                disabled={!canDelete}
                onClick={handleDelete}
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <PiTrash />
                <Menu.ItemText>{t.common.componentActions.remove}</Menu.ItemText>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  )
}

type AddChildComponentMenuProps = {
  onAddChild: (type: ComponentSchema['type']) => void
  component: ComponentSchema
}

const AddChildComponentMenuSection: FC<AddChildComponentMenuProps> = ({ onAddChild, component }) => {
  const t = useTranslation()

  const possibleTypes = useMemo<ComponentSchema['type'][]>(() => {
    switch (component.type) {
      case 'panel':
      case 'root-panel':
        return ['panel', 'pocket-cluster']
      case 'pocket-cluster':
        return []
      default:
        return []
    }
  }, [component.type])

  const labels = useMemo<Record<ComponentSchema['type'], string>>(
    () => ({
      panel: t.common.componentActions.add(t.component.types.panel),
      'root-panel': t.common.componentActions.add(t.component.types.rootPanel),
      'pocket-cluster': t.common.componentActions.add(t.component.types.pocketCluster),
    }),
    [t],
  )

  return (
    <>
      {possibleTypes.map((type) => {
        const Icon = getComponentIcon(type)
        return (
          <Menu.Item key={type} value={type} onClick={() => onAddChild(type)}>
            <Icon />
            <Menu.ItemText>{labels[type]}</Menu.ItemText>
          </Menu.Item>
        )
      })}
      {possibleTypes.length > 0 ? <Menu.Separator /> : null}
    </>
  )
}

type AddComponentStitchLineMenuProps = {
  onAddStitchLine: (type: StitchLineSchema['type']) => void
  component: ComponentSchema
}

export const AddComponentStitchLineMenu: FC<AddComponentStitchLineMenuProps> = ({ component, onAddStitchLine }) => {
  const t = useTranslation()

  const possibleTypes = useMemo<StitchLineSchema['type'][]>(() => {
    switch (component.type) {
      case 'panel':
        return ['component-bounds-stitch-line']
      case 'root-panel':
        return ['component-bounds-stitch-line']
      case 'pocket-cluster':
        return ['component-bounds-stitch-line', 'pocket-cluster-stitch-line']
      default:
        return []
    }
  }, [component.type])

  const labels = useMemo<Record<StitchLineSchema['type'], string>>(
    () => ({
      'component-bounds-stitch-line': t.common.componentActions.add(t.stitchLine.types.componentBounds),
      'pocket-cluster-stitch-line': t.common.componentActions.add(t.stitchLine.types.pocketCluster),
    }),
    [t],
  )

  return (
    <>
      {possibleTypes.map((type) => {
        return (
          <Menu.Item key={type} value={type} onClick={() => onAddStitchLine(type)}>
            <PiNeedle />
            <Menu.ItemText>{labels[type]}</Menu.ItemText>
          </Menu.Item>
        )
      })}
      {possibleTypes.length > 0 ? <Menu.Separator /> : null}
    </>
  )
}

type MoveComponentMenuSectionProps = {
  onMoveUp: () => void
  onMoveDown: () => void
  siblingMoveState: SiblingMoveState
}

const MoveComponentMenuSection: FC<MoveComponentMenuSectionProps> = ({ onMoveDown, onMoveUp, siblingMoveState }) => {
  const t = useTranslation()

  return (
    <>
      <Menu.Item disabled={!siblingMoveState.canMoveUp} onClick={onMoveUp} value="move-up">
        <PiCaretUp />
        <Menu.ItemText>{t.common.componentActions.moveUp}</Menu.ItemText>
      </Menu.Item>
      <Menu.Item disabled={!siblingMoveState.canMoveDown} onClick={onMoveDown} value="move-down">
        <PiCaretDown />
        <Menu.ItemText>{t.common.componentActions.moveDown}</Menu.ItemText>
      </Menu.Item>
      <Menu.Separator />
    </>
  )
}
