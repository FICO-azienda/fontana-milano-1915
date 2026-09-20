import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa + routing a hash: funziona su GitHub Pages con qualunque nome di repository.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2020', cssMinify: true },
})
