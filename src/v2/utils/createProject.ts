import { LEATHER_BASE_COLOR } from '../constants/drawing'
import { defaultStitchingSettings } from '../defaultStates'
import type { RootPanelSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import type { TranslationSchema } from '../translations/translationSchema'
import { id } from './id'

export const createProject = (name: string, t: TranslationSchema): ProjectSchema => {
  const root: RootPanelSchema = {
    borderRadius: 0,
    topLeftRadius: 0,
    bottomLeftRadius: 0,
    bottomRightRadius: 0,
    topRightRadius: 0,
    individualRadii: false,
    layoutOrientation: 'horizontal',
    layoutOrder: 'default',
    layoutGap: 0,
    type: 'root-panel',
    id: id(),
    name: t.defaults.rootComponentName,
    color: LEATHER_BASE_COLOR,
    children: [],
    width: 170,
    height: 100,
  }

  return {
    id: id(),
    name,
    root: root.id,
    components: {
      [root.id]: root,
    },
    stitchLines: [],
    editingSettings: {
      addComputedSizesToAutoSized: true,
      adjustCornerRadiiToParent: true,
    },
    stitchingSettings: { ...defaultStitchingSettings },
  }
}
