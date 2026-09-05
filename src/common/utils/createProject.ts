import { defaultColorSettings, defaultStitchingSettings } from '../defaultStates'
import type { ProjectSchema } from '../schemas/project'
import { id } from './id'

export const createProject = (name: string): ProjectSchema => {
  return {
    id: id(),
    name,
    subProjects: [],
    editingSettings: {
      addBaseColorByDefault: false,
      numberEditorStep: 1,
    },
    colorSettings: { ...defaultColorSettings },
    stitchingSettings: { ...defaultStitchingSettings },
  }
}
