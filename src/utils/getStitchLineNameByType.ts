import { StitchLineSchema } from '../schemas/stitching'
import type { TranslationSchema } from '../translations/translationSchema'

export const getStitchLineNameByType = (type: StitchLineSchema['type'], t: TranslationSchema): string => {
  switch (type) {
    case 'component-bounds-stitch-line':
      return t.stitchLine.types.componentBounds
    case 'pocket-cluster-stitch-line':
      return t.stitchLine.types.pocketCluster
  }
}
