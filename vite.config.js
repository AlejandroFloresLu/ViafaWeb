import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// El código fuente entra por app.html. `npm run build` genera UNA sola página
// con todo adentro y la copia a index.html (la que sirve GitHub Pages)
// y a viafa-demo.html (para abrir con doble clic).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { rollupOptions: { input: 'app.html' } },
  server: { host: true, port: 5173, open: '/app.html' },
})
