import { FC, useCallback } from 'react'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { PanelEditor } from './PanelEditor'
import { PocketClusterEditor } from './PocketClusterEditor'
import { RootPanelEditor } from './RootPanelEditor'

type ComponentEditorProps = {
  baseColor: string
  component: ComponentSchema
  editable: EditableSchema<ComponentSchema>
  issues: ValidationIssuesSchema<ComponentSchema>
  onChange: (updated: EditableSchema<ComponentSchema>) => void
  parent: RootPanelSchema | PanelSchema | undefined
}

export const ComponentEditor: FC<ComponentEditorProps> = (props) => {
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
      if (!isDefined(props.parent)) {
        throw new Error('Panel parent not found')
      }
      return (
        <PanelEditor
          component={props.component as PanelSchema}
          baseColor={props.baseColor}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PanelSchema>}
          onChange={props.onChange}
          onResetColor={handleColorReset}
          parent={props.parent}
        />
      )
    case 'pocket-cluster':
      if (!isDefined(props.parent)) {
        throw new Error('Pocket cluster parent not found')
      }
      return (
        <PocketClusterEditor
          component={props.component as PocketClusterSchema}
          baseColor={props.baseColor}
          editable={props.editable}
          issues={props.issues as ValidationIssuesSchema<PocketClusterSchema>}
          onChange={props.onChange}
          onResetColor={handleColorReset}
          parent={props.parent}
        />
      )
  }
}
