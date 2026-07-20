import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import type { TranslationSchema } from '../translations/translation'
import { isDefined } from './isDefined'

export type StitchLineTypeOption = {
  label: string
  value: StitchLineSchema['type']
}

export const getStitchLineTypeOptions = (
  component: ComponentSchema | undefined,
  t: TranslationSchema,
): StitchLineTypeOption[] => {
  if (!isDefined(component)) {
    return []
  }

  if (component.type === 'pocket-cluster') {
    return [
      { label: t.stitchLine.add.types.componentBounds(), value: 'component-bounds-stitch-line' },
      { label: t.stitchLine.add.types.pocketCluster(), value: 'pocket-cluster-stitch-line' },
    ]
  }

  return [{ label: t.stitchLine.add.types.componentBounds(), value: 'component-bounds-stitch-line' }]
}
