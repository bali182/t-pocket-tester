import type { HasCornerRadiusSchema, HasXYOffsetSchema } from '../../../schemas/common'
import type { HasAnchorsSchema, HoleSchema } from '../../../schemas/hole'

type CreateHoleParams = {
  id: string
  componentId: string
  name: string
}

export const createHole = (params: CreateHoleParams): HoleSchema => {
  return {
    ...DEFAULT_HOLE,
    componentId: params.componentId,
    id: params.id,
    name: params.name,
  }
}

const defaultAnchors: HasAnchorsSchema = {
  xAnchor: 'middle',
  yAnchor: 'middle',
}

const defaultOffsets: HasXYOffsetSchema = {
  xOffset: 0,
  yOffset: 0,
}

const defaultCornerRadius: HasCornerRadiusSchema = {
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  individualRadii: false,
  topLeftRadius: 0,
  topRightRadius: 0,
}

const DEFAULT_HOLE: HoleSchema = {
  ...defaultAnchors,
  ...defaultOffsets,
  ...defaultCornerRadius,
  type: 'hole',
  componentId: '',
  height: 20,
  id: '',
  name: '',
  width: 20,
}
