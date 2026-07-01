import { useToken, type Tokens } from '@chakra-ui/react'

type ColorToken = Tokens['colors']

export const useColorTokens = <T extends readonly ColorToken[]>(tokens: T): string[] => {
  return useToken('colors', tokens as unknown as string[])
}
