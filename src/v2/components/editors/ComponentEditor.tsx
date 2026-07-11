import { Alert } from '@chakra-ui/react'
import { FC } from 'react'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { PanelEditor } from './PanelEditor'
import { PocketClusterEditor } from './PocketClusterEditor'
import { RootPanelEditor } from './RootPanelEditor'

type ComponentEditorProps = {
  component: ComponentSchema
  editable: EditableSchema<ComponentSchema>
  issues: ValidationIssuesSchema<ComponentSchema>
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: EditableSchema<ComponentSchema>) => void
  onRemoveComponent: () => void
}

export const ComponentEditor: FC<ComponentEditorProps> = (props) => {
  switch (props.editable.type) {
    case 'root-panel':
      return (
        <RootPanelEditor
          component={props.component as RootPanelSchema}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<RootPanelSchema>}
          onAddChild={props.onAddChild}
          onChange={props.onChange}
        />
      )
    case 'panel':
      return (
        <PanelEditor
          component={props.component as PanelSchema}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PanelSchema>}
          onAddChild={props.onAddChild}
          onChange={props.onChange}
          onRemoveComponent={props.onRemoveComponent}
        />
      )
    case 'pocket-cluster':
      return (
        <PocketClusterEditor
          component={props.component as PocketClusterSchema}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PocketClusterSchema>}
          onChange={props.onChange}
          onRemoveComponent={props.onRemoveComponent}
        />
      )
    default:
      return (
        <Alert.Root status="error">
          <Alert.Content>
            <Alert.Title>Hiba</Alert.Title>
            <Alert.Description>Ehhez a komponenshez még nincs szerkesztő!</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )
  }
}
