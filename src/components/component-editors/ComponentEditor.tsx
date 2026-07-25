import { Alert } from '@chakra-ui/react'
import { FC, useCallback } from 'react'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { PanelEditor } from './PanelEditor'
import { PocketClusterEditor } from './PocketClusterEditor'
import { RootPanelEditor } from './RootPanelEditor'

type ComponentEditorProps = {
  baseColor: string
  component: ComponentSchema
  editable: EditableSchema<ComponentSchema>
  issues: ValidationIssuesSchema<ComponentSchema>
  onChange: (updated: EditableSchema<ComponentSchema>) => void
}

export const ComponentEditor: FC<ComponentEditorProps> = (props) => {
  const t = useTranslation()
  const handleColorReset = useCallback((): void => {
    const updatedEditable = { ...props.editable }
    delete updatedEditable.color
    props.onChange(updatedEditable)
  }, [props])

  switch (props.editable.type) {
    case 'root-panel':
      return (
        <RootPanelEditor
          component={props.component as RootPanelSchema}
          baseColor={props.baseColor}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<RootPanelSchema>}
          onChange={props.onChange}
          onResetColor={handleColorReset}
        />
      )
    case 'panel':
      return (
        <PanelEditor
          component={props.component as PanelSchema}
          baseColor={props.baseColor}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PanelSchema>}
          onChange={props.onChange}
          onResetColor={handleColorReset}
        />
      )
    case 'pocket-cluster':
      return (
        <PocketClusterEditor
          component={props.component as PocketClusterSchema}
          baseColor={props.baseColor}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PocketClusterSchema>}
          onChange={props.onChange}
          onResetColor={handleColorReset}
        />
      )
    default:
      return (
        <Alert.Root status="error">
          <Alert.Content>
            <Alert.Title>{t.component.editor.missing.title}</Alert.Title>
            <Alert.Description>{t.component.editor.missing.description}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )
  }
}
