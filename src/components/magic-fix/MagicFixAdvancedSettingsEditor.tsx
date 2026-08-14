import { Splitter, SplitterPanelData } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { useSubProjectSelection } from '../../hooks/useSubProjectSelection'
import {
  MagicFixComponentConfigSchema,
  MagicFixConfigSchema,
  MagicFixStitchLineConfigSchema,
} from '../../schemas/magicFixConfig'
import { SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import { ComponentTree } from '../component-tree/ComponentTree'
import { useComponentTreeCollection } from '../component-tree/utils/useComponentTreeCollection'
import { MagicFixComponentBoundsStitchLineConfigEditor } from './editors/MagicFixComponentBoundsStitchLineConfigEditor'
import { MagicFixPanelConfigEditor } from './editors/MagicFixPanelConfigEditor'
import { MagicFixPocketClusterConfigEditor } from './editors/MagicFixPocketClusterConfigEditor'
import { MagicFixPocketClusterStitchLineConfigEditor } from './editors/MagicFixPocketClusterStitchLineConfigEditor'
import { MagicFixRootPanelConfigEditor } from './editors/MagicFixRootPanelConfigEditor'

const panels: SplitterPanelData[] = [{ id: 'tree' }, { id: 'editor' }]
const defaultPanelSizes: string[] = ['250px', 'auto']

export type MagicFixAdvancedSettingsEditorProps = {
  subProject: SubProjectSchema
  config: MagicFixConfigSchema
  onChange: (config: MagicFixConfigSchema) => void
}

export const MagicFixAdvancedSettingsEditor: FC<MagicFixAdvancedSettingsEditorProps> = ({
  config,
  onChange,
  subProject,
}) => {
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(() => [subProject.root])
  const selection = useSubProjectSelection(subProject)
  const collection = useComponentTreeCollection(subProject, { showHoles: false, showStitchLines: true })
  const handleComponentConfigChange = useCallback(
    (updatedComponentConfig: MagicFixComponentConfigSchema): void => {
      onChange({
        ...config,
        componentConfigs: {
          ...config.componentConfigs,
          [updatedComponentConfig.componentId]: updatedComponentConfig,
        },
      })
    },
    [config, onChange],
  )
  const handleStitchLineConfigChange = useCallback(
    (updatedStitchLineConfig: MagicFixStitchLineConfigSchema): void => {
      onChange({
        ...config,
        stitchLineConfigs: {
          ...config.stitchLineConfigs,
          [updatedStitchLineConfig.stitchLineId]: updatedStitchLineConfig,
        },
      })
    },
    [config, onChange],
  )

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

      <Splitter.ResizeTrigger id="tree:editor">
        <Splitter.ResizeTriggerSeparator />
        <Splitter.ResizeTriggerIndicator />
      </Splitter.ResizeTrigger>

      <Splitter.Panel id="editor" minHeight="0" minWidth="0">
        <MagicFixAdvancedSettingsDetail
          config={config}
          onComponentConfigChange={handleComponentConfigChange}
          onStitchLineConfigChange={handleStitchLineConfigChange}
          selection={selection}
        />
      </Splitter.Panel>
    </Splitter.Root>
  )
}

type MagicFixAdvancedSettingsDetailProps = {
  config: MagicFixConfigSchema
  selection: ReturnType<typeof useSubProjectSelection>
  onComponentConfigChange: (config: MagicFixComponentConfigSchema) => void
  onStitchLineConfigChange: (config: MagicFixStitchLineConfigSchema) => void
}

const MagicFixAdvancedSettingsDetail: FC<MagicFixAdvancedSettingsDetailProps> = ({
  config,
  onComponentConfigChange,
  onStitchLineConfigChange,
  selection,
}) => {
  const { editorSelection } = selection

  if (!isDefined(editorSelection)) {
    return null
  }

  switch (editorSelection.type) {
    case 'component': {
      const componentConfig = config.componentConfigs[editorSelection.componentId]

      if (!isDefined(componentConfig)) {
        return null
      }

      switch (componentConfig.type) {
        case 'magic-fix-root-panel-config':
          return <MagicFixRootPanelConfigEditor config={componentConfig} onChange={onComponentConfigChange} />
        case 'magic-fix-panel-config':
          return <MagicFixPanelConfigEditor config={componentConfig} onChange={onComponentConfigChange} />
        case 'magic-fix-pocket-cluster-config':
          return <MagicFixPocketClusterConfigEditor config={componentConfig} onChange={onComponentConfigChange} />
      }
    }
    case 'stitch-line': {
      const stitchLineConfig = config.stitchLineConfigs[editorSelection.stitchLineId]

      if (!isDefined(stitchLineConfig)) {
        return null
      }

      switch (stitchLineConfig.type) {
        case 'magic-fix-component-bounds-stitch-line-config':
          return (
            <MagicFixComponentBoundsStitchLineConfigEditor
              config={stitchLineConfig}
              onChange={onStitchLineConfigChange}
            />
          )
        case 'magic-fix-pocket-cluster-stitch-line-config':
          return (
            <MagicFixPocketClusterStitchLineConfigEditor
              config={stitchLineConfig}
              onChange={onStitchLineConfigChange}
            />
          )
      }
    }
    case 'hole':
      return null
  }
}
