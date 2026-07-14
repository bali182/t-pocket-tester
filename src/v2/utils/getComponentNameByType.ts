import { ComponentSchema } from '../schemas/components'

export const getComponentNameByType = (type: ComponentSchema['type']): string => {
  switch (type) {
    case 'root-panel':
      return 'Fő panel'
    case 'panel':
      return 'Panel'
    case 'pocket-cluster':
      return 'Zsebek'
  }
}
