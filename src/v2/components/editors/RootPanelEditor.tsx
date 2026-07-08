import { FC } from 'react'
import { RootPanelSchema } from '../../schemas/components'
import type { ChildComponentType } from '../AddChildComponentMenu'
import { CornerRadiusSection } from './CornerRadiusSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { ToolbarSection } from './ToolbarSection'
import { WidthAndHeightSizeSection } from './WidthAndHeightSizeSection'

type RootPanelEditorProps = {
  component: RootPanelSchema
  onAddChild: (type: ChildComponentType) => void
  onChange: (updated: RootPanelSchema) => void
}

export const RootPanelEditor: FC<RootPanelEditorProps> = ({ component, onAddChild, onChange }) => {
  return (
    <>
      <ToolbarSection onAddChild={onAddChild} />
      <NameAndColorSection component={component} onChange={onChange} />
      <WidthAndHeightSizeSection component={component} onChange={onChange} />
      <CornerRadiusSection component={component} onChange={onChange} />
      <LayoutSection component={component} onChange={onChange} />
    </>
  )
}
