import { type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import { FillableSizeSection } from './FillableSizeSection'
import { NameAndColorSection } from './NameAndColorSection'
import { PocketClusterSettingsSection } from './PocketClusterSettingsSection'
import { TPocketShapeSection } from './TPocketShapeSection'

type PocketClusterEditorProps = {
  component: PocketClusterSchema
  onChange: (updated: PocketClusterSchema) => void
}

export const PocketClusterEditor: FC<PocketClusterEditorProps> = ({ component, onChange }) => {
  return (
    <>
      <NameAndColorSection component={component} onChange={onChange} />
      <FillableSizeSection component={component} onChange={onChange} />
      <PocketClusterSettingsSection component={component} onChange={onChange} />
      <TPocketShapeSection component={component} onChange={onChange} />
    </>
  )
}
