import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { publicacionesIniciales } from '../data/negocio'

/* Estado compartido de la demo: lo que el local publica y el anuncio que
   compra. Se guarda en el navegador para que, si recargas la página durante
   la reunión, siga ahí. "reiniciar demo" lo deja todo como al inicio. */
const KEY = 'viafa-publicaciones-v1'
const KEY_ANUNCIO = 'viafa-anuncio-v1'
const Ctx = createContext(null)

function leer(key, inicial) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
  return inicial
}

function guardar(key, valor) {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    /* imagen muy grande o almacenamiento bloqueado: no pasa nada */
  }
}

export function PublicacionesProvider({ children }) {
  const [lista, setLista] = useState(() => leer(KEY, publicacionesIniciales))
  const [ultima, setUltima] = useState(null)
  // 'fundador' (gratis) | 'destacado' | 'portada'
  const [anuncio, setAnuncio] = useState(() => leer(KEY_ANUNCIO, 'fundador'))

  useEffect(() => guardar(KEY, lista), [lista])
  useEffect(() => guardar(KEY_ANUNCIO, anuncio), [anuncio])

  const publicar = useCallback((p) => {
    const nueva = { ...p, id: `p-${Date.now()}`, fecha: 'recién publicado' }
    setLista((l) => [nueva, ...l])
    setUltima(nueva.id)
    return nueva
  }, [])

  const reiniciar = useCallback(() => {
    setLista(publicacionesIniciales)
    setUltima(null)
    setAnuncio('fundador')
  }, [])

  return (
    <Ctx.Provider value={{ lista, ultima, publicar, reiniciar, anuncio, setAnuncio }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePublicaciones = () => useContext(Ctx)
