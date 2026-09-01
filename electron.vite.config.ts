import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'
import { createViteConfig } from './vite.common'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: resolve('electron/main.ts'),
        output: {
          entryFileNames: 'index.js',
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: resolve('electron/preload.ts'),
        output: {
          entryFileNames: 'index.js',
        },
      },
    },
  },
  renderer: {
    ...createViteConfig({ base: './', isElectron: true }),
    root: '.',
    build: {
      rollupOptions: {
        input: resolve('index.html'),
      },
    },
  },
})
