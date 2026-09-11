import typia from 'typia'

import type { ProjectSchema } from '../schemas/project'
import type { RecentProjectsSchema } from '../schemas/recentProject'
import type { GlobalSettingsSchema } from '../schemas/settings'
import type { ThemeSchema } from '../schemas/theme'
import { getSystemTheme } from '../utils/getSystemTheme'

type StorageKey = 'global-settings' | 'projects' | 'recent-projects' | 'theme'

export const readGlobalSettingsFromStorage = (defaultValue: GlobalSettingsSchema): GlobalSettingsSchema => {
  return safeReadStorage<GlobalSettingsSchema>('global-settings', defaultValue, (raw) =>
    typia.assert<GlobalSettingsSchema>(raw),
  )
}

export const saveGlobalSettingsToStorage = (settings: GlobalSettingsSchema): void => {
  safeWriteStorage('global-settings', settings)
}

export const readProjectsFromStorage = (): ProjectSchema[] => {
  return safeReadStorage<ProjectSchema[]>('projects', [], (raw) => typia.assert<ProjectSchema[]>(raw))
}

export const saveProjectsToStorage = (projects: ProjectSchema[]): void => {
  safeWriteStorage('projects', projects)
}

export const readRecentProjectsFromStorage = (): RecentProjectsSchema => {
  return safeReadStorage<RecentProjectsSchema>('recent-projects', {}, (raw) => typia.assert<RecentProjectsSchema>(raw))
}

export const saveRecentProjectsToStorage = (recentProjects: RecentProjectsSchema): void => {
  safeWriteStorage('recent-projects', recentProjects)
}

export const readThemeFromStorage = (): ThemeSchema => {
  return safeReadStorage<ThemeSchema>('theme', getSystemTheme(), (raw) => typia.assert<ThemeSchema>(raw))
}

export const saveThemeToStorage = (theme: ThemeSchema): void => {
  safeWriteStorage('theme', theme)
}

const safeReadStorage = <T>(key: StorageKey, defaultValue: T, assert: (raw: unknown) => void): T => {
  try {
    const storedValue = localStorage.getItem(key)

    if (storedValue === null) {
      return defaultValue
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    assert(parsedValue)
    return parsedValue as T
  } catch (error) {
    try {
      localStorage.removeItem(key)
    } catch (removeError) {
      console.error(`Unable to remove invalid stored ${key}:`, removeError)
    }

    console.error(`Unable to read stored ${key}:`, error)
    return defaultValue
  }
}

const safeWriteStorage = <T>(key: StorageKey, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ${key}:`, error)
  }
}
