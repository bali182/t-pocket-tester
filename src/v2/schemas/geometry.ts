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

export type PolygonSchema = {
  points: PointSchema[]
}
