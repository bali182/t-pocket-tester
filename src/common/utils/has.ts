import { isDefined } from './isDefined'

const hasOwnProperty = Object.prototype.hasOwnProperty

export const has = <T extends object>(object: T, key: keyof T) => {
  if (!isDefined(object)) {
    return false
  }
  return hasOwnProperty.call(object, key)
}
