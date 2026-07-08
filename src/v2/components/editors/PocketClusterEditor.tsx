import { type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import { CornerRadiusSection } from './CornerRadiusSection'
import { FillableSizeSection } from './FillableSizeSection'
import { NameAndColorSection } from './NameAndColorSection'
import { PocketClusterSettingsSection } from './PocketClusterSettingsSection'
import { ToolbarSection } from './ToolbarSection'
import { TPocketShapeSection } from './TPocketShapeSection'

type PocketClusterEditorProps = {
  component: PocketClusterSchema
  onChange: (updated: PocketClusterSchema) => void
  onRemoveComponent: () => void
}

export const PocketClusterEditor: FC<PocketClusterEditorProps> = ({ component, onChange, onRemoveComponent }) => {
  return (
    <>
      <ToolbarSection onRemoveComponent={onRemoveComponent} />
      <NameAndColorSection component={component} onChange={onChange} />
      <FillableSizeSection component={component} onChange={onChange} />
      <CornerRadiusSection component={component} onChange={onChange} />
      <PocketClusterSettingsSection component={component} onChange={onChange} />
      <TPocketShapeSection component={component} onChange={onChange} />
    </>
  )
}
