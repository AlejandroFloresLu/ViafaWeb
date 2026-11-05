# Documentación técnica · Web de Viafa Agencia de Viajes

| | |
|---|---|
| **Proyecto** | Nueva web de Viafa Agencia de Viajes (reemplaza el sitio Joomla actual) |
| **Dominio** | https://www.viafaecuador.com.ec |
| **Repositorio** | https://github.com/AlejandroFloresLu/ViafaWeb (rama `main`) |
| **Vista previa** | https://alejandrofloreslu.github.io/ViafaWeb/ |
| **Desarrollador** | Alejandro Flores (flores.alejandro10moc@gmail.com) |
| **Versión** | 1.2 · 5 de noviembre de 2026 · revisión del hosting (§14) y protecciones 365 días (§12.1) |
| **Para** | revisión técnica antes de publicar en el dominio |

---

## 1. Resumen

La web nueva es una **aplicación estática de una sola página** (React compilado a un único `index.html`).
No necesita PHP ni MySQL en el hosting: se sube por FTP a `public_html` del cPanel actual.

El contenido que el gerente cambia seguido (fotos de favoritos, collage de viajes, opiniones de clientes y horario)
vive en **Supabase** (Postgres + almacenamiento de fotos + autenticación) y se edita desde un panel en **`/admin`**.

Los cambios de código (diseño, secciones nuevas) los hace el desarrollador en GitHub; al subirlos a `main`,
**GitHub Actions** compila y publica automáticamente en el hosting.

```
            ┌──────────────── navegador del visitante ────────────────┐
            │  www.viafaecuador.com.ec  (index.html estático, ~320 KB) │
            └───────────┬───────────────────────────┬─────────────────┘
                        │ lee contenido visible     │ fotos
                        ▼                           ▼
                 Supabase (REST + RLS)      Supabase Storage "fotos"  /  Unsplash
                        ▲
                        │ crear / editar / borrar (solo con sesión de administrador)
            ┌───────────┴───────────┐
            │  /admin  (gerente)    │
            └───────────────────────┘

   Desarrollador ── git push main ──► GitHub Actions ── build + FTPS ──► cPanel public_html
```

---

## 2. Roles

| Rol | Quién | Qué puede hacer | Dónde |
|---|---|---|---|
| **Desarrollador** | Alejandro (cuenta GitHub vinculada al repo) | Cambios grandes: diseño, secciones, textos fijos, activar/ocultar secciones, despliegues, base de datos | GitHub + Supabase (dashboard) |
| **Gerente** | Personal de Viafa | Crear / modificar / ocultar / reordenar / eliminar las tarjetas de **favoritos de Quito**, fotos de **lugares que visitó Viafa**, **opiniones de clientes** y el **horario**. Cambiar su clave. **No** cambia el diseño. | `viafaecuador.com.ec/admin` |
| **Visitante** | Público | Ver la web; los botones "cotizar" abren WhatsApp | La web |

---

## 3. Tecnología

| Capa | Tecnología | Notas |
|---|---|---|
| UI | React 18, react-router-dom 6 (`HashRouter`) | Rutas con `#` → no requiere reglas de reescritura en el servidor |
| Estilos | Tailwind CSS 4 (tokens en `src/index.css`) | Colores de marca: azul rey `#0A0A98`, naranja `#F7941D`, azul mar `#0A6898` |
| Iconos | lucide-react | |
| Build | Vite 6 + `vite-plugin-singlefile` | Todo (JS, CSS, logo) queda dentro de un solo `index.html` |
| Datos / auth / fotos | Supabase (`@supabase/supabase-js` 2) | Plan gratuito suficiente para este volumen |
| CI/CD | GitHub Actions + `SamKirkland/FTP-Deploy-Action@v4.3.5` (FTPS) | Despliegue incremental al cPanel |
| Hosting | cPanel actual (Interserver, LiteSpeed) | Solo sirve archivos estáticos |

---

## 4. Estructura del repositorio

