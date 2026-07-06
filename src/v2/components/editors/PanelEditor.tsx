import { FC } from 'react'
import { PanelSchema } from '../../schemas/components'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { FillableSizeSection } from './FillableSizeSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { ToolbarSection } from './ToolbarSection'

type PanelEditorProps = {
  component: PanelSchema
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: PanelSchema) => void
  onRemoveComponent: () => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, onAddChild, onChange, onRemoveComponent }) => {
  return (
    <>
      <ToolbarSection onAddChild={onAddChild} onRemoveComponent={onRemoveComponent} />
      <NameAndColorSection component={component} onChange={onChange} />
      <FillableSizeSection component={component} onChange={onChange} />
      <LayoutSection component={component} onChange={onChange} />
    </>
  )
}
