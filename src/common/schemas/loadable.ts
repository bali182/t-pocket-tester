export type UninitializedSchema = {
  type: 'uninitialized'
}

export type LoadingSchema = {
  type: 'loading'
}

export type LoadedSchema<T> = {
  type: 'loaded'
  data: T
}

export type LoadingWithValueSchema<T> = {
  type: 'loading-with-value'
  data: T
}

export type LoadingFailedSchema = {
  type: 'failed'
  error: unknown
}

export type LoadableWithValueSchema<T> = LoadingWithValueSchema<T> | LoadedSchema<T>

export type LoadableSchema<T> =
  | UninitializedSchema
  | LoadingSchema
  | LoadedSchema<T>
  | LoadingWithValueSchema<T>
  | LoadingFailedSchema
