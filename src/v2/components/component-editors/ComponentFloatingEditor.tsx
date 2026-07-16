import { type FC } from 'react'

import { useEditableComponent } from '../../hooks/useEditableComponent'
import type { ComponentSchema } from '../../schemas/components'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { SectionGroup } from '../common/SectionGroup'
import { ComponentEditor } from './ComponentEditor'
import { ComponentEditorHeaderMenu } from './ComponentEditorHeaderMenu'

type ComponentFloatingEditorProps = {
  anchorElement: SVGGraphicsElement
  component: ComponentSchema
  onClose: () => void
}

export const ComponentFloatingEditor: FC<ComponentFloatingEditorProps> = ({ anchorElement, component, onClose }) => {
  const {
    component: editedComponent,
    editableComponent,
    setComponent,
    validationIssues,
  } = useEditableComponent(component.id)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<ComponentEditorHeaderMenu component={editedComponent} onClose={onClose} />}
        title={`#${editedComponent.id}`}
      />
      <SectionGroup.Root>
        <ComponentEditor
          component={editedComponent}
          editable={editableComponent}
          issues={validationIssues as ValidationIssuesSchema<ComponentSchema>}
          onChange={setComponent}
        />
      </SectionGroup.Root>
    </FloatingEditor>
  )
}
