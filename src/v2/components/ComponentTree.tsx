import {
  makeStyles,
  tokens,
  Tree,
  TreeItem,
  TreeItemLayout,
  type TreeItemValue,
  type TreeOpenChangeData,
  type TreeOpenChangeEvent,
} from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState, type FC, type ReactNode } from 'react'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useChildren } from '../hooks/useChildren'
import { useComponent } from '../hooks/useComponent'
import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { getComponentAncestorIds } from '../utils/getComponentAncestorIds'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeItemActions } from './ComponentTreeItemActions'

type ComponentTreeItemProps = {
  component: ComponentSchema
  selectedComponentId: string | undefined
}

type ComponentTreeProps = {
  selectedComponentId: string | undefined
}

const useStyles = makeStyles({
  selectedTreeItemLayout: {
    backgroundColor: tokens.colorSubtleBackgroundSelected,
    color: tokens.colorNeutralForeground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
})

const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ component, selectedComponentId }) => {
  const styles = useStyles()
  const { onComponentClick } = useDrawAreaContext()
  const children = useChildren(component)
  const Icon = useComponentIcon(component.type)
  const isBranch = children.length > 0
  const isSelected = component.id === selectedComponentId
  const renderChild = useCallback(
    (child: ComponentSchema): ReactNode => (
      <ComponentTreeItem key={child.id} component={child} selectedComponentId={selectedComponentId} />
    ),
    [selectedComponentId],
  )

  const handleTreeItemClick = useCallback((): void => {
    const element = document.querySelector<SVGGraphicsElement>(`[data-component-id="${CSS.escape(component.id)}"]`)
    if (!isDefined(element)) {
      return
    }
    onComponentClick(component, element)
  }, [component, onComponentClick])

  return (
    <TreeItem itemType={isBranch ? 'branch' : 'leaf'} value={component.id} onClick={handleTreeItemClick}>
      <TreeItemLayout
        actions={<ComponentTreeItemActions component={component} />}
        aria-current={isSelected ? 'true' : undefined}
        className={isSelected ? styles.selectedTreeItemLayout : undefined}
        iconBefore={<Icon />}
      >
        {component.name}
      </TreeItemLayout>
      {isBranch && <Tree>{children.map(renderChild)}</Tree>}
    </TreeItem>
  )
}

export const ComponentTree: FC<ComponentTreeProps> = ({ selectedComponentId }) => {
  const project = useAtomValue(projectAtom)
  const rootComponent = useComponent(project.root)
  const [openItems, setOpenItems] = useState<Set<TreeItemValue>>(() => new Set([project.root]))

  useEffect(() => {
    if (!isDefined(selectedComponentId)) {
      return
    }
    const ancestorIds = getComponentAncestorIds(selectedComponentId, project)
    setOpenItems((openItems) => new Set([...openItems, ...ancestorIds]))
  }, [project, selectedComponentId])

  const handleOpenChange = useCallback((_event: TreeOpenChangeEvent, data: TreeOpenChangeData): void => {
    setOpenItems(data.openItems)
  }, [])

  return (
    <Tree
      aria-label="Komponensek"
      appearance="subtle"
      onOpenChange={handleOpenChange}
      openItems={openItems}
      size="small"
    >
      <ComponentTreeItem component={rootComponent} selectedComponentId={selectedComponentId} />
    </Tree>
  )
}
