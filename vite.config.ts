import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/anti-jetlag-diet/',
  test: {
    environment: 'node',
    globals: true,
  },
})
