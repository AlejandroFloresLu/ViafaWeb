# Web de Viafa Agencia de Viajes

Nueva web de **viafaecuador.com.ec** con panel de administración para el gerente.
Colores de la marca: azul rey `#0A0A98`, naranja `#F7941D` y azul mar `#0A6898`.

📄 **Documentación técnica completa (arquitectura, seguridad, base de datos en Supabase, GitHub y migración desde Joomla):**
[`docs/Viafa_Documentacion_Tecnica.docx`](docs/Viafa_Documentacion_Tecnica.docx) (Word)

- Vista previa: https://alejandrofloreslu.github.io/ViafaWeb/
- Panel: `/admin` (en la vista previa: https://alejandrofloreslu.github.io/ViafaWeb/admin/)

## Qué tiene

**Inicio:** portada · por qué confiar · **los favoritos de Quito** · nosotros · **lugares que visitó Viafa** (collage) ·
**esto dicen nuestros clientes** (collage) · Google, horario, mapa y cómo llegar.

**Panel `/admin`** (usuario `admin`, clave inicial `admin`, se cambia en "mi cuenta"):
crear, modificar, ordenar, ocultar y eliminar favoritos, fotos de viajes y opiniones de clientes; horario.

**Ocultos por ahora** (se activan en `src/config.js`): destinos por región con página de cada destino (`MOSTRAR_DESTINOS`)
y promociones (`MOSTRAR_PROMOCIONES`).

## Roles
- **Desarrollador** (GitHub): cambios grandes de diseño o secciones → push a `main` → se publica solo.
- **Gerente** (`/admin`): fotos y textos de las secciones editables. No toca el diseño.

## Desarrollo
```bash
npm install
npm run dev      # http://localhost:5173/app.html
npm run build    # genera index.html (no editarlo a mano), viafa-demo.html y admin/index.html
```
El código fuente entra por `app.html`. Siempre `npm run build` antes de hacer commit.

| Archivo | Para qué |
|---|---|
| `src/config.js` | Mostrar/ocultar secciones, conexión a Supabase, login |
| `src/data/negocio.js` | Datos fijos (contacto, dirección) y datos de respaldo |
| `src/views/Web.jsx` | Página de inicio |
| `src/views/admin/` | Panel |
| `supabase/esquema.sql` | Base de datos, seguridad y datos iniciales |
| `.github/workflows/desplegar.yml` | Publicación automática por FTP al cPanel |

## Puesta en producción (resumen)
1. **Supabase:** correr `supabase/esquema.sql`, crear el usuario `admin@viafaecuador.com.ec` con clave `admin::viafa`,
   desactivar registros nuevos y pegar URL + anon key en `src/config.js`.
2. **cPanel:** respaldo completo, mover Joomla a `joomla-viejo` (fuera de `public_html`), crear cuenta FTP a `public_html`.
3. **GitHub:** secretos `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` → Actions → *Run workflow*.
4. Entrar a `/admin` y **cambiar la clave**.

Los pasos detallados, verificación y plan de reversa están en la [documentación técnica](docs/Viafa_Documentacion_Tecnica.docx).

## Modo demo
`MOSTRAR_DEMO = true` en `src/config.js` muestra la barra "su web · su panel · publicar" con un panel simulado
(para presentar a clientes). En producción debe quedar en `false`.
