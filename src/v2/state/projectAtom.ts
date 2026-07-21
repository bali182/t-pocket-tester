import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import { getPatchedProject } from '../component-patches/getPatchedProject'
import { getComputedProject } from '../logic/getComputedProject'
import type { ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'
import { projectsAtom } from './projectsAtom'

// Stores the final project model after automatic patches have been applied.
const projectStorageAtom = atom<ProjectSchema | undefined>(undefined)

// Public project atom. Writes apply the caller's update and then automatic project patches.
export const projectAtom = atom(
  (get): ProjectSchema | undefined => get(projectStorageAtom),
  (get, set, update: SetStateAction<ProjectSchema | undefined>): ProjectSchema | undefined => {
    const currentProject = get(projectStorageAtom)
    const updatedProject = typeof update === 'function' ? update(currentProject) : update

    if (!isDefined(updatedProject)) {
      set(projectStorageAtom, undefined)
      return undefined
    }

    const computedProject = getComputedProject(updatedProject)
    const patchedProject = getPatchedProject(updatedProject, computedProject)

    set(projectStorageAtom, patchedProject)
    set(projectsAtom, (projects) =>
      projects.map((project) => (project.id === patchedProject.id ? patchedProject : project)),
    )

    return patchedProject
  },
)

// Read-only computed representation of the final project model.
export const computedProjectAtom = atom((get) => {
  const project = get(projectAtom)

  if (!isDefined(project)) {
    return undefined
  }

  return getComputedProject(project)
})
