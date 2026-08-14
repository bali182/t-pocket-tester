import { Splitter, SplitterPanelData } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { useSubProjectSelection } from '../../hooks/useSubProjectSelection'
import { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import { SubProjectSchema } from '../../schemas/subProject'
import { ComponentTree } from '../component-tree/ComponentTree'
import { useComponentTreeCollection } from '../component-tree/utils/useComponentTreeCollection'

const panels: SplitterPanelData[] = [{ id: 'tree' }, { id: 'editor' }]
const defaultPanelSizes: string[] = ['300px', 'auto']

export type MagicFixAdvancedSettingsEditorProps = {
  subProject: SubProjectSchema
  config: MagicFixConfigSchema
  onChange: (config: MagicFixConfigSchema) => void
}

export const MagicFixAdvancedSettingsEditor: FC<MagicFixAdvancedSettingsEditorProps> = ({ subProject }) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(() => [subProject.root])
  const selection = useSubProjectSelection(subProject)
  const collection = useComponentTreeCollection(subProject, { showHoles: false, showStitchLines: true })

  return (
    <Splitter.Root
      defaultSize={defaultPanelSizes}
      height="100%"
      minHeight="0"
      minWidth="0"
      orientation="horizontal"
      panels={panels}
    >
      <Splitter.Panel id="tree" minHeight="0" minWidth="0">
        <ComponentTree
          collection={collection}
          selection={selection}
          expandedNodeIds={expandedNodeIds}
          hasDragAndDrop={false}
          setExpandedNodeIds={setExpandedNodeIds}
        />
      </Splitter.Panel>

      <Splitter.ResizeTrigger id="tree:editor" mt="3" mb="3">
        <Splitter.ResizeTriggerSeparator />
        <Splitter.ResizeTriggerIndicator />
      </Splitter.ResizeTrigger>

      <Splitter.Panel id="editor" minHeight="0" minWidth="0"></Splitter.Panel>
    </Splitter.Root>
  )
}
