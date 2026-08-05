import { Getter } from 'jotai'
import { SubProjectSchema } from '../schemas/subProject'
import { subProjectAtom } from '../state/subProjectAtom'
import { isDefined } from './isDefined'

export const getRequiredSubProject = (get: Getter): SubProjectSchema => {
  const subProject = get(subProjectAtom)

  if (!isDefined(subProject)) {
    throw new Error('An opened project is required')
  }

  return subProject
}
