export type HasIdentitySchema = {
  id: string
  name: string
}

export type HasCornerRadiusSchema = {
  individualRadii: boolean
  borderRadius: number
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
}

export type HasSizeSchema = {
  width: number
  height: number
}

export type HasComponentReferenceSchema = {
  componentId: string
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
