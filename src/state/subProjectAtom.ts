import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import { getPatchedSubProject } from '../component-patches/getPatchedSubProject'
import { getComputedProject } from '../logic/getComputedProject'
import type { SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'
import { projectsAtom } from './projectsAtom'

// Stores the final subProject model after automatic patches have been applied.
const subProjectStorageAtom = atom<SubProjectSchema | undefined>(undefined)

// Public subProject atom. Writes apply the caller's update and then automatic subProject patches.
export const subProjectAtom = atom(
  (get): SubProjectSchema | undefined => get(subProjectStorageAtom),
  (get, set, update: SetStateAction<SubProjectSchema | undefined>): SubProjectSchema | undefined => {
    const currentProject = get(subProjectStorageAtom)
    const updatedProject = typeof update === 'function' ? update(currentProject) : update

    if (!isDefined(updatedProject)) {
      set(subProjectStorageAtom, undefined)
      return undefined
    }

    console.log(updatedProject)

    const computedProject = getComputedProject(updatedProject)
    const patchedProject = getPatchedSubProject(updatedProject, computedProject)

    set(subProjectStorageAtom, patchedProject)
    set(projectsAtom, (projects) =>
      projects.map((subProject) => (subProject.id === patchedProject.id ? patchedProject : subProject)),
    )

    return patchedProject
  },
)

// Read-only computed representation of the final project model.
export const computedSubProjectAtom = atom((get) => {
  const subProject = get(subProjectAtom)

  if (!isDefined(subProject)) {
    return undefined
  }

  return getComputedProject(subProject)
})
