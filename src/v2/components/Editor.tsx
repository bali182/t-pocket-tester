import { Box } from '@chakra-ui/react'
import { makeStyles } from '@fluentui/react-components'
import { useCallback, useMemo, useState, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'
import { ComponentTree } from './ComponentTree'
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
})

export const Editor: FC = () => {
  const styles = useStyles()
  const [componentId, setComponentId] = useState<string | undefined>()
  const [element, setElement] = useState<SVGGraphicsElement | undefined>()
  const project = useAtomValue(projectAtom)
  const component = isDefined(componentId) ? project.components[componentId] : undefined

  const handleComponentClick = useCallback((component: ComponentSchema, element: SVGGraphicsElement): void => {
    setComponentId(component.id)
    setElement(element)
  }, [])

  const handleFloatingEditorClose = useCallback((): void => {
    setComponentId(undefined)
    setElement(undefined)
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
        </div>
        <Box flexShrink={0} height="100%" overflow="auto" padding="4" width="400px">
          <ComponentTree selectedComponentId={componentId} />
        </Box>
      </div>
    </DrawAreaContext.Provider>
  )
}
