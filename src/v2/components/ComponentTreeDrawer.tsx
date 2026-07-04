import {
  Button,
  DialogOpenChangeData,
  DialogOpenChangeEvent,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Tree,
  TreeItem,
  TreeItemLayout,
} from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { useAtomValue } from 'jotai'
import { useCallback, type FC } from 'react'

import { useChild } from '../hooks/useChild'
import { useChildren } from '../hooks/useChildren'
import type { ComponentSchema } from '../schemas/components'
import { rootComponentIdAtom } from '../state'

type ComponentTreeDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getComponentLabel = (component: ComponentSchema): string => component.name || component.id

type ComponentTreeItemProps = {
  component: ComponentSchema
}

const ComponentTreeItem: FC<ComponentTreeItemProps> = ({ component }) => {
  const children = useChildren(component)
  const isBranch = children.length > 0

  return (
    <TreeItem itemType={isBranch ? 'branch' : 'leaf'} value={component.id}>
      <TreeItemLayout aside={component.type}>{getComponentLabel(component)}</TreeItemLayout>
      {isBranch && (
        <Tree>
          {children.map((child) => (
            <ComponentTreeItem key={child.id} component={child} />
          ))}
        </Tree>
      )}
    </TreeItem>
  )
}

export const ComponentTreeDrawer: FC<ComponentTreeDrawerProps> = ({ open, onOpenChange }) => {
  const rootComponentId = useAtomValue(rootComponentIdAtom)
  const rootComponent = useChild(rootComponentId)

  const handleOpenChange = useCallback(
    (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
      onOpenChange(data.open)
    },
    [onOpenChange],
  )

  return (
    <Drawer separator type="inline" onOpenChange={handleOpenChange} open={open} position="end" size="small">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Komponensfa bezárása"
              icon={<DismissRegular />}
              onClick={() => onOpenChange(false)}
            />
          }
        >
          Komponensfa
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <Tree appearance="subtle" defaultOpenItems={[rootComponentId]} size="small">
          <ComponentTreeItem component={rootComponent} />
        </Tree>
      </DrawerBody>
    </Drawer>
  )
}
