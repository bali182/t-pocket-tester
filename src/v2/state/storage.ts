import typia from 'typia'

import type { ProjectSchema } from '../schemas/project'

const projectsStorageKey = 't-pocket-tester:projects'

export const readProjectsFromStorage = (): ProjectSchema[] => {
  try {
    const storedProjects = localStorage.getItem(projectsStorageKey)

    if (storedProjects === null) {
      return []
    }

    const parsedProjects: unknown = JSON.parse(storedProjects)
    return typia.assert<ProjectSchema[]>(parsedProjects)
  } catch (error) {
    try {
      localStorage.removeItem(projectsStorageKey)
    } catch (removeError) {
      console.error('Unable to remove invalid stored projects:', removeError)
    }

    console.error('Unable to read stored projects:', error)
    return []
  }
}

export const saveProjectsToStorage = (projects: ProjectSchema[]): void => {
  try {
    localStorage.setItem(projectsStorageKey, JSON.stringify(projects))
  } catch (error) {
    console.error('Unable to save projects:', error)
  }
}
