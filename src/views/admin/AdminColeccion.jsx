import { useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from 'lucide-react'
import { borrarFoto, supabase } from '../../lib/supabase'
import { LIMITES } from '../../config'
import { precio } from '../../lib/utils'
import { Aviso, SelectorFoto, Titulo, campo } from './comun'

/* ==========================================================================
   EDITOR GENÉRICO DE UNA COLECCIÓN DE TARJETAS CON FOTO
   Sirve para "los favoritos de quito", "lugares que visitó viafa" y
   "esto dicen nuestros clientes". El gerente puede crear, modificar,
   ocultar, reordenar (subir/bajar) y eliminar. El DISEÑO no se edita aquí:
   solo fotos y textos.
   ========================================================================== */

/* Cada colección define su tabla en Supabase y sus campos. */
export const COLECCIONES = {
  favoritos: {
    tabla: 'favoritos',
    carpeta: 'favoritos',
    titulo: 'los favoritos de quito.',
    texto: 'las tarjetas de "los más vendidos" del inicio. lo ideal son 3 (o 6).',
    nuevo: 'nuevo favorito',
    aspecto: 'aspect-[3/4]',
    campos: [
      { k: 'nombre', label: 'destino', req: true, max: 40, ej: 'punta cana' },
      { k: 'region', label: 'región', max: 30, ej: 'caribe' },
      { k: 'detalle', label: 'detalle corto', max: 80, ej: '5 días · 4 noches · todo incluido' },
      { k: 'precio', label: 'precio desde (USD)', tipo: 'number', maxNum: 99999, ej: '899' },
    ],
    resumen: (f) => [f.region, f.precio > 0 ? `desde ${precio(f.precio)}` : null].filter(Boolean).join(' · '),
    nombre: (f) => f.nombre,
  },
  viajes: {
    tabla: 'viajes_galeria',
    carpeta: 'viajes',
    titulo: 'lugares que visitó viafa.',
    texto: 'el collage de fotos de los viajes. la 1.ª foto sale grande; sube fotos horizontales de buena calidad.',
    nuevo: 'nueva foto',
    aspecto: 'aspect-[4/3]',
    campos: [{ k: 'lugar', label: 'lugar (opcional)', max: 40, ej: 'galápagos' }],
    resumen: () => '',
    nombre: (f) => f.lugar || 'foto sin nombre',
  },
  clientes: {
    tabla: 'testimonios',
    carpeta: 'clientes',
    titulo: 'esto dicen nuestros clientes.',
    texto: 'foto del cliente en su viaje + lo que dijo. pide permiso antes de publicar su foto.',
    nuevo: 'nuevo cliente',
    aspecto: 'aspect-[4/5]',
    campos: [
      { k: 'autor', label: 'nombre del cliente', req: true, max: 50, ej: 'maría josé t.' },
      { k: 'viaje', label: 'a dónde viajó', max: 40, ej: 'cartagena' },
      { k: 'texto', label: 'lo que dijo', req: true, tipo: 'textarea', max: 280, ej: 'todo salió perfecto…' },
    ],
    resumen: (f) => (f.viaje ? `viajó a ${f.viaje}` : ''),
    nombre: (f) => f.autor,
  },
}

const vacio = (cfg) => Object.fromEntries([['foto', ''], ...cfg.campos.map((c) => [c.k, ''])])

export function AdminColeccion({ tipo }) {
  const cfg = COLECCIONES[tipo]
  const limite = LIMITES[tipo]
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState(null) // null = cerrado; { id?, ...campos }
  const [guardando, setGuardando] = useState(false)
  const [borrar, setBorrar] = useState(null)
  const [aviso, setAviso] = useState(null)
  const cerrarAviso = useCallback(() => setAviso(null), [])

  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from(cfg.tabla).select('*').order('orden').order('creado_en')
    if (error) setAviso({ tipo: 'error', texto: 'no se pudo cargar la lista.' })
    else setLista(data.map((f) => ({ ...f, precio: f.precio != null ? Number(f.precio) : undefined })))
    setCargando(false)
  }, [cfg.tabla])

  useEffect(() => {
    setForm(null)
    setCargando(true)
    cargar()
  }, [cargar])

  const lleno = lista.length >= limite
  const original = (id) => lista.find((f) => f.id === id)?.foto

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }))

  // Al cambiar la foto dentro del formulario, la anterior se borra si era una
  // subida en este mismo formulario (no la que ya está publicada).
  const cambiarFoto = (url) =>
    setForm((f) => {
      if (f.foto && f.foto !== original(f.id)) borrarFoto(f.foto)
      return { ...f, foto: url }
    })

  const cancelar = () => {
    if (form?.foto && form.foto !== original(form.id)) borrarFoto(form.foto)
    setForm(null)
  }

  const guardar = async (e) => {
    e.preventDefault()
    if (!form.foto) return setAviso({ tipo: 'error', texto: 'falta la foto.' })
    const fila = { foto: form.foto }
    for (const c of cfg.campos) {
      const v = String(form[c.k] ?? '').trim()
      if (c.req && !v) return setAviso({ tipo: 'error', texto: `falta: ${c.label}.` })
      if (c.max && v.length > c.max) return setAviso({ tipo: 'error', texto: `${c.label}: máximo ${c.max} caracteres.` })
      if (c.maxNum && Number(v) > c.maxNum) return setAviso({ tipo: 'error', texto: `${c.label}: máximo ${c.maxNum}.` })
      fila[c.k] = c.tipo === 'number' ? Number(v) || 0 : v
    }
    if (!form.id && lleno) return setAviso({ tipo: 'error', texto: `ya hay ${limite}, el máximo. elimina uno antes de agregar otro.` })
    setGuardando(true)
    const anterior = original(form.id)
    const { error } = form.id
      ? await supabase.from(cfg.tabla).update(fila).eq('id', form.id)
      : await supabase.from(cfg.tabla).insert({ ...fila, orden: (lista.at(-1)?.orden ?? 0) + 1 })
    setGuardando(false)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo guardar. intenta de nuevo.' })
    if (form.id && anterior && anterior !== form.foto) borrarFoto(anterior) // foto reemplazada
    setAviso({ tipo: 'ok', texto: form.id ? 'cambios guardados. ya se ven en la web.' : '¡agregado! ya aparece en la web.' })
    setForm(null)
    cargar()
  }

  const alternar = async (f) => {
    const { error } = await supabase.from(cfg.tabla).update({ visible: !f.visible }).eq('id', f.id)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo cambiar.' })
    setAviso({ tipo: 'ok', texto: f.visible ? 'oculto: ya no se ve en la web.' : 'visible otra vez en la web.' })
    cargar()
  }

  // Intercambia la posición con el vecino (arriba = -1, abajo = +1) y renumera todo.
  const mover = async (i, paso) => {
    const j = i + paso
    if (j < 0 || j >= lista.length) return
    const nueva = [...lista]
    ;[nueva[i], nueva[j]] = [nueva[j], nueva[i]]
    setLista(nueva)
    const cambios = nueva.map((f, k) => ({ id: f.id, orden: k + 1 })).filter((c, k) => nueva[k].orden !== c.orden)
    const res = await Promise.all(cambios.map((c) => supabase.from(cfg.tabla).update({ orden: c.orden }).eq('id', c.id)))
    if (res.some((r) => r.error)) setAviso({ tipo: 'error', texto: 'no se pudo cambiar el orden.' })
    cargar()
  }

  const eliminar = async (f) => {
    const { error } = await supabase.from(cfg.tabla).delete().eq('id', f.id)
    setBorrar(null)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo eliminar.' })
    borrarFoto(f.foto)
    setAviso({ tipo: 'ok', texto: 'eliminado.' })
    cargar()
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Titulo titulo={cfg.titulo} texto={cfg.texto} />
        {!form && (
          <button type="button" disabled={lleno} title={lleno ? `máximo ${limite}` : undefined} onClick={() => setForm(vacio(cfg))} className="inline-flex h-11 items-center gap-2 bg-ink px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-40">
            <Plus size={15} /> {cfg.nuevo}
          </button>
        )}
      </div>

      {!cargando && (
        <p className={`mt-4 text-[13px] ${lleno ? 'text-clay' : 'text-ink-3'}`}>
          {lista.length} de {limite} usados{lleno ? ' · llegaste al máximo: elimina uno para agregar otro' : ''}.
        </p>
      )}

      {form && (
        <form onSubmit={guardar} className="mt-8 grid gap-6 border border-line bg-white/60 p-5 sm:grid-cols-[220px_1fr] sm:p-6">
          <SelectorFoto valor={form.foto} onCambio={cambiarFoto} carpeta={cfg.carpeta} aspecto={cfg.aspecto} alt="Foto" />
          <div className="space-y-4">
            <p className="text-[15px] font-medium">{form.id ? 'modificar' : cfg.nuevo}</p>
            {cfg.campos.map((c) => (
              <label key={c.k} className="block">
                <span className="flex justify-between text-[13px] text-ink-2">
                  {c.label}
                  {c.max && <span className="text-ink-3">{String(form[c.k] ?? '').length}/{c.max}</span>}
                </span>
                {c.tipo === 'textarea' ? (
                  <textarea rows={4} maxLength={c.max} value={form[c.k] ?? ''} onChange={set(c.k)} placeholder={c.ej} className={`${campo} py-3 leading-relaxed`} />
                ) : (
                  <input type={c.tipo === 'number' ? 'number' : 'text'} min={c.tipo === 'number' ? 0 : undefined} max={c.maxNum} maxLength={c.max} value={form[c.k] ?? ''} onChange={set(c.k)} placeholder={c.ej} className={`${campo} h-12`} />
                )}
              </label>
            ))}
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="submit" disabled={guardando} className="h-11 bg-ink px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-50">
                {guardando ? 'guardando…' : 'guardar'}
              </button>
              <button type="button" onClick={cancelar} className="inline-flex h-11 items-center gap-1.5 border border-line px-4 text-[13px] text-ink-2 hover:border-ink">
                <X size={14} /> cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-10">
        {cargando ? (
          <p className="text-[14px] text-ink-3">cargando…</p>
        ) : lista.length === 0 ? (
          <p className="text-[14px] text-ink-3">todavía no hay nada aquí. usa “{cfg.nuevo}”.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {lista.map((f, i) => (
              <li key={f.id} className={`flex items-center gap-4 py-3 ${f.visible ? '' : 'opacity-50'}`}>
                <img src={f.foto} alt="" className="h-16 w-16 shrink-0 bg-paper-2 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium">{cfg.nombre(f)}</p>
                  <p className="truncate text-[13px] text-ink-3">{[cfg.resumen(f), f.visible ? null : 'oculto'].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex shrink-0 items-center text-ink-2">
                  <Boton etiqueta="subir" onClick={() => mover(i, -1)} desactivado={i === 0}><ArrowUp size={16} /></Boton>
                  <Boton etiqueta="bajar" onClick={() => mover(i, 1)} desactivado={i === lista.length - 1}><ArrowDown size={16} /></Boton>
                  <Boton etiqueta="modificar" onClick={() => setForm({ ...f })}><Pencil size={16} /></Boton>
                  <Boton etiqueta={f.visible ? 'ocultar' : 'mostrar'} onClick={() => alternar(f)}>{f.visible ? <Eye size={16} /> : <EyeOff size={16} />}</Boton>
                  {borrar === f.id ? (
                    <span className="ml-1 inline-flex items-center gap-2 text-[12px]">
                      <button type="button" onClick={() => eliminar(f)} className="bg-clay px-2.5 py-1.5 font-semibold text-paper">eliminar</button>
                      <button type="button" onClick={() => setBorrar(null)} className="px-1.5 py-1.5 text-ink-3">no</button>
                    </span>
                  ) : (
                    <Boton etiqueta="eliminar" onClick={() => setBorrar(f.id)}><Trash2 size={16} /></Boton>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}

function Boton({ etiqueta, onClick, desactivado, children }) {
  return (
    <button type="button" title={etiqueta} aria-label={etiqueta} onClick={onClick} disabled={desactivado} className="p-2 hover:text-ink disabled:opacity-25">
      {children}
    </button>
  )
}
