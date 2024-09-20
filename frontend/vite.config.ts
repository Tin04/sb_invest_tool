import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'BACKEND_HOST': JSON.stringify('http://localhost:5000'),
    'FRONTEND_HOST': JSON.stringify('http://localhost:5173'),
  }
})