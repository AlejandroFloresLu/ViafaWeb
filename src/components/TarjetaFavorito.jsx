import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, Bus, Camera, Clock, MapPin, Plane, ShieldCheck, Sparkles, Star, Tag, Utensils } from 'lucide-react'
import { INCLUYE } from '../data/favoritos'
import { precio, whatsapp } from '../lib/utils'

const ICONOS = { vuelo: Plane, hotel: BedDouble, comidas: Utensils, todo: Sparkles, traslados: Bus, tours: Camera, asistencia: ShieldCheck }
const nombreIncluye = Object.fromEntries(INCLUYE.map((x) => [x.id, x.label]))
const sinCentavos = (n) => precio(n).replace(/,00$/, '')

const sinFoto = (e) => {
  e.currentTarget.style.visibility = 'hidden'
}

/* Tarjeta compacta de un "lugar favorito" (entra completa en una pantalla):
   foto, título, salidas, estrellas, precio, tipo, duración, salida, aerolínea,
   descripción corta, íconos de lo que incluye y botón "ver oferta". */
export function TarjetaFavorito({ f, destino }) {
  const mensaje =
    `Hola Viafa 👋 me interesa la oferta "${f.nombre}"` +
    (f.precio > 0 ? ` desde ${sinCentavos(f.precio)}` : '') +
    (f.salidas ? ` (${f.salidas})` : '') +
    '. ¿Me pueden dar más información?'

  const datos = [
    f.tipo && { icono: Tag, label: 'tipo', valor: f.tipo },
    f.noches > 0 && { icono: Clock, label: 'duración', valor: `${f.noches} ${f.noches === 1 ? 'noche' : 'noches'}` },
    f.salida && { icono: MapPin, label: 'salida', valor: f.salida },
    f.aerolinea && { icono: Plane, label: 'aerolínea', valor: f.aerolinea },
  ].filter(Boolean)

  const claseBoton =
    'group/btn relative inline-flex h-10 shrink-0 items-center gap-1.5 overflow-hidden bg-sun px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-ink shadow-[0_6px_16px_-6px_rgba(247,148,29,0.95)] ring-2 ring-sun/30 transition hover:-translate-y-0.5 hover:ring-sun/60'
  const boton = (
    <>
      <span className="brillo pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/45" aria-hidden="true" />
      ver oferta <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-0.5" />
    </>
  )

  return (
    <article className="flex w-full flex-col bg-white ring-1 ring-line">
      <div className="group relative aspect-[16/9] overflow-hidden bg-paper-3 [@media(max-height:800px)_and_(min-width:768px)]:aspect-[2/1]">
        <img onError={sinFoto} src={f.foto} alt={f.nombre} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="text-[17px] font-semibold uppercase leading-snug text-ink">{f.nombre}</h3>

        <div className="mt-2 flex items-end justify-between gap-3 border-b border-line pb-3">
          <div className="min-w-0">
            {f.salidas && <p className="text-[12px] leading-snug text-ink-2">{f.salidas}</p>}
            {f.estrellas > 0 && (
              <p className="mt-1 flex gap-0.5" aria-label={`hotel ${f.estrellas} estrellas`}>
                {Array.from({ length: f.estrellas }, (_, i) => (
                  <Star key={i} size={13} className="fill-sun text-sun" />
                ))}
              </p>
            )}
          </div>
          {f.precio > 0 && (
            <p className="shrink-0 text-right leading-none">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-sea">desde</span>
              <span className="mt-0.5 block text-[26px] font-bold tracking-[-0.03em] text-olive">{sinCentavos(f.precio)}</span>
            </p>
          )}
        </div>

        {datos.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] lg:flex lg:flex-wrap lg:gap-x-5">
            {datos.map(({ icono: Icono, label, valor }) => (
              <div key={label} className="flex min-w-0 items-center gap-1.5">
                <dt className="shrink-0 text-ink-3" title={label}>
                  <Icono size={13} aria-label={label} />
                </dt>
                <dd className="truncate text-ink">{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {f.descripcion && <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{f.descripcion}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {f.incluye?.length > 0 ? (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">incluye</p>
              <ul className="mt-1.5 flex flex-wrap gap-1">
                {f.incluye.map((id) => {
                  const Icono = ICONOS[id]
                  if (!Icono) return null
                  return (
                    <li key={id} title={nombreIncluye[id]} className="grid size-7 place-items-center bg-sun/15 text-clay">
                      <Icono size={14} aria-label={nombreIncluye[id]} />
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <span />
          )}

          {destino ? (
            <Link to={`/destinos/${destino.id}`} className={claseBoton}>{boton}</Link>
          ) : (
            <a href={whatsapp(mensaje)} target="_blank" rel="noreferrer" className={claseBoton}>{boton}</a>
          )}
        </div>
      </div>
    </article>
  )
}
