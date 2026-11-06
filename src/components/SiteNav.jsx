import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { negocio } from '../data/negocio'
import { useContenido } from '../lib/contenido'
import { porRegion, useIrA } from '../lib/navegacion'
import { whatsapp } from '../lib/utils'
import { MOSTRAR_DESTINOS } from '../config'
import logo from '../assets/logo.png'

/* Menú principal: barra azul fija con el logo
   inicio · nosotros · favoritos · viajes · clientes · contáctenos · cotice ahora
   Con MOSTRAR_DESTINOS = true aparece además "destinos ▾" (por región). */
export function SiteNav() {
  const { destinos } = useContenido()
  const irA = useIrA()
  const { pathname } = useLocation()
  const [mega, setMega] = useState(false)
  const [movil, setMovil] = useState(false)
  const cajaRef = useRef(null)
  const grupos = porRegion(destinos)
  const cotizar = whatsapp('Hola Viafa 👋 quiero cotizar un viaje.')

  // Cerrar el menú de destinos al cambiar de página o al hacer clic afuera
  useEffect(() => {
    setMega(false)
    setMovil(false)
  }, [pathname])
  useEffect(() => {
    if (!mega) return
    const fuera = (e) => !cajaRef.current?.contains(e.target) && setMega(false)
    const esc = (e) => e.key === 'Escape' && setMega(false)
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [mega])

  const enlace = 'text-[13px] uppercase tracking-[0.12em] opacity-90 hover:opacity-100'

  return (
    <nav ref={cajaRef} className="sticky top-0 z-30 bg-white text-olive shadow-[0_12px_28px_-6px_rgba(4,4,80,0.8)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link to="/web" aria-label={`${negocio.nombreLargo} · inicio`} className="shrink-0">
          <img src={logo} alt="Viafa Agencia de Viajes" className="h-[28px] w-auto sm:h-[42px]" />
        </Link>

        {/* Escritorio */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link to="/web" className={enlace}>inicio</Link>
          <button type="button" onClick={() => irA('nosotros')} className={enlace}>nosotros</button>
          {MOSTRAR_DESTINOS ? (
            <button type="button" onClick={() => setMega((m) => !m)} aria-expanded={mega} className={`${enlace} inline-flex items-center gap-1`}>
              destinos <ChevronDown size={14} className={`transition-transform ${mega ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button type="button" onClick={() => irA('favoritos')} className={enlace}>favoritos</button>
          )}
          <button type="button" onClick={() => irA('viajes')} className={enlace}>viajes</button>
          <button type="button" onClick={() => irA('clientes')} className={enlace}>clientes</button>
          <button type="button" onClick={() => irA('visitanos')} className={enlace}>contáctenos</button>
          <a href={cotizar} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center bg-sun px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink hover:brightness-105">
            cotice ahora
          </a>
        </div>

        <button type="button" aria-label="Abrir menú" onClick={() => setMovil(true)} className="p-1 lg:hidden">
          <Menu size={24} />
        </button>
      </div>

      {/* Menú de destinos (escritorio) */}
      {MOSTRAR_DESTINOS && mega && (
        <div className="absolute inset-x-0 top-full hidden lg:block">
          <div className="mx-auto max-w-6xl px-8">
            <div className="rise grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 bg-ink p-8 text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
              {grupos.map((g) => (
                <div key={g.region}>
                  <p className="eyebrow text-sun">{g.region}</p>
                  <ul className="mt-4 space-y-2.5">
                    {g.destinos.map((d) => (
                      <li key={d.id}>
                        <Link to={`/destinos/${d.id}`} className="group inline-flex items-center gap-2 text-[15px] text-paper/85 hover:text-paper">
                          <ArrowRight size={13} className="text-sun transition-transform group-hover:translate-x-0.5" /> {d.nombre}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col justify-end">
                <Link to="/destinos" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sun">
                  ver todos los destinos <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menú en el celular */}
      {movil && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-paper px-5 py-5 text-ink lg:hidden">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Viafa Agencia de Viajes" className="h-11 w-auto" />
            <button type="button" aria-label="Cerrar menú" onClick={() => setMovil(false)} className="p-1"><X size={24} /></button>
          </div>
          <div className="mt-10 flex flex-col gap-4 text-[28px] font-medium tracking-[-0.02em]">
            <Link to="/web" onClick={() => setMovil(false)}>inicio</Link>
            <button type="button" className="text-left" onClick={() => { setMovil(false); irA('nosotros') }}>nosotros</button>
            {MOSTRAR_DESTINOS ? (
              <Link to="/destinos" onClick={() => setMovil(false)}>destinos</Link>
            ) : (
              <button type="button" className="text-left" onClick={() => { setMovil(false); irA('favoritos') }}>favoritos</button>
            )}
            <button type="button" className="text-left" onClick={() => { setMovil(false); irA('viajes') }}>viajes</button>
            <button type="button" className="text-left" onClick={() => { setMovil(false); irA('clientes') }}>clientes</button>
          </div>
          {MOSTRAR_DESTINOS && <div className="mt-3 space-y-5 border-l-2 border-sun pl-4">
            {grupos.map((g) => (
              <div key={g.region}>
                <p className="eyebrow text-ink-3">{g.region}</p>
                <div className="mt-1.5 flex flex-col gap-1.5 text-[17px]">
                  {g.destinos.map((d) => (
                    <Link key={d.id} to={`/destinos/${d.id}`} onClick={() => setMovil(false)} className="text-ink-2">{d.nombre}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>}
          <div className="mt-6 flex flex-col gap-4 text-[28px] font-medium tracking-[-0.02em]">
            <button type="button" className="text-left" onClick={() => { setMovil(false); irA('visitanos') }}>contáctenos</button>
            <a href={cotizar} target="_blank" rel="noreferrer" className="text-clay">cotice ahora</a>
          </div>
        </div>
      )}
    </nav>
  )
}
