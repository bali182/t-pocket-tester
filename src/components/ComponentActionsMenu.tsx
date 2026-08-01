import { Box, IconButton, IconButtonProps, Menu, Portal } from '@chakra-ui/react'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCircleDashed, PiCopy, PiDotsThreeVertical, PiNeedle, PiRectangleDashed, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import { hasComponentChildren } from '../operations/project/utils/hasComponentChildren'
import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { getComponentIcon } from '../utils/getComponentIcon'
import { noop } from '../utils/noop'

type ComponentActionsProps = {
  component: ComponentSchema
  size: IconButtonProps['size']
  onAddChild?: (parentId: string, type: ComponentSchema['type']) => void
  onAddStitchLine?: (componentId: string, type: StitchLineSchema['type']) => void
  onDelete?: (componentId: string) => void
}

export const ComponentActionsMenu: FC<ComponentActionsProps> = ({
  component,
  size,
  onAddChild = noop,
  onAddStitchLine = noop,
  onDelete = noop,
}) => {
  const t = useTranslation()
  const { addComponent, addHole, addStitchLine, cloneComponent, deleteComponent } = useProject()
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasComponentChildren(component), [component])
  const canClone = useMemo((): boolean => component.type !== 'root-panel', [component.type])

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

  const handleClone = useCallback((): void => {
    if (!canClone) {
      return
    }

    cloneComponent(component.id)
  }, [canClone, cloneComponent, component.id])

  const handleAddStitchLine = useCallback(
    (type: StitchLineSchema['type']): void => {
      addStitchLine(component.id, type)
      onAddStitchLine(component.id, type)
    },
    [addStitchLine, component, onAddStitchLine],
  )

  const handleAddRectHole = useCallback((): void => {
    addHole(component.id, 'rect-hole')
  }, [addHole, component.id])

  const handleAddCircleHole = useCallback((): void => {
    addHole(component.id, 'circle-hole')
  }, [addHole, component.id])

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
              <Menu.Item value="rect-hole" onClick={handleAddRectHole}>
                <PiRectangleDashed />
                <Menu.ItemText>{t.common.actions.addByName(t.hole.types.rectangle)}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item value="circle-hole" onClick={handleAddCircleHole}>
                <PiCircleDashed />
                <Menu.ItemText>{t.common.actions.addByName(t.hole.types.circle)}</Menu.ItemText>
              </Menu.Item>
              <Menu.Separator />
              <AddComponentStitchLineMenu component={component} onAddStitchLine={handleAddStitchLine} />
              <Menu.Item onClick={handleClone} value="clone" disabled={!canClone}>
                <PiCopy />
                <Menu.ItemText>{t.common.actions.clone}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item
                disabled={!canDelete}
                onClick={handleDelete}
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <PiTrash />
                <Menu.ItemText>{t.common.actions.remove}</Menu.ItemText>
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
      panel: t.common.actions.addByName(t.component.types.panel),
      'root-panel': t.common.actions.addByName(t.component.types.rootPanel),
      'pocket-cluster': t.common.actions.addByName(t.component.types.pocketCluster),
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
      'component-bounds-stitch-line': t.common.actions.addByName(t.stitchLine.types.componentBounds),
      'pocket-cluster-stitch-line': t.common.actions.addByName(t.stitchLine.types.pocketCluster),
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