```
app.html                 entrada de Vite (el código fuente); NO editar index.html a mano
index.html               build listo (lo sirve GitHub Pages y es lo que se sube al hosting)
viafa-demo.html          copia del build para abrir con doble clic
admin/index.html         redirección  /admin  →  /#/admin   (copiada desde public/admin)
public/robots.txt        bloquea /admin/ a buscadores
pdf/                     fichas PDF de destinos (sección oculta por ahora)
supabase/esquema.sql     tablas, seguridad (RLS), bucket de fotos y datos iniciales
.github/workflows/desplegar.yml   CI/CD al hosting
.github/workflows/mantener-activo.yml   revisión semanal (base activa + web responde)
docs/                    esta documentación
src/
  config.js              banderas de secciones + conexión Supabase + login
  App.jsx                rutas
  data/negocio.js        datos fijos y datos de respaldo (fallback)
  data/sitios.js         lugares de cada destino (sección oculta)
  lib/contenido.jsx      carga el contenido de Supabase; si falla, usa src/data
  lib/supabase.js        cliente Supabase + subida de fotos
  lib/utils.js           precios, WhatsApp, Google Maps, horario, redimensionar imágenes
  lib/navegacion.js      desplazamiento a secciones
  components/            SiteNav (menú), SiteFooter, PostCard, DemoBar
  views/Web.jsx          página de inicio
  views/Destinos.jsx, Destino.jsx   páginas de destinos (ocultas)
  views/admin/           panel /admin
    Admin.jsx            login, permisos y navegación del panel
    AdminColeccion.jsx   CRUD genérico: favoritos, lugares visitados, clientes
    AdminHorario.jsx     horario semanal
    AdminCuenta.jsx      cambio de clave
    AdminPromos.jsx, AdminDestinos.jsx   (ocultos por bandera)
  views/Panel.jsx, Publicar.jsx      panel SIMULADO solo para modo demo
```

---

## 5. Funcionalidad

### 5.1 Web pública (`/` → `/#/web`)

1. Portada con "cotizar gratis" por WhatsApp.
2. Valores ("¿por qué confiar en nosotros?").
3. **Los favoritos de Quito** — tarjetas editables desde el panel. Clic → WhatsApp con el destino.
4. Banda "¿no sabes a dónde ir?".
5. Nosotros.
6. **Lugares que visitó Viafa** — collage tipo *masonry* (2 / 3 / 4 columnas según pantalla); funciona con cualquier cantidad de fotos.
7. **Esto dicen nuestros clientes** — collage de foto + opinión + nombre + destino.
8. Visítanos: calificación de Google (4.3 · 24 reseñas), horario con "abierto ahora", mapa de Google y "cómo llegar".
9. Pie de página con contacto y redes.

### 5.2 Secciones ocultas (código listo, apagado por bandera)

En `src/config.js`:

| Bandera | Valor | Efecto si se pone en `true` |
|---|---|---|
| `MOSTRAR_DESTINOS` | `false` | Menú "destinos ▾" por región, `/destinos`, páginas de destino (banner, precio, PDF) y de cada lugar; pestaña "destinos" en el panel |
| `MOSTRAR_PROMOCIONES` | `false` | Sección "lo nuevo este mes" y pestaña "promociones" en el panel |
| `MOSTRAR_DEMO` | `false` | Modo presentación con panel simulado. **Debe estar en `false` en producción** |

Cuando las banderas están en `false`, las rutas correspondientes **no se registran** (redirigen al inicio) y los enlaces no se muestran.

### 5.3 Panel del gerente (`/admin`)

- **Login** con usuario y clave (ver §7).
- **Favoritos**: foto, destino, región, detalle, precio "desde".
- **Lugares visitados**: foto + nombre del lugar (opcional).
- **Clientes**: foto, nombre, a dónde viajó, opinión.
- En las tres: **nuevo · modificar · subir/bajar (orden) · ocultar/mostrar · eliminar** (con confirmación).
- **Horario**: apertura/cierre por día y días cerrados.
- **Mi cuenta**: cambio de clave (mínimo 8 caracteres). Mientras se use la clave inicial aparece un aviso en todas las pantallas.
- Las fotos se redimensionan en el navegador (máx. 1600 px, JPEG) antes de subirlas → cargas rápidas y poco espacio.
- Los cambios se ven en la web al recargarla (la web consulta Supabase en cada visita).

---

## 6. Modelo de datos (Supabase / Postgres)

Definido en `supabase/esquema.sql` (idempotente: se puede volver a correr).

