import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic',
  })],
  build: {
    lib: {
      entry: './src/lib/*.ts',
      fileName: "[name]",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      input: {
        index: "./src/lib/index.ts",
        hooks: "./src/lib/hooks.ts",
        utils: "./src/lib/utils.ts",
      },
      external: ['react', 'react-dom', '@antv/x6'],
      output: {
        globals: {
          '@antv/x6': 'X6',
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
