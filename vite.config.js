import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/colors': 'http://localhost:8080',
      '/books': 'http://localhost:8080',
      '/microseasons': 'http://localhost:8080',
      '/cart-items': "http://localhost:8080",
      '/digital-cards': "http://localhost:8080",
      '/reservations': "http://localhost:8080",
      '/favorites': "http://localhost:8080",
      '/paypal': "http://localhost:8080",
    }
  }
})
