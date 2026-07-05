import { FC } from 'react'
import { PanelSchema } from '../../schemas/components'
import { FillableSizeSection } from './FillableSizeSection'
import { LayoutSection } from './LayoutSection'
import { NameAndColorSection } from './NameAndColorSection'

type PanelEditorProps = {
  component: PanelSchema
  onChange: (updated: PanelSchema) => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, onChange }) => {
  return (
    <>
      <NameAndColorSection component={component} onChange={onChange} />
      <FillableSizeSection component={component} onChange={onChange} />
      <LayoutSection component={component} onChange={onChange} />
    </>
  )
}
