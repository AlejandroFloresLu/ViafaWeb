import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PublicacionesProvider } from './lib/publicaciones'
import { ContenidoProvider } from './lib/contenido'
import { DemoBar } from './components/DemoBar'
import { MOSTRAR_DEMO } from './config'
import { Web } from './views/Web'
import { Panel } from './views/Panel'
import { Publicar } from './views/Publicar'
import { Admin } from './views/admin/Admin'

/* Rutas
   /web     → la web de Viafa (lee destinos, promos y horario de Supabase)
   /panel   → PANEL REAL con login (promociones, destinos, horario)

   Con MOSTRAR_DEMO = true (modo presentación):
   /panel           → panel SIMULADO con métricas de ejemplo
   /panel/publicar  → "publicar" simulado
   + la barra flotante "su web · su panel · publicar"                    */

function ScrollArriba() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (!search.includes('nuevo')) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ContenidoProvider>
        <PublicacionesProvider>
          <ScrollArriba />
          <Routes>
            <Route path="/" element={<Navigate to="/web" replace />} />
            <Route path="/web" element={<Web />} />
            {MOSTRAR_DEMO ? (
              <>
                <Route path="/panel" element={<Panel />} />
                <Route path="/panel/publicar" element={<Publicar />} />
              </>
            ) : (
              <Route path="/panel/*" element={<Admin />} />
            )}
            <Route path="*" element={<Navigate to="/web" replace />} />
          </Routes>
          {MOSTRAR_DEMO && <DemoBar />}
        </PublicacionesProvider>
      </ContenidoProvider>
    </HashRouter>
  )
}
