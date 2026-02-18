import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- this makes @ point to src/
    },
    // make sure Rollup/Vite explicitly resolves these extensions during build
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
})
