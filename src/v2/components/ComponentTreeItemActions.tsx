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
import { AddRegular, DeleteRegular, EditRegular } from '@fluentui/react-icons'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'

import { useDrawAreaContext } from '../contexts/DrawAreaContext'
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
  const { onComponentClick } = useDrawAreaContext()
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasChildren(component), [component])

  const handleActionsClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleEdit = useCallback((): void => {
    const element = document.querySelector<SVGGraphicsElement>(`[data-component-id="${CSS.escape(component.id)}"]`)

    if (!element) {
      return
    }

    onComponentClick(component, element)
  }, [component, onComponentClick])

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

  return (
    <div className={styles.root} onClick={handleActionsClick}>
      <Button
        appearance="subtle"
        aria-label="Elem szerkesztése"
        icon={<EditRegular />}
        onClick={handleEdit}
        size="small"
      />
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
            <MenuItem onClick={handleAddPanel}>Panel</MenuItem>
            <MenuItem disabled>Pocket</MenuItem>
            <MenuItem onClick={handleAddPocketCluster}>Pocket cluster</MenuItem>
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
