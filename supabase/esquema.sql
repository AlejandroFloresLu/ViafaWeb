-- ============================================================================
--  VIAFA · BASE DE DATOS DEL PANEL
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Se puede correr una sola vez (crea tablas, seguridad, fotos y datos).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. QUIÉN PUEDE EDITAR
--    Solo los correos de esta tabla pueden cambiar contenido.
--    👉 Cambia el correo de abajo por el de Santiago (y agrega más si hace falta).
-- ---------------------------------------------------------------------------
create table if not exists public.administradores (
  email text primary key
);

insert into public.administradores (email) values
  ('santiago@viafaecuador.com.ec')   -- 👈 CAMBIAR por el correo real
on conflict do nothing;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.administradores
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. TABLAS DE CONTENIDO
-- ---------------------------------------------------------------------------
create table if not exists public.destinos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  region      text not null default 'caribe',
  detalle     text not null default '',
  precio      numeric(10,2) not null default 0,
  foto        text not null default '',
  mas_vendido boolean not null default false,
  visible     boolean not null default true,
  orden       int not null default 0,
  creado_en   timestamptz not null default now()
);

-- Columnas de la página de cada destino (se pueden agregar sobre una base ya creada)
alter table public.destinos add column if not exists slug    text unique;      -- dirección: /destinos/<slug>
alter table public.destinos add column if not exists noches  int not null default 0;
alter table public.destinos add column if not exists incluye text[] not null default '{}';
alter table public.destinos add column if not exists galeria text[] not null default '{}';
alter table public.destinos add column if not exists pdf     text not null default '';

create table if not exists public.promociones (
  id         uuid primary key default gen_random_uuid(),
  categoria  text not null default 'promo',   -- promo | nuevo | evento | aviso
  titulo     text not null,
  texto      text not null default '',
  foto       text not null default '',
  vigencia   text not null default 'esta semana',
  visible    boolean not null default true,
  creado_en  timestamptz not null default now()
);

create table if not exists public.horario (
  dia_idx  int primary key check (dia_idx between 0 and 6),  -- 0 = lunes
  dia      text not null,
  abre     text not null default '10:00',
  cierra   text not null default '20:00',
  cerrado  boolean not null default false
);

-- ---------------------------------------------------------------------------
-- 3. SEGURIDAD (Row Level Security)
--    Todos pueden LEER lo visible. Solo los administradores pueden ESCRIBIR.
-- ---------------------------------------------------------------------------
alter table public.administradores enable row level security;
alter table public.destinos        enable row level security;
alter table public.promociones     enable row level security;
alter table public.horario         enable row level security;

drop policy if exists "admins se ven" on public.administradores;
create policy "admins se ven" on public.administradores
  for select using (public.es_admin());

drop policy if exists "leer destinos" on public.destinos;
create policy "leer destinos" on public.destinos
  for select using (visible or public.es_admin());
drop policy if exists "editar destinos" on public.destinos;
create policy "editar destinos" on public.destinos
  for all using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer promociones" on public.promociones;
create policy "leer promociones" on public.promociones
  for select using (visible or public.es_admin());
drop policy if exists "editar promociones" on public.promociones;
create policy "editar promociones" on public.promociones
  for all using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer horario" on public.horario;
create policy "leer horario" on public.horario
  for select using (true);
drop policy if exists "editar horario" on public.horario;
create policy "editar horario" on public.horario
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------------
-- 4. FOTOS (Storage)
--    Carpeta pública "fotos" (fotos y PDFs de destinos): todos las ven,
--    solo administradores suben/borran.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos: subir" on storage.objects;
create policy "fotos: subir" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos' and public.es_admin());

drop policy if exists "fotos: cambiar" on storage.objects;
create policy "fotos: cambiar" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos' and public.es_admin());

drop policy if exists "fotos: borrar" on storage.objects;
create policy "fotos: borrar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos' and public.es_admin());

-- ---------------------------------------------------------------------------
-- 5. DATOS INICIALES (los mismos de la web; cámbialos luego desde el panel)
--    Solo se cargan si las tablas están vacías.
-- ---------------------------------------------------------------------------
insert into public.horario (dia_idx, dia, abre, cierra, cerrado)
select * from (values
  (0, 'lunes', '10:00', '20:00', false),
  (1, 'martes', '10:00', '20:00', false),
  (2, 'miércoles', '10:00', '20:00', false),
  (3, 'jueves', '10:00', '20:00', false),
  (4, 'viernes', '10:00', '20:00', false),
  (5, 'sábado', '10:00', '20:00', false),
  (6, 'domingo', '11:00', '18:00', false)
) as v(dia_idx, dia, abre, cierra, cerrado)
where not exists (select 1 from public.horario);

