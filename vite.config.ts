import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic',
  }), dts({
    insertTypesEntry: false,
  })],
  build: {
    lib: {
      entry: './src/lib',
      name: 'react-x6-graph',
      fileName: 'index',
    },
    rollupOptions: {
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
