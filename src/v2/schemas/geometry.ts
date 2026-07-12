import type BigNumber from 'bignumber.js'

export type PointSchema = {
  x: BigNumber
  y: BigNumber
}

export type LineSchema = {
  start: PointSchema
  end: PointSchema
}

export type RectSchema = {
  x: BigNumber
  y: BigNumber
  width: BigNumber
  height: BigNumber
}

export type SizeSchema = {
  width: number
  height: number
}

export type FillableSizeSchema = {
  width: number | 'fill'
  height: number | 'fill'
}

export type CornerRadiusSchema = {
  topLeft: number
  topRight: number
  bottomLeft: number
  bottomRight: number
}

export type PathMoveToSchema = {
  type: 'moveTo'
  point: PointSchema
}

export type PathLineToSchema = {
  type: 'lineTo'
  point: PointSchema
}

export type PathArcToSchema = {
  type: 'arcTo'
  radius: BigNumber
  point: PointSchema
}

export type PathCloseSchema = {
  type: 'close'
}

export type PathCommand = PathMoveToSchema | PathLineToSchema | PathArcToSchema | PathCloseSchema

export type PathSchema = {
  commands: PathCommand[]
}
