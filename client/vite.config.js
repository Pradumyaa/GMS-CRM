import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      crypto: path.resolve('node_modules/crypto-browserify'),
      stream: path.resolve('node_modules/stream-browserify'),
      buffer: path.resolve('node_modules/buffer/'),
      events: path.resolve('node_modules/events/'),
      util: path.resolve('node_modules/util/'),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'crypto-browserify',
      'stream-browserify',
      'assert',
      'safe-buffer',
      'buffer',
      'events',
      'util'
    ],
  },
  define: {
    global: {},
  },
})
