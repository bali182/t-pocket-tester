import typia from 'typia'

import type { ProjectSchema } from '../schemas/project'
import { BaseExportSettingsSchema } from '../schemas/settings'

type StorageKey = 'projects' | 'scaling' | 'svg-export-params'

export const readProjectsFromStorage = (): ProjectSchema[] => {
  return safeReadStorage<ProjectSchema[]>('projects', [], (raw) => typia.assert<ProjectSchema[]>(raw))
}

export const saveProjectsToStorage = (projects: ProjectSchema[]): void => {
  safeWriteStorage('projects', projects)
}

export const readScalingFromStorage = (): number => {
  return safeReadStorage<number>('scaling', 1, (raw) => typia.assert<number>(raw))
}

export const saveScalingToStorage = (scaling: number): void => {
  safeWriteStorage('scaling', scaling)
}

export const readSvgExportParamsFromStorage = (defaultValue: BaseExportSettingsSchema): BaseExportSettingsSchema => {
  return safeReadStorage<BaseExportSettingsSchema>('svg-export-params', defaultValue, (raw) =>
    typia.assert<BaseExportSettingsSchema>(raw),
  )
}

export const saveSvgExportParamsToStorage = (params: BaseExportSettingsSchema): void => {
  safeWriteStorage('svg-export-params', params)
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
