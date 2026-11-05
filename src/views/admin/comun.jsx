import { useEffect, useRef, useState } from 'react'
import { Check, ImagePlus, X } from 'lucide-react'
import { leerImagen } from '../../lib/utils'
import { subirFoto } from '../../lib/supabase'
import { FOTO } from '../../config'

/* Elegir una foto desde el celular o la compu: la achica y la sube a Supabase.
   Llama onCambio(urlPublica) cuando termina. */
export function SelectorFoto({ valor, onCambio, carpeta, aspecto = 'aspect-[4/3]', alt = 'Foto' }) {
  const ref = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  const elegir = async (file) => {
    if (!file) return
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setError('usa una foto JPG, PNG o WEBP.')
    if (file.size > FOTO.archivoMaximoMB * 1024 * 1024) return setError(`la foto pesa más de ${FOTO.archivoMaximoMB} MB. usa una más liviana.`)
    setError('')
    setSubiendo(true)
    try {
      const dataUrl = await leerImagen(file, FOTO.ladoMaximo, FOTO.pesoMaximoKB)
      onCambio(await subirFoto(dataUrl, carpeta))
    } catch (e) {
      console.error(e)
      setError('no se pudo leer o subir la foto. prueba con otra (JPG) o revisa tu conexión.')
    } finally {
      setSubiendo(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          elegir(e.dataTransfer.files?.[0])
        }}
        disabled={subiendo}
        className={`relative flex w-full items-center justify-center overflow-hidden border border-dashed border-ink/30 bg-paper-2 text-ink-2 hover:border-ink ${aspecto}`}
      >
        {valor ? <img src={valor} alt={alt} className="absolute inset-0 h-full w-full object-cover" /> : null}
        <span className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium ${valor ? 'bg-paper/95 text-ink' : 'text-ink-2'}`}>
          <ImagePlus size={14} /> {subiendo ? 'subiendo foto…' : valor ? 'cambiar foto' : 'subir foto'}
        </span>
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => elegir(e.target.files?.[0])} />
      {error && <p className="mt-2 text-[13px] text-clay">{error}</p>}
    </div>
  )
}

/* Aviso flotante breve: { tipo: 'ok' | 'error', texto } */
export function Aviso({ aviso, onCerrar }) {
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(onCerrar, 3500)
    return () => clearTimeout(t)
  }, [aviso, onCerrar])
  if (!aviso) return null
  return (
    <div role="status" className="fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
      <div className={`rise flex items-center gap-2.5 px-4 py-3 text-[14px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ${aviso.tipo === 'error' ? 'bg-clay text-paper' : 'bg-ink text-paper'}`}>
        {aviso.tipo === 'error' ? <X size={16} /> : <Check size={16} />}
        {aviso.texto}
      </div>
    </div>
  )
}

export function Titulo({ titulo, texto }) {
  return (
    <div>
      <h1 className="text-[30px] font-medium leading-tight tracking-[-0.02em] sm:text-[36px]">{titulo}</h1>
      {texto && <p className="mt-1 text-[15px] text-ink-2">{texto}</p>}
    </div>
  )
}

export const campo = 'mt-1.5 w-full border border-line bg-white px-3.5 text-[16px] outline-none focus:border-ink'
