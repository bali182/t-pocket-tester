import { FC } from 'react'
import { PanelSchema } from '../../schemas/components'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'
import { PanelSizeSection } from './PanelSizeSection'

type PanelEditorProps = {
  component: PanelSchema
  onChange: (updated: PanelSchema) => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, onChange }) => {
  return (
    <>
      <NameAndColorSection component={component} onChange={onChange} />
      <PanelSizeSection component={component} onChange={onChange} />
      <LayoutSection component={component} onChange={onChange} />
    </>
  )
}
