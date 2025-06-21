import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,          // ouvre automatiquement le navigateur au démarrage
    strictPort: true,    // empêche Vite de changer de port si 5173 est occupé
  }
})
