import typia from '@typia/unplugin/vite'
import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'
import { electronBuildTargets } from './src/electron/electron-api/buildPaths'
import { createViteConfig } from './vite.common'

export default defineConfig({
  main: {
    plugins: [typia()],
    build: {
      outDir: resolve(electronBuildTargets.main.outputDirectory),
      rollupOptions: {
        input: resolve(electronBuildTargets.main.sourcePath),
        output: {
          entryFileNames: electronBuildTargets.main.entryFileName,
        },
      },
    },
  },
  preload: {
    build: {
      outDir: resolve(electronBuildTargets.preload.outputDirectory),
      rollupOptions: {
        input: resolve(electronBuildTargets.preload.sourcePath),
        output: {
          entryFileNames: electronBuildTargets.preload.entryFileName,
          format: 'cjs',
        },
        treeshake: {
          moduleSideEffects: (moduleId: string): boolean => !moduleId.startsWith('node:'),
        },
      },
    },
  },
  renderer: {
    ...createViteConfig({ appEntry: '/index.tsx', base: './', isElectron: true, port: 4000 }),
    root: resolve('src/electron'),
    build: {
      outDir: resolve(electronBuildTargets.renderer.outputDirectory),
      rollupOptions: {
        input: resolve(electronBuildTargets.renderer.sourcePath),
      },
    },
  },
})
