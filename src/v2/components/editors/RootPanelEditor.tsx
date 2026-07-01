import { FC } from 'react'
import { RootPanelSchema } from '../../schemas/components'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { WidthAndHeightSizeSection } from './WidthAndHeightSizeSection'

type RootPanelEditorProps = {
  component: RootPanelSchema
  onChange: (updated: RootPanelSchema) => void
}

export const RootPanelEditor: FC<RootPanelEditorProps> = ({ component, onChange }) => {
  return (
    <>
      <NameAndColorSection component={component} onChange={onChange} />
      <WidthAndHeightSizeSection component={component} onChange={onChange} />
      <LayoutSection component={component} onChange={onChange} />
    </>
  )
}
