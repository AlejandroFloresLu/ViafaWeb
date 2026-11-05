-- ============================================================================
--  VIAFA · BASE DE DATOS DEL PANEL
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Se puede correr una sola vez (crea tablas, seguridad, fotos y datos).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. QUIÉN PUEDE EDITAR
--    Solo los correos de esta tabla pueden cambiar contenido.
--    El panel /admin convierte el USUARIO en correo:  admin → admin@viafaecuador.com.ec
--    Para dar acceso a otra persona: crea su usuario en Authentication → Users
--    y agrega aquí su correo (ej. 'santiago@viafaecuador.com.ec').
-- ---------------------------------------------------------------------------
create table if not exists public.administradores (
  email text primary key
);

insert into public.administradores (email) values
  ('admin@viafaecuador.com.ec')      -- usuario "admin" del panel
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

-- Lugares favoritos (ofertas detalladas de "los más vendidos" del inicio)
create table if not exists public.favoritos (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  region     text not null default '',
  detalle    text not null default '',
  precio     numeric(10,2) not null default 0,
  foto       text not null default '',
  orden      int not null default 0,
  visible    boolean not null default true,
  creado_en  timestamptz not null default now()
);

-- Campos detallados de cada oferta (se pueden agregar sobre una base ya creada)
alter table public.favoritos add column if not exists salidas     text not null default '';  -- "salidas 2026 · septiembre a diciembre"
alter table public.favoritos add column if not exists estrellas   int  not null default 0;   -- categoría del hotel (0 = no mostrar)
alter table public.favoritos add column if not exists tipo        text not null default '';  -- vacaciones, relax, familiar…
alter table public.favoritos add column if not exists noches      int  not null default 0;
alter table public.favoritos add column if not exists salida      text not null default '';  -- ciudad de salida
alter table public.favoritos add column if not exists aerolinea   text not null default '';
alter table public.favoritos add column if not exists descripcion text not null default '';
alter table public.favoritos add column if not exists incluye     text[] not null default '{}'; -- vuelo, hotel, comidas, todo, traslados, tours, asistencia

-- Lugares que visitó Viafa (collage de fotos)
create table if not exists public.viajes_galeria (
  id         uuid primary key default gen_random_uuid(),
  lugar      text not null default '',
  foto       text not null,
  orden      int not null default 0,
  visible    boolean not null default true,
  creado_en  timestamptz not null default now()
);

