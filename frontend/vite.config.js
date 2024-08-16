import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import vercel from 'vite-plugin-vercel'

dotenv.config()

const isLocal = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react(), vercel()],
  server: {
    port: 3000,
    https: isLocal ? {
      key: fs.readFileSync(path.resolve(process.env.VITE_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(process.env.VITE_CERT_PATH)),
    } : false,
  },
})