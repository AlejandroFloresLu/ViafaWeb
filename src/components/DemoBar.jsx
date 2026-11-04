import { NavLink } from 'react-router-dom'

/* Barra flotante para guiar la demo:
   1 web → 2 panel → 3 publicar */
const pasos = [
  { to: '/web', n: '1', label: 'su web' },
  { to: '/panel', n: '2', label: 'su panel', end: true },
  { to: '/panel/publicar', n: '3', label: 'publicar' },
]

export function DemoBar() {
  return (
    <nav
      aria-label="Pasos de la demo"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-ink/90 p-1 text-[13px] text-paper shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur">
        {pasos.map((p) => (
          <NavLink
            key={p.to}
            to={p.to}
            end={p.end}
            className={({ isActive }) =>
              `flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 transition-colors sm:px-3.5 ${
                isActive ? 'bg-paper text-ink' : 'text-paper/75 hover:text-paper'
              }`
            }
          >
            <span className="hidden text-[11px] font-semibold opacity-60 sm:inline">{p.n}</span>
            <span className="font-medium">{p.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
