export type PointSchema = {
  x: number
  y: number
}

export type LineSchema = {
  start: PointSchema
  end: PointSchema
}

export type RectSchema = {
  x: number
  y: number
  width: number
  height: number
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
  radius: number
  point: PointSchema
}

export type PathCloseSchema = {
  type: 'close'
}

export type PathCommand = PathMoveToSchema | PathLineToSchema | PathArcToSchema | PathCloseSchema

export type PathSchema = {
  commands: PathCommand[]
}
