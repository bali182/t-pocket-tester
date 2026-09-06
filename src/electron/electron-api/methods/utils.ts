export const hasErrorCode = (error: unknown, expectedCode: string): boolean => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false
  }

  return error.code === expectedCode
}
