import type { PositioningImperativeRef, PositioningVirtualElement } from '@fluentui/react-components'
import { Button, Caption1Strong, CardHeader, makeStyles, Popover, PopoverSurface } from '@fluentui/react-components'
import { DismissRegular } from '@fluentui/react-icons'
import { useAtom } from 'jotai'
import { MouseEvent, useCallback, useEffect, useMemo, useRef, type FC } from 'react'

import type { ComponentSchema } from '../../schemas/components'
import { projectAtom } from '../../state'
import { addComponent } from '../../utils/addComponent'
import { isDefined } from '../../utils/isDefined'
import { removeComponent } from '../../utils/removeComponent'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { ComponentEditor } from './ComponentEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

const useStyles = makeStyles({
  surface: {
    width: '320px',
    zIndex: 1000,
  },
  body: {
    padding: 0,
  },
})

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const styles = useStyles()
  const [project, setProject] = useAtom(projectAtom)
  const positioningRef = useRef<PositioningImperativeRef>(null)
  const editedComponent = project.components[component.id]
  const positioningTarget = useMemo<PositioningVirtualElement>(
    () => ({
      getBoundingClientRect: () => anchorElement.getBoundingClientRect(),
      contextElement: anchorElement,
    }),
    [anchorElement],
  )

  useEffect(() => {
    const editorElement = anchorElement.ownerSVGElement?.parentElement

    if (!isDefined(editorElement)) {
      return
    }

    const observer = new ResizeObserver((): void => {
      positioningRef.current?.updatePosition()
    })

    observer.observe(editorElement)

    return (): void => {
      observer.disconnect()
    }
  }, [anchorElement])

  const handleComponentChange = useCallback(
    (updated: ComponentSchema) => {
      setProject((project) => ({
        ...project,
        components: {
          ...project.components,
          [updated.id]: updated,
        },
      }))
    },
    [setProject],
  )

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      setProject((project) => addComponent(component.id, type, project))
    },
    [component.id, setProject],
  )

  const handleRemoveComponent = useCallback((): void => {
    setProject((project) => removeComponent(component.id, project))
  }, [component.id, setProject])

  const captureClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  useEffect(() => {
    if (!isDefined(editedComponent)) {
      onClose()
    }
  }, [editedComponent, onClose])

  if (!isDefined(editedComponent)) {
    return null
  }

  return (
    <Popover
      open
      positioning={{
        align: 'top',
        fallbackPositions: ['before-top', 'below', 'above', 'after-top'],
        offset: 10,
        overflowBoundaryPadding: 8,
        position: 'after',
        positioningRef,
        strategy: 'fixed',
        target: positioningTarget,
      }}
      withArrow
    >
      <PopoverSurface className={styles.surface} onClick={captureClick}>
        <CardHeader
          action={
            <Button appearance="subtle" aria-label="Bezárás" icon={<DismissRegular />} onClick={onClose} size="small" />
          }
          header={<Caption1Strong>#{editedComponent.id}</Caption1Strong>}
        />
        <div className={styles.body}>
          <ComponentEditor
            component={editedComponent}
            onAddChild={handleAddChild}
            onChange={handleComponentChange}
            onRemoveComponent={handleRemoveComponent}
          />
        </div>
      </PopoverSurface>
    </Popover>
  )
}