| Tabla | Columnas principales | Uso |
|---|---|---|
| `administradores` | `email` (PK) | Lista blanca de quién puede editar |
| `favoritos` | `id uuid`, `nombre`, `region`, `detalle`, `precio numeric`, `foto`, `orden`, `visible`, `creado_en` | Los favoritos de Quito |
| `viajes_galeria` | `id`, `lugar`, `foto`, `orden`, `visible`, `creado_en` | Lugares que visitó Viafa |
| `testimonios` | `id`, `autor`, `viaje`, `texto`, `foto`, `orden`, `visible`, `creado_en` | Esto dicen nuestros clientes |
| `horario` | `dia_idx` (0 = lunes, PK), `dia`, `abre`, `cierra`, `cerrado` | Horario semanal |
| `destinos` | `slug`, `nombre`, `region`, `precio`, `foto`, `galeria[]`, `incluye[]`, `pdf`, … | Sección oculta |
| `promociones` | `categoria`, `titulo`, `texto`, `foto`, `vigencia`, … | Sección oculta |

**Storage:** bucket público `fotos` con carpetas `favoritos/`, `viajes/`, `clientes/` (nombres de archivo aleatorios con marca de tiempo).

**Función** `es_admin()` (`SECURITY DEFINER`): devuelve `true` si el correo del JWT está en `administradores`.

---

## 7. Seguridad

### 7.1 Control de acceso (lo hace la base, no la web)

Row Level Security activado en todas las tablas:

- **Lectura pública** solo de filas con `visible = true` (el administrador ve todas).
- **Escritura** (`insert/update/delete`) solo si `es_admin()` es verdadero.
- **Storage**: cualquiera puede ver fotos; solo administradores suben, cambian o borran.

Por eso la `SUPABASE_ANON_KEY` que va dentro del `index.html` **es pública por diseño** (así funciona Supabase):
sin una sesión de un correo listado en `administradores`, esa llave solo permite leer lo visible.
La `service_role key` de Supabase **nunca** se pone en el código.

### 7.2 Login "usuario + clave"

Se pidió entrar como **`admin` / `admin`** al inicio, con opción de cambiarla. Supabase Auth trabaja con correo y exige
claves de 6+ caracteres, así que el panel hace dos transformaciones (en `src/config.js`):

| El gerente escribe | Se envía a Supabase |
|---|---|
| usuario `admin` | correo `admin@viafaecuador.com.ec` (`ADMIN_DOMINIO`) |
| clave `admin` | `admin::viafa` (se agrega `CLAVE_SUFIJO`) |

- El correo **no necesita existir** como buzón; es solo un identificador.
- El sufijo no es un secreto (está en el código); su único fin es cumplir el mínimo de longitud. La seguridad la da la clave elegida.
- Al cambiar la clave desde "mi cuenta" se guarda `clave + sufijo` y se marca `user_metadata.clave_inicial = false`, lo que quita el aviso.
- ⚠️ Si alguien cambia `CLAVE_SUFIJO`, todas las claves dejan de funcionar (habría que restablecerlas).

### 7.3 Recomendaciones (checklist)

- [ ] **Cambiar `admin/admin` el mismo día** que se publica (el panel lo exige con un aviso).
- [ ] En Supabase: **desactivar "Allow new users to sign up"** (nadie puede crearse cuenta).
- [ ] Activar **2FA** en GitHub, Supabase y cPanel.
- [ ] Las credenciales FTP solo en **GitHub Secrets**; nunca en el repo ni por chat.
- [ ] Usar una **cuenta FTP dedicada** que solo vea `public_html`.
- [ ] El dominio **no se transfiere ni se toca** (titular: Santiago Hidalgo; registrador: Dominios Ecuador; vence 2028-06-16; bloqueo de transferencia activo).
- [ ] `robots.txt` excluye `/admin/` y la página del panel lleva `noindex`.
- [ ] Opcional: hacer el repositorio **privado** (ver §9.4).

---

## 8. Configuración de Supabase (una sola vez, ~15 min)

1. https://supabase.com → **New project** (nombre `viafa`, región *South America (São Paulo)*). Guardar la clave de la base.
2. **SQL Editor → New query** → pegar `supabase/esquema.sql` completo → **Run**.
   Crea tablas, RLS, bucket `fotos` y carga los datos actuales de la web.
3. **Authentication → Users → Add user → Create new user**
   - Email: `admin@viafaecuador.com.ec`
   - Password: **`admin::viafa`** (equivale a la clave `admin` del panel)
   - Marcar **Auto Confirm User**.
