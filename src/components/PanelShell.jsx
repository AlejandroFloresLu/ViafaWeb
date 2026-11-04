import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, LayoutGrid, PenLine } from 'lucide-react'
import { negocio } from '../data/negocio'

/* Marco común del panel del dueño (resumen y publicar). */
export function PanelShell({ children }) {
  const items = [
    { to: '/panel', label: 'resumen', icon: LayoutGrid, end: true },
    { to: '/panel/publicar', label: 'publicar', icon: PenLine },
  ]
  return (
    <div className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[232px_1fr]">
      {/* Lateral (escritorio) */}
      <aside className="hidden border-r border-line lg:flex lg:flex-col lg:justify-between lg:px-5 lg:py-6 lg:sticky lg:top-0 lg:h-dvh">
        <div>
          <p className="text-[20px] font-semibold tracking-[-0.03em]">{negocio.nombre}</p>
          <p className="text-[12px] text-ink-3">panel del dueño</p>
          <nav className="mt-10 space-y-1">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 px-3 text-[14px] ${isActive ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'}`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <Link to="/web" className="flex h-10 items-center gap-3 px-3 text-[14px] text-ink-2 hover:text-ink">
              <ArrowUpRight size={16} /> ver mi web
            </Link>
          </nav>
        </div>
        <p className="text-[11px] leading-relaxed text-ink-3">demo · datos de ejemplo</p>
      </aside>

      {/* Cabecera (móvil) */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <div>
            <p className="text-[18px] font-semibold leading-tight tracking-[-0.03em]">{negocio.nombre}</p>
            <p className="text-[11px] text-ink-3">panel del dueño</p>
          </div>
          <Link to="/web" className="inline-flex items-center gap-1 text-[13px] text-ink-2">
            mi web <ArrowUpRight size={14} />
          </Link>
        </div>
        <nav className="mt-3 flex gap-6 px-5">
          {items.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `border-b-2 pb-2.5 text-[14px] ${isActive ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-3'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-w-0 px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pt-10">{children}</main>
    </div>
  )
}