-- Esto dicen nuestros clientes (foto + opinión)
create table if not exists public.testimonios (
  id         uuid primary key default gen_random_uuid(),
  autor      text not null,
  viaje      text not null default '',
  texto      text not null,
  foto       text not null default '',
  orden      int not null default 0,
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
-- 2b. LÍMITES (para que la web funcione todo el año sin sorpresas)
--     Iguales a LIMITES en src/config.js. El panel ya los respeta; aquí la
--     base los hace obligatorios aunque alguien intente saltarse el panel.
-- ---------------------------------------------------------------------------
create or replace function public.limitar_filas()
returns trigger
language plpgsql
as $$
declare
  maximo int := tg_argv[0]::int;
  total  int;
begin
  execute format('select count(*) from %I.%I', tg_table_schema, tg_table_name) into total;
  if total >= maximo then
    raise exception 'límite alcanzado: máximo % filas en %', maximo, tg_table_name;
  end if;
  return new;
end;
$$;

drop trigger if exists limite on public.favoritos;
create trigger limite before insert on public.favoritos
  for each row execute function public.limitar_filas('6');
drop trigger if exists limite on public.viajes_galeria;
create trigger limite before insert on public.viajes_galeria
  for each row execute function public.limitar_filas('24');
drop trigger if exists limite on public.testimonios;
create trigger limite before insert on public.testimonios
  for each row execute function public.limitar_filas('12');

-- Largo máximo de los textos (igual que en el panel)
alter table public.favoritos drop constraint if exists favoritos_largos;
alter table public.favoritos add constraint favoritos_largos check (
  char_length(nombre) <= 60 and char_length(salidas) <= 50 and char_length(salida) <= 40
  and char_length(aerolinea) <= 30 and char_length(descripcion) <= 240
  and precio between 0 and 99999 and estrellas between 0 and 5 and noches between 0 and 60
  and cardinality(incluye) <= 10 and char_length(foto) <= 500);
alter table public.viajes_galeria drop constraint if exists viajes_largos;
alter table public.viajes_galeria add constraint viajes_largos check (
  char_length(lugar) <= 40 and char_length(foto) <= 500);
alter table public.testimonios drop constraint if exists testimonios_largos;
alter table public.testimonios add constraint testimonios_largos check (
  char_length(autor) <= 50 and char_length(viaje) <= 40 and char_length(texto) <= 280
  and char_length(foto) <= 500);

-- ---------------------------------------------------------------------------
-- 3. SEGURIDAD (Row Level Security)
--    Todos pueden LEER lo visible. Solo los administradores pueden ESCRIBIR.
-- ---------------------------------------------------------------------------
alter table public.administradores enable row level security;
alter table public.destinos        enable row level security;
alter table public.promociones     enable row level security;
alter table public.horario         enable row level security;
alter table public.favoritos       enable row level security;
alter table public.viajes_galeria  enable row level security;
alter table public.testimonios     enable row level security;

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

drop policy if exists "leer favoritos" on public.favoritos;
create policy "leer favoritos" on public.favoritos
  for select using (visible or public.es_admin());
drop policy if exists "editar favoritos" on public.favoritos;
create policy "editar favoritos" on public.favoritos
  for all using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer viajes" on public.viajes_galeria;
create policy "leer viajes" on public.viajes_galeria
  for select using (visible or public.es_admin());
drop policy if exists "editar viajes" on public.viajes_galeria;
create policy "editar viajes" on public.viajes_galeria
  for all using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer testimonios" on public.testimonios;
create policy "leer testimonios" on public.testimonios
  for select using (visible or public.es_admin());
drop policy if exists "editar testimonios" on public.testimonios;
create policy "editar testimonios" on public.testimonios
  for all using (public.es_admin()) with check (public.es_admin());

-- ---------------------------------------------------------------------------
-- 4. FOTOS (Storage)
--    Carpeta pública "fotos" (fotos y PDFs de destinos): todos las ven,
--    solo administradores suben/borran.
-- ---------------------------------------------------------------------------
-- Máximo 2 MB por archivo y solo imágenes (y PDF para las fichas de destinos).
-- El panel sube fotos de ~300 KB, así que este tope solo frena abusos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

insert into public.favoritos (nombre, salidas, estrellas, precio, tipo, noches, salida, aerolinea, descripcion, incluye, foto, orden)
select * from (values
  ('tour a punta cana desde quito', 'salidas 2026 · septiembre a diciembre', 4, 1149, 'vacaciones', 4, 'quito y guayaquil', 'copa airlines', 'escápate a punta cana con un viaje todo incluido en un resort frente al mar. 4 noches de playa, piscinas y relax, con salidas desde quito y guayaquil.', array['vuelo', 'hotel', 'todo', 'traslados', 'asistencia']::text[], 'https://images.unsplash.com/photo-1705507972578-78537a2dda73?w=1200&q=75&auto=format&fit=crop', 1),
  ('tour a cartagena desde ecuador', 'salidas 2026 · enero a diciembre', 3, 813, 'relax', 3, 'quito y guayaquil', 'avianca', 'tres noches en la histórica ciudad de cartagena, patrimonio cultural de la humanidad. hotel todo incluido, city tour y la ciudad amurallada.', array['vuelo', 'hotel', 'todo', 'tours']::text[], 'https://images.unsplash.com/photo-1536308037887-165852797016?w=1200&q=75&auto=format&fit=crop', 2),
  ('buenos aires + cataratas del iguazú', 'salidas 2026 · marzo a noviembre', 4, 1450, 'cultural', 7, 'quito', 'latam', 'ciudad, tango y una de las maravillas naturales del mundo en un solo viaje: 4 noches en buenos aires y 3 en iguazú, con vuelos internos.', array['vuelo', 'hotel', 'comidas', 'traslados', 'tours', 'asistencia']::text[], 'https://images.unsplash.com/photo-1590246185449-e9e2ddd683bb?w=1200&q=75&auto=format&fit=crop', 3)
) as v(nombre, salidas, estrellas, precio, tipo, noches, salida, aerolinea, descripcion, incluye, foto, orden)
where not exists (select 1 from public.favoritos);

insert into public.viajes_galeria (lugar, foto, orden)
select * from (values
  ('galápagos', 'https://images.unsplash.com/photo-1595517930215-d2778a56ac93?w=1200&q=75&auto=format&fit=crop', 1),
  ('cartagena', 'https://images.unsplash.com/photo-1536308037887-165852797016?w=1000&q=75&auto=format&fit=crop', 2),
  ('cataratas del iguazú', 'https://images.unsplash.com/photo-1590246185449-e9e2ddd683bb?w=1000&q=75&auto=format&fit=crop', 3),
  ('punta cana', 'https://images.unsplash.com/photo-1637576305711-23d3b0f72881?w=1000&q=75&auto=format&fit=crop', 4),
  ('chichén itzá', 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=1000&q=75&auto=format&fit=crop', 5),
  ('buenos aires', 'https://images.unsplash.com/photo-1679417302656-9b5170584526?w=1000&q=75&auto=format&fit=crop', 6),
  ('isla saona', 'https://images.unsplash.com/photo-1669517270484-df54ad8d54c8?w=1000&q=75&auto=format&fit=crop', 7),
  ('salida grupal', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1000&q=75&auto=format&fit=crop', 8)
) as v(lugar, foto, orden)
where not exists (select 1 from public.viajes_galeria);

insert into public.testimonios (autor, viaje, texto, foto, orden)
select * from (values
  ('familia Andrade', 'punta cana', 'Era nuestro primer viaje con los niños y nos sentimos acompañados en todo momento.', 'https://images.unsplash.com/photo-1721840432289-d0041522103d?w=1000&q=75&auto=format&fit=crop', 1),
  ('Paola y Luis', 'cartagena', 'La luna de miel que soñábamos. El hotel en la ciudad amurallada fue un acierto.', 'https://images.unsplash.com/photo-1568050878862-c8b4bdc99bc3?w=1000&q=75&auto=format&fit=crop', 2),
  ('grupo de amigos del sur', 'galápagos', 'Organizaron todo para 18 personas sin un solo problema. Ya estamos planeando el próximo.', 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=1000&q=75&auto=format&fit=crop', 3),
  ('familia Ortiz', 'cancún', 'Nos ayudaron a pagar en cuotas y el hotel todo incluido superó lo que esperábamos.', 'https://images.unsplash.com/photo-1576696058573-12b47c49559e?w=1000&q=75&auto=format&fit=crop', 4)
) as v(autor, viaje, texto, foto, orden)
where not exists (select 1 from public.testimonios);
