import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Clock, FileText, Link2, MessageCircle, Share2 } from 'lucide-react'
import { negocio } from '../data/negocio'
import { useContenido } from '../lib/contenido'
import { precio, whatsapp } from '../lib/utils'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

/* ==========================================================================
   /destinos/:id          → página del destino: banner, precio, PDF y sus lugares
   /destinos/:id/:sitio   → página de un lugar del destino, con fotos e información
   ========================================================================== */

function useDestino() {
  const { id, sitio } = useParams()
  const { destinos, fuente, recargar } = useContenido()
  useEffect(() => {
    recargar()
  }, [recargar])
  const d = destinos.find((x) => x.id === id)
  const s = d?.sitios?.find((x) => x.id === sitio)
  return { d, s, destinos, cargando: fuente === 'cargando', sitio }
}

export function Destino() {
  const { d, destinos, cargando } = useDestino()
  useEffect(() => {
    if (d) document.title = `${d.nombre} · ${negocio.nombreLargo}`
  }, [d])
  return (
    <Marco>
      {d ? <FichaDestino d={d} destinos={destinos} /> : cargando ? <Cargando /> : <NoExiste />}
    </Marco>
  )
}

export function Sitio() {
  const { d, s, cargando } = useDestino()
  useEffect(() => {
    if (d && s) document.title = `${s.nombre} · ${d.nombre} · ${negocio.nombreLargo}`
  }, [d, s])
  return (
    <Marco>
      {d && s ? <FichaSitio d={d} s={s} /> : cargando ? <Cargando /> : <NoExiste />}
    </Marco>
  )
}

function Marco({ children }) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
function Migas({ items }) {
  return (
    <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
      {items.map(([texto, to], i) => (
        <span key={texto} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} />}
          {to ? <Link to={to} className="hover:text-ink">{texto}</Link> : <span className="text-ink">{texto}</span>}
        </span>
      ))}
    </nav>
  )
}

