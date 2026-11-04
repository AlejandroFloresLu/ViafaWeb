import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ImagePlus, Lock } from 'lucide-react'
import { categorias, fotosEjemplo, negocio } from '../data/negocio'
import { usePublicaciones } from '../lib/publicaciones'
import { PostCard } from '../components/PostCard'
import { PanelShell } from '../components/PanelShell'
import { leerImagen } from '../lib/utils'

/* ==========================================================================
   3 · PUBLICAR — foto, categoría, texto → y así se ve en la web
   ========================================================================== */
const VIGENCIAS = ['solo hoy', 'esta semana', 'este mes']

export function Publicar() {
  const navigate = useNavigate()
  const { publicar } = usePublicaciones()
  const fileRef = useRef(null)

  const [foto, setFoto] = useState(fotosEjemplo[0])
  const [categoria, setCategoria] = useState('promo')
  const [titulo, setTitulo] = useState('cartagena con 20% de descuento.')
  const [texto, setTexto] = useState('solo este fin de semana: 4 noches en la ciudad amurallada con vuelo desde quito incluido.')
  const [vigencia, setVigencia] = useState('esta semana')
  const [enviando, setEnviando] = useState(false)
  const [listo, setListo] = useState(false)
  const [error, setError] = useState('')

  const subir = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('ese archivo no es una imagen.')
      return
    }
    setError('')
    try {
      setFoto(await leerImagen(file))
    } catch {
      setError('no pudimos leer esa imagen, prueba con otra.')
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!titulo.trim()) return
    setEnviando(true)
    await new Promise((r) => setTimeout(r, 900))
    publicar({ foto, categoria, titulo: titulo.trim(), texto: texto.trim(), vigencia })
    setEnviando(false)
    setListo(true)
  }

  const borrador = { foto, categoria, titulo, texto, vigencia, fecha: 'recién publicado' }

  return (
    <PanelShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-[30px] font-medium leading-tight tracking-[-0.02em] sm:text-[36px]">publicar una novedad.</h1>
        <p className="mt-1 text-[15px] text-ink-2">
          lo que escribas aquí aparece en tu web al instante.{' '}
          <a href="#vista-previa" className="font-medium text-ink underline underline-offset-4 lg:hidden">ver cómo queda ↓</a>
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ---------------- Formulario ---------------- */}
          <form onSubmit={enviar} className="space-y-9">
            <Paso n="1" titulo="la foto">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  subir(e.dataTransfer.files?.[0])
                }}
                className="grid gap-3 sm:grid-cols-[1.4fr_1fr]"
              >
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-dashed border-ink/30 bg-paper-2 text-ink-2 hover:border-ink"
                >
                  {foto ? (
                    <>
                      <img src={foto} alt="Foto elegida" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-paper/95 px-3 py-1.5 text-[12px] font-medium text-ink">
                        <ImagePlus size={14} /> cambiar foto
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-2 text-[14px]">
                      <ImagePlus size={22} /> sube una foto
                    </span>
                  )}
                </button>
                <div>
                  <p className="text-[12px] text-ink-3">o usa una de ejemplo</p>
                  <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-2">
                    {fotosEjemplo.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFoto(f)}
                        aria-label="Usar esta foto"
                        aria-pressed={foto === f}
                        className={`relative aspect-square overflow-hidden ${foto === f ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-80 hover:opacity-100'}`}
                      >
                        <img src={f.replace('w=1200', 'w=300')} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 text-[13px] font-medium underline underline-offset-4">
                    subir desde el celular
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => subir(e.target.files?.[0])} />
              </div>
              {error && <p className="mt-2 text-[13px] text-clay">{error}</p>}
            </Paso>

            <Paso n="2" titulo="¿de qué se trata?">
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoria(c.id)}
                    aria-pressed={categoria === c.id}
                    className={`h-10 border px-4 text-[14px] ${categoria === c.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </Paso>

            <Paso n="3" titulo="el texto">
              <label className="block">
                <span className="flex justify-between text-[13px] text-ink-2">
                  título <span className="tabular-nums text-ink-3">{titulo.length}/60</span>
                </span>
                <input
                  value={titulo}
                  maxLength={60}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="ej.: cartagena con 20% de descuento."
                  className="mt-1.5 h-12 w-full border border-line bg-white px-3.5 text-[16px] outline-none focus:border-ink"
                  required
                />
              </label>
              <label className="mt-4 block">
                <span className="flex justify-between text-[13px] text-ink-2">
                  descripción <span className="tabular-nums text-ink-3">{texto.length}/200</span>
                </span>
                <textarea
                  value={texto}
                  maxLength={200}
                  rows={3}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="cuenta en dos líneas qué es, cuándo y para quién."
                  className="mt-1.5 w-full resize-none border border-line bg-white p-3.5 text-[16px] leading-relaxed outline-none focus:border-ink"
                />
              </label>
            </Paso>

            <Paso n="4" titulo="¿hasta cuándo y dónde?">
              <div className="flex flex-wrap gap-2">
                {VIGENCIAS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVigencia(v)}
                    aria-pressed={vigencia === v}
                    className={`h-10 border px-4 text-[14px] ${vigencia === v ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <ul className="mt-5 divide-y divide-line border-y border-line text-[14px]">
                <li className="flex items-center gap-3 py-3">
                  <span className="flex size-5 items-center justify-center bg-ink text-paper"><Check size={13} /></span>
                  tu web
                  <span className="ml-auto text-[12px] text-ink-3">al instante</span>
                </li>
                <li className="flex items-center gap-3 py-3">
                  <span className="flex size-5 items-center justify-center bg-ink text-paper"><Check size={13} /></span>
                  facebook e instagram
                  <span className="ml-auto text-[12px] text-ink-3">al instante</span>
                </li>
                <li className="flex items-center gap-3 py-3 text-ink-3">
                  <span className="flex size-5 items-center justify-center border border-line"><Lock size={11} /></span>
                  google maps
                  <span className="ml-auto text-[12px]">próximamente</span>
                </li>
              </ul>
            </Paso>

            <button
              type="submit"
              disabled={enviando || !titulo.trim()}
              className="inline-flex h-13 w-full items-center justify-center gap-2 bg-ink py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive-2 disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {enviando ? 'publicando…' : <>publicar <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* ---------------- Vista previa ---------------- */}
          <div id="vista-previa" className="scroll-mt-28 lg:sticky lg:top-10 lg:self-start">
            <p className="eyebrow text-ink-3">así se verá en tu web</p>
            <div className="mt-3 overflow-hidden rounded-[28px] border-[6px] border-ink bg-paper shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
              <div className="bg-olive py-1.5 text-center text-[10px] text-paper/80">atendiendo ahora · cotiza por whatsapp</div>
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-[15px] font-semibold tracking-[-0.03em]">{negocio.nombre}</span>
                <span className="text-[11px] text-ink-3">menú</span>
              </div>
              <div className="px-4 pb-6 pt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-3">promociones</p>
                <p className="mt-1 text-[20px] font-medium tracking-[-0.02em]">lo nuevo este mes.</p>
                <div className="mt-4">
                  <PostCard post={borrador} compacta destacada={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Publicado ---------------- */}
      {listo && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="listo-titulo">
          <div className="rise w-full max-w-md bg-paper p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center bg-sage text-paper"><Check size={22} /></span>
            <h2 id="listo-titulo" className="mt-5 text-[26px] font-medium leading-tight tracking-[-0.02em]">¡listo! ya está en tu web.</h2>
            <p className="mt-2 text-[15px] text-ink-2">tus clientes ya pueden ver “{titulo.trim()}” en la sección de promociones.</p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => navigate('/web?nuevo=1')} className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-ink text-[13px] font-semibold uppercase tracking-[0.12em] text-paper">
                ver en mi web <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => setListo(false)} className="h-12 flex-1 border border-line text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-2">
                publicar otra
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  )
}

function Paso({ n, titulo, children }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-baseline gap-3">
        <span className="text-[12px] tabular-nums text-ink-3">{n}</span>
        <span className="text-[17px] font-medium">{titulo}</span>
      </legend>
      {children}
    </fieldset>
  )
}
