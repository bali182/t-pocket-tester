export type HasTypeSchema<T extends string> = {
  type: T
}

export type HasId = {
  id: string
}

export type HasName = {
  name: string
}

export type HasIdentitySchema = HasId & HasName

export type HasCornerRadiusValuesSchema = {
  borderRadius: number
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
}

export type HasCornerRadiusSchema = HasCornerRadiusValuesSchema & {
  individualRadii: boolean
}

export type HasSizeSchema = {
  width: number
  height: number
}

export type HasComponentReferenceSchema = {
  componentId: string
}

export type HasStitchLineReferenceSchema = {
  stitchLineId: string
}

export type HasComponentTargetSchema = {
  targetType: 'component'
  targetId: string
}

export type HasHoleTargetSchema = {
  targetType: 'hole'
  targetId: string
}

export type HasTargetSchema = HasComponentTargetSchema | HasHoleTargetSchema