/* Banner ancho como el de su web actual, con fotos que se pueden cambiar */
function Banner({ fotos, alt, etiqueta }) {
  const [i, setI] = useState(0)
  useEffect(() => setI(0), [fotos[0]])
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-3 sm:aspect-[21/9]">
        {fotos[i] && <img key={fotos[i]} src={fotos[i]} alt={`${alt}, foto ${i + 1}`} className="rise h-full w-full object-cover" />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        {etiqueta && <span className="absolute left-4 top-4 bg-sun px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">{etiqueta}</span>}
        {fotos.length > 1 && <span className="absolute bottom-4 right-4 bg-black/45 px-2.5 py-1 text-[12px] text-paper backdrop-blur">{i + 1} / {fotos.length}</span>}
      </div>
      {fotos.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {fotos.map((f, k) => (
            <button
              key={f + k}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Ver foto ${k + 1}`}
              aria-pressed={i === k}
              className={`aspect-[4/3] w-28 shrink-0 overflow-hidden sm:w-36 ${i === k ? 'ring-2 ring-sun ring-offset-2 ring-offset-paper' : 'opacity-70 hover:opacity-100'}`}
            >
              <img src={f.replace(/w=\d+/, 'w=400')} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Compartir({ texto }) {
  const [copiado, setCopiado] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin portapapeles */
    }
  }
  const btn = 'inline-flex h-10 items-center gap-2 border border-line px-3.5 text-[13px] text-ink-2 hover:border-ink hover:text-ink'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[13px] text-ink-3"><Share2 size={14} /> compartir</span>
      <a className={btn} href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`} target="_blank" rel="noreferrer">whatsapp</a>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">facebook</a>
      <button type="button" onClick={copiar} className={btn}><Link2 size={14} /> {copiado ? '¡copiado!' : 'copiar enlace'}</button>
    </div>
  )
}

function CajaPrecio({ d, mensaje }) {
  return (
    <div className="bg-paper-2 p-5 sm:p-6">
      <p className="text-[13px] text-ink-2">paquete {d.nombre} · desde, por persona</p>
      <p className="mt-1 text-[40px] font-medium leading-none tracking-[-0.03em] tabular-nums">{precio(d.precio)}</p>
      <p className="mt-2 text-[12px] text-ink-3">{d.detalle}</p>
      <div className="mt-5 flex flex-col gap-3">
        <a href={whatsapp(mensaje)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-sun text-[12px] font-semibold uppercase tracking-[0.14em] text-ink hover:brightness-105">
          <MessageCircle size={16} /> cotizar por whatsapp
        </a>
        {d.pdf && (
          <a href={d.pdf} target="_blank" rel="noreferrer" download className="inline-flex h-12 items-center justify-center gap-2 border border-ink/25 bg-paper text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-ink">
            <FileText size={16} /> descargar ficha (pdf)
          </a>
        )}
      </div>
      <p className="mt-3 text-[11px] text-ink-3">precio en acomodación doble, sujeto a disponibilidad.</p>
    </div>
  )
}

function TarjetaSitio({ d, s }) {
  return (
    <Link to={`/destinos/${d.id}/${s.id}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-3">
        <img src={s.fotos[0]?.replace(/w=\d+/, 'w=900')} alt={s.nombre} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">{s.tipo}</span>
        {s.incluido && <span className="absolute right-3 top-3 bg-sun px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">incluido</span>}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-paper">
          <p className="text-[22px] font-medium leading-tight tracking-[-0.01em]">{s.nombre}</p>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-paper/85">{s.resumen}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em]">
            conocer <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  )
}

/* ---------------------------------------------------------------------- */
function FichaDestino({ d, destinos }) {
  const fotos = [d.foto, ...(d.galeria || []).filter((f) => f && f !== d.foto)].filter(Boolean)
  const otros = [...destinos.filter((x) => x.id !== d.id && x.region === d.region), ...destinos.filter((x) => x.id !== d.id && x.region !== d.region)].slice(0, 3)

  return (
    <main className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
      <Migas items={[['inicio', '/web'], ['destinos', '/destinos'], [d.nombre]]} />

      <p className="eyebrow mt-8 text-clay">{d.region}</p>
      <h1 className="mt-2 text-[44px] font-medium leading-[1.02] tracking-[-0.025em] sm:text-[64px]">{d.nombre}</h1>

      <div className="mt-6">
        <Banner fotos={fotos} alt={d.nombre} etiqueta={d.masVendido ? 'más vendido' : null} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* Lugares */}
          {d.sitios?.length > 0 && (
            <section>
              <h2 className="text-[28px] font-medium tracking-[-0.02em]">lugares en {d.nombre}.</h2>
              <p className="mt-1 text-[14px] text-ink-2">
                toca cada lugar para ver fotos e información. los marcados <span className="bg-sun px-1.5 text-[12px] font-semibold text-ink">incluido</span> vienen en el paquete.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {d.sitios.map((s) => <TarjetaSitio key={s.id} d={d} s={s} />)}
              </div>
            </section>
          )}

          {/* Qué incluye */}
          {d.incluye?.length > 0 && (
            <section className="mt-14 border-t border-line pt-8">
              <h2 className="text-[26px] font-medium tracking-[-0.02em]">el paquete incluye.</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {d.incluye.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-2">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center bg-olive text-paper"><Check size={12} /></span>
                    {it}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10">
            <Compartir texto={`Mira este viaje a ${d.nombre} con Viafa:`} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CajaPrecio d={d} mensaje={`Hola Viafa 👋 quiero cotizar el paquete a ${d.nombre}.`} />
        </aside>
      </div>

      {/* Otros destinos */}
      {otros.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[26px] font-medium tracking-[-0.02em]">también te puede gustar.</h2>
            <Link to="/destinos" className="hidden items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink sm:inline-flex">todos los destinos <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {otros.map((o) => (
              <Link key={o.id} to={`/destinos/${o.id}`} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-paper-2">
                  <img src={o.foto} alt={o.nombre} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-medium">{o.nombre}</span>
                  <span className="text-[13px] text-ink-2">desde {precio(o.precio)}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

/* ---------------------------------------------------------------------- */
function FichaSitio({ d, s }) {
  const otros = d.sitios.filter((x) => x.id !== s.id)
  return (
    <main className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
      <Migas items={[['inicio', '/web'], ['destinos', '/destinos'], [d.nombre, `/destinos/${d.id}`], [s.nombre]]} />

      <p className="eyebrow mt-8 text-clay">{d.nombre} · {s.tipo}</p>
      <h1 className="mt-2 text-[44px] font-medium leading-[1.02] tracking-[-0.025em] sm:text-[64px]">{s.nombre}</h1>

      <div className="mt-6">
        <Banner fotos={s.fotos} alt={s.nombre} etiqueta={s.incluido ? 'incluido en el paquete' : null} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-[20px] leading-relaxed text-ink">{s.resumen}</p>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{s.descripcion}</p>

          <dl className="mt-8 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
            <div className="border-b border-r border-line p-4">
              <dt className="text-[12px] text-ink-3">duración</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-[15px] font-medium"><Clock size={14} /> {s.duracion}</dd>
            </div>
            <div className="border-b border-r border-line p-4">
              <dt className="text-[12px] text-ink-3">tipo</dt>
              <dd className="mt-1 text-[15px] font-medium">{s.tipo}</dd>
            </div>
            <div className="col-span-2 border-b border-r border-line p-4 sm:col-span-1">
              <dt className="text-[12px] text-ink-3">en el paquete</dt>
              <dd className="mt-1 text-[15px] font-medium">{s.incluido ? 'sí, viene incluido' : 'excursión opcional'}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <Compartir texto={`Mira ${s.nombre} en ${d.nombre} con Viafa:`} />
          </div>

          <Link to={`/destinos/${d.id}`} className="mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-ink">
            ver todo el paquete a {d.nombre} <ArrowRight size={14} />
          </Link>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CajaPrecio d={d} mensaje={`Hola Viafa 👋 quiero cotizar ${d.nombre} y me interesa ${s.nombre}.`} />
        </aside>
      </div>

      {otros.length > 0 && (
        <section className="mt-20">
          <h2 className="text-[26px] font-medium tracking-[-0.02em]">más lugares en {d.nombre}.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otros.map((o) => <TarjetaSitio key={o.id} d={d} s={o} />)}
          </div>
        </section>
      )}
    </main>
  )
}

function Cargando() {
  return <p className="mx-auto max-w-6xl px-5 py-24 text-[15px] text-ink-3 sm:px-8">cargando…</p>
}

function NoExiste() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <h1 className="text-[32px] font-medium tracking-[-0.02em]">no encontramos esa página.</h1>
      <p className="mt-2 text-[15px] text-ink-2">puede que ya no esté disponible. mira todos nuestros destinos o escríbenos.</p>
      <Link to="/destinos" className="mt-6 inline-flex h-11 items-center gap-2 bg-ink px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper">
        ver destinos <ArrowRight size={14} />
      </Link>
    </div>
  )
}
