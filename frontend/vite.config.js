import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(process.env.VITE_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(process.env.VITE_CERT_PATH)),
    },
  }
})
