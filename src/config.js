/* ==========================================================================
   CONFIGURACIÓN GENERAL
   ========================================================================== */

/* MOSTRAR_DEMO
   false → la web publicada: sin la barra "su web · su panel · publicar".
           /#/panel abre el PANEL REAL (con login) para que Viafa edite.
   true  → modo presentación: barra de demo + panel y publicar SIMULADOS. */
export const MOSTRAR_DEMO = false

/* SUPABASE (base de datos + fotos del panel)
   Copia estos 2 datos de Supabase → Project Settings → API:
     - Project URL           → SUPABASE_URL
     - anon / public key     → SUPABASE_ANON_KEY
   La "anon key" es pública por diseño: la seguridad la dan las reglas
   de supabase/esquema.sql (solo los administradores pueden editar).
   Mientras estén vacíos, la web muestra los datos de src/data/negocio.js
   y el panel indica que falta configurar. */
export const SUPABASE_URL = ''
export const SUPABASE_ANON_KEY = ''
