import type { HasCornerRadiusSchema } from '../../../schemas/common'
import type { HolePositionSchema, HoleSchema } from '../../../schemas/hole'

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

const defaultPosition: HolePositionSchema = {
  xAnchor: 'middle',
  xOffset: 0,
  yAnchor: 'middle',
  yOffset: 0,
}

const defaultCornerRadius: HasCornerRadiusSchema = {
  borderRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  individualRadii: false,
  topLeftRadius: 0,
  topRightRadius: 0,
}

const DEFAULT_HOLE: HoleSchema = {
  ...defaultPosition,
  ...defaultCornerRadius,
  type: 'hole',
  componentId: '',
  height: 20,
  id: '',
  name: '',
  width: 20,
}
