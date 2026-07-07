import { Button, makeStyles, Menu, MenuTrigger, tokens } from '@fluentui/react-components'
import { AddRegular, ChevronDownRegular, ChevronUpRegular, DeleteRegular } from '@fluentui/react-icons'
import { useAtom } from 'jotai'
import { useCallback, useMemo, type FC, type MouseEvent } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'
import { addComponent } from '../utils/addComponent'
import { getParent } from '../utils/getParent'
import { hasChildren } from '../utils/hasChildren'
import { isDefined } from '../utils/isDefined'
import { moveComponentWithinParent } from '../utils/moveComponentWithinParent'
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
  const [components, setComponents] = useAtom(componentsAtom)
  const canDelete = useMemo((): boolean => component.type !== 'root-panel', [component.type])
  const canAdd = useMemo((): boolean => hasChildren(component), [component])
  const siblingMoveState = useMemo(() => {
    if (component.type === 'root-panel') {
      return { canMoveUp: false, canMoveDown: false }
    }

    const parent = getParent(component.id, components)

    if (!isDefined(parent)) {
      return { canMoveUp: false, canMoveDown: false }
    }

    const index = parent.children.indexOf(component.id)

    return {
      canMoveUp: index > 0,
      canMoveDown: index >= 0 && index < parent.children.length - 1,
    }
  }, [component.id, component.type, components])

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

  const handleMoveUp = useCallback((): void => {
    if (!siblingMoveState.canMoveUp) {
      return
    }
    setComponents((components) => moveComponentWithinParent(component.id, 'up', components))
  }, [component.id, setComponents, siblingMoveState.canMoveUp])

  const handleMoveDown = useCallback((): void => {
    if (!siblingMoveState.canMoveDown) {
      return
    }
    setComponents((components) => moveComponentWithinParent(component.id, 'down', components))
  }, [component.id, setComponents, siblingMoveState.canMoveDown])

  return (
    <div className={styles.root} onClick={handleActionsClick}>
      <Button
        appearance="subtle"
        aria-label="Elem mozgatása fel"
        disabled={!siblingMoveState.canMoveUp}
        icon={<ChevronUpRegular />}
        onClick={handleMoveUp}
        size="small"
      />
      <Button
        appearance="subtle"
        aria-label="Elem mozgatása le"
        disabled={!siblingMoveState.canMoveDown}
        icon={<ChevronDownRegular />}
        onClick={handleMoveDown}
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
