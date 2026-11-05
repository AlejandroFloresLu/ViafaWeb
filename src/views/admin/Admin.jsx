import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock, LogOut, Megaphone, Plane } from 'lucide-react'
import { negocio } from '../../data/negocio'
import { supabase, supabaseListo } from '../../lib/supabase'
import { AdminPromos } from './AdminPromos'
import { AdminDestinos } from './AdminDestinos'
import { AdminHorario } from './AdminHorario'
import logo from '../../assets/logo.png'

/* ==========================================================================
   PANEL REAL DE VIAFA  (/#/panel)
   Login con correo y clave → promociones, destinos y horario.
   Solo pueden editar los correos de la tabla "administradores" (Supabase).
   ========================================================================== */

const SECCIONES = [
  { id: 'promos', label: 'promociones', icon: Megaphone },
  { id: 'destinos', label: 'destinos', icon: Plane },
  { id: 'horario', label: 'horario', icon: CalendarClock },
]

export function Admin() {
  const [sesion, setSesion] = useState(undefined) // undefined = cargando
  const [esAdmin, setEsAdmin] = useState(null)

  useEffect(() => {
    document.title = `panel · ${negocio.nombreLargo}`
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !sesion) {
      setEsAdmin(null)
      return
    }
    supabase.rpc('es_admin').then(({ data, error }) => setEsAdmin(!error && data === true))
  }, [sesion])

  if (!supabaseListo) return <FaltaConfigurar />
  if (sesion === undefined || (sesion && esAdmin === null)) return <Pantalla><p className="text-[15px] text-ink-2">cargando…</p></Pantalla>
  if (!sesion) return <Login />
  if (!esAdmin) return <SinPermiso email={sesion.user.email} />
  return <Panel email={sesion.user.email} />
}

/* ---------------------------------------------------------------------- */
function Panel({ email }) {
  const [sec, setSec] = useState('promos')
  return (
    <div className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="hidden border-r border-line lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:px-5 lg:py-6">
        <div>
          <p className="text-[22px] font-semibold tracking-[-0.03em]">{negocio.nombre}<span className="text-sun">.</span></p>
          <p className="text-[12px] text-ink-3">panel de la agencia</p>
          <nav className="mt-10 space-y-1">
            {SECCIONES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSec(id)}
                className={`flex h-10 w-full items-center gap-3 px-3 text-left text-[14px] ${sec === id ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <Link to="/web" className="flex h-10 items-center gap-3 px-3 text-[14px] text-ink-2 hover:text-ink">
              <ArrowUpRight size={16} /> ver la web
            </Link>
          </nav>
        </div>
        <div className="text-[12px] text-ink-3">
          <p className="truncate">{email}</p>
          <button type="button" onClick={() => supabase.auth.signOut()} className="mt-2 inline-flex items-center gap-1.5 text-ink-2 hover:text-ink">
            <LogOut size={13} /> salir
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <div>
            <p className="text-[18px] font-semibold leading-tight tracking-[-0.03em]">{negocio.nombre}<span className="text-sun">.</span></p>
            <p className="text-[11px] text-ink-3">panel de la agencia</p>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-ink-2">
            <Link to="/web" className="inline-flex items-center gap-1">web <ArrowUpRight size={14} /></Link>
            <button type="button" onClick={() => supabase.auth.signOut()} aria-label="Salir"><LogOut size={16} /></button>
          </div>
        </div>
        <nav className="mt-3 flex gap-6 px-5">
          {SECCIONES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSec(id)}
              className={`border-b-2 pb-2.5 text-[14px] ${sec === id ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-3'}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="min-w-0 px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-10">
        <div className="mx-auto max-w-5xl">
          {sec === 'promos' && <AdminPromos />}
          {sec === 'destinos' && <AdminDestinos />}
          {sec === 'horario' && <AdminHorario />}
        </div>
      </main>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
function Pantalla({ children }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-5 text-ink">
      <div className="w-full max-w-sm">
        <img src={logo} alt="Viafa Agencia de Viajes" className="h-14 w-auto" />
        <p className="mt-2 text-[13px] text-ink-3">panel de la agencia</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)

  const entrar = async (e) => {
    e.preventDefault()
    setError('')
    setEntrando(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: clave })
    setEntrando(false)
    if (error) setError('correo o clave incorrectos.')
  }

  return (
    <Pantalla>
      <form onSubmit={entrar} className="space-y-4">
        <label className="block">
          <span className="text-[13px] text-ink-2">correo</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 w-full border border-line bg-white px-3.5 text-[16px] outline-none focus:border-ink" />
        </label>
        <label className="block">
          <span className="text-[13px] text-ink-2">clave</span>
          <input type="password" autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} className="mt-1.5 h-12 w-full border border-line bg-white px-3.5 text-[16px] outline-none focus:border-ink" />
        </label>
        {error && <p className="text-[13px] text-clay">{error}</p>}
        <button type="submit" disabled={entrando} className="h-12 w-full bg-ink text-[13px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-olive disabled:opacity-50">
          {entrando ? 'entrando…' : 'entrar'}
        </button>
        <p className="text-[12px] text-ink-3">¿olvidaste tu clave? pídele a tu administrador web que la restablezca.</p>
      </form>
    </Pantalla>
  )
}

function SinPermiso({ email }) {
  return (
    <Pantalla>
      <p className="text-[15px] text-ink-2">
        <span className="font-medium text-ink">{email}</span> no tiene permiso para editar la web.
      </p>
      <p className="mt-2 text-[13px] text-ink-3">el correo tiene que estar en la tabla "administradores" de supabase.</p>
      <button type="button" onClick={() => supabase.auth.signOut()} className="mt-6 h-11 border border-line px-4 text-[13px] text-ink-2 hover:border-ink">
        salir
      </button>
    </Pantalla>
  )
}

function FaltaConfigurar() {
  return (
    <Pantalla>
      <p className="text-[16px] font-medium">falta conectar la base de datos.</p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
        el panel necesita supabase. sigue los pasos del README (sección "panel de administración") y completa
        <code className="mx-1 bg-paper-2 px-1">SUPABASE_URL</code> y
        <code className="mx-1 bg-paper-2 px-1">SUPABASE_ANON_KEY</code> en <code className="bg-paper-2 px-1">src/config.js</code>.
      </p>
      <Link to="/web" className="mt-6 inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-4">ver la web <ArrowUpRight size={13} /></Link>
    </Pantalla>
  )
}
