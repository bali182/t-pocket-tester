import typia from '@typia/unplugin/vite'
import react from '@vitejs/plugin-react'
import type { Plugin, UserConfig } from 'vite'

const appEntry = '/src/index.tsx'

export type ViteConfigOptions = {
  base: string
  isElectron: boolean
}

const entry = (entryPath: string): Plugin => {
  return {
    name: 'app-entry',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [{ tag: 'script', attrs: { type: 'module', src: entryPath }, injectTo: 'body' }]
      },
    },
  }
}

export const createViteConfig = ({ base, isElectron }: ViteConfigOptions): Omit<UserConfig, 'build'> => {
  return {
    base,
    define: {
      'import.meta.env.VITE_IS_ELECTRON': JSON.stringify(isElectron ? 'true' : 'false'),
    },
    plugins: [entry(appEntry), typia(), react()],
  }
}
