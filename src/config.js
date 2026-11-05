/* ==========================================================================
   CONFIGURACIÓN GENERAL DE LA WEB DE VIAFA
   ========================================================================== */

/* ---------- Secciones que se muestran u ocultan ----------
   Ocultar NO borra nada: el código y los datos siguen ahí para activarlos
   más adelante cambiando el valor a true. */

// Menú "destinos ▾", página /destinos y páginas de cada destino y lugar.
export const MOSTRAR_DESTINOS = false

// Sección "lo nuevo este mes" (promociones) en el inicio y su pestaña en /admin.
export const MOSTRAR_PROMOCIONES = false

/* MOSTRAR_DEMO: solo para presentar a clientes nuevos.
   true  → barra "su web · su panel · publicar" con panel y publicar SIMULADOS.
   false → web de producción; /admin es el panel real con login. */
export const MOSTRAR_DEMO = false

/* ---------- Supabase (base de datos + fotos del panel /admin) ----------
   Copia estos 2 datos de Supabase → Project Settings → API:
     - Project URL           → SUPABASE_URL
     - anon / public key     → SUPABASE_ANON_KEY
   La "anon key" es pública por diseño: la seguridad la dan las reglas de
   supabase/esquema.sql (solo los administradores pueden editar).
   Mientras estén vacíos, la web muestra los datos de src/data/ y /admin
   avisa que falta conectar la base. */
export const SUPABASE_URL = ''
export const SUPABASE_ANON_KEY = ''

/* ---------- Login del panel /admin ----------
   El gerente entra con un USUARIO corto (ej. "admin"); internamente se
   convierte en el correo usuario@ADMIN_DOMINIO para Supabase Auth.
   CLAVE_SUFIJO se agrega a la clave antes de enviarla: Supabase exige
   mínimo 6 caracteres y así funciona una clave inicial corta como "admin".
   No es un secreto (está en el código); la seguridad la da la clave.
   ⚠️ Si cambias CLAVE_SUFIJO, todas las claves existentes dejan de servir. */
export const ADMIN_DOMINIO = 'viafaecuador.com.ec'
export const CLAVE_SUFIJO = '::viafa'

/* ---------- Límites (para que la web funcione todo el año sin sorpresas) ----------
   Mantienen la web rápida y el almacenamiento y el tráfico muy por debajo de
   los límites del plan. El panel no deja pasar de aquí y la base de datos
   también lo bloquea (supabase/esquema.sql), así que no se pueden saltar.
   Si los cambias, cambia también los números en esquema.sql. */
export const LIMITES = {
  favoritos: 6, // tarjetas de "los favoritos de quito"
  viajes: 24, //   fotos de "lugares que visitó viafa"
  clientes: 12, // opiniones de "esto dicen nuestros clientes"
}

/* Fotos: se achican y comprimen en el navegador ANTES de subirlas. */
export const FOTO = {
  ladoMaximo: 1200, //  px del lado más largo (suficiente para pantallas retina)
  pesoMaximoKB: 300, // se baja la calidad hasta quedar por debajo
  archivoMaximoMB: 25, // fotos más pesadas que esto se rechazan (antes de procesarlas)
}
