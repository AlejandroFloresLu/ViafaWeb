import { categorias } from '../data/negocio'

export const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.label ?? id

/* Tarjeta de una publicación tal como se ve en la web del local.
   La usan la web y la vista previa de "publicar", así siempre coinciden. */
export function PostCard({ post, destacada = false, compacta = false }) {
  return (
    <article className={`group flex flex-col ${destacada ? 'rise' : ''}`}>
      <div className={`relative overflow-hidden bg-paper-3 ${compacta ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-[4/5]'}`}>
        {post.foto ? (
          <img
            src={post.foto}
            alt={post.titulo || 'Foto de la publicación'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-ink-3">sin foto</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink">
          {nombreCategoria(post.categoria)}
        </span>
        {destacada && (
          <span className="glow absolute right-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold tracking-wide text-paper">
            nuevo
          </span>
        )}
      </div>
      <div className={compacta ? 'pt-3' : 'pt-4'}>
        <h3 className={`font-medium leading-snug text-ink ${compacta ? 'text-[15px]' : 'text-[17px]'}`}>
          {post.titulo || 'título de tu publicación'}
        </h3>
        <p className={`mt-1.5 leading-relaxed text-ink-2 ${compacta ? 'text-[13px]' : 'text-[14px]'}`}>
          {post.texto || 'aquí va el texto que quieres que vean tus clientes.'}
        </p>
        <p className="mt-2 text-[12px] text-ink-3">
          {post.fecha}
          {post.vigencia ? ` · válido ${post.vigencia}` : ''}
        </p>
      </div>
    </article>
  )
}
