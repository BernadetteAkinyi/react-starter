import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vite config doubles as the Vitest config.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    css: true,
  },
})
