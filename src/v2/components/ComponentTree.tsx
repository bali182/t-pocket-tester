import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useCallback, type FC, type ReactNode } from 'react'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
import { useChild } from '../hooks/useChild'
import { useChildren } from '../hooks/useChildren'
import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { rootComponentIdAtom } from '../state'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeItemActions } from './ComponentTreeItemActions'

type ComponentTreeItemProps = {
  component: ComponentSchema
}

const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ component }) => {
  const { onComponentClick } = useDrawAreaContext()
  const children = useChildren(component)
  const Icon = useComponentIcon(component.type)
  const isBranch = children.length > 0
  const renderChild = useCallback(
    (child: ComponentSchema): ReactNode => <ComponentTreeItem key={child.id} component={child} />,
    [],
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
      <TreeItemLayout actions={<ComponentTreeItemActions component={component} />} iconBefore={<Icon />}>
        {component.name}
      </TreeItemLayout>
      {isBranch && <Tree>{children.map(renderChild)}</Tree>}
    </TreeItem>
  )
}

export const ComponentTree: FC = () => {
  const rootComponentId = useAtomValue(rootComponentIdAtom)
  const rootComponent = useChild(rootComponentId)

  return (
    <Tree appearance="subtle" defaultOpenItems={[rootComponentId]} size="small">
      <ComponentTreeItem component={rootComponent} />
    </Tree>
  )
}
