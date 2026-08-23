import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import type { SetStateAction } from 'react'

import { getPatchedSubProject } from '../component-patches/getPatchedSubProject'
import { getSubComputedSubProject } from '../logic/getSubComputedProject'
import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'
import { projectsAtom } from './projectsAtom'

export type SubProjectAtomReferenceSchema = {
  projectId: string | undefined
  subProjectId: string | undefined
}

const isSameSubProjectAtomReference = (
  first: SubProjectAtomReferenceSchema,
  second: SubProjectAtomReferenceSchema,
): boolean => {
  return first.projectId === second.projectId && first.subProjectId === second.subProjectId
}

const getPatchedProject = (project: ProjectSchema): ProjectSchema => {
  return {
    ...project,
    subProjects: project.subProjects.map((subProject) => {
      const computedSubProject = getSubComputedSubProject(subProject, project.stitchingSettings)
      return getPatchedSubProject(subProject, computedSubProject, project.editingSettings)
    }),
  }
}

export const projectAtomFamily = atomFamily((projectId: string | undefined) => {
  return atom(
    (get): ProjectSchema | undefined => {
      if (!isDefined(projectId)) {
        return undefined
      }

      return get(projectsAtom).find((project) => project.id === projectId)
    },
    (get, set, update: SetStateAction<ProjectSchema>): void => {
      const currentProject = get(projectAtomFamily(projectId))

      if (!isDefined(currentProject)) {
        throw new Error('Project not found')
      }

      const updatedProject = typeof update === 'function' ? update(currentProject) : update
      const patchedProject = getPatchedProject(updatedProject)

      set(projectsAtom, (projects) =>
        projects.map((project) => (project.id === patchedProject.id ? patchedProject : project)),
      )
    },
  )
})

export const subProjectAtomFamily = atomFamily((reference: SubProjectAtomReferenceSchema) => {
  return atom(
    (get): SubProjectSchema | undefined => {
      const project = get(projectAtomFamily(reference.projectId))

      if (!isDefined(project) || !isDefined(reference.subProjectId)) {
        return undefined
      }

      return project.subProjects.find((subProject) => subProject.id === reference.subProjectId)
    },
    (get, set, update: SetStateAction<SubProjectSchema>): void => {
      const project = get(projectAtomFamily(reference.projectId))
      const currentSubProject = get(subProjectAtomFamily(reference))

      if (!isDefined(project) || !isDefined(currentSubProject)) {
        throw new Error('Subproject not found')
      }

      const updatedSubProject = typeof update === 'function' ? update(currentSubProject) : update
      const computedSubProject = getSubComputedSubProject(updatedSubProject, project.stitchingSettings)
      const patchedSubProject = getPatchedSubProject(updatedSubProject, computedSubProject, project.editingSettings)

      set(projectsAtom, (projects) =>
        projects.map((candidate) => {
          if (candidate.id !== project.id) {
            return candidate
          }

          return {
            ...candidate,
            subProjects: candidate.subProjects.map((subProject) =>
              subProject.id === patchedSubProject.id ? patchedSubProject : subProject,
            ),
          }
        }),
      )
    },
  )
}, isSameSubProjectAtomReference)

export const computedSubProjectAtomFamily = atomFamily((reference: SubProjectAtomReferenceSchema) => {
  return atom((get): ComputedSubProjectSchema | undefined => {
    const project = get(projectAtomFamily(reference.projectId))
    const subProject = get(subProjectAtomFamily(reference))

    if (!isDefined(project) || !isDefined(subProject)) {
      return undefined
    }

    return getSubComputedSubProject(subProject, project.stitchingSettings)
  })
}, isSameSubProjectAtomReference)

export const computedProjectAtomFamily = atomFamily((projectId: string | undefined) => {
  return atom((get): ComputedProjectSchema | undefined => {
    const project = get(projectAtomFamily(projectId))

    if (!isDefined(project)) {
      return undefined
    }

    const subProjects = project.subProjects.map((subProject) => {
      const computedSubProject = get(
        computedSubProjectAtomFamily({ projectId: project.id, subProjectId: subProject.id }),
      )

      if (!isDefined(computedSubProject)) {
        throw new Error('Computed subproject not found')
      }

      return computedSubProject
    })

    return {
      id: project.id,
      name: project.name,
      subProjects,
    }
  })
})
