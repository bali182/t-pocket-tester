import { defineConfig, loadEnv } from 'vite'
import { createViteConfig } from './vite.common'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = command === 'build' ? (env.VITE_BASE_PATH ?? '/') : '/'

  return createViteConfig({ base, isElectron: false })
})
