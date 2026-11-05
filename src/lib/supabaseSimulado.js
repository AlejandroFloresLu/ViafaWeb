import { negocio } from '../data/negocio'
import { favoritosEjemplo } from '../data/favoritos'

/* ==========================================================================
   SUPABASE SIMULADO — solo para la versión de prueba (npm run simulacion)
   Imita las partes de Supabase que usa la web: tablas, login y fotos.
   Todo se guarda en el navegador (localStorage); nada sale a internet.
   Usuario: admin · clave: admin (se puede cambiar en "mi cuenta").
   ========================================================================== */

const CLAVE_LS = 'viafa-simulacion-v2'
const ahora = () => new Date().toISOString()
const nuevoId = () => Math.random().toString(36).slice(2, 10)

function semilla() {
  const fila = (o, i) => ({ id: nuevoId(), orden: i + 1, visible: true, creado_en: ahora(), ...o })
  return {
    usuarios: { 'admin@viafaecuador.com.ec': { clave: 'admin::viafa', meta: {} } },
    fotos: {},
    tablas: {
      favoritos: favoritosEjemplo.map(({ id, ...f }, i) => fila(f, i)),
      viajes_galeria: negocio.galeriaViajes.map((g, i) => fila({ lugar: g.lugar, foto: g.foto }, i)),
      testimonios: negocio.referencias.map((t, i) => fila({ autor: t.autor, viaje: t.viaje, texto: t.texto, foto: t.foto }, i)),
      horario: negocio.horario.map((h, i) => ({ dia_idx: i, dia: h.dia, abre: h.abre, cierra: h.cierra, cerrado: !!h.cerrado })),
      destinos: [],
      promociones: [],
    },
  }
}

let db = null
function cargar() {
  try {
    db = JSON.parse(localStorage.getItem(CLAVE_LS)) || semilla()
  } catch {
    db = semilla()
  }
}
function guardar() {
  try {
    localStorage.setItem(CLAVE_LS, JSON.stringify(db))
    return null
  } catch {
    return { message: 'el navegador se quedó sin espacio para la simulación (reiníciala)' }
  }
}

export function reiniciarSimulacion() {
  localStorage.removeItem(CLAVE_LS)
  sessionStorage.removeItem(CLAVE_LS + '-sesion')
  location.reload()
}

const LIMITE = { favoritos: 6, viajes_galeria: 24, testimonios: 12 }
const espera = (v) => new Promise((r) => setTimeout(() => r(v), 120)) // simula la red

/* ---------- tablas: from(t).select().eq().order() / insert / update / delete / upsert ---------- */
function consulta(tabla) {
  const q = { filtros: [], orden: [], accion: 'select', datos: null, single: false }
  const api = {
    select() { return api },
    eq(k, v) { q.filtros.push([k, v]); return api },
    order(k, o = {}) { q.orden.push([k, o.ascending !== false]); return api },
    single() { q.single = true; return api },
    insert(d) { q.accion = 'insert'; q.datos = d; return api },
    update(d) { q.accion = 'update'; q.datos = d; return api },
    upsert(d) { q.accion = 'upsert'; q.datos = d; return api },
    delete() { q.accion = 'delete'; return api },
    then(ok, mal) { return espera(ejecutar(tabla, q)).then(ok, mal) },
  }
  return api
}

function ejecutar(tabla, q) {
  const filas = db.tablas[tabla]
  if (!filas) return { data: null, error: { message: `no existe la tabla ${tabla}` } }
  const pasa = (f) => q.filtros.every(([k, v]) => f[k] === v)
  const sesion = leerSesion()
  if (q.accion !== 'select' && !sesion) return { data: null, error: { message: 'sin permiso (RLS)' } }

  if (q.accion === 'select') {
    let r = filas.filter(pasa)
    for (const [k, asc] of [...q.orden].reverse()) r = [...r].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (asc ? 1 : -1))
    r = JSON.parse(JSON.stringify(r))
    return { data: q.single ? r[0] : r, error: null }
  }
  if (q.accion === 'insert') {
    const nuevas = (Array.isArray(q.datos) ? q.datos : [q.datos]).map((d) => ({ id: nuevoId(), visible: true, orden: 0, creado_en: ahora(), ...d }))
    if (LIMITE[tabla] && filas.length + nuevas.length > LIMITE[tabla])
      return { data: null, error: { message: `límite alcanzado: máximo ${LIMITE[tabla]} filas en ${tabla}` } }
    filas.push(...nuevas)
    return { data: q.single ? nuevas[0] : nuevas, error: guardar() }
  }
  if (q.accion === 'update') {
    filas.filter(pasa).forEach((f) => Object.assign(f, q.datos))
    return { data: null, error: guardar() }
  }
  if (q.accion === 'upsert') {
    for (const d of Array.isArray(q.datos) ? q.datos : [q.datos]) {
      const f = filas.find((x) => x.dia_idx === d.dia_idx)
      f ? Object.assign(f, d) : filas.push(d)
    }
    return { data: null, error: guardar() }
  }
  if (q.accion === 'delete') {
    db.tablas[tabla] = filas.filter((f) => !pasa(f))
    return { data: null, error: guardar() }
  }
  return { data: null, error: { message: 'acción no soportada' } }
}

