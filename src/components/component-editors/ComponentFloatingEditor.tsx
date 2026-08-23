import { type FC } from 'react'

import { useEditableComponent } from '../../hooks/useEditableComponent'
import { useProject } from '../../hooks/useProject'
import { useSubProject } from '../../hooks/useSubProject'
import { getComponentParent } from '../../operations/subProject/utils/getComponentParent'
import type { ComponentSchema } from '../../schemas/components'
import type { FloatingEditorAnchor } from '../../utils/svgElementUtils'
import { FloatingEditor } from '../common/FloatingEditor'
import { FloatingEditorHeader } from '../common/FloatingEditorHeader'
import { ComponentActionsMenu } from '../ComponentActionsMenu'
import { ComponentEditor } from './ComponentEditor'

type ComponentFloatingEditorProps = {
  anchorElement: FloatingEditorAnchor
  component: ComponentSchema
  onClose: () => void
}

export const ComponentFloatingEditor: FC<ComponentFloatingEditorProps> = ({ anchorElement, component, onClose }) => {
  const { project } = useProject()
  const { subProject } = useSubProject()
  const {
    component: editedComponent,
    editableComponent,
    setComponent,
    validationIssues,
  } = useEditableComponent(component.id)
  const parent = getComponentParent(editedComponent.id, subProject)

  return (
    <FloatingEditor anchorElement={anchorElement} onClose={onClose}>
      <FloatingEditorHeader
        menu={<ComponentActionsMenu component={editedComponent} onDelete={onClose} size="xs" subProject={subProject} />}
        title={`#${editedComponent.id}`}
      />
      <ComponentEditor
        baseColor={project.componentSettings.baseColor}
        component={editedComponent}
        editable={editableComponent}
        issues={validationIssues}
        onChange={setComponent}
        parent={parent}
      />
    </FloatingEditor>
  )
}
