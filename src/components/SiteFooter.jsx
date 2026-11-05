import { Link } from 'react-router-dom'
import { negocio } from '../data/negocio'
import { MOSTRAR_DEMO } from '../config'
import { useIrA } from '../lib/navegacion'
import { mapaFicha, whatsapp } from '../lib/utils'

/* Pie de página común a todas las páginas públicas. */
export function SiteFooter() {
  const n = negocio
  const irA = useIrA()
  const boton = 'block text-left hover:text-paper'
  return (
    <footer className="mt-28 bg-olive text-paper/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 text-[13px] sm:grid-cols-[1.5fr_1fr_1fr] sm:px-8">
        <div>
          <p className="text-[24px] font-semibold tracking-[-0.03em] text-paper">{n.nombre}<span className="text-sun">.</span></p>
          <p className="mt-2 max-w-xs leading-relaxed">{n.nombreLargo}. {n.direccion}, quito.</p>
          <p className="mt-3 leading-relaxed">{n.telefonos.join(' · ')} · {n.celular}<br />{n.email}</p>
        </div>
        <div className="space-y-2">
          <Link to="/destinos" className={boton}>destinos</Link>
          <button type="button" onClick={() => irA('promociones')} className={boton}>promociones</button>
          <button type="button" onClick={() => irA('nosotros')} className={boton}>nosotros</button>
          <button type="button" onClick={() => irA('visitanos')} className={boton}>contáctenos</button>
        </div>
        <div className="space-y-2">
          <a href={whatsapp('Hola Viafa 👋')} target="_blank" rel="noreferrer" className={boton}>whatsapp</a>
          <a href="https://www.facebook.com/VIAFA-Agencia-De-Viajes-1524900374407878/" target="_blank" rel="noreferrer" className={boton}>facebook</a>
          <a href={mapaFicha()} target="_blank" rel="noreferrer" className={boton}>google maps</a>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-[12px] text-paper/50 sm:px-8">
          <span>© {new Date().getFullYear()} {n.nombreLargo}</span>
          {MOSTRAR_DEMO && <Link to="/panel" className="hover:text-paper">acceso agencia</Link>}
        </div>
      </div>
    </footer>
  )
}
