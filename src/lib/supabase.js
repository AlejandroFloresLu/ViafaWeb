import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config'

/* Cliente de Supabase. Es null mientras no se configure en src/config.js. */
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null

export const supabaseListo = Boolean(supabase)

/* Sube una foto (ya achicada como dataURL) a la carpeta pública "fotos"
   y devuelve su URL pública. */
export async function subirFoto(dataUrl, carpeta = 'general') {
  if (!supabase) throw new Error('Supabase no está configurado')
  const blob = await (await fetch(dataUrl)).blob()
  const nombre = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from('fotos').upload(nombre, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from('fotos').getPublicUrl(nombre).data.publicUrl
}

/* Borra del almacenamiento una foto subida desde el panel (para no dejar
   fotos huérfanas ocupando espacio). Ignora fotos externas (Unsplash, etc.)
   y nunca rompe el flujo si falla: lo peor es que quede un archivo suelto. */
export async function borrarFoto(url) {
  if (!supabase || !url) return
  const marca = '/storage/v1/object/public/fotos/'
  const i = url.indexOf(marca)
  if (i < 0) return
  try {
    await supabase.storage.from('fotos').remove([decodeURIComponent(url.slice(i + marca.length).split('?')[0])])
  } catch (e) {
    console.warn('no se pudo borrar la foto vieja', e)
  }
}
