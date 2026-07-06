import {
  Button,
  DialogOpenChangeData,
  DialogOpenChangeEvent,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { useCallback, type FC } from 'react'

import { ComponentTree } from './ComponentTree'

type ComponentTreeDrawerProps = {
  open: boolean
  selectedComponentId: string | undefined
  onOpenChange: (open: boolean) => void
}

const useStyles = makeStyles({
  drawer: {
    boxShadow: tokens.shadow16,
  },
})

export const ComponentTreeDrawer: FC<ComponentTreeDrawerProps> = ({ open, selectedComponentId, onOpenChange }) => {
  const styles = useStyles()

  const handleOpenChange = useCallback(
    (_: DialogOpenChangeEvent, data: DialogOpenChangeData): void => {
      onOpenChange(data.open)
    },
    [onOpenChange],
  )

  const handleClose = useCallback((): void => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Drawer
      separator
      className={styles.drawer}
      type="inline"
      onOpenChange={handleOpenChange}
      open={open}
      position="end"
      size="small"
    >
      <DrawerHeader>
        <DrawerHeaderTitle action={<Button appearance="subtle" icon={<DismissRegular />} onClick={handleClose} />}>
          Komponensfa
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <ComponentTree selectedComponentId={selectedComponentId} />
      </DrawerBody>
    </Drawer>
  )
}
