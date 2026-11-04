import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Genera UN solo index.html con todo adentro: se abre con doble clic,
// sin servidor ni instalación (las fotos y el mapa sí necesitan internet).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: { host: true, port: 5173 },
})
