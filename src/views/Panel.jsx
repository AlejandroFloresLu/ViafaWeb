import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, CircleAlert, RefreshCw, Star } from 'lucide-react'
import { metricas, negocio } from '../data/negocio'
import { usePublicaciones } from '../lib/publicaciones'
import { nombreCategoria } from '../components/PostCard'
import { PanelShell } from '../components/PanelShell'
import { mapaFicha, numero, saludo } from '../lib/utils'

/* ==========================================================================
   2 · EL PANEL DEL DUEÑO — cómo le está yendo, en un vistazo
   ========================================================================== */
export function Panel() {
  const [dias, setDias] = useState(30)
  const k = dias === 30 ? 1 : 0.24 // los números de 7 días son ~1/4 del mes
  const m = metricas

  const kpis = [
    { label: 'te vieron en google', ...m.googleVistas, nota: 'búsquedas y google maps' },
    { label: 'visitas a tu web', ...m.webVisitas, nota: 'personas que abrieron tu página' },
    { label: 'cotizaciones por whatsapp', ...m.pedidosWhatsapp, nota: 'desde tu web y tu ficha' },
    { label: 'pidieron cómo llegar', ...m.comoLlegar, nota: 'rutas abiertas en google maps' },
  ]

  return (
    <PanelShell>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-medium leading-tight tracking-[-0.02em] sm:text-[36px]">
              {saludo()}, {negocio.dueno}.
            </h1>
            <p className="mt-1 text-[15px] text-ink-2">así le fue a {negocio.nombre} en los últimos {dias} días.</p>
          </div>
          <div className="flex border border-line p-0.5 text-[13px]" role="group" aria-label="Periodo">
            {[7, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDias(d)}
                aria-pressed={dias === d}
                className={`h-9 px-4 ${dias === d ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
              >
                {d} días
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {kpis.map((x) => (
            <div key={x.label} className="border-b border-r border-line p-4 sm:p-5">
              <p className="text-[13px] text-ink-2">{x.label}</p>
              <p className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] tabular-nums sm:text-[36px]">
                {numero(Math.round(x.valor * k))}
              </p>
              <p className={`mt-2 text-[12px] font-medium ${x.cambio >= 0 ? 'text-sage' : 'text-clay'}`}>
                {x.cambio >= 0 ? '↑' : '↓'} {Math.abs(x.cambio)}% vs. periodo anterior
              </p>
              <p className="mt-1 hidden text-[12px] text-ink-3 sm:block">{x.nota}</p>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        <div className="mt-6 border border-line bg-white/50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[16px] font-medium">personas que te encontraron, por día</h2>
            <div className="flex gap-4 text-[12px] text-ink-2">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-ink" /> google</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-clay" /> tu web</span>
            </div>
          </div>
          <Grafico dias={dias} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Cómo te buscan */}
          <div className="border border-line p-5 sm:p-6">
            <h2 className="text-[16px] font-medium">cómo te buscan en google</h2>
            <ul className="mt-5 space-y-4">
              {m.busquedas.map((b) => (
                <li key={b.texto}>
                  <div className="flex justify-between text-[14px]">
                    <span>“{b.texto}”</span>
                    <span className="tabular-nums text-ink-2">{numero(Math.round(b.veces * k))}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-paper-2">
                    <div className="h-full bg-ink" style={{ width: `${(b.veces / m.busquedas[0].veces) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Lo más visto */}
          <div className="border border-line p-5 sm:p-6">
            <h2 className="text-[16px] font-medium">destinos más vistos</h2>
            <ul className="mt-4 divide-y divide-line">
              {[...negocio.carta].sort((a, b) => b.vistas - a.vistas).slice(0, 4).map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="w-4 text-[12px] text-ink-3">{i + 1}</span>
                  <img src={c.foto} alt="" className="size-11 object-cover" loading="lazy" />
                  <span className="flex-1 text-[14px]">{c.nombre}</span>
                  <span className="text-[13px] tabular-nums text-ink-2">{numero(Math.round(c.vistas * k))} vistas</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <FichaGoogle />
          <Resenas />
        </div>

        <Publicaciones />

      </div>
    </PanelShell>
  )
}

/* ---------------------------------------------------------------------- */
function Grafico({ dias }) {
  const { google, web } = useMemo(() => {
    const g = []
    const w = []
    for (let i = 0; i < 30; i++) {
      const finde = i % 7 === 5 || i % 7 === 6 ? 1.35 : 1
      const tendencia = 0.8 + (i / 29) * 0.45
      g.push(Math.round(62 * tendencia * finde * (1 + 0.12 * Math.sin(i * 1.7))))
      w.push(Math.round(36 * tendencia * finde * (1 + 0.15 * Math.cos(i * 1.3))))
    }
    return { google: g.slice(-dias), web: w.slice(-dias) }
  }, [dias])

  const W = 720
  const H = 200
  const max = Math.max(...google) * 1.1
  const x = (i) => (i / (google.length - 1)) * W
  const y = (v) => H - (v / max) * H
  const linea = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = (arr) => `${linea(arr)} L${W},${H} L0,${H} Z`

  return (
    <div className="mt-5">
      <svg viewBox={`0 0 ${W} ${H + 4}`} className="h-[180px] w-full sm:h-[220px]" preserveAspectRatio="none" role="img" aria-label="Personas que te encontraron por día en Google y en tu web">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" x2={W} y1={H * t} y2={H * t} stroke="#d9d2c5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area(google)} fill="#23231a" opacity="0.06" />
        <path d={linea(google)} fill="none" stroke="#23231a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d={linea(web)} fill="none" stroke="#a2623a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ink-3">
        <span>hace {dias} días</span>
        <span>hoy</span>
      </div>
    </div>
  )
}

function FichaGoogle() {
  const items = [
    ['nombre, categoría y dirección', true],
    ['horario actualizado', true],
    ['teléfono y whatsapp', true],
    ['enlace a tu web', true],
    ['destinos y paquetes', true],
    ['12 fotos del local', true],
    ['descripción del negocio', true],
    ['responder reseñas', false],
  ]
  const ok = items.filter((i) => i[1]).length
  return (
    <div className="border border-line p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-medium">tu ficha de google maps</h2>
        <a href={mapaFicha()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] text-ink-2 hover:text-ink">
          ver ficha <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[36px] font-medium leading-none tracking-[-0.03em]">{Math.round((ok / items.length) * 100)}%</span>
        <span className="text-[13px] text-ink-2">completa</span>
      </div>
      <div className="mt-3 h-1.5 bg-paper-2">
        <div className="h-full bg-sage" style={{ width: `${(ok / items.length) * 100}%` }} />
      </div>
      <ul className="mt-5 grid gap-2 text-[13px] sm:grid-cols-2">
        {items.map(([t, done]) => (
          <li key={t} className={`flex items-center gap-2 ${done ? 'text-ink-2' : 'font-medium text-clay'}`}>
            {done ? <Check size={14} className="shrink-0 text-sage" /> : <CircleAlert size={14} className="shrink-0" />} {t}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-start gap-3 bg-paper-2 p-3.5 text-[13px] text-ink-2">
        <RefreshCw size={15} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-medium text-ink">próximamente:</span> cambia tu horario o tus precios aquí y se actualizan solos en tu web y en google maps.
        </p>
      </div>
    </div>
  )
}

function Resenas() {
  const [abierta, setAbierta] = useState(null)
  const [enviadas, setEnviadas] = useState({})
  return (
    <div className="border border-line p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-medium">reseñas nuevas en google</h2>
        <span className="flex items-center gap-1 text-[13px] text-ink-2">
          <Star size={13} className="fill-[#e8a33d] text-[#e8a33d]" /> {negocio.google.rating.toFixed(1)} · {negocio.google.resenas}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {negocio.resenasGoogle.map((r) => (
          <li key={r.autor} className="py-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium">{r.autor}</span>
              <span className="text-ink-3">{r.hace}</span>
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">“{r.texto}”</p>
            {enviadas[r.autor] ? (
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-sage"><Check size={14} /> respuesta publicada</p>
            ) : abierta === r.autor ? (
              <div className="mt-3">
                <textarea
                  rows={2}
                  defaultValue={`¡Gracias ${r.autor.split(' ')[0]}! Te esperamos pronto en ${negocio.nombre}.`}
                  className="w-full resize-none border border-line bg-white p-3 text-[14px] outline-none focus:border-ink"
                />
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { setEnviadas((e) => ({ ...e, [r.autor]: true })); setAbierta(null) }} className="h-9 bg-ink px-4 text-[13px] text-paper">
                    responder
                  </button>
                  <button type="button" onClick={() => setAbierta(null)} className="h-9 px-3 text-[13px] text-ink-2">cancelar</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setAbierta(r.autor)} className="mt-2 text-[13px] font-medium underline underline-offset-4">
                responder
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Publicaciones() {
  const { lista, reiniciar } = usePublicaciones()
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Link to="/panel/publicar" className="group flex flex-col justify-between bg-olive p-6 text-paper sm:p-7">
        <div>
          <p className="eyebrow text-sun">¿algo nuevo hoy?</p>
          <p className="mt-3 text-[24px] font-medium leading-tight tracking-[-0.02em]">publica una promo, un destino o una salida grupal.</p>
          <p className="mt-2 text-[14px] text-paper/70">sube una foto, escribe dos líneas y aparece al instante en tu web.</p>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em]">
          publicar ahora <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
      <div className="border border-line p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-medium">tus publicaciones</h2>
          <button type="button" onClick={reiniciar} className="text-[12px] text-ink-3 underline underline-offset-4 hover:text-ink" title="Deja la demo como al inicio, para la próxima visita">
            reiniciar demo
          </button>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {lista.slice(0, 4).map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <img src={p.foto} alt="" className="size-12 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{p.titulo}</p>
                <p className="text-[12px] text-ink-3">{nombreCategoria(p.categoria)} · {p.fecha}</p>
              </div>
              <span className="text-[12px] text-sage">en tu web</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
