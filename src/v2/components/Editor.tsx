import { Button, makeStyles, tokens } from '@fluentui/react-components'
import { useCallback, useMemo, useState, type FC } from 'react'
import { PiTreeStructure } from 'react-icons/pi'

import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { ComponentTreeDrawer } from './ComponentTreeDrawer'
import { DrawArea } from './DrawArea'
import { FloatingEditor } from './editors/FloatingEditor'

type EditedComponent = {
  component: ComponentSchema
  element: SVGGraphicsElement
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  },
  editor: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  componentTreeButton: {
    bottom: tokens.spacingVerticalL,
    position: 'absolute',
    right: tokens.spacingHorizontalL,
    zIndex: 1000,
  },
})

export const Editor: FC = () => {
  const styles = useStyles()
  const [editedComponent, setEditedComponent] = useState<EditedComponent | undefined>()
  const [isComponentTreeOpen, setIsComponentTreeOpen] = useState(true)

  const handleComponentClick = useCallback((component: ComponentSchema, element: SVGGraphicsElement): void => {
    setEditedComponent({ component, element })
  }, [])

  const handleFloatingEditorClose = useCallback((): void => {
    setEditedComponent(undefined)
  }, [])

  const handleComponentTreeButtonClick = useCallback((): void => {
    setIsComponentTreeOpen(!isComponentTreeOpen)
  }, [isComponentTreeOpen])

  const handleComponentTreeOpenChange = useCallback((open: boolean): void => {
    setIsComponentTreeOpen(open)
  }, [])

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: true,
      editedComponent,
      onComponentClick: handleComponentClick,
    }),
    [editedComponent, handleComponentClick],
  )

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <div className={styles.root}>
        <div className={styles.editor} onClick={handleFloatingEditorClose}>
          <DrawArea />

          {editedComponent && (
            <FloatingEditor
              component={editedComponent.component}
              anchorElement={editedComponent.element}
              onClose={handleFloatingEditorClose}
            />
          )}

          <Button
            appearance="primary"
            aria-label="Komponensfa megnyitása"
            size="large"
            className={styles.componentTreeButton}
            icon={<PiTreeStructure />}
            onClick={handleComponentTreeButtonClick}
          />
        </div>
        <ComponentTreeDrawer open={isComponentTreeOpen} onOpenChange={handleComponentTreeOpenChange} />
      </div>
    </DrawAreaContext.Provider>
  )
}
