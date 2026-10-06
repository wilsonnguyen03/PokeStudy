import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Browser build of the renderer, used for the web demo (the desktop app uses electron.vite.config.ts)
export default defineConfig({
  root: resolve('src/renderer'),
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src')
    }
  },
  plugins: [react()],
  define: {
    'import.meta.env.RENDERER_VITE_WEB': JSON.stringify('1')
  },
  build: {
    outDir: resolve('dist-web'),
    emptyOutDir: true
  }
})
