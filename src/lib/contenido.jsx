import { createContext, useCallback, useContext, useState } from 'react'
import { negocio, publicacionesIniciales } from '../data/negocio'
import { sitios } from '../data/sitios'
import { supabase } from './supabase'

/* ==========================================================================
   CONTENIDO DE LA WEB (destinos, promociones, horario)
   --------------------------------------------------------------------------
   - Con Supabase configurado: se lee de la base de datos (lo que Viafa
     edita en el panel).
   - Sin Supabase: se usan los datos de src/data/negocio.js.
   La web arranca con los datos locales y los reemplaza en cuanto llega
   la respuesta de la base, así nunca se ve vacía.
   ========================================================================== */

const Ctx = createContext(null)

/* "hace 3 días" a partir de una fecha */
export function haceCuanto(fecha) {
  if (!fecha) return ''
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000)
  if (dias <= 0) return 'hoy'
  if (dias === 1) return 'ayer'
  if (dias < 7) return `hace ${dias} días`
  if (dias < 14) return 'hace 1 semana'
  if (dias < 31) return `hace ${Math.floor(dias / 7)} semanas`
  return new Date(fecha).toLocaleDateString('es-EC', { day: 'numeric', month: 'long' })
}

/* Base de datos (snake_case) → formato que usa la web */
export const aDestino = (d) => ({
  uuid: d.id, // id interno de la base (para editar)
  id: d.slug || d.id, // dirección de la página: /destinos/<id>
  slug: d.slug || '',
  noches: d.noches || 0,
  incluye: d.incluye || [],
  galeria: d.galeria || [],
  pdf: d.pdf || '',
  sitios: sitios[d.slug] || [], // lugares del destino (src/data/sitios.js)
  nombre: d.nombre,
  region: d.region,
  detalle: d.detalle,
  precio: Number(d.precio),
  foto: d.foto,
  masVendido: d.mas_vendido,
  visible: d.visible,
  orden: d.orden,
})

export const aPromo = (p) => ({
  id: p.id,
  categoria: p.categoria,
  titulo: p.titulo,
  texto: p.texto,
  foto: p.foto,
  vigencia: p.vigencia,
  visible: p.visible,
  creadoEn: p.creado_en,
  fecha: haceCuanto(p.creado_en),
})

export const aDia = (h) => ({ indice: h.dia_idx, dia: h.dia, abre: h.abre, cierra: h.cierra, cerrado: h.cerrado })

/* "Los favoritos de Quito" (tarjetas del inicio) */
export const aFavorito = (f) => ({
  uuid: f.id, id: f.id, nombre: f.nombre, region: f.region, detalle: f.detalle,
  precio: Number(f.precio), foto: f.foto, orden: f.orden, visible: f.visible,
})
/* "Lugares que visitó Viafa" (collage) */
export const aViaje = (g) => ({ uuid: g.id, id: g.id, lugar: g.lugar, foto: g.foto, orden: g.orden, visible: g.visible })
/* "Esto dicen nuestros clientes" */
export const aTestimonio = (t) => ({
  uuid: t.id, id: t.id, autor: t.autor, viaje: t.viaje, texto: t.texto, foto: t.foto, orden: t.orden, visible: t.visible,
})

const local = {
  destinos: negocio.carta.map((d) => ({ ...d, sitios: sitios[d.id] || [] })),
  favoritos: negocio.carta.filter((d) => d.masVendido),
  galeriaViajes: negocio.galeriaViajes.map((g, i) => ({ id: `g${i}`, ...g })),
  testimonios: negocio.referencias.map((r, i) => ({ id: `t${i}`, ...r })),
  promociones: publicacionesIniciales,
  horario: negocio.horario.map((h, i) => ({ indice: i, cerrado: false, ...h })),
}

const visibles = (tabla) => supabase.from(tabla).select('*').eq('visible', true).order('orden').order('creado_en')

export function ContenidoProvider({ children }) {
  const [datos, setDatos] = useState(local)
  const [fuente, setFuente] = useState(supabase ? 'cargando' : 'local')

  const recargar = useCallback(async () => {
    if (!supabase) return
    const [d, f, g, t, p, h] = await Promise.all([
      visibles('destinos'),
      visibles('favoritos'),
      visibles('viajes_galeria'),
      visibles('testimonios'),
      supabase.from('promociones').select('*').eq('visible', true).order('creado_en', { ascending: false }),
      supabase.from('horario').select('*').order('dia_idx'),
    ])
    const error = [d, f, g, t, p, h].find((r) => r.error)?.error
    if (error) {
      console.error('No se pudo leer Supabase', error)
      setFuente('local')
      return
    }
    setDatos({
      destinos: d.data.map(aDestino),
      favoritos: f.data.map(aFavorito),
      galeriaViajes: g.data.map(aViaje),
      testimonios: t.data.map(aTestimonio),
      promociones: p.data.map(aPromo),
      horario: h.data.length === 7 ? h.data.map(aDia) : local.horario,
    })
    setFuente('supabase')
  }, [])

  // Las páginas llaman a recargar() al abrirse, así lo que se acaba de
  // cambiar en el panel /admin se ve al instante.
  return <Ctx.Provider value={{ ...datos, fuente, recargar }}>{children}</Ctx.Provider>
}

export const useContenido = () => useContext(Ctx)
