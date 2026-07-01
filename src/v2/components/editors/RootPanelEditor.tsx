import { FC } from 'react'
import { RootPanelSchema } from '../../schemas/components'
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
    </>
  )
}
