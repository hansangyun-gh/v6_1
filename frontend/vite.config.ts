import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 개발 중 API 요청을 백엔드로 프록시
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // 백엔드 포트에 맞게 5000으로 수정
    },
  },
})