4. **Authentication → Sign In / Providers → Email**: desactivar **Allow new users to sign up**.
5. **Project Settings → API**: copiar **Project URL** y **anon public key** a `src/config.js`
   (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
6. `npm run build`, commit y push a `main`.

**Agregar otro usuario:** crearlo en Authentication (correo `nombre@viafaecuador.com.ec`, clave `<clave>::viafa`)
y agregar su correo en la tabla `administradores`. Entra con usuario `nombre`.

**Restablecer una clave olvidada:** Authentication → Users → el usuario → cambiar password a `<nueva>::viafa`
(o usar el SQL Editor). El buzón de correo no es necesario.

---

## 9. GitHub y despliegue

### 9.1 Flujo de trabajo

```bash
git clone https://github.com/AlejandroFloresLu/ViafaWeb.git
cd ViafaWeb
npm install
npm run dev          # http://localhost:5173/app.html
# … cambios …
npm run build        # genera index.html, viafa-demo.html y admin/index.html
git add -A && git commit -m "descripción" && git push origin main
```

`index.html` es un **artefacto de build versionado** (lo usa GitHub Pages). Siempre correr `npm run build` antes de hacer commit.

### 9.2 CI/CD (`.github/workflows/desplegar.yml`)

- Se dispara en cada **push a `main`** o manualmente (**Actions → Run workflow**).
- Si no existen los secretos FTP, termina sin hacer nada (seguro para el repo mientras se prepara).
- Pasos: `npm ci` → `npm run build` → arma la carpeta `publicar/` con `index.html`, `robots.txt`, `admin/index.html` y `pdf/` → sube por **FTPS** a la raíz de la cuenta FTP (`public_html`).
- La acción guarda un `.ftp-deploy-sync-state.json` en el servidor para subir solo lo que cambió.

### 9.3 Secretos (Repo → Settings → Secrets and variables → Actions)

| Secreto | Valor |
|---|---|
| `FTP_SERVER` | `ftp.viafaecuador.com.ec` |
| `FTP_USERNAME` | usuario FTP dedicado (ej. `web@viafaecuador.com.ec`) |
| `FTP_PASSWORD` | su clave |

Si FTPS falla al conectar, cambiar `protocol: ftps` por `protocol: ftp` en el workflow.

### 9.4 Repositorio público o privado

Hoy el repo es **público**, porque GitHub Pages gratis (la vista previa) lo requiere. No contiene secretos: la llave anon es pública por diseño y las credenciales FTP están en Secrets.
Si se prefiere **privado**: el despliegue FTP sigue funcionando igual; solo se pierde la vista previa en GitHub Pages (salvo con un plan de pago).

---

## 10. Migración desde Joomla (paso a paso)

**Tiempo estimado:** 30–45 min. **Ventana sugerida:** fuera del horario de atención.
**Requisitos:** acceso a cPanel (https://cpanel.viafaecuador.com.ec), base de datos lista (§8 o §14.4), secretos en GitHub (§9.3).

> Atajo para el respaldo: **JetBackup 5** (cPanel → Archivos) ya tiene respaldos automáticos; antes de empezar se puede crear uno con *Create Backup On Demand* y descargarlo.

| # | Paso | Detalle | Verificación |
|---|---|---|---|
| 1 | **Respaldo completo** | cPanel → *Respaldo / Backup* → descargar respaldo del directorio de inicio **y** la base MySQL de Joomla | Archivos `.tar.gz` y `.sql.gz` guardados fuera del servidor |
| 2 | **Prueba previa** | Revisar la web en GitHub Pages y `/#/admin` con Supabase real | Login funciona, se puede subir una foto |
| 3 | **Apartar Joomla** | *Administrador de archivos* → crear `joomla-viejo` **fuera** de `public_html` → mover todo el contenido de `public_html` (excepto `.well-known` y `cgi-bin`) | `public_html` vacía; Joomla intacto en `joomla-viejo` |
| 4 | **Cuenta FTP** | cPanel → *Cuentas FTP* → usuario `web`, directorio **`public_html`** | Conecta con un cliente FTP y ve `public_html` como raíz |
| 5 | **Secretos** | Cargar `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` | — |
| 6 | **Desplegar** | GitHub → Actions → *Desplegar en viafaecuador.com.ec* → **Run workflow** | Job en verde |
| 7 | **Comprobar** | Abrir `https://www.viafaecuador.com.ec`, `/admin`, celular, enlaces de WhatsApp y mapa | Ver §11 |
| 8 | **Clave** | Entrar a `/admin` con `admin/admin` y cambiarla | El aviso amarillo desaparece |
| 9 | **SSL** | cPanel → *SSL/TLS Status* → AutoSSL activo para `viafaecuador.com.ec` y `www` | Candado en el navegador |

**Notas:**
- El `.htaccess` de Joomla se va con el paso 3. La web nueva no lo necesita (rutas con `#`).
  Si se quiere forzar HTTPS o `www`, se puede añadir un `.htaccess` mínimo después.
- Las URLs viejas de Joomla (ej. `/index.php/...`) mostrarán 404 del servidor. Opcional: `.htaccess` con `ErrorDocument 404 /index.html` para mandar todo al inicio.
- **Correo:** no se toca. Los buzones (webmail) y los registros MX siguen igual; la migración solo cambia archivos de `public_html`.
- **Dominio y DNS:** no se tocan.

### 10.0 Cuidado con el correo (mismo cPanel)

Este cPanel también maneja **11 cuentas de correo** de Viafa (1,25 GB). La migración solo toca `public_html`; el correo vive en otra carpeta (`mail/`) y en los registros DNS. Para no afectarlo:

- **No mover ni borrar nada fuera de `public_html`** (en especial `mail/`, `etc/`, `ssl/`). `joomla-viejo` se crea al lado, sin tocar lo demás.
- **No tocar** *Zone Editor* (DNS), registros **MX / SPF / DKIM**, *Email Routing* ni las cuentas de correo.
- Dejar `public_html/.well-known` en su lugar (lo usa AutoSSL para el certificado).
- **No restaurar un respaldo completo** de JetBackup para revertir la web: también restauraría el correo y se perderían los mensajes recibidos después de ese respaldo. Para revertir, usar solo *Home Directory* → `public_html`, o el plan de reversa de abajo.
- La cuenta FTP de despliegue apunta **solo** a `public_html`, así que GitHub no puede llegar al correo.
- Después de publicar, enviar y recibir un correo de prueba (webmail).

### 10.1 Plan de reversa (rollback, ~5 min)

1. Administrador de archivos → vaciar `public_html` (dejar `.well-known` y `cgi-bin`).
2. Mover el contenido de `joomla-viejo` de vuelta a `public_html`.
3. Desactivar el workflow (o borrar el secreto `FTP_SERVER`) para que no vuelva a subir.

Conservar `joomla-viejo` y los respaldos al menos 1–2 meses antes de borrarlos.

---

## 11. Pruebas realizadas

Pruebas automatizadas de extremo a extremo con Playwright contra un **Supabase simulado** (REST, Auth y Storage en memoria):

| Caso | Resultado |
|---|---|
| Inicio sin promociones ni menú de destinos; secciones favoritos/viajes/clientes presentes | ✅ |
| `/#/destinos` redirige al inicio (oculto); `/#/panel` redirige a `/#/admin` | ✅ |
| Login con clave incorrecta muestra error; `admin/admin` entra | ✅ |
| Aviso de clave inicial visible y desaparece al cambiarla | ✅ |
| Cambio de clave: rechaza < 8 caracteres; envía `nueva::viafa` | ✅ |
| Favoritos: crear con foto, modificar precio, reordenar, ocultar | ✅ |
| Lugares visitados: eliminar con confirmación | ✅ |
| Clientes: crear con foto | ✅ |
| La web refleja orden, precios, ocultos y nuevos | ✅ |
| Celular 390 px sin desplazamiento horizontal | ✅ |
| `supabase/esquema.sql` corre en Postgres (PGlite) **dos veces seguidas** sin errores (idempotente) | ✅ |
| Base: el trigger bloquea el elemento que pasa el máximo; el `check` bloquea un texto de 300 caracteres | ✅ |
| Panel: al llegar al máximo se desactiva "nuevo" y muestra "4 de 4 usados"; al eliminar se reactiva | ✅ |
| Panel: reemplazar o eliminar borra la foto vieja del almacenamiento; fotos externas no se tocan | ✅ |

**Pendiente de probar con el Supabase real** (después de §8): login, subida de fotos al bucket, RLS (intentar editar sin sesión debe fallar).
Prueba rápida de RLS desde la consola del navegador en la web pública:
```js
await fetch(SUPABASE_URL + '/rest/v1/favoritos', { method: 'POST', headers: { apikey: ANON, Authorization: 'Bearer ' + ANON, 'Content-Type': 'application/json' }, body: '{"nombre":"x"}' })
// debe responder 401/403 (violación de RLS)
```

### Checklist después de publicar
- [ ] Inicio carga en celular y computadora
- [ ] "cotizar" abre WhatsApp al 096 972 5577 con el texto del destino
- [ ] Mapa y "cómo llegar" apuntan a Av. Quitumbe Ñan y Av. Morán Valverde
- [ ] `/admin` muestra el login; cambiar clave
- [ ] Subir una foto de prueba y verla en la web; luego borrarla
- [ ] `https://` con candado

---

## 12. Riesgos y límites conocidos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Supabase gratis **pausa** el proyecto tras ~7 días sin actividad | El panel no funciona hasta reactivarlo | Revisión semanal automática (§12.1). Si aun así se pausa, la web **sigue mostrando** los datos de respaldo y se reactiva con un clic |
| Datos de respaldo desactualizados | Si Supabase cae, se ven los datos del código | Actualizar `src/data/negocio.js` de vez en cuando |
| Una sola página (SPA) con rutas `#` | SEO limitado para páginas internas | Hoy solo hay inicio; el título y la descripción están en `app.html`. Para SEO por destino se migraría a rutas reales + prerender |
| Fotos de ejemplo de Unsplash | No son fotos propias | El gerente las reemplaza desde el panel |
| Calificación de Google (4.3 / 24) fija en el código | Puede desactualizarse | Actualizar en `negocio.js` o integrar Places API más adelante |
| Clave inicial débil | Acceso no autorizado | Aviso obligatorio + cambiar el día 1 |
| Fotos de clientes | Privacidad | Pedir permiso antes de publicar (indicado en el panel) |

### 12.1 Protecciones para funcionar los 365 días

Mecanismos que ya están en el código para que la web no se llene, no se ponga lenta y no se caiga
aunque nadie la revise:

| Protección | Dónde | Qué evita |
|---|---|---|
| **Máximo de elementos:** 6 favoritos · 24 fotos de viajes · 12 opiniones | Panel (`LIMITES` en `src/config.js`) **y** base de datos (trigger `limitar_filas`) | Que se suban fotos sin control y la web se vuelva pesada. Al llegar al máximo, el botón "nuevo" se desactiva y el panel muestra "X de Y usados" |
| **Fotos comprimidas antes de subir:** lado máximo 1200 px, peso ≤ 300 KB (baja la calidad hasta lograrlo) | Navegador del gerente (`leerImagen`) | Fotos de 5–10 MB del celular. 42 fotos × 300 KB ≈ **13 MB en total** |
| **Solo JPG, PNG o WEBP, de hasta 25 MB** | Panel | Archivos que no son fotos o que el celular no puede procesar |
| **Tope de 2 MB por archivo y tipos permitidos** | Bucket `fotos` de Supabase | Que alguien suba archivos grandes saltándose el panel |
| **Borrado de fotos huérfanas:** al eliminar un elemento, al reemplazar su foto o al cancelar un formulario | Panel (`borrarFoto`) | Que el almacenamiento se llene de fotos que ya no se usan |
| **Largo máximo de textos** (nombre 40, detalle 80, opinión 280, etc.) con contador | Panel **y** base de datos (`check`) | Textos larguísimos que rompen el diseño |
| **La web nunca muestra más del máximo** | `Web.jsx` | Aunque la base tuviera más filas, el diseño no se rompe |
| **Foto rota → se oculta** y queda el fondo de color | `Web.jsx` (`sinFoto`) | Que aparezca el ícono de imagen rota |
| **Si la base no responde, se ven los datos de respaldo** | `lib/contenido.jsx` | Que la web quede vacía o con error si Supabase se cae |
| **Revisión semanal automática** (lunes): consulta la base y comprueba que la web responda | `.github/workflows/mantener-activo.yml` | Que Supabase pause el proyecto por inactividad. Si algo falla, GitHub envía un correo |
| **Clave inicial obligatoria de cambiar** | Panel | Acceso con `admin/admin` |

Si se quiere cambiar un máximo, se cambia en **los dos lugares**: `LIMITES` en `src/config.js` y el número del
trigger en `supabase/esquema.sql` (y se vuelve a correr esa parte en el SQL Editor).

**Revisión semanal: respaldo.** GitHub desactiva los flujos programados de un repo público tras 60 días sin commits
(avisa por correo; se reactiva con un clic en *Actions*). Como respaldo se puede crear en cPanel →
*Trabajos de cron* una tarea semanal que haga lo mismo:

```
17 8 * * 1  curl -s "https://<proyecto>.supabase.co/rest/v1/horario?select=dia_idx&limit=1" -H "apikey: <anon-key>" > /dev/null
```

**Consumo estimado con estos límites** (plan gratuito de Supabase; confirmar las cifras vigentes en supabase.com/pricing):

| Recurso | Límite del plan gratuito | Uso esperado |
|---|---|---|
| Almacenamiento de archivos | 1 GB | ~13 MB (1 %) |
| Base de datos | 500 MB | < 1 MB |
| Transferencia de fotos | ~5 GB/mes | Una visita que vea **todas** las fotos baja ~8 MB; las fotos cargan solo al acercarse (lazy) y el navegador las guarda en caché un año. Alcanza para unas **600–1.500 visitas completas al mes**. Hoy el sitio usa 177 MB/mes de transferencia en total |

Si el tráfico crece mucho, la salida natural es guardar las fotos en el hosting (200 GB/mes de transferencia, §14),
que es lo que se haría si la base pasa a cPanel (§14.4).

---

## 13. Mantenimiento

| Tarea | Quién | Cómo |
|---|---|---|
| Cambiar fotos, favoritos, opiniones, horario | Gerente | `/admin` |
| Activar destinos o promociones | Desarrollador | Bandera en `src/config.js` → build → push |
| Cambiar textos fijos, teléfonos, diseño | Desarrollador | `src/data/negocio.js`, `src/views/Web.jsx`, `src/index.css` |
| Nuevo usuario del panel / clave olvidada | Desarrollador | Supabase (§8) |
| Actualizar dependencias | Desarrollador | `npm outdated` / `npm update`, probar, build, push (cada 3–6 meses) |
| Respaldo de contenido | Desarrollador | Supabase → Database → Backups (Pro) o exportar tablas a CSV mensualmente |
| Revisar correo de GitHub por fallas de "Revisión semanal" | Desarrollador | Si llega, abrir Actions y ver qué falló |
| Cambiar los máximos de fotos | Desarrollador | `LIMITES` en `src/config.js` + trigger en `esquema.sql` |

---

## 14. Hosting (cPanel) — revisión del 5 de noviembre de 2026

Revisión **solo de lectura** del cPanel (no se cambió nada). Las credenciales de cPanel **no** se guardan en este
documento ni en el repositorio (el repo es público): las custodia Viafa.

### 14.1 Datos del servidor

| | |
|---|---|
| Panel | https://cpanel.viafaecuador.com.ec (cPanel, tema Jupiter, CloudLinux) |
| Servidor | `kondor.globalhost1.com` · IP compartida 74.50.95.214 · Interserver (NJ, EE. UU.) · LiteSpeed |
| Directorio principal | `/home/<usuario-cpanel>` → web en `public_html/` |
| SSL | **Activo** para `viafaecuador.com.ec` |
| PHP en uso | **7.4** (definido en *Seleccionar Versión PHP* de CloudLinux; está obsoleto). MultiPHP muestra 8.1 y hay disponibles **8.0 a 8.4** |
| Extensiones PHP | `pdo_mysql`, `mysqli`, `gd`, `imagick`, `fileinfo`, `json`, `mbstring`, `openssl`, `session`, `zip` disponibles |
| Herramientas útiles | phpMyAdmin, **Git™ Version Control**, **JetBackup 5**, Trabajos de cron, Acceso SSH, ModSecurity, Imunify360, LiteSpeed Cache |
| FTP | `ftp.viafaecuador.com.ec`, FTPS explícito. Cuentas existentes: `ale@` → `/ale` y `viafa@` → `/viafa` (ninguna apunta a `public_html`); se creará una dedicada |
| Respaldos | JetBackup 5 con **19 respaldos** automáticos disponibles (1,4 GB): completos, archivos, bases, correo, DNS, SSL |
| Correo | 11 cuentas y 6 reenviadores. **No se tocan** en la migración |

### 14.2 Capacidad (uso actual vs. límite)

| Recurso | Usado | Límite | Uso | ¿Alcanza? |
|---|---|---|---|---|
| Disco | 1,38 GB | 20 GB | 7 % | ✅ Sobra. El correo ocupa 1,25 GB; la web Joomla 282 MB |
| Inodos (archivos) | 34.734 | 350.000 | 10 % | ✅ |
| Ancho de banda (mes) | 177 MB | 200 GB | 0,1 % | ✅ |
| Memoria física | 4,5 MB | 2 GB | 0,2 % | ✅ |
| Procesos / entrantes | 1 / 1 | 35 / 20 | < 5 % | ✅ |
| CPU · IOPS · I/O | 0 % | 100 % · 1.024 · 3 MB/s | 0 % | ✅ |
| Espacio de bases de datos | 27 MB | 18,65 GB | 0,1 % | ✅ |
| **Cantidad de bases MySQL** | **2** | **2** | **100 %** | ⚠️ **No se puede crear otra** |
| Cuentas FTP, correo, subdominios | — | ilimitado | — | ✅ |

**Costos:** estos límites son los **incluidos en el plan contratado** (se leen del propio cPanel). En este tipo de hosting
compartido (CloudLinux) normalmente no se cobra por uso: si se llega a un límite, el servidor **frena** la cuenta
(o, con el ancho de banda, puede suspenderla) en vez de facturar extra. Aun así, **confirmar con quien factura el hosting**
el precio del plan, la fecha de renovación y si hay cargos por exceso. La web nueva consume **menos** que Joomla
(es estática: no ejecuta PHP ni consulta MySQL en cada visita).

**Conclusión:** el hosting tiene espacio y recursos de sobra para la web nueva. La web compilada pesa ~0,3 MB y,
aun con cientos de fotos del panel (~200–400 KB cada una, ya redimensionadas), se usarían pocos cientos de MB.
El único límite es la **cantidad de bases de datos**.

### 14.3 Bases de datos existentes

| Base | Tamaño | Uso probable |
|---|---|---|
| `‹usuario›_2019` | 27 MB | Base del sitio **Joomla actual**. No tocar hasta terminar y verificar la migración |
| `‹usuario›_2024` | **0 bytes (vacía)** | Sin uso aparente |

Usuarios MySQL existentes: `‹usuario›_2019`, `‹usuario›_2024`, `‹usuario›_joom413`. Los usuarios no cuentan para el límite.

### 14.4 Si la base de datos va en cPanel (en lugar de Supabase)

Como no se puede crear una tercera base, hay tres caminos (de más a menos recomendado):

1. **Usar `‹usuario›_2024`**, que está vacía, con un **usuario MySQL nuevo** solo para la web
   (privilegios: SELECT, INSERT, UPDATE, DELETE). Antes, confirmar con Viafa que nadie la usa.
2. **Después de la migración**, respaldar y liberar `‹usuario›_2019` (Joomla) para dejar un cupo libre.
   Recién cuando la web nueva lleve 1–2 meses estable.
3. Pedir a Interserver que **aumente el límite** de bases.

Consideraciones si se elige cPanel:
- Subir PHP a **8.2 o 8.3** en *Seleccionar Versión PHP* después de apartar Joomla: la versión 7.4 está obsoleta,
  y el Joomla actual podría no funcionar con 8.x, así que conviene cambiarla solo una vez que Joomla ya no esté en uso.
- Las fotos del panel irían en `public_html/fotos/`. El despliegue por FTP **no debe borrar esa carpeta**:
  la acción solo elimina archivos que ella misma subió, pero se excluirá `fotos/**` explícitamente.
- La vista previa de GitHub Pages solo mostraría datos de ejemplo (GitHub no ejecuta PHP).

---

## 15. Dominio (referencia)

| | |
|---|---|
| Titular | Santiago Hidalgo |
| Contacto administrativo | Alejandra Cuesta (Cuesta Comunicación Total) |
| Registrador | Dominios Ecuador |
| Vence | 2028-06-16 · bloqueo de transferencia activo |
| Sitio anterior | Joomla (PHP 7.4) |
| Webmail | https://webmail.viafaecuador.com.ec (no se modifica) |
