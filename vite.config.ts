import typia from '@typia/unplugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const appEntry = '/src/index.tsx'

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
  return {
    base: command === 'build' ? (env.VITE_BASE_PATH ?? '/') : '/',
    plugins: [entry(appEntry), typia(), react()],
  }
})
