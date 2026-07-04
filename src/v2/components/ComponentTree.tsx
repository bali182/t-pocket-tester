import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useCallback, type FC, type ReactNode } from 'react'

import { useChild } from '../hooks/useChild'
import { useChildren } from '../hooks/useChildren'
import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { rootComponentIdAtom } from '../state'

type ComponentTreeItemProps = {
  component: ComponentSchema
}

const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ component }) => {
  const children = useChildren(component)
  const Icon = useComponentIcon(component)
  const isBranch = children.length > 0
  const renderChild = useCallback(
    (child: ComponentSchema): ReactNode => <ComponentTreeItem key={child.id} component={child} />,
    [],
  )

  return (
    <TreeItem itemType={isBranch ? 'branch' : 'leaf'} value={component.id}>
      <TreeItemLayout aside={component.type} iconBefore={<Icon />}>
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
