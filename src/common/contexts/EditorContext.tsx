import { createContext, SetStateAction } from 'react'
import { ProjectSchema } from '../schemas/project'
import { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'

export type EditorContextType = {
  project?: ProjectSchema
  subProject?: SubProjectSchema
  computedSubProject?: ComputedSubProjectSchema

  /** Overwrites the data model of the selected project. */
  setProject: (project: SetStateAction<ProjectSchema>) => void
  /** Overwrites the data model of the selected sub-project. */
  setSubProject: (update: SetStateAction<SubProjectSchema>) => void

  /** Goes to the landing page / recent projects list */
  navigateToProjects: () => void
  /** Goes to the selected project. Use when there are no subProjects */
  navigateToProject: () => void
  /** Goes to the subProjectId in the selected project. */
  navigateToSubProject: (subProjectId: string) => void
}

const notImplemented = () => {
  throw new Error('Should not be used outside of EditorContext.Provider')
}

export const EditorContext = createContext<EditorContextType>({
  project: undefined,
  subProject: undefined,
  computedSubProject: undefined,

  setProject: notImplemented,
  setSubProject: notImplemented,
  navigateToProjects: notImplemented,
  navigateToProject: notImplemented,
  navigateToSubProject: notImplemented,
})
