import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TarjetaFavorito } from './TarjetaFavorito'

/* Carril horizontal de "lugares favoritos": 2 tarjetas a la vez en computadora,
   1 (y un pedacito de la siguiente) en celular. Se desliza con el dedo, con la
   rueda/trackpad o con las flechas. */
export function CarrilFavoritos({ favoritos, paginaDe, titulo }) {
  const ref = useRef(null)
  const [puede, setPuede] = useState({ atras: false, adelante: false })
  const [actual, setActual] = useState(0)

  const revisar = useCallback(() => {
    const el = ref.current
    if (!el) return
    setPuede({ atras: el.scrollLeft > 4, adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
    const ancho = el.firstElementChild?.getBoundingClientRect().width || 1
    setActual(Math.round(el.scrollLeft / (ancho + 20)))
  }, [])

  useEffect(() => {
    revisar()
    const el = ref.current
    el?.addEventListener('scroll', revisar, { passive: true })
    window.addEventListener('resize', revisar)
    return () => {
      el?.removeEventListener('scroll', revisar)
      window.removeEventListener('resize', revisar)
    }
  }, [revisar, favoritos.length])

  const mover = (dir) => {
    const el = ref.current
    const ancho = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth
    el.scrollBy({ left: dir * (ancho + 20), behavior: 'smooth' })
  }

  const flecha = 'grid size-11 place-items-center border border-ink/15 bg-white text-ink transition hover:border-ink disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink/15'

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        {titulo}
        {favoritos.length > 1 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" aria-label="anterior" onClick={() => mover(-1)} disabled={!puede.atras} className={flecha}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" aria-label="siguiente" onClick={() => mover(1)} disabled={!puede.adelante} className={flecha}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={ref}
        className="carril -mx-5 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
        aria-label="lugares favoritos"
      >
        {favoritos.map((f) => (
          <div key={f.id} className="flex w-[86%] shrink-0 snap-start md:w-[calc((100%-20px)/2)]">
            <TarjetaFavorito f={f} destino={paginaDe(f)} />
          </div>
        ))}
      </div>

      {favoritos.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
          {favoritos.map((f, i) => (
            <span key={f.id} className={`h-1.5 transition-all ${i === actual ? 'w-6 bg-sun' : 'w-1.5 bg-ink/20'}`} />
          ))}
        </div>
      )}
    </>
  )
}