/* ---------- login ---------- */
const oyentes = new Set()
function leerSesion() {
  try {
    const email = sessionStorage.getItem(CLAVE_LS + '-sesion')
    if (!email || !db.usuarios[email]) return null
    return { user: { email, user_metadata: { ...db.usuarios[email].meta } } }
  } catch {
    return null
  }
}
const avisar = (evento) => oyentes.forEach((fn) => fn(evento, leerSesion()))

const auth = {
  async getSession() {
    return { data: { session: leerSesion() }, error: null }
  },
  onAuthStateChange(fn) {
    oyentes.add(fn)
    return { data: { subscription: { unsubscribe: () => oyentes.delete(fn) } } }
  },
  async signInWithPassword({ email, password }) {
    await espera()
    const u = db.usuarios[email]
    if (!u || u.clave !== password) return { data: null, error: { message: 'Invalid login credentials' } }
    sessionStorage.setItem(CLAVE_LS + '-sesion', email)
    avisar('SIGNED_IN')
    return { data: { session: leerSesion() }, error: null }
  },
  async signOut() {
    sessionStorage.removeItem(CLAVE_LS + '-sesion')
    avisar('SIGNED_OUT')
    return { error: null }
  },
  async updateUser({ password, data }) {
    await espera()
    const s = leerSesion()
    if (!s) return { error: { message: 'sin sesión' } }
    const u = db.usuarios[s.user.email]
    if (password) u.clave = password
    if (data) Object.assign(u.meta, data)
    const error = guardar()
    avisar('USER_UPDATED')
    return { data: { user: leerSesion()?.user }, error }
  },
}

/* ---------- fotos (se guardan como dataURL en el navegador) ---------- */
const MARCA = 'https://simulacion.local/storage/v1/object/public/fotos/'
const storage = {
  from() {
    return {
      async upload(nombre, blob) {
        if (!leerSesion()) return { error: { message: 'sin permiso' } }
        const dataUrl = await new Promise((r) => {
          const fr = new FileReader()
          fr.onload = () => r(fr.result)
          fr.readAsDataURL(blob)
        })
        db.fotos[nombre] = dataUrl
        return { data: { path: nombre }, error: guardar() }
      },
      getPublicUrl(nombre) {
        return { data: { publicUrl: MARCA + nombre } }
      },
      async remove(nombres) {
        nombres.forEach((n) => delete db.fotos[n])
        return { data: null, error: guardar() }
      },
    }
  },
}

/* Las URLs de fotos simuladas se convierten en la imagen guardada.
   (Se reemplaza el src de las imágenes al vuelo.) */
function resolverFotos() {
  const arreglar = (img) => {
    const s = img.getAttribute('src')
    if (s && s.startsWith(MARCA)) {
      const dato = db.fotos[decodeURIComponent(s.slice(MARCA.length))]
      if (dato) img.setAttribute('src', dato)
    }
  }
  new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === 'attributes') arreglar(m.target)
      m.addedNodes?.forEach((n) => n.nodeType === 1 && (n.tagName === 'IMG' ? arreglar(n) : n.querySelectorAll?.('img').forEach(arreglar)))
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] })
}
/* Se llama una sola vez, y solo en la versión de simulación. */
export function crearSupabaseSimulado() {
  cargar()
  if (typeof document !== 'undefined') resolverFotos()
  return {
    from: consulta,
    rpc: async (nombre) => ({ data: nombre === 'es_admin' ? !!leerSesion() : null, error: null }),
    auth,
    storage,
  }
}
