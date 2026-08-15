import { EmptyState, Splitter, SplitterPanelData } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiSelectionForeground } from 'react-icons/pi'
import { useSubProjectSelection } from '../../../hooks/useSubProjectSelection'
import {
  MagicFixComponentConfigSchema,
  MagicFixConfigSchema,
  MagicFixStitchLineConfigSchema,
} from '../../../schemas/magicFixConfig'
import { SelectionSchema } from '../../../schemas/selection'
import { SubProjectSchema } from '../../../schemas/subProject'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ComponentTree } from '../../component-tree/ComponentTree'
import { useComponentTreeCollection } from '../../component-tree/utils/useComponentTreeCollection'
import { MagicFixComponentBoundsStitchLineConfigEditor } from './MagicFixComponentBoundsStitchLineConfigEditor'
import { MagicFixPanelConfigEditor } from './MagicFixPanelConfigEditor'
import { MagicFixPocketClusterConfigEditor } from './MagicFixPocketClusterConfigEditor'
import { MagicFixPocketClusterStitchLineConfigEditor } from './MagicFixPocketClusterStitchLineConfigEditor'
import { MagicFixRootPanelConfigEditor } from './MagicFixRootPanelConfigEditor'

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
  const t = useTranslation()
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

      <Splitter.Panel display="flex" id="editor" minHeight="0" minWidth="0">
        {isDefined(selection.editorSelection) ? (
          <MagicFixAdvancedSettingsDetail
            config={config}
            onComponentConfigChange={handleComponentConfigChange}
            onStitchLineConfigChange={handleStitchLineConfigChange}
            selection={selection.editorSelection}
          />
        ) : (
          <EmptyState.Root height="100%" alignContent="center">
            <EmptyState.Content>
              <EmptyState.Indicator>
                <PiSelectionForeground />
              </EmptyState.Indicator>
              <EmptyState.Title>{t.magicFix.dialog.settings.noSelectionTitle}</EmptyState.Title>
              <EmptyState.Description>{t.magicFix.dialog.settings.noSelectionDescription}</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        )}
      </Splitter.Panel>
    </Splitter.Root>
  )
}

type MagicFixAdvancedSettingsDetailProps = {
  config: MagicFixConfigSchema
  selection: SelectionSchema
  onComponentConfigChange: (config: MagicFixComponentConfigSchema) => void
  onStitchLineConfigChange: (config: MagicFixStitchLineConfigSchema) => void
}

const MagicFixAdvancedSettingsDetail: FC<MagicFixAdvancedSettingsDetailProps> = ({
  config,
  onComponentConfigChange,
  onStitchLineConfigChange,
  selection,
}) => {
  switch (selection.type) {
    case 'component': {
      const componentConfig = config.componentConfigs[selection.componentId]

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
      const stitchLineConfig = config.stitchLineConfigs[selection.stitchLineId]

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
