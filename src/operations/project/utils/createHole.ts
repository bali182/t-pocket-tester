import type { HasCornerRadiusSchema } from '../../../schemas/common'
import type { CircleHoleSchema, HolePositionSchema, RectHoleSchema } from '../../../schemas/hole'

type HoleByType = {
  'rect-hole': RectHoleSchema
  'circle-hole': CircleHoleSchema
}

type CreateHoleParams<T extends keyof HoleByType> = {
  type: T
  id: string
  componentId: string
  name: string
}

export const createHole = <T extends keyof HoleByType>(params: CreateHoleParams<T>): HoleByType[T] => {
  return {
    ...DEFAULT_HOLES[params.type],
    componentId: params.componentId,
    id: params.id,
    name: params.name,
    type: params.type,
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

const DEFAULT_HOLES: HoleByType = {
  'rect-hole': {
    ...defaultPosition,
    ...defaultCornerRadius,
    componentId: '',
    height: 20,
    id: '',
    name: '',
    type: 'rect-hole',
    width: 20,
  },
  'circle-hole': {
    ...defaultPosition,
    componentId: '',
    id: '',
    name: '',
    radius: 10,
    type: 'circle-hole',
  },
}
