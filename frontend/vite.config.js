import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const isLocal = process.env.NODE_ENV === 'development'
    const isVercel = process.env.NODE_ENV === 'production'

    return defineConfig({
    plugins: [react(), 
        isVercel && vercel(), 
        isLocal && basicSsl({
            name: 'test',
            domains: ['localhost'],
            certDir: process.env.VITE_CERT_PATH
        })],
        server: {
            port: 3000,
            https: isLocal
        },
})}