import { Box, IconButton, IconButtonProps, Menu, Portal } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'
import { PiCopy, PiDotsThreeVertical, PiNeedle, PiRectangleDashed, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import { useProjectOperations } from '../hooks/useProjectOperations'
import { useSubProject } from '../hooks/useSubProject'
import { useSubProjectOperations } from '../hooks/useSubProjectOperations'
import { hasComponentChildren } from '../operations/subProject/utils/hasComponentChildren'
import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { pendingSubProjectDeletionAtom } from '../state/pendigDeletionAtoms'
import { useTranslation } from '../translations/translation'
import { getComponentIcon } from '../utils/getComponentIcon'
import { isDefined } from '../utils/isDefined'
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
  const { project } = useProject()
  const { subProject } = useSubProject()
  const setPendingSubProjectDeletion = useSetAtom(pendingSubProjectDeletionAtom)
  const { cloneSubProject, deleteSubProject } = useProjectOperations()
  const { addComponent, addHole, addStitchLineToComponent, cloneComponent, deleteComponent } = useSubProjectOperations()
  const canAdd = useMemo((): boolean => hasComponentChildren(component), [component])

  const nextSubProjectAfterDelete = useMemo(() => {
    const subProjectIndex = project.subProjects.findIndex((candidate) => candidate.id === subProject.id)
    if (project.subProjects.length === 1 && project.subProjects[0] === subProject) {
      return undefined
    }
    return subProjectIndex === 0 ? project.subProjects[1] : project.subProjects[subProjectIndex - 1]
  }, [project.subProjects, subProject])

  const deleteRoot = useCallback((): void => {
    const navigationTarget = isDefined(nextSubProjectAfterDelete)
      ? `/projects/${project.id}/${nextSubProjectAfterDelete.id}`
      : `/projects/${project.id}`
    setPendingSubProjectDeletion({ redirectPath: navigationTarget, subProjectId: subProject.id })
    deleteSubProject()
    onDelete(component.id)
  }, [
    component.id,
    deleteSubProject,
    nextSubProjectAfterDelete,
    onDelete,
    project.id,
    setPendingSubProjectDeletion,
    subProject.id,
  ])

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
    switch (component.type) {
      case 'root-panel': {
        deleteRoot()
        break
      }
      case 'panel':
      case 'pocket-cluster': {
        deleteComponent(component.id)
        onDelete(component.id)
        break
      }
    }
  }, [onDelete, component.id, component.type, deleteComponent, deleteRoot])

  const handleClone = useCallback((): void => {
    switch (component.type) {
      case 'root-panel': {
        cloneSubProject()
        break
      }
      case 'panel':
      case 'pocket-cluster': {
        cloneComponent(component.id)
        break
      }
    }
  }, [cloneComponent, cloneSubProject, component.id, component.type])

  const handleAddStitchLine = useCallback(
    (type: StitchLineSchema['type']): void => {
      addStitchLineToComponent(component.id, type)
      onAddStitchLine(component.id, type)
    },
    [addStitchLineToComponent, component, onAddStitchLine],
  )

  const handleAddHole = useCallback((): void => {
    addHole(component.id)
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
              <Menu.Item value="hole" onSelect={handleAddHole}>
                <PiRectangleDashed />
                <Menu.ItemText>{t.common.actions.addByName(t.hole.title)}</Menu.ItemText>
              </Menu.Item>
              <Menu.Separator />
              <AddComponentStitchLineMenu component={component} onAddStitchLine={handleAddStitchLine} />
              <Menu.Item value="clone" onSelect={handleClone}>
                <PiCopy />
                <Menu.ItemText>{t.common.actions.clone}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item
                onSelect={handleDelete}
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
          <Menu.Item key={type} value={type} onSelect={() => onAddChild(type)}>
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
          <Menu.Item key={type} value={type} onSelect={() => onAddStitchLine(type)}>
            <PiNeedle />
            <Menu.ItemText>{labels[type]}</Menu.ItemText>
          </Menu.Item>
        )
      })}
      {possibleTypes.length > 0 ? <Menu.Separator /> : null}
    </>
  )
}
