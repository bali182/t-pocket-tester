import { ComponentSchema } from '../schemas/components'
import type { TranslationSchema } from '../translations/translation'

export const getComponentNameByType = (type: ComponentSchema['type'], t: TranslationSchema): string => {
  switch (type) {
    case 'root-panel':
      return t.component.types.rootPanel()
    case 'panel':
      return t.component.types.panel()
    case 'pocket-cluster':
      return t.component.types.pocketCluster()
  }
}
