import { type FC } from 'react'

import { useEditableComponent } from '../../hooks/useEditableComponent'
import { useSubProject } from '../../hooks/useSubProject'
import type { ComponentSchema } from '../../schemas/components'
import type { FloatingEditorAnchor } from '../../utils/svgElementUtils'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { SectionGroup } from '../common/SectionGroup'
import { ComponentActionsMenu } from '../ComponentActionsMenu'
import { ComponentEditor } from './ComponentEditor'

type ComponentFloatingEditorProps = {
  anchorElement: FloatingEditorAnchor
  component: ComponentSchema
  onClose: () => void
}

export const ComponentFloatingEditor: FC<ComponentFloatingEditorProps> = ({ anchorElement, component, onClose }) => {
  const { subProject } = useSubProject()
  const {
    component: editedComponent,
    editableComponent,
    setComponent,
    validationIssues,
  } = useEditableComponent(component.id)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<ComponentActionsMenu component={editedComponent} onDelete={onClose} size="xs" />}
        title={`#${editedComponent.id}`}
      />
      <SectionGroup.Root>
        <ComponentEditor
          baseColor={subProject.componentSettings.baseColor}
          component={editedComponent}
          editable={editableComponent}
          issues={validationIssues}
          onChange={setComponent}
        />
      </SectionGroup.Root>
    </FloatingEditor>
  )
}
