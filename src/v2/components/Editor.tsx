import { Button, makeStyles, tokens } from '@fluentui/react-components'
import { useCallback, useMemo, useState, type FC } from 'react'
import { PiTreeStructure } from 'react-icons/pi'

import { useAtomValue } from 'jotai'
import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'
import { isDefined } from '../utils/isDefined'
import { ComponentTreeDrawer } from './ComponentTreeDrawer'
import { DrawArea } from './DrawArea'
import { FloatingEditor } from './editors/FloatingEditor'

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
  const [componentId, setComponentId] = useState<string | undefined>()
  const [element, setElement] = useState<SVGGraphicsElement | undefined>()
  const [isComponentTreeOpen, setIsComponentTreeOpen] = useState(true)
  const components = useAtomValue(componentsAtom)
  const component = isDefined(componentId) ? components[componentId] : undefined

  const handleComponentClick = useCallback((component: ComponentSchema, element: SVGGraphicsElement): void => {
    setComponentId(component.id)
    setElement(element)
  }, [])

  const handleFloatingEditorClose = useCallback((): void => {
    setComponentId(undefined)
    setElement(undefined)
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
      component,
      element,
      onComponentClick: handleComponentClick,
    }),
    [component, element, handleComponentClick],
  )

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <div className={styles.root}>
        <div className={styles.editor} onClick={handleFloatingEditorClose}>
          <DrawArea />

          {isDefined(component) && isDefined(element) && (
            <FloatingEditor component={component} anchorElement={element} onClose={handleFloatingEditorClose} />
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
