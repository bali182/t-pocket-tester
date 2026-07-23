const TRAILING_NUMBER_PATTERN = /^(.+) (\d+)$/

export const getNextUnusedClonedComponentName = (sourceName: string, usedComponentNames: Set<string>): string => {
  const normalizedSourceName = sourceName.trim()
  const sourceNameMatch = normalizedSourceName.match(TRAILING_NUMBER_PATTERN)
  const baseName = sourceNameMatch?.[1].trim() ?? normalizedSourceName
  let number = sourceNameMatch === null ? 1 : Number(sourceNameMatch[2]) + 1
  let componentName = getComponentName(baseName, number)

  while (usedComponentNames.has(componentName)) {
    number += 1
    componentName = getComponentName(baseName, number)
  }

  return componentName
}

const getComponentName = (baseName: string, number: number): string => {
  return baseName === '' ? `${number}` : `${baseName} ${number}`
}
