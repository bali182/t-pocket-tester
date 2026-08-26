import { leatherColors } from '../data/colors'
import { defaultStitchingSettings } from '../defaultStates'
import type { ProjectSchema } from '../schemas/project'
import { id } from './id'

export const createProject = (name: string): ProjectSchema => {
  return {
    id: id(),
    name,
    subProjects: [],
    componentSettings: {
      baseColor: leatherColors.natural,
    },
    editingSettings: {
      addComputedSizesToAutoSized: true,
      adjustCornerRadiiToParent: true,
      addBaseColorByDefault: false,
      numberEditorStep: 1,
    },
    stitchingSettings: { ...defaultStitchingSettings },
  }
}
