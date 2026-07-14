import { Popover, Tabs, usePopover } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import { MouseEvent, useCallback, useEffect, useMemo, type FC } from 'react'
import { TbNeedleThread } from 'react-icons/tb'

import { useComponentIcon } from '../../hooks/useComponentIcon'
import { useEditableComponent } from '../../hooks/useEditableComponent'
import type { ComponentSchema } from '../../schemas/components'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { projectAtom } from '../../state'
import { addComponent } from '../../utils/addComponent'
import { getComponentNameByType } from '../../utils/getComponentNameByType'
import { isDefined } from '../../utils/isDefined'
import { removeComponent } from '../../utils/removeComponent'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { ComponentEditor } from './ComponentEditor'
import { FloatingEditorHeader } from './FloatingEditorHeader'
import { SectionGroup } from './SectionGroup'
import { StitchingEditor } from './StitchingEditor'

type FloatingEditorProps = {
  component: ComponentSchema
  anchorElement: SVGGraphicsElement
  onClose: () => void
}

const tabContentStyles = {
  gridArea: '1 / 1',
  pointerEvents: 'none',
  visibility: 'hidden',
  '&[data-selected]': {
    pointerEvents: 'auto',
    visibility: 'visible',
  },
}

export const FloatingEditor: FC<FloatingEditorProps> = ({ component, anchorElement, onClose }) => {
  const setProject = useSetAtom(projectAtom)
  const {
    component: editedComponent,
    editableComponent,
    setComponent,
    validationIssues,
  } = useEditableComponent(component.id)

  const ComponentIcon = useComponentIcon(editedComponent.type)
  const componentTabLabel = getComponentNameByType(editedComponent.type)

  const positioningTarget = useMemo(
    () => ({
      getBoundingClientRect: () => anchorElement.getBoundingClientRect(),
      contextElement: anchorElement,
    }),
    [anchorElement],
  )
  const popover = usePopover({
    open: true,
    onOpenChange: ({ open }) => {
      if (!open) {
        onClose()
      }
    },
    positioning: {
      flip: ['left-start', 'bottom', 'top', 'right-start'],
      getAnchorElement: () => positioningTarget,
      gutter: 10,
      overflowPadding: 8,
      placement: 'right-start',
      strategy: 'fixed',
    },
  })

  useEffect(() => {
    const editorElement = anchorElement.ownerSVGElement?.parentElement

    if (!isDefined(editorElement)) {
      return
    }

    const observer = new ResizeObserver((): void => {
      popover.reposition()
    })

    observer.observe(editorElement)

    return (): void => {
      observer.disconnect()
    }
  }, [anchorElement, popover])

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      setProject((project) => addComponent(component.id, type, project))
    },
    [component.id, setProject],
  )

  const handleRemoveComponent = useCallback((): void => {
    onClose()
    setProject((project) => removeComponent(component.id, project))
  }, [component.id, onClose, setProject])

  const captureClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Popover.RootProvider value={popover}>
      <Popover.Positioner>
        <Popover.Content onClick={captureClick} width="400px" zIndex="popover">
          <Popover.Arrow />
          <FloatingEditorHeader
            componentId={editedComponent.id}
            onAddChild={editedComponent.type === 'pocket-cluster' ? undefined : handleAddChild}
            onRemoveComponent={editedComponent.type === 'root-panel' ? undefined : handleRemoveComponent}
          />
          <Tabs.Root defaultValue="component">
            <Tabs.List>
              <Tabs.Trigger value="component">
                <ComponentIcon />
                {componentTabLabel}
              </Tabs.Trigger>
              <Tabs.Trigger value="stitching">
                <TbNeedleThread />
                Varrások
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.ContentGroup display="grid">
              <Tabs.Content css={tabContentStyles} hidden={false} pt="0" value="component">
                <SectionGroup.Root>
                  <ComponentEditor
                    component={editedComponent}
                    editable={editableComponent}
                    issues={validationIssues as ValidationIssuesSchema<ComponentSchema>}
                    onChange={setComponent}
                  />
                </SectionGroup.Root>
              </Tabs.Content>
              <Tabs.Content css={tabContentStyles} hidden={false} pt="0" value="stitching">
                <StitchingEditor />
              </Tabs.Content>
            </Tabs.ContentGroup>
          </Tabs.Root>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.RootProvider>
  )
}
