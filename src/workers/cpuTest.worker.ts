import { expose } from 'comlink'

export const runCpuTest = (iterations: number): number => {
  let result = 0

  for (let index = 0; index < iterations; index += 1) {
    result = (result + index * 1_103_515_245 + 12_345) % 2_147_483_647
  }

  return result
}

expose(runCpuTest)
