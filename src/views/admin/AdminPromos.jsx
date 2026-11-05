import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Eye, EyeOff, Trash2 } from 'lucide-react'
import { categorias } from '../../data/negocio'
import { supabase } from '../../lib/supabase'
import { aPromo } from '../../lib/contenido'
import { PostCard, nombreCategoria } from '../../components/PostCard'
import { Aviso, SelectorFoto, Titulo, campo } from './comun'

const VIGENCIAS = ['solo hoy', 'esta semana', 'este mes']
const VACIA = { foto: '', categoria: 'promo', titulo: '', texto: '', vigencia: 'esta semana' }

/* Publicar promociones con foto + lista para ocultar o borrar. */
export function AdminPromos() {
  const [form, setForm] = useState(VACIA)
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [borrar, setBorrar] = useState(null)
  const [aviso, setAviso] = useState(null)
  const cerrarAviso = useCallback(() => setAviso(null), [])

  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from('promociones').select('*').order('creado_en', { ascending: false })
    if (error) setAviso({ tipo: 'error', texto: 'no se pudieron cargar las promociones.' })
    else setLista(data.map(aPromo))
    setCargando(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }))

  const publicar = async (e) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    if (!form.foto) return setAviso({ tipo: 'error', texto: 'falta la foto.' })
    setGuardando(true)
    const { error } = await supabase.from('promociones').insert({
      categoria: form.categoria,
      titulo: form.titulo.trim(),
      texto: form.texto.trim(),
      foto: form.foto,
      vigencia: form.vigencia,
    })
    setGuardando(false)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo publicar. intenta de nuevo.' })
    setForm(VACIA)
    setAviso({ tipo: 'ok', texto: '¡publicada! ya aparece en la web.' })
    cargar()
  }

  const alternar = async (p) => {
    const { error } = await supabase.from('promociones').update({ visible: !p.visible }).eq('id', p.id)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo cambiar.' })
    setAviso({ tipo: 'ok', texto: p.visible ? 'oculta: ya no se ve en la web.' : 'visible otra vez en la web.' })
    cargar()
  }

  const eliminar = async (p) => {
    const { error } = await supabase.from('promociones').delete().eq('id', p.id)
    setBorrar(null)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo borrar.' })
    setAviso({ tipo: 'ok', texto: 'promoción borrada.' })
    cargar()
  }

  return (
    <div>
      <Titulo titulo="promociones." texto="publica una promo, un destino nuevo o una salida grupal. aparece en la web al instante." />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form onSubmit={publicar} className="space-y-6">
          <div className="max-w-md">
            <SelectorFoto valor={form.foto} onCambio={set('foto')} carpeta="promociones" alt="Foto de la promoción" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set('categoria')(c.id)}
                aria-pressed={form.categoria === c.id}
                className={`h-10 border px-4 text-[14px] ${form.categoria === c.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="flex justify-between text-[13px] text-ink-2">título <span className="text-ink-3">{form.titulo.length}/60</span></span>
            <input value={form.titulo} maxLength={60} onChange={set('titulo')} placeholder="ej.: cartagena con 20% de descuento." className={`${campo} h-12`} required />
          </label>

          <label className="block">
            <span className="flex justify-between text-[13px] text-ink-2">descripción <span className="text-ink-3">{form.texto.length}/200</span></span>
            <textarea value={form.texto} maxLength={200} rows={3} onChange={set('texto')} placeholder="qué incluye, fechas y cómo reservar." className={`${campo} resize-none py-3 leading-relaxed`} />
          </label>

          <div className="flex flex-wrap gap-2">
            {VIGENCIAS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set('vigencia')(v)}
                aria-pressed={form.vigencia === v}
                className={`h-10 border px-4 text-[14px] ${form.vigencia === v ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <button type="submit" disabled={guardando || !form.titulo.trim()} className="inline-flex w-full items-center justify-center gap-2 bg-ink py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-50 sm:w-auto sm:px-10">
            {guardando ? 'publicando…' : <>publicar <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="eyebrow text-ink-3">así se verá en la web</p>
          <div className="mt-3 border border-line bg-white p-4">
            <PostCard post={{ ...form, fecha: 'hoy' }} compacta />
          </div>
        </div>
      </div>

      {/* Lista */}
      <h2 className="mt-14 text-[18px] font-medium">publicadas</h2>
      <p className="mt-1 text-[13px] text-ink-3">en la web se muestran las 3 más recientes que estén visibles.</p>
      {cargando ? (
        <p className="mt-4 text-[14px] text-ink-3">cargando…</p>
      ) : lista.length === 0 ? (
        <p className="mt-4 text-[14px] text-ink-3">todavía no hay promociones.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {lista.map((p) => (
            <li key={p.id} className={`flex items-center gap-3 py-3 ${p.visible ? '' : 'opacity-50'}`}>
              {p.foto ? <img src={p.foto} alt="" className="size-14 shrink-0 object-cover" /> : <div className="size-14 shrink-0 bg-paper-3" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{p.titulo}</p>
                <p className="text-[12px] text-ink-3">{nombreCategoria(p.categoria)} · {p.fecha} · {p.visible ? 'visible' : 'oculta'}</p>
              </div>
              {borrar === p.id ? (
                <div className="flex shrink-0 items-center gap-2 text-[13px]">
                  <span className="hidden text-ink-2 sm:inline">¿borrar?</span>
                  <button type="button" onClick={() => eliminar(p)} className="h-9 bg-clay px-3 text-paper">sí, borrar</button>
                  <button type="button" onClick={() => setBorrar(null)} className="h-9 px-2 text-ink-2">no</button>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => alternar(p)} aria-label={p.visible ? 'Ocultar' : 'Mostrar'} title={p.visible ? 'ocultar' : 'mostrar'} className="flex size-9 items-center justify-center text-ink-2 hover:bg-paper-2 hover:text-ink">
                    {p.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button type="button" onClick={() => setBorrar(p.id)} aria-label="Borrar" title="borrar" className="flex size-9 items-center justify-center text-ink-2 hover:bg-paper-2 hover:text-clay">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}
