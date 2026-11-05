import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { aDestino } from '../../lib/contenido'
import { precio as formatoPrecio } from '../../lib/utils'
import { Aviso, SelectorFoto, Titulo, campo } from './comun'

const REGIONES = ['caribe', 'sudamérica', 'ecuador', 'norteamérica', 'europa']

/* Editar destinos: foto, nombre, región, detalle, precio, más vendido, visible. */
export function AdminDestinos() {
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [abierto, setAbierto] = useState(null)
  const [aviso, setAviso] = useState(null)
  const cerrarAviso = useCallback(() => setAviso(null), [])

  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from('destinos').select('*').order('orden').order('creado_en')
    if (error) setAviso({ tipo: 'error', texto: 'no se pudieron cargar los destinos.' })
    else setLista(data.map(aDestino))
    setCargando(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const agregar = async () => {
    const orden = lista.length ? Math.max(...lista.map((d) => d.orden)) + 1 : 0
    const { data, error } = await supabase
      .from('destinos')
      .insert({ nombre: 'nuevo destino', region: 'caribe', detalle: '', precio: 0, visible: false, orden })
      .select()
      .single()
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo crear el destino.' })
    await cargar()
    setAbierto(data.id)
    setAviso({ tipo: 'ok', texto: 'destino creado (oculto). complétalo y márcalo visible.' })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Titulo titulo="destinos." texto="cambia fotos, precios y qué destinos salen como más vendidos." />
        <button type="button" onClick={agregar} className="inline-flex h-11 items-center gap-2 bg-ink px-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-olive">
          <Plus size={16} /> agregar destino
        </button>
      </div>
      <p className="mt-3 text-[13px] text-ink-3">"más vendidos": la web muestra arriba los 3 primeros marcados.</p>

      {cargando ? (
        <p className="mt-6 text-[14px] text-ink-3">cargando…</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {lista.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setAbierto(abierto === d.id ? null : d.id)}
                aria-expanded={abierto === d.id}
                className={`flex w-full items-center gap-3 py-3 text-left ${d.visible ? '' : 'opacity-55'}`}
              >
                {d.foto ? <img src={d.foto} alt="" className="size-14 shrink-0 object-cover" /> : <div className="size-14 shrink-0 bg-paper-3" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium">{d.nombre}</p>
                  <p className="text-[12px] text-ink-3">
                    {d.region} · desde {formatoPrecio(d.precio)}
                    {d.masVendido ? ' · más vendido' : ''}
                    {d.visible ? '' : ' · oculto'}
                  </p>
                </div>
                <span className="text-[13px] font-medium text-ink-2">{abierto === d.id ? 'cerrar' : 'editar'}</span>
              </button>
              {abierto === d.id && (
                <Editor
                  destino={d}
                  onGuardado={(t) => {
                    setAviso({ tipo: 'ok', texto: t })
                    cargar()
                  }}
                  onError={(t) => setAviso({ tipo: 'error', texto: t })}
                  onBorrado={() => {
                    setAbierto(null)
                    setAviso({ tipo: 'ok', texto: 'destino borrado.' })
                    cargar()
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}

function Editor({ destino, onGuardado, onError, onBorrado }) {
  const [f, setF] = useState(destino)
  const [guardando, setGuardando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }))

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    const { error } = await supabase
      .from('destinos')
      .update({
        nombre: f.nombre.trim(),
        region: f.region,
        detalle: f.detalle.trim(),
        precio: Number(f.precio) || 0,
        foto: f.foto,
        mas_vendido: f.masVendido,
        visible: f.visible,
        orden: Number(f.orden) || 0,
      })
      .eq('id', f.id)
    setGuardando(false)
    if (error) return onError('no se pudo guardar.')
    onGuardado('cambios guardados. ya se ven en la web.')
  }

  const borrar = async () => {
    const { error } = await supabase.from('destinos').delete().eq('id', f.id)
    if (error) return onError('no se pudo borrar.')
    onBorrado()
  }

  return (
    <form onSubmit={guardar} className="grid gap-5 pb-6 pt-2 sm:grid-cols-[280px_1fr]">
      <SelectorFoto valor={f.foto} onCambio={set('foto')} carpeta="destinos" alt={`Foto de ${f.nombre}`} />
      <div className="space-y-4">
        <label className="block">
          <span className="text-[13px] text-ink-2">nombre</span>
          <input value={f.nombre} onChange={set('nombre')} className={`${campo} h-11`} required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[13px] text-ink-2">región</span>
            <select value={f.region} onChange={set('region')} className={`${campo} h-11`}>
              {[...new Set([...REGIONES, f.region])].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[13px] text-ink-2">precio desde (USD)</span>
            <input type="number" min="0" step="1" inputMode="numeric" value={f.precio} onChange={set('precio')} className={`${campo} h-11`} />
          </label>
        </div>
        <label className="block">
          <span className="text-[13px] text-ink-2">detalle (noches, qué incluye)</span>
          <input value={f.detalle} onChange={set('detalle')} placeholder="5 noches · todo incluido · vuelo + hotel" className={`${campo} h-11`} />
        </label>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={f.masVendido} onChange={set('masVendido')} className="size-4 accent-[#0a0a98]" /> más vendido
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={f.visible} onChange={set('visible')} className="size-4 accent-[#0a0a98]" /> visible en la web
          </label>
          <label className="inline-flex items-center gap-2 text-ink-2">
            orden
            <input type="number" value={f.orden} onChange={set('orden')} className="h-9 w-16 border border-line bg-white px-2 text-[14px]" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button type="submit" disabled={guardando} className="h-11 bg-ink px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-olive disabled:opacity-50">
            {guardando ? 'guardando…' : 'guardar'}
          </button>
          {confirmar ? (
            <span className="flex items-center gap-2 text-[13px]">
              ¿borrar este destino?
              <button type="button" onClick={borrar} className="h-9 bg-clay px-3 text-paper">sí, borrar</button>
              <button type="button" onClick={() => setConfirmar(false)} className="h-9 px-2 text-ink-2">no</button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmar(true)} className="inline-flex h-11 items-center gap-1.5 px-2 text-[13px] text-ink-2 hover:text-clay">
              <Trash2 size={15} /> borrar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
