import type { ComponentSchema } from '../schemas/components'

export const getUnusedComponentName = (
  type: ComponentSchema['type'],
  components: Record<string, ComponentSchema>,
): string => {
  const baseName = getComponentNameByType(type)
  const usedNames = new Set(Object.values(components).map((component) => component.name))
  let counter = 1
  let name = `${baseName} ${counter}`

  while (usedNames.has(name)) {
    counter += 1
    name = `${baseName} ${counter}`
  }

  return name
}

const getComponentNameByType = (type: ComponentSchema['type']): string => {
  switch (type) {
    case 'root-panel':
      return 'Fő panel'
    case 'panel':
      return 'Panel'
    case 'pocket-cluster':
      return 'Zsebek'
  }
}
