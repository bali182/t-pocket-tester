import type { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'

export const getUnusedComponentName = (type: ComponentSchema['type'], project: ProjectSchema): string => {
  const baseName = getComponentNameByType(type)
  const usedNames = new Set(Object.values(project.components).map((component) => component.name))
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
