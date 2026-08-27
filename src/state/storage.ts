import typia from 'typia'

import type { PdfExportSettingsSchema } from '../schemas/pdfExport'
import type { ProjectSchema } from '../schemas/project'
import type { RecentProjectSchema } from '../schemas/recentProject'
import type { BaseExportSettingsSchema } from '../schemas/settings'
import type { ThemeAppearanceSchema } from '../schemas/theme'

type StorageKey = 'pdf-export-params' | 'projects' | 'recent-projects' | 'scaling' | 'svg-export-params' | 'theme'

export const readProjectsFromStorage = (): ProjectSchema[] => {
  return safeReadStorage<ProjectSchema[]>('projects', [], (raw) => typia.assert<ProjectSchema[]>(raw))
}

export const saveProjectsToStorage = (projects: ProjectSchema[]): void => {
  safeWriteStorage('projects', projects)
}

export const readRecentProjectsFromStorage = (): Record<string, RecentProjectSchema> => {
  return safeReadStorage<Record<string, RecentProjectSchema>>('recent-projects', {}, (raw) =>
    typia.assert<Record<string, RecentProjectSchema>>(raw),
  )
}

export const saveRecentProjectsToStorage = (recentProjects: Record<string, RecentProjectSchema>): void => {
  safeWriteStorage('recent-projects', recentProjects)
}

export const readScalingFromStorage = (): number => {
  return safeReadStorage<number>('scaling', 1, (raw) => typia.assert<number>(raw))
}

export const saveScalingToStorage = (scaling: number): void => {
  safeWriteStorage('scaling', scaling)
}

export const readThemeFromStorage = (): ThemeAppearanceSchema => {
  return safeReadStorage<ThemeAppearanceSchema>('theme', 'light', (raw) => typia.assert<ThemeAppearanceSchema>(raw))
}

export const saveThemeToStorage = (theme: ThemeAppearanceSchema): void => {
  safeWriteStorage('theme', theme)
}

export const readSvgExportParamsFromStorage = (defaultValue: BaseExportSettingsSchema): BaseExportSettingsSchema => {
  return safeReadStorage<BaseExportSettingsSchema>('svg-export-params', defaultValue, (raw) =>
    typia.assert<BaseExportSettingsSchema>(raw),
  )
}

export const saveSvgExportParamsToStorage = (params: BaseExportSettingsSchema): void => {
  safeWriteStorage('svg-export-params', params)
}

export const readPdfExportParamsFromStorage = (defaultValue: PdfExportSettingsSchema): PdfExportSettingsSchema => {
  return safeReadStorage<PdfExportSettingsSchema>('pdf-export-params', defaultValue, (raw) =>
    typia.assert<PdfExportSettingsSchema>(raw),
  )
}

export const savePdfExportParamsToStorage = (params: PdfExportSettingsSchema): void => {
  safeWriteStorage('pdf-export-params', params)
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
