import { negocio } from '../data/negocio'

const enc = encodeURIComponent

export const precio = (v) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: negocio.moneda, minimumFractionDigits: 2 }).format(v)

export const numero = (v) => new Intl.NumberFormat('es-EC').format(v)

export const whatsapp = (texto) =>
  `https://wa.me/${negocio.whatsapp}?text=${enc(texto)}`

/* ---------- Google Maps (sin API key) ---------- */
const q = () => negocio.google.mapa
const pid = () => negocio.google.placeId

export const mapaEmbed = () => `https://www.google.com/maps?q=${enc(q())}&z=15&output=embed`
export const mapaFicha = () =>
  `https://www.google.com/maps/search/?api=1&query=${enc(q())}${pid() ? `&query_place_id=${enc(pid())}` : ''}`
export const mapaComoLlegar = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${enc(q())}${pid() ? `&destination_place_id=${enc(pid())}` : ''}`
export const mapaResena = () =>
  pid() ? `https://search.google.com/local/writereview?placeid=${enc(pid())}` : mapaFicha()

/* ---------- Horario ---------- */
const min = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function hoy() {
  const i = (new Date().getDay() + 6) % 7 // 0 = lunes
  return { indice: i, ...negocio.horario[i] }
}

export function abiertoAhora() {
  const h = hoy()
  const d = new Date()
  const ahora = d.getHours() * 60 + d.getMinutes()
  return ahora >= min(h.abre) && ahora < min(h.cierra)
}

export function saludo() {
  const h = new Date().getHours()
  if (h < 12) return 'buenos días'
  if (h < 19) return 'buenas tardes'
  return 'buenas noches'
}

/* Achica una imagen subida para que la demo vaya fluida y quepa en memoria. */
export function leerImagen(file, max = 1400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * k)
        c.height = Math.round(img.height * k)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve(c.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
