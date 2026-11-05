import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { aDia } from '../../lib/contenido'
import { Aviso, Titulo } from './comun'

/* Horario de atención: abre, cierra o "cerrado" por día. */
export function AdminHorario() {
  const [dias, setDias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const cerrarAviso = useCallback(() => setAviso(null), [])

  useEffect(() => {
    supabase
      .from('horario')
      .select('*')
      .order('dia_idx')
      .then(({ data, error }) => {
        if (error) setAviso({ tipo: 'error', texto: 'no se pudo cargar el horario.' })
        else setDias(data.map(aDia))
        setCargando(false)
      })
  }, [])

  const cambiar = (i, k, v) => setDias((ds) => ds.map((d, j) => (j === i ? { ...d, [k]: v } : d)))

  const guardar = async () => {
    setGuardando(true)
    const { error } = await supabase
      .from('horario')
      .upsert(dias.map((d) => ({ dia_idx: d.indice, dia: d.dia, abre: d.abre, cierra: d.cierra, cerrado: d.cerrado })))
    setGuardando(false)
    setAviso(error ? { tipo: 'error', texto: 'no se pudo guardar el horario.' } : { tipo: 'ok', texto: 'horario guardado. ya se ve en la web.' })
  }

  return (
    <div>
      <Titulo titulo="horario." texto="lo que ven tus clientes en la web y en el aviso de arriba (atendiendo ahora / cerrado)." />
      {cargando ? (
        <p className="mt-6 text-[14px] text-ink-3">cargando…</p>
      ) : (
        <>
          <ul className="mt-8 max-w-xl divide-y divide-line border-y border-line">
            {dias.map((d, i) => (
              <li key={d.indice} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-24 text-[15px] font-medium">{d.dia}</span>
                <input type="time" value={d.abre} disabled={d.cerrado} onChange={(e) => cambiar(i, 'abre', e.target.value)} aria-label={`${d.dia}: abre`} className="h-10 border border-line bg-white px-2 text-[15px] disabled:opacity-40" />
                <span className="text-ink-3">—</span>
                <input type="time" value={d.cierra} disabled={d.cerrado} onChange={(e) => cambiar(i, 'cierra', e.target.value)} aria-label={`${d.dia}: cierra`} className="h-10 border border-line bg-white px-2 text-[15px] disabled:opacity-40" />
                <label className="ml-auto inline-flex items-center gap-2 text-[14px] text-ink-2">
                  <input type="checkbox" checked={d.cerrado} onChange={(e) => cambiar(i, 'cerrado', e.target.checked)} className="size-4 accent-[#0a0a98]" /> cerrado
                </label>
              </li>
            ))}
          </ul>
          <button type="button" onClick={guardar} disabled={guardando} className="mt-6 h-12 bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-50">
            {guardando ? 'guardando…' : 'guardar horario'}
          </button>
        </>
      )}
      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}
