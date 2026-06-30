export const isDefined = <T>(input: T | null | undefined): input is T => {
  return input !== null && input !== undefined
}
