import react from '@vitejs/plugin-react'
import typia from '@typia/unplugin/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_BASE_PATH ?? '/') : '/',
  plugins: [typia(), react()],
}))
