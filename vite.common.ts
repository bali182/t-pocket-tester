import typia from '@typia/unplugin/vite'
import react from '@vitejs/plugin-react'
import type { Plugin, UserConfig } from 'vite'

export type ViteConfigOptions = {
  appEntry: string
  base: string
  contentSecurityPolicy?: string
  isElectron: boolean
  port: number
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

const contentSecurityPolicy = (policy: string): Plugin => {
  return {
    name: 'content-security-policy',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'meta',
            attrs: {
              content: policy,
              'http-equiv': 'Content-Security-Policy',
            },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

export const createViteConfig = ({
  appEntry,
  base,
  contentSecurityPolicy: csp,
  isElectron,
  port,
}: ViteConfigOptions): Omit<UserConfig, 'build'> => {
  return {
    base,
    define: {
      'import.meta.env.VITE_IS_ELECTRON': JSON.stringify(isElectron ? 'true' : 'false'),
    },
    plugins: [entry(appEntry), ...(csp === undefined ? [] : [contentSecurityPolicy(csp)]), typia(), react()],
    server: {
      port,
      strictPort: true,
    },
  }
}
