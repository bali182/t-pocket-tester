import { Button, makeStyles, Menu, MenuTrigger, tokens } from '@fluentui/react-components'
import { AddRegular, DeleteRegular } from '@fluentui/react-icons'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'
import { addComponent } from '../utils/addComponent'
import { hasChildren } from '../utils/hasChildren'
import { removeComponent } from '../utils/removeComponent'
import { AddChildComponentMenu, type ChildComponentType } from './AddChildComponentMenu'

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

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      if (!canAdd) {
        return
      }
      setComponents((components) => addComponent(component.id, type, components))
    },
    [canAdd, component.id, setComponents],
  )

  const handleDelete = useCallback((): void => {
    if (!canDelete) {
      return
    }
    setComponents((components) => removeComponent(component.id, components))
  }, [canDelete, component.id, setComponents])

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
        <AddChildComponentMenu onAddChild={handleAddChild} />
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
