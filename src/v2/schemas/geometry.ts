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

export type FillableSize = {
  width: number | 'fill'
  height: number | 'fill'
}

export type PathMoveTo = {
  type: 'moveTo'
  point: PointSchema
}

export type PathLineTo = {
  type: 'lineTo'
  point: PointSchema
}

export type PathArcTo = {
  type: 'arcTo'
  radius: number
  point: PointSchema
}

export type PathClose = {
  type: 'close'
}

export type PathCommand = PathMoveTo | PathLineTo | PathArcTo | PathClose

export type Path = {
  commands: PathCommand[]
}
