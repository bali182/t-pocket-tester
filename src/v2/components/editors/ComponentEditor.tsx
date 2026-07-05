import { MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components'
import { FC } from 'react'

import { ComponentSchema } from '../../schemas/components'
import { PanelEditor } from './PanelEditor'
import { PocketClusterEditor } from './PocketClusterEditor'
import { RootPanelEditor } from './RootPanelEditor'

type ComponentEditorProps = {
  component: ComponentSchema
  onChange: (updated: ComponentSchema) => void
}

export const ComponentEditor: FC<ComponentEditorProps> = ({ component, onChange }) => {
  switch (component.type) {
    case 'root-panel':
      return <RootPanelEditor component={component} onChange={onChange} />
    case 'panel':
      return <PanelEditor component={component} onChange={onChange} />
    case 'pocket-cluster':
      return <PocketClusterEditor component={component} onChange={onChange} />
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
