import { useCallback, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CLAVE_SUFIJO } from '../../config'
import { Aviso, Titulo, campo } from './comun'

/* Cambiar la clave del panel. Se guarda en Supabase Auth (cifrada);
   nadie, ni el desarrollador, puede verla. */
export function AdminCuenta({ usuario, onCambiada }) {
  const [nueva, setNueva] = useState('')
  const [repite, setRepite] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const cerrarAviso = useCallback(() => setAviso(null), [])

  const guardar = async (e) => {
    e.preventDefault()
    if (nueva.length < 8) return setAviso({ tipo: 'error', texto: 'la clave debe tener al menos 8 caracteres.' })
    if (nueva.toLowerCase() === 'admin' || nueva.toLowerCase() === usuario) return setAviso({ tipo: 'error', texto: 'elige una clave distinta a "admin".' })
    if (nueva !== repite) return setAviso({ tipo: 'error', texto: 'las dos claves no coinciden.' })
    setGuardando(true)
    const { error } = await supabase.auth.updateUser({ password: nueva + CLAVE_SUFIJO, data: { clave_inicial: false } })
    setGuardando(false)
    if (error) return setAviso({ tipo: 'error', texto: 'no se pudo cambiar la clave. intenta de nuevo.' })
    setNueva('')
    setRepite('')
    setAviso({ tipo: 'ok', texto: 'clave cambiada. úsala la próxima vez que entres.' })
    onCambiada?.()
  }

  return (
    <div className="max-w-md">
      <Titulo titulo="mi cuenta." texto={`entras con el usuario “${usuario}”.`} />
      <form onSubmit={guardar} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-[13px] text-ink-2">clave nueva (mínimo 8 caracteres)</span>
          <input type="password" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} className={`${campo} h-12`} />
        </label>
        <label className="block">
          <span className="text-[13px] text-ink-2">repite la clave nueva</span>
          <input type="password" autoComplete="new-password" value={repite} onChange={(e) => setRepite(e.target.value)} className={`${campo} h-12`} />
        </label>
        <button type="submit" disabled={guardando} className="h-12 bg-ink px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-50">
          {guardando ? 'guardando…' : 'cambiar clave'}
        </button>
        <p className="text-[12px] leading-relaxed text-ink-3">
          si olvidas la clave, el desarrollador puede restablecerla desde supabase (authentication → users).
        </p>
      </form>
      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  )
}
