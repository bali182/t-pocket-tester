export const produce =
  <T>(value: T) =>
  (): T =>
    value
