import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components'
import { AddRegular, DeleteRegular } from '@fluentui/react-icons'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'

import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'
import { addComponent } from '../utils/addComponent'
import { hasChildren } from '../utils/hasChildren'
import { removeComponent } from '../utils/removeComponent'

type ComponentTreeItemActionsProps = {
  component: ComponentSchema
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXS,
  },
})

export const ComponentTreeItemActions: FC<ComponentTreeItemActionsProps> = ({ component }) => {
  const styles = useStyles()
  const setComponents = useSetAtom(componentsAtom)
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasChildren(component), [component])

  const handleActionsClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleAddPanel = useCallback((): void => {
    if (!canAdd) {
      return
    }
    setComponents((components) => addComponent(component.id, 'panel', components))
  }, [canAdd, component.id, setComponents])

  const handleAddPocketCluster = useCallback((): void => {
    if (!canAdd) {
      return
    }
    setComponents((components) => addComponent(component.id, 'pocket-cluster', components))
  }, [canAdd, component.id, setComponents])

  const handleDelete = useCallback((): void => {
    if (!canDelete) {
      return
    }
    setComponents((components) => removeComponent(component.id, components))
  }, [canDelete, component.id, setComponents])

  const PanelIcon = useComponentIcon('panel')
  const PocketClusterIcon = useComponentIcon('pocket-cluster')

  return (
    <div className={styles.root} onClick={handleActionsClick}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            aria-label="Elem hozzáadása"
            disabled={!canAdd}
            icon={<AddRegular />}
            size="small"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<PanelIcon />} onClick={handleAddPanel}>
              Panel
            </MenuItem>
            <MenuItem icon={<PocketClusterIcon />} onClick={handleAddPocketCluster}>
              Zsebek
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Button
        appearance="subtle"
        aria-label="Elem törlése"
        disabled={!canDelete}
        icon={<DeleteRegular />}
        onClick={handleDelete}
        size="small"
      />
    </div>
  )
}
