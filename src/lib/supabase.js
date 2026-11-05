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
