import { MenuItem, MenuList, MenuPopover } from '@fluentui/react-components'
import { type FC, useCallback } from 'react'

import { useComponentIcon } from '../hooks/useComponentIcon'

export type ChildComponentType = 'panel' | 'pocket-cluster'

type AddChildComponentMenuProps = {
  onAddChild: (type: ChildComponentType) => void
}

type AddChildComponentMenuItemProps = {
  label: string
  onAddChild: (type: ChildComponentType) => void
  type: ChildComponentType
}

const AddChildComponentMenuItem: FC<AddChildComponentMenuItemProps> = ({ label, onAddChild, type }) => {
  const Icon = useComponentIcon(type)

  const handleClick = useCallback((): void => {
    onAddChild(type)
  }, [onAddChild, type])

  return (
    <MenuItem icon={<Icon />} onClick={handleClick}>
      {label}
    </MenuItem>
  )
}

export const AddChildComponentMenu: FC<AddChildComponentMenuProps> = ({ onAddChild }) => {
  return (
    <MenuPopover>
      <MenuList>
        <AddChildComponentMenuItem label="Panel" onAddChild={onAddChild} type="panel" />
        <AddChildComponentMenuItem label="Zsebek" onAddChild={onAddChild} type="pocket-cluster" />
      </MenuList>
    </MenuPopover>
  )
}
