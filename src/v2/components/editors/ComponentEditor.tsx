import { EmptyState, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { IoAlertCircleOutline } from 'react-icons/io5'

import { ComponentSchema } from '../../schemas/components'
import { PanelEditor } from './PanelEditor'
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
    default:
      return (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <IoAlertCircleOutline />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Hiba</EmptyState.Title>
              <EmptyState.Description>Ehhez a komponenshez még nincs szerkesztő!</EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      )
  }
}
