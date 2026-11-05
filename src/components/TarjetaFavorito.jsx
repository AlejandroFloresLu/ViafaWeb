import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, Bus, Camera, Clock, MapPin, Plane, ShieldCheck, Sparkles, Star, Tag, Utensils } from 'lucide-react'
import { INCLUYE } from '../data/favoritos'
import { precio, whatsapp } from '../lib/utils'

const ICONOS = { vuelo: Plane, hotel: BedDouble, comidas: Utensils, todo: Sparkles, traslados: Bus, tours: Camera, asistencia: ShieldCheck }
const nombreIncluye = Object.fromEntries(INCLUYE.map((x) => [x.id, x.label]))

const sinFoto = (e) => {
  e.currentTarget.style.visibility = 'hidden'
}

/* Tarjeta detallada de un "lugar favorito": foto, salidas, estrellas, precio,
   tipo, duración, salida, aerolínea, descripción, qué incluye y "ver oferta". */
export function TarjetaFavorito({ f, posicion, destino }) {
  const mensaje =
    `Hola Viafa 👋 me interesa la oferta "${f.nombre}"` +
    (f.precio > 0 ? ` desde ${precio(f.precio).replace(/,00$/, '')}` : '') +
    (f.salidas ? ` (${f.salidas})` : '') +
    '. ¿Me pueden dar más información?'

  const datos = [
    f.tipo && { icono: Tag, label: 'tipo', valor: f.tipo },
    f.noches > 0 && { icono: Clock, label: 'duración', valor: `${f.noches} ${f.noches === 1 ? 'noche' : 'noches'}` },
    f.salida && { icono: MapPin, label: 'salida', valor: f.salida },
    f.aerolinea && { icono: Plane, label: 'aerolínea', valor: f.aerolinea },
  ].filter(Boolean)

  const boton = (
    <>
      ver oferta <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
    </>
  )
  const claseBoton =
    'group/btn mt-6 flex h-14 w-full items-center justify-center gap-2 bg-sun text-[15px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_10px_24px_-10px_rgba(247,148,29,0.9)] transition hover:-translate-y-0.5 hover:brightness-105'

  return (
    <article className="flex flex-col bg-white ring-1 ring-line">
      <div className="group relative aspect-[16/10] overflow-hidden bg-paper-3">
        <img onError={sinFoto} src={f.foto} alt={f.nombre} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
        {posicion != null && (
          <span className="absolute left-3 top-3 bg-sun px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">#{posicion} más vendido</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-[19px] font-semibold uppercase leading-snug tracking-[0.01em] text-ink">{f.nombre}</h3>

        <div className="mt-3 flex items-end justify-between gap-3 border-b border-line pb-4">
          <div className="min-w-0">
            {f.salidas && <p className="text-[13px] leading-snug text-ink-2">{f.salidas}</p>}
            {f.estrellas > 0 && (
              <p className="mt-1.5 flex gap-0.5" aria-label={`hotel ${f.estrellas} estrellas`}>
                {Array.from({ length: f.estrellas }, (_, i) => (
                  <Star key={i} size={15} className="fill-sun text-sun" />
                ))}
              </p>
            )}
          </div>
          {f.precio > 0 && (
            <p className="shrink-0 text-right leading-none">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-sea">desde</span>
              <span className="mt-1 block text-[34px] font-bold tracking-[-0.03em] text-olive">{precio(f.precio).replace(/,00$/, '')}</span>
            </p>
          )}
        </div>

        {datos.length > 0 && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {datos.map(({ icono: Icono, label, valor }) => (
              <div key={label} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  <Icono size={12} /> {label}
                </dt>
                <dd className="mt-0.5 text-[14px] font-medium text-ink">{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {f.descripcion && <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{f.descripcion}</p>}

        <div className="mt-auto">
          {f.incluye?.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">paquete incluye</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {f.incluye.map((id) => {
                  const Icono = ICONOS[id]
                  if (!Icono) return null
                  return (
                    <li key={id} title={nombreIncluye[id]} className="flex items-center gap-1.5 bg-sun/15 py-1 pl-1 pr-2 text-[12px] text-ink">
                      <span className="grid size-7 place-items-center bg-sun text-paper">
                        <Icono size={15} />
                      </span>
                      {nombreIncluye[id]}
                    </li>
                  )
                })}
              </ul>
            </div>
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
