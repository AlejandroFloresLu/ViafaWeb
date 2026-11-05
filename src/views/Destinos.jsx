import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { negocio } from '../data/negocio'
import { useContenido } from '../lib/contenido'
import { porRegion } from '../lib/navegacion'
import { precio, whatsapp } from '../lib/utils'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

/* ==========================================================================
   /destinos — todos los destinos, agrupados por región
   ========================================================================== */
export function Destinos() {
  const { destinos, recargar } = useContenido()
  const [region, setRegion] = useState('todas')
  const grupos = porRegion(destinos)
  const visibles = region === 'todas' ? grupos : grupos.filter((g) => g.region === region)

  useEffect(() => {
    document.title = `destinos · ${negocio.nombreLargo}`
    recargar()
  }, [recargar])

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteNav />

      <header className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow text-ink-3">destinos</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-[38px] font-medium leading-tight tracking-[-0.02em] sm:text-[52px]">¿a dónde quieres ir?</h1>
          <div className="flex flex-wrap gap-2">
            {['todas', ...grupos.map((g) => g.region)].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={`h-10 border px-4 text-[14px] ${region === r ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {visibles.map((g) => (
        <section key={g.region} className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
          <h2 className="flex items-baseline gap-3 border-b border-line pb-3 text-[22px] font-medium tracking-[-0.01em]">
            {g.region}
            <span className="text-[13px] font-normal text-ink-3">{g.destinos.length} {g.destinos.length === 1 ? 'destino' : 'destinos'}</span>
          </h2>
          <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {g.destinos.map((d) => (
              <Link key={d.id} to={`/destinos/${d.id}`} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                  <img src={d.foto} alt={d.nombre} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                  {d.masVendido && <span className="absolute left-3 top-3 bg-sun px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">más vendido</span>}
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 pt-4">
                  <div>
                    <h3 className="text-[19px] font-medium leading-snug">{d.nombre}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{d.detalle}</p>
                  </div>
                  <p className="shrink-0 text-right text-[12px] text-ink-3">
                    desde<span className="block text-[17px] font-medium tabular-nums text-ink">{precio(d.precio)}</span>
                  </p>
                </div>
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 border-b border-ink/30 pb-0.5 text-[12px] font-semibold uppercase tracking-[0.12em] group-hover:border-ink">
                  ver destino <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 bg-olive p-8 text-paper sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="eyebrow text-sun">¿no encuentras tu destino?</p>
            <p className="mt-2 max-w-xl text-[26px] font-medium leading-tight tracking-[-0.02em]">te armamos el viaje a donde quieras, a tu medida y presupuesto.</p>
          </div>
          <a href={whatsapp('Hola Viafa 👋 quiero cotizar un viaje a medida.')} target="_blank" rel="noreferrer" className="inline-flex h-12 shrink-0 items-center gap-2 bg-sun px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
            <MessageCircle size={15} /> cotizar a medida
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
