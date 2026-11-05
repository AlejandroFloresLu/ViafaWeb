import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PublicacionesProvider } from './lib/publicaciones'
import { ContenidoProvider } from './lib/contenido'
import { DemoBar } from './components/DemoBar'
import { MOSTRAR_DEMO, MOSTRAR_DESTINOS } from './config'
import { SIMULACION } from './lib/supabase'
import { reiniciarSimulacion } from './lib/supabaseSimulado'
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

/* Barra fija solo en la versión de prueba del panel */
function BarraSimulacion() {
  const { pathname } = useLocation()
  const enAdmin = pathname.startsWith('/admin')
  return (
    <div className="fixed bottom-3 left-1/2 z-[60] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full bg-sun px-5 py-2 text-[12px] font-medium text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
      <span className="font-semibold uppercase tracking-[0.12em]">simulación</span>
      <span className="hidden sm:inline">se guarda solo en este navegador · usuario admin / clave admin</span>
      <a href={enAdmin ? '#/web' : '#/admin'} className="underline underline-offset-2">{enAdmin ? 'ver la web' : 'ir al panel /admin'}</a>
      <button type="button" onClick={reiniciarSimulacion} className="underline underline-offset-2">reiniciar</button>
    </div>
  )
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
          {SIMULACION && <BarraSimulacion />}
        </PublicacionesProvider>
      </ContenidoProvider>
    </HashRouter>
  )
}
