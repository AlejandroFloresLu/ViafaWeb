import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Mail, MapPin, MessageCircle, Navigation, Phone, Quote, Star } from 'lucide-react'
import { negocio } from '../data/negocio'
import { LIMITES, MOSTRAR_DEMO, MOSTRAR_DESTINOS, MOSTRAR_PROMOCIONES } from '../config'
import { usePublicaciones } from '../lib/publicaciones'
import { useContenido } from '../lib/contenido'
import { PostCard } from '../components/PostCard'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { TarjetaFavorito } from '../components/TarjetaFavorito'
import { useBajarASeccion, useIrA } from '../lib/navegacion'
import { abiertoAhora, hoy, mapaComoLlegar, mapaEmbed, mapaFicha, mapaResena, precio, whatsapp } from '../lib/utils'

/* ==========================================================================
   1 · LA WEB DE VIAFA
   ========================================================================== */
export function Web() {
  const n = negocio
  const demo = usePublicaciones()
  const c = useContenido()
  const { destinos, promociones, horario, recargar } = c
  // Nunca se muestran más de los límites, aunque la base tenga más filas.
  const favoritos = c.favoritos.slice(0, LIMITES.favoritos)
  const galeriaViajes = c.galeriaViajes.slice(0, LIMITES.viajes)
  const testimonios = c.testimonios.slice(0, LIMITES.clientes)
  const irA = useIrA()

  useBajarASeccion()

  // Trae lo último de la base de datos cada vez que se abre la web
  useEffect(() => {
    recargar()
  }, [recargar])
  // En modo demo, las promos salen del "publicar" simulado; si no, de la base de datos.
  const lista = MOSTRAR_DEMO ? demo.lista : MOSTRAR_PROMOCIONES ? promociones : []
  const ultima = MOSTRAR_DEMO ? demo.ultima : null
  const { search } = useLocation()
  const abierto = abiertoAhora(horario)
  const h = hoy(horario)

  useEffect(() => {
    document.title = `${n.nombreLargo} · ${n.frase}`
  }, [n.nombreLargo, n.frase])

  useEffect(() => {
    if (search.includes('nuevo')) {
      const t = setTimeout(() => document.getElementById('promociones')?.scrollIntoView({ behavior: 'smooth' }), 250)
      return () => clearTimeout(t)
    }
  }, [search])

  const cotizar = (destino) => whatsapp(destino ? `Hola Viafa 👋 quiero cotizar un viaje a ${destino}.` : 'Hola Viafa 👋 quiero cotizar un viaje.')
  // Si las páginas de destinos están activas y hay uno con el mismo nombre, la tarjeta lleva ahí;
  // si no, abre WhatsApp para cotizar.
  const paginaDe = (f) => (MOSTRAR_DESTINOS ? destinos.find((d) => d.nombre === f.nombre) : null)

  return (
    <div className={`min-h-dvh bg-paper text-ink ${MOSTRAR_DEMO ? 'pb-24' : ''}`}>
      {/* Cinta superior */}
      <div className="bg-olive px-4 py-2 text-center text-[12px] text-paper/85">
        {abierto ? 'atendiendo ahora' : 'cerrado ahora'} · {h.cerrado ? 'hoy no atendemos' : `hoy de ${h.abre} a ${h.cierra}`} · quicentro sur ·{' '}
        <a href={cotizar()} target="_blank" rel="noreferrer" className="underline underline-offset-2">cotiza por whatsapp</a>
      </div>

      <SiteNav />

      {/* Portada a sangre */}
      <header className="relative h-[78svh] min-h-[520px] w-full overflow-hidden bg-olive">
        <img src={n.fotos.portada} alt="Playa con palmeras" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/55" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
          <p className="eyebrow text-paper/85">{n.tipo} · {n.sector}</p>
          <h1 className="mt-3 max-w-[15ch] text-[44px] font-medium leading-[1.02] tracking-[-0.02em] text-paper sm:text-[68px]">{n.frase}</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            {MOSTRAR_DESTINOS ? (
              <Link to="/destinos" className="inline-flex h-11 items-center bg-sun px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink hover:brightness-105">
                ver destinos
              </Link>
            ) : (
              <button type="button" onClick={() => irA('favoritos')} className="inline-flex h-11 items-center bg-sun px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink hover:brightness-105">
                ver favoritos
              </button>
            )}
            <a href={cotizar()} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 border border-paper/70 px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-paper/10">
              <MessageCircle size={14} /> cotizar gratis
            </a>
          </div>
        </div>
      </header>

      {/* Porqué confiar en nosotros */}
      <section className="bg-olive text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="eyebrow text-sun sm:text-center">¿porqué confiar en nosotros?</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {n.valores.map((v) => (
              <div key={v.titulo} className="sm:text-center">
                <h2 className="text-[15px] font-semibold">{v.titulo}</h2>
                <p className="mt-2 max-w-[30ch] text-[14px] leading-relaxed text-paper/70 sm:mx-auto">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lugares favoritos: tarjetas detalladas (las edita el gerente en /admin) */}
      {favoritos.length > 0 && (
        <section id="favoritos" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-20 sm:px-8 sm:pt-28">
          <p className="eyebrow text-ink-3">los más vendidos</p>
          <h2 className="mt-2 text-[32px] font-medium tracking-[-0.02em] sm:text-[40px]">lugares favoritos.</h2>
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((f, i) => (
              <TarjetaFavorito key={f.id} f={f} posicion={i < 3 ? i + 1 : null} destino={paginaDe(f)} />
            ))}
          </div>
          {MOSTRAR_DESTINOS && (
            <Link to="/destinos" className="mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-ink">
              ver todos los destinos <ArrowRight size={14} />
            </Link>
          )}
        </section>
      )}

      {/* Promociones (se ocultan si no hay ninguna) */}
      {lista.length > 0 && (
        <section id="promociones" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-24 sm:px-8 sm:pt-32">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-3">promociones</p>
              <h2 className="mt-2 text-[32px] font-medium tracking-[-0.02em] sm:text-[40px]">lo nuevo este mes.</h2>
            </div>
            <a href={cotizar()} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink sm:inline-flex">
              pregunta por más promos <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {lista.slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} destacada={p.id === ultima} />
            ))}
          </div>
        </section>
      )}


      {/* Banda foto */}
      <section className="relative mt-28 min-h-[420px] overflow-hidden bg-olive sm:mt-36">
        <img src={n.fotos.banda} alt="Ventana de avión sobre las nubes" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col items-start justify-center px-5 text-paper sm:px-8">
          <p className="eyebrow text-sun">¿no sabes a dónde ir?</p>
          <p className="mt-3 max-w-[18ch] text-[34px] font-medium leading-tight tracking-[-0.02em] sm:text-[48px]">cuéntanos tu presupuesto y te armamos el viaje.</p>
          <a href={cotizar()} target="_blank" rel="noreferrer" className="mt-7 inline-flex h-11 items-center gap-2 bg-sun px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
            <MessageCircle size={15} /> hablar con una asesora
          </a>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="grid sm:grid-cols-2">
        <div className="relative min-h-[380px] bg-paper-3 sm:min-h-[560px]">
          <img src={n.fotos.nosotros} alt="Viajeras en la playa" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex items-center bg-paper-2 px-6 py-16 sm:px-14">
          <div className="max-w-md">
            <p className="eyebrow text-ink-3">quiénes somos</p>
            <h2 className="mt-3 text-[30px] font-medium leading-tight tracking-[-0.02em] sm:text-[36px]">expertos en hacer el viaje de tus sueños.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{n.descripcion}</p>
            <p className="mt-6 flex items-start gap-2 text-[14px] text-ink-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {n.direccion}, quito</p>
          </div>
        </div>
      </section>

      {/* Lugares que visitó Viafa — collage (lo edita el gerente en /admin) */}
      {galeriaViajes.length > 0 && (
        <section id="viajes" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-24 sm:px-8 sm:pt-32">
          <p className="eyebrow text-ink-3">nuestros viajes</p>
          <h2 className="mt-2 text-[32px] font-medium tracking-[-0.02em] sm:text-[40px]">lugares que visitó viafa.</h2>
          <div className="mt-10 columns-2 gap-3 md:columns-3 lg:columns-4">
            {galeriaViajes.map((g, i) => (
              <figure key={g.id} className={`group relative mb-3 break-inside-avoid overflow-hidden bg-paper-3 ${COLLAGE[i % COLLAGE.length]}`}>
                <img onError={sinFoto} src={g.foto} alt={g.lugar || 'Viaje de Viafa'} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
                {g.lugar && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10 text-[13px] font-medium text-paper">
                    {g.lugar}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Esto dicen nuestros clientes — collage de fotos con su opinión (lo edita el gerente en /admin) */}
      {testimonios.length > 0 && (
        <section id="clientes" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-24 sm:px-8 sm:pt-32">
          <p className="eyebrow text-ink-3">nuestros clientes</p>
          <h2 className="mt-2 text-[32px] font-medium tracking-[-0.02em] sm:text-[40px]">esto dicen nuestros clientes.</h2>
          <div className="mt-10 gap-5 sm:columns-2 lg:columns-3">
            {testimonios.map((t, i) => (
              <figure key={t.id} className="mb-5 break-inside-avoid bg-white/70 ring-1 ring-line">
                {t.foto && (
                  <div className={`overflow-hidden bg-paper-3 ${i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                    <img onError={sinFoto} src={t.foto} alt={`${t.autor} de viaje`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <Quote size={20} className="text-sun" />
                  <blockquote className="mt-3 text-[16px] leading-relaxed">“{t.texto}”</blockquote>
                  <figcaption className="mt-4 text-[13px] text-ink-2">
                    <span className="font-semibold text-ink">{t.autor}</span>
                    {t.viaje && <> · viajó a {t.viaje}</>}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      <Visitanos horario={horario} />
      <SiteFooter />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Si una foto no carga (enlace roto, sin internet), se oculta y queda el fondo
   de color en su lugar en vez del ícono de imagen rota. */
const sinFoto = (e) => {
  e.currentTarget.style.visibility = 'hidden'
}

/* Proporciones del collage de "lugares que visitó viafa" (se repiten en este orden).
   Es un collage tipo "masonry": funciona con cualquier cantidad de fotos. */
const COLLAGE = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-[4/5]', 'aspect-square']

function Estrellas({ valor, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(valor) ? 'fill-[#e8a33d] text-[#e8a33d]' : 'text-line'} />
      ))}
    </span>
  )
}

function GoogleG({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

function Visitanos({ horario }) {
  const n = negocio
  const h = hoy(horario)
  return (
    <section id="visitanos" className="mx-auto max-w-6xl scroll-mt-6 px-5 pt-24 sm:px-8 sm:pt-32">
      <p className="eyebrow text-ink-3">visítanos</p>
      <h2 className="mt-2 text-[32px] font-medium tracking-[-0.02em] sm:text-[40px]">estamos en quicentro sur.</h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <div className="flex flex-col gap-8">
          {/* Estamos en Google */}
          <div className="border border-line bg-white/60 p-6">
            <div className="flex items-center gap-3">
              <GoogleG />
              <span className="text-[13px] font-medium text-ink-2">estamos en google</span>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-[44px] font-medium leading-none tracking-[-0.03em]">{n.google.rating.toFixed(1)}</span>
              <div className="pb-1">
                <Estrellas valor={n.google.rating} />
                <p className="mt-1 text-[12px] text-ink-3">{n.google.resenas} reseñas</p>
              </div>
            </div>
            <div className="mt-6 space-y-5 border-t border-line pt-5">
              {n.resenasGoogle.map((r) => (
                <figure key={r.autor}>
                  <Estrellas valor={r.estrellas} size={12} />
                  <blockquote className="mt-1.5 text-[14px] leading-relaxed text-ink-2">“{r.texto}”</blockquote>
                  <figcaption className="mt-1 text-[12px] text-ink-3">{r.autor} · {r.hace}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={mapaResena()} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center bg-ink px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-olive-2">
                dejar una reseña
              </a>
              <a href={mapaFicha()} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 border border-ink/25 px-4 text-[12px] font-semibold uppercase tracking-[0.12em] hover:border-ink">
                ver todas <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Horario y contacto */}
          <div>
            <ul className="divide-y divide-line border-y border-line text-[14px]">
              {horario.map((d, i) => (
                <li key={d.dia} className={`flex justify-between py-2.5 ${i === h.indice ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                  <span>{d.dia}{i === h.indice ? ' · hoy' : ''}</span>
                  <span className="tabular-nums">{d.cerrado ? 'cerrado' : `${d.abre} — ${d.cierra}`}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-[14px] text-ink-2">
              <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {n.direccion}, quito</p>
              <p className="flex items-start gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> {n.telefonos.join(' · ')} · {n.celular}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="shrink-0" /> <a href={`mailto:${n.email}`} className="hover:text-ink">{n.email}</a></p>
            </div>
          </div>
        </div>

        {/* Mapa real de Google */}
        <div className="flex flex-col">
          <div className="relative min-h-[380px] flex-1 overflow-hidden bg-paper-3">
            <iframe
              title={`Mapa de ${n.nombreLargo}`}
              src={mapaEmbed()}
              className="absolute inset-0 h-full w-full grayscale-[15%]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a href={mapaFicha()} target="_blank" rel="noreferrer" className="absolute left-4 top-4 flex items-center gap-3 bg-paper px-4 py-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]">
              <GoogleG className="size-4" />
              <span>
                <span className="block text-[14px] font-semibold leading-tight">{n.nombreLargo}</span>
                <span className="block text-[12px] text-ink-3">quicentro sur · local 51 · abrir en google maps</span>
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <a href={mapaComoLlegar()} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-ink text-[12px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-olive-2">
              <Navigation size={15} /> cómo llegar
            </a>
            <a href={whatsapp('Hola Viafa 👋')} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 border border-ink/25 text-[12px] font-semibold uppercase tracking-[0.12em] hover:border-ink">
              <MessageCircle size={15} /> whatsapp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
