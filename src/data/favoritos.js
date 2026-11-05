/* ==========================================================================
   LUGARES FAVORITOS — opciones de los campos y datos de ejemplo
   El gerente los edita en /admin → lugares favoritos.
   Estos datos solo se ven si la base de datos no responde (respaldo).
   ========================================================================== */

const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`

/* "Paquete incluye": íconos que el gerente marca o desmarca */
export const INCLUYE = [
  { id: 'vuelo', label: 'vuelo' },
  { id: 'hotel', label: 'hotel' },
  { id: 'comidas', label: 'alimentación' },
  { id: 'todo', label: 'todo incluido' },
  { id: 'traslados', label: 'traslados' },
  { id: 'tours', label: 'tours' },
  { id: 'asistencia', label: 'asistencia de viaje' },
]

export const TIPOS = ['vacaciones', 'relax', 'familiar', 'luna de miel', 'aventura', 'cultural', 'crucero', 'grupal']

export const favoritosEjemplo = [
  {
    id: 'f-punta-cana',
    nombre: 'tour a punta cana desde quito',
    salidas: 'salidas 2026 · septiembre a diciembre',
    estrellas: 4,
    precio: 1149,
    tipo: 'vacaciones',
    noches: 4,
    salida: 'quito y guayaquil',
    aerolinea: 'copa airlines',
    descripcion: 'escápate a punta cana con un viaje todo incluido en un resort frente al mar: playa, piscinas y relax.',
    incluye: ['vuelo', 'hotel', 'todo', 'traslados', 'asistencia'],
    foto: u('1705507972578-78537a2dda73'),
  },
  {
    id: 'f-cartagena',
    nombre: 'tour a cartagena desde ecuador',
    salidas: 'salidas 2026 · enero a diciembre',
    estrellas: 3,
    precio: 813,
    tipo: 'relax',
    noches: 3,
    salida: 'quito y guayaquil',
    aerolinea: 'avianca',
    descripcion: 'la histórica ciudad amurallada, patrimonio de la humanidad, con hotel todo incluido y city tour.',
    incluye: ['vuelo', 'hotel', 'todo', 'tours'],
    foto: u('1536308037887-165852797016'),
  },
  {
    id: 'f-buenos-aires',
    nombre: 'buenos aires + cataratas del iguazú',
    salidas: 'salidas 2026 · marzo a noviembre',
    estrellas: 4,
    precio: 1450,
    tipo: 'cultural',
    noches: 7,
    salida: 'quito',
    aerolinea: 'latam',
    descripcion: 'tango y ciudad en buenos aires, y una maravilla natural del mundo: las cataratas del iguazú.',
    incluye: ['vuelo', 'hotel', 'comidas', 'traslados', 'tours', 'asistencia'],
    foto: u('1590246185449-e9e2ddd683bb'),
  },
]
