import { Button, makeStyles, tokens } from '@fluentui/react-components'
import { useCallback, useMemo, useState, type FC } from 'react'
import { PiTreeStructure } from 'react-icons/pi'

import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { setOpacity } from '../utils/setOpacity'
import { ComponentTreeDrawer } from './ComponentTreeDrawer'
import { DrawArea } from './DrawArea'
import { FloatingEditor } from './editors/FloatingEditor'

type ComponentHoverCardTarget = {
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
  const [componentHoverCardTarget, setComponentHoverCardTarget] = useState<ComponentHoverCardTarget | undefined>()
  const [isComponentTreeOpen, setIsComponentTreeOpen] = useState(false)

  const handleComponentClick = useCallback((component: ComponentSchema, element: SVGGraphicsElement): void => {
    setComponentHoverCardTarget({
      component,
      element,
    })
  }, [])

  const getHoverBackgroundColor = useCallback((component: ComponentSchema): string => {
    return setOpacity(component.color, 0.3)
  }, [])

  const handleFloatingEditorClose = useCallback((): void => {
    setComponentHoverCardTarget(undefined)
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
      onComponentClick: handleComponentClick,
      getHoverBackgroundColor,
    }),
    [getHoverBackgroundColor, handleComponentClick],
  )

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <div className={styles.root}>
        <div className={styles.editor}>
          <DrawArea />

          {componentHoverCardTarget && (
            <FloatingEditor
              component={componentHoverCardTarget.component}
              anchorElement={componentHoverCardTarget.element}
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
