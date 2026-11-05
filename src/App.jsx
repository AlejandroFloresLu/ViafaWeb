import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PublicacionesProvider } from './lib/publicaciones'
import { ContenidoProvider } from './lib/contenido'
import { DemoBar } from './components/DemoBar'
import { MOSTRAR_DEMO, MOSTRAR_DESTINOS } from './config'
import { Web } from './views/Web'
import { Panel } from './views/Panel'
import { Publicar } from './views/Publicar'
import { Admin } from './views/admin/Admin'
import { Destinos } from './views/Destinos'
import { Destino, Sitio } from './views/Destino'

/* Rutas
   /web     → inicio de Viafa (favoritos, nosotros, viajes, clientes, contacto)
   /admin   → PANEL REAL del gerente, con login (/panel redirige aquí)

   Con MOSTRAR_DESTINOS = true (hoy oculto):
   /destinos             → todos los destinos por región
   /destinos/:id         → un destino: banner, precio, PDF y sus lugares
   /destinos/:id/:sitio  → un lugar del destino, con fotos e información

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
            {MOSTRAR_DESTINOS && (
              <>
                <Route path="/destinos" element={<Destinos />} />
                <Route path="/destinos/:id" element={<Destino />} />
                <Route path="/destinos/:id/:sitio" element={<Sitio />} />
              </>
            )}
            {MOSTRAR_DEMO ? (
              <>
                <Route path="/panel" element={<Panel />} />
                <Route path="/panel/publicar" element={<Publicar />} />
              </>
            ) : (
              <>
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/panel/*" element={<Navigate to="/admin" replace />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/web" replace />} />
          </Routes>
          {MOSTRAR_DEMO && <DemoBar />}
        </PublicacionesProvider>
      </ContenidoProvider>
    </HashRouter>
  )
}
