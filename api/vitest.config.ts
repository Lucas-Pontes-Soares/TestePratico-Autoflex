import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
    include: ['src/**/*.test.ts'], 
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/http/server.ts',
        'src/db/migrations/**',
        'src/db/client.ts',
        'src/db/schema/**',
        'src/lib/**',
        'src/middlewares/**'
      ],
    },
  },
})