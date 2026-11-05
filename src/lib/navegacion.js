import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/* Ir a una sección del inicio (nosotros, contacto…) desde cualquier página.
   Los enlaces "#seccion" no sirven aquí porque la web usa rutas con # (/#/web). */
export function useIrA() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return useCallback(
    (id) => {
      if (pathname === '/web' || pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/web', { state: { ir: id } })
      }
    },
    [navigate, pathname],
  )
}

/* En el inicio: si llegamos con { state: { ir: 'seccion' } }, baja hasta ahí. */
export function useBajarASeccion() {
  const { state } = useLocation()
  useEffect(() => {
    if (!state?.ir) return
    const t = setTimeout(() => document.getElementById(state.ir)?.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [state])
}

/* Destinos agrupados por región, en el orden en que aparecen. */
export function porRegion(destinos) {
  const grupos = []
  for (const d of destinos) {
    let g = grupos.find((x) => x.region === d.region)
    if (!g) grupos.push((g = { region: d.region, destinos: [] }))
    g.destinos.push(d)
  }
  return grupos
}
