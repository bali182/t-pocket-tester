import { MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components'
import { FC } from 'react'

import { ComponentSchema } from '../../schemas/components'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { PanelEditor } from './PanelEditor'
import { PocketClusterEditor } from './PocketClusterEditor'
import { RootPanelEditor } from './RootPanelEditor'

type ComponentEditorProps = {
  component: ComponentSchema
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: ComponentSchema) => void
  onRemoveComponent: () => void
}

export const ComponentEditor: FC<ComponentEditorProps> = ({ component, onAddChild, onChange, onRemoveComponent }) => {
  switch (component.type) {
    case 'root-panel':
      return <RootPanelEditor component={component} onAddChild={onAddChild} onChange={onChange} />
    case 'panel':
      return (
        <PanelEditor
          component={component}
          onAddChild={onAddChild}
          onChange={onChange}
          onRemoveComponent={onRemoveComponent}
        />
      )
    case 'pocket-cluster':
      return <PocketClusterEditor component={component} onChange={onChange} onRemoveComponent={onRemoveComponent} />
    default:
      return (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Hiba</MessageBarTitle>
            Ehhez a komponenshez még nincs szerkesztő!
          </MessageBarBody>
        </MessageBar>
      )
  }
}
