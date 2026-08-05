import { customAlphabet } from 'nanoid'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const id = customAlphabet(alphabet, 10)

export const safeId = (used: string[]): string => {
  let newId = id()
  while (used.includes(newId)) {
    newId = id()
  }
  return newId
}
