import {
  LoadableSchema,
  LoadableWithValueSchema,
  LoadedSchema,
  LoadingFailedSchema,
  LoadingSchema,
  LoadingWithValueSchema,
  UninitializedSchema,
} from './schemas/loadable'

function hasValue<T>(loadable: LoadableSchema<T>): loadable is LoadableWithValueSchema<T> {
  return loadable.type === 'loaded' || loadable.type === 'loading-with-value'
}

function get<T>(loadable: LoadableSchema<T>): T | undefined
function get<T, F>(loadable: LoadableSchema<T>, fallback: F): T | F
function get<T, F>(loadable: LoadableSchema<T>, fallback?: F): T | F | undefined {
  return hasValue(loadable) ? loadable.data : fallback
}

export const Loadable = {
  // Factories
  uninitialized: (): UninitializedSchema => {
    return { type: 'uninitialized' }
  },
  loading: (): LoadingSchema => {
    return { type: 'loading' }
  },
  loadingWith: <T>(data: T): LoadingWithValueSchema<T> => {
    return { type: 'loading-with-value', data }
  },
  failed: (error?: unknown): LoadingFailedSchema => {
    return { type: 'failed', error }
  },
  loaded: <T>(data: T): LoadedSchema<T> => {
    return { type: 'loaded', data }
  },

  // Functional utilities
  get,
  hasValue,
  map: <I, O>(loadable: LoadableSchema<I>, transform: (data: I) => O): LoadableSchema<O> => {
    switch (loadable.type) {
      case 'uninitialized':
      case 'loading':
      case 'failed':
        return loadable
      case 'loading-with-value':
        return Loadable.loadingWith(transform(loadable.data))
      case 'loaded':
        return Loadable.loaded(transform(loadable.data))
    }
  },
}
