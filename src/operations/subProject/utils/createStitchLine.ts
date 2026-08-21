import type { HasTargetSchema } from '../../../schemas/common'
import type {
  ComponentBoundsStitchLineOwnSchema,
  PocketClusterStitchLineOwnSchema,
  StitchLineSchema,
} from '../../../schemas/stitching'

export const createStitchLine = (
  type: StitchLineSchema['type'],
  target: HasTargetSchema,
  id: string,
  name: string,
): StitchLineSchema => {
  switch (type) {
    case 'component-bounds-stitch-line':
      return { ...defaultStitchLine, ...target, id, name, type }
    case 'pocket-cluster-stitch-line':
      if (target.targetType === 'hole') {
        throw new Error('Pocket cluster stitch lines cannot target holes')
      }
      return { ...defaultPocketClusterStitchLine, ...target, id, name, type }
  }
}

const defaultStitchLine: ComponentBoundsStitchLineOwnSchema = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topLeftCorner: true,
  topRightCorner: true,
  bottomRightCorner: true,
  bottomLeftCorner: true,
  topStitchDirection: 'left-to-right',
  rightStitchDirection: 'top-to-bottom',
  bottomStitchDirection: 'right-to-left',
  leftStitchDirection: 'bottom-to-top',
  topStartOffset: 0,
  topEndOffset: 0,
  rightStartOffset: 0,
  rightEndOffset: 0,
  bottomStartOffset: 0,
  bottomEndOffset: 0,
  leftStartOffset: 0,
  leftEndOffset: 0,
}

const defaultPocketClusterStitchLine: PocketClusterStitchLineOwnSchema = {
  endOffset: 0,
  startOffset: 0,
  stitchDirection: 'start-to-end',
}
