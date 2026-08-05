import { Tabs } from '@chakra-ui/react'
import { FC } from 'react'

// TODO present the sub-projects under the selected project as tabs
export const EditorSubProjectTabs: FC = () => {
  return (
    <Tabs.Root defaultValue="sub-project" size="sm" variant="line" width="100%">
      <Tabs.List>
        <Tabs.Trigger value="sub-project">Sub-project</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
