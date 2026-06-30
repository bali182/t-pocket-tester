import typia from '@typia/unplugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const appEntries = {
  v1: '/src/v1/index.tsx',
  v2: '/src/v2/index.tsx',
}

const entry = (entry: string): Plugin => {
  return {
    name: 'app-entry',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [{ tag: 'script', attrs: { type: 'module', src: entry }, injectTo: 'body' }]
      },
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const indexTsx = appEntries[env.APP_VERSION as keyof typeof appEntries]
  return {
    base: command === 'build' ? (env.VITE_BASE_PATH ?? '/') : '/',
    plugins: [entry(indexTsx), typia(), react()],
  }
})
