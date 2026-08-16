import { LEATHER_BASE_COLOR } from '../constants/drawing'
import { defaultStitchingSettings } from '../defaultStates'
import type { ProjectSchema } from '../schemas/project'
import { id } from './id'

export const createProject = (name: string): ProjectSchema => {
  return {
    id: id(),
    name,
    subProjects: [],
    componentSettings: {
      baseColor: LEATHER_BASE_COLOR,
    },
    editingSettings: {
      addComputedSizesToAutoSized: true,
      adjustCornerRadiiToParent: true,
      addBaseColorByDefault: false,
    },
    stitchingSettings: { ...defaultStitchingSettings },
  }
}
