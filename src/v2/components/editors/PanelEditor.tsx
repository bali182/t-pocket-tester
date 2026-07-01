import { FC } from 'react'
import { PanelSchema } from '../../schemas/components'
import { NameAndColorSection } from './NameAndColorSection'

type PanelEditorProps = {
  component: PanelSchema
  onChange: (updated: PanelSchema) => void
}

export const PanelEditor: FC<PanelEditorProps> = ({ component, onChange }) => {
  return <NameAndColorSection component={component} onChange={onChange} />
}
