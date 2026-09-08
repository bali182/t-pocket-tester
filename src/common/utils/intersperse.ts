export const intersperse = <T>(arr: T[], producer: (prevIndex: number, nextIndex: number) => T): T[] => {
  if (arr.length < 2) {
    return arr
  }

  const result: T[] = []

  for (let i = 0; i < arr.length; i++) {
    if (i > 0) {
      result.push(producer(i - 1, i))
    }
    result.push(arr[i])
  }

  return result
}
