import { join, relative } from 'node:path'

type ElectronBuildTargetSchema = {
  entryFileName: string
  outputDirectory: string
  sourcePath: string
}

const mainBuildTarget: ElectronBuildTargetSchema = {
  entryFileName: 'index.js',
  outputDirectory: 'out/main',
  sourcePath: 'src/electron/electron-api/main.ts',
}

const preloadBuildTarget: ElectronBuildTargetSchema = {
  entryFileName: 'preload.cjs',
  outputDirectory: 'out/preload',
  sourcePath: 'src/electron/electron-api/preload.ts',
}

const rendererBuildTarget: ElectronBuildTargetSchema = {
  entryFileName: 'index.html',
  outputDirectory: 'out/renderer',
  sourcePath: 'src/electron/index.html',
}

export const electronBuildTargets = {
  main: mainBuildTarget,
  preload: preloadBuildTarget,
  renderer: rendererBuildTarget,
}

const getOutputPath = (target: ElectronBuildTargetSchema): string => {
  return join(target.outputDirectory, target.entryFileName)
}

const getRuntimePath = (mainDirectory: string, target: ElectronBuildTargetSchema): string => {
  return join(mainDirectory, relative(electronBuildTargets.main.outputDirectory, getOutputPath(target)))
}

export const getPreloadPath = (mainDirectory: string): string => {
  return getRuntimePath(mainDirectory, electronBuildTargets.preload)
}

export const getRendererPath = (mainDirectory: string): string => {
  return getRuntimePath(mainDirectory, electronBuildTargets.renderer)
}