insert into public.destinos (slug, nombre, region, detalle, precio, foto, mas_vendido, orden, noches, incluye, galeria, pdf)
select * from (values
  ('punta-cana', 'punta cana', 'caribe', '5 noches · todo incluido · vuelo + hotel + traslados', 1290, 'https://images.unsplash.com/photo-1705507972578-78537a2dda73?w=1400&q=75&auto=format&fit=crop', true, 0, 5, array['vuelo ida y vuelta desde quito', 'hotel todo incluido 5 noches', 'traslados aeropuerto – hotel – aeropuerto', 'asistencia de viaje', 'impuestos aéreos']::text[], array['https://images.unsplash.com/photo-1569700946659-fe1941c71fe4?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1637576305711-23d3b0f72881?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1705507972578-78537a2dda73?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/punta-cana.pdf'),
  ('cartagena', 'cartagena', 'caribe', '4 noches · hotel en ciudad amurallada · desayunos', 690, 'https://images.unsplash.com/photo-1536308037887-165852797016?w=1400&q=75&auto=format&fit=crop', true, 1, 4, array['vuelo ida y vuelta desde quito', 'hotel en la ciudad amurallada 4 noches', 'desayunos diarios', 'city tour y tour a islas del rosario', 'traslados y asistencia de viaje']::text[], array['https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1536308037887-165852797016?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/cartagena.pdf'),
  ('buenos-aires-iguazu', 'buenos aires + iguazú', 'sudamérica', '7 noches · city tour + cataratas · vuelos internos', 1450, 'https://images.unsplash.com/photo-1590246185449-e9e2ddd683bb?w=1400&q=75&auto=format&fit=crop', true, 2, 7, array['vuelos quito – buenos aires – iguazú – quito', '4 noches en buenos aires + 3 en iguazú', 'desayunos diarios', 'city tour y excursión a las cataratas', 'traslados y asistencia de viaje']::text[], array['https://images.unsplash.com/photo-1538703012804-b74999aa11b9?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/buenos-aires-iguazu.pdf'),
  ('galapagos', 'galápagos', 'ecuador', '4 noches · santa cruz · tours a islas', 980, 'https://images.unsplash.com/photo-1706957614198-8d2e5f0ed6ea?w=1400&q=75&auto=format&fit=crop', false, 3, 4, array['vuelo ida y vuelta desde quito', 'hotel en santa cruz 4 noches', 'tours a isla bartolomé y playa tortuga bay', 'desayunos y almuerzos en tours', 'traslados y guía naturalista']::text[], array['https://images.unsplash.com/photo-1595517930215-d2778a56ac93?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1503301360699-4f60cf292ec8?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1706957614198-8d2e5f0ed6ea?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/galapagos.pdf'),
  ('cancun', 'cancún', 'caribe', '5 noches · todo incluido · zona hotelera', 1350, 'https://images.unsplash.com/photo-1630252421399-ddde79af47b3?w=1400&q=75&auto=format&fit=crop', false, 4, 5, array['vuelo ida y vuelta desde quito', 'hotel todo incluido en zona hotelera 5 noches', 'traslados aeropuerto – hotel – aeropuerto', 'asistencia de viaje']::text[], array['https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1630252421399-ddde79af47b3?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/cancun.pdf'),
  ('buenos-aires', 'buenos aires', 'sudamérica', '5 noches · palermo · tango show', 990, 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1400&q=75&auto=format&fit=crop', false, 5, 5, array['vuelo ida y vuelta desde quito', 'hotel en palermo 5 noches', 'desayunos diarios', 'city tour y cena con show de tango', 'traslados y asistencia de viaje']::text[], array['https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200&q=75&auto=format&fit=crop', 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=75&auto=format&fit=crop']::text[], 'pdf/buenos-aires.pdf')
) as v(slug, nombre, region, detalle, precio, foto, mas_vendido, orden, noches, incluye, galeria, pdf)
where not exists (select 1 from public.destinos);

insert into public.promociones (categoria, titulo, texto, foto, vigencia)
select * from (values
  ('promo', 'punta cana en 10 cuotas sin intereses.', 'reserva con $150 y paga el resto en cuotas. válido para viajes de enero a marzo.', 'https://images.unsplash.com/photo-1637576305711-23d3b0f72881?w=1200&q=75&auto=format&fit=crop', 'este mes'),
  ('evento', 'salida grupal a galápagos · febrero.', 'cupos limitados para el grupo del 14 al 18 de febrero. vuelo, hotel y tours incluidos.', 'https://images.unsplash.com/photo-1595517930215-d2778a56ac93?w=1200&q=75&auto=format&fit=crop', 'este mes'),
  ('nuevo', 'nuevo: buenos aires + cataratas.', 'el combo más pedido de sudamérica: ciudad, tango y las cataratas del iguazú en un solo viaje.', 'https://images.unsplash.com/photo-1538703012804-b74999aa11b9?w=1200&q=75&auto=format&fit=crop', 'este mes')
) as v(categoria, titulo, texto, foto, vigencia)
where not exists (select 1 from public.promociones);
