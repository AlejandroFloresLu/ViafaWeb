/* ==========================================================================
   DEMO · VIAFA AGENCIA DE VIAJES
   --------------------------------------------------------------------------
   Todo lo que se ve en la web, el panel y "publicar" sale de aquí.

   ⚠️ Datos REALES (tomados de viafaecuador.com.ec): nombre, dirección,
      teléfonos, correo, destinos y los 4 "porqué confiar en nosotros".
   ⚠️ Datos DE EJEMPLO (confirmar con Viafa antes de mostrar en público):
      precios, horario, calificación y reseñas de Google, testimonios,
      métricas del panel y publicaciones.

   Fotos: Unsplash (se cargan desde internet).
   ========================================================================== */

const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`

export const negocio = {
  nombre: 'viafa',
  nombreLargo: 'viafa agencia de viajes',
  tipo: 'agencia de viajes',
  sector: 'quito',
  dueno: 'equipo viafa',
  frase: 'el viaje de tus sueños, sin complicaciones.',
  descripcion:
    'Somos una agencia de viajes especializada en el sur de Quito. Te ayudamos a elegir el destino, conseguir la mejor tarifa y viajar tranquilo: nos encargamos de vuelos, hoteles, traslados y asistencia, y te acompañamos antes, durante y después del viaje.',

  moneda: 'USD',
  telefono: '(02) 400 0259',
  telefonos: ['(02) 400 0259', '(02) 400 0260', '(02) 400 0262'],
  celular: '096 972 5577',
  whatsapp: '593969725577', // WhatsApp 0969 725 577 (aparece en su banner)
  email: 'info@viafaecuador.com.ec',
  instagram: '@viafaecuador', // 👉 confirmar (en su web solo aparece Facebook)
  direccion: 'Av. Quitumbe Ñan y Av. Morán Valverde · C.C. Quicentro Sur, local 51, planta baja',

  google: {
    mapa: 'Viafa Agencia de Viajes, Av. Quitumbe Ñan y Av. Morán Valverde, 170702 Quito', // lo que se busca en Google Maps
    placeId: '',
    rating: 4.3, // real (Google Maps, nov 2026)
    resenas: 24, // real (Google Maps, nov 2026)
  },

  fotos: {
    portada: u('1569700946659-fe1941c71fe4', 2200),
    banda: u('1545132147-d037e6c54cfd', 2000),
    nosotros: u('1516370873344-fb7c61054fa9'),
    nosotros2: u('1536869338989-e7ffd2297454', 900),
  },

  // Los 4 "porqué confiar en nosotros" de su web actual
  valores: [
    { titulo: 'atención personal.', texto: 'una asesora te acompaña de principio a fin, en la oficina o por whatsapp.' },
    { titulo: 'las mejores tarifas.', texto: 'comparamos aerolíneas y hoteles para darte el mejor precio.' },
    { titulo: 'asistencia total.', texto: 'te respaldamos durante todo el viaje, ante cualquier imprevisto.' },
    { titulo: 'facilidades de pago.', texto: 'paga en cuotas y reserva con un abono inicial.' },
  ],

  // 👉 Horario de ejemplo (horario típico de centro comercial). Confirmar.
  horario: [
    { dia: 'lunes', abre: '10:00', cierra: '20:00' },
    { dia: 'martes', abre: '10:00', cierra: '20:00' },
    { dia: 'miércoles', abre: '10:00', cierra: '20:00' },
    { dia: 'jueves', abre: '10:00', cierra: '20:00' },
    { dia: 'viernes', abre: '10:00', cierra: '20:00' },
    { dia: 'sábado', abre: '10:00', cierra: '20:00' },
    { dia: 'domingo', abre: '11:00', cierra: '18:00' },
  ],

  /* DESTINOS / PAQUETES — "carta" de la agencia.
     Cartagena, Punta Cana y Buenos Aires están en su web.
     Galápagos y Cancún son agregados de EJEMPLO. Precios de EJEMPLO. */
  carta: [
    { id: 'punta-cana', nombre: 'punta cana', region: 'caribe', detalle: '5 noches · todo incluido · vuelo + hotel + traslados', precio: 1290, foto: u('1705507972578-78537a2dda73', 1000), vistas: 486, masVendido: true },
    { id: 'cartagena', nombre: 'cartagena', region: 'caribe', detalle: '4 noches · hotel en ciudad amurallada · desayunos', precio: 690, foto: u('1536308037887-165852797016', 1000), vistas: 431, masVendido: true },
    { id: 'buenos-aires', nombre: 'buenos aires + iguazú', region: 'sudamérica', detalle: '7 noches · city tour + cataratas · vuelos internos', precio: 1450, foto: u('1590246185449-e9e2ddd683bb', 1000), vistas: 302, masVendido: true },
    { id: 'galapagos', nombre: 'galápagos', region: 'ecuador', detalle: '4 noches · santa cruz · tours a islas', precio: 980, foto: u('1706957614198-8d2e5f0ed6ea', 1000), vistas: 255 },
    { id: 'cancun', nombre: 'cancún', region: 'caribe', detalle: '5 noches · todo incluido · zona hotelera', precio: 1350, foto: u('1630252421399-ddde79af47b3', 1000), vistas: 214 },
    { id: 'baires-solo', nombre: 'buenos aires', region: 'sudamérica', detalle: '5 noches · palermo · tango show', precio: 990, foto: u('1589909202802-8f4aadce1849', 1000), vistas: 176 },
  ],

  // Reseñas en Google — DE EJEMPLO
  resenasGoogle: [
    { autor: 'Carla V.', estrellas: 5, texto: 'Nos armaron el viaje a Punta Cana en dos días y nos dieron facilidades de pago. Todo salió perfecto.', hace: 'hace 3 días' },
    { autor: 'Diego P.', estrellas: 5, texto: 'Excelente atención en Quicentro Sur. Nos ayudaron hasta con un cambio de vuelo a última hora.', hace: 'hace 2 semanas' },
  ],

  // Referencias / testimonios — DE EJEMPLO
  referencias: [
    { autor: 'familia Andrade', viaje: 'punta cana', texto: 'Era nuestro primer viaje con los niños y nos sentimos acompañados en todo momento.' },
    { autor: 'Paola y Luis', viaje: 'cartagena', texto: 'La luna de miel que soñábamos. El hotel en la ciudad amurallada fue un acierto.' },
    { autor: 'Grupo de jubilados del sur', viaje: 'galápagos', texto: 'Organizaron todo para 18 personas sin un solo problema. Ya estamos planeando el próximo.' },
  ],
}

/* Fotos de ejemplo para la pantalla de publicar (si no subes una propia). */
export const fotosEjemplo = [
  u('1637576305711-23d3b0f72881', 1200),
  u('1538703012804-b74999aa11b9', 1200),
  u('1595517930215-d2778a56ac93', 1200),
  u('1534943441045-1009d7cb0bb9', 1200),
]

export const categorias = [
  { id: 'promo', label: 'promoción' },
  { id: 'nuevo', label: 'nuevo destino' },
  { id: 'evento', label: 'salida grupal' },
  { id: 'aviso', label: 'aviso' },
]

/* Publicaciones que ya aparecen en la web al abrir la demo (EJEMPLO). */
export const publicacionesIniciales = [
  {
    id: 'p-1',
    categoria: 'promo',
    titulo: 'punta cana en 10 cuotas sin intereses.',
    texto: 'reserva con $150 y paga el resto en cuotas. válido para viajes de enero a marzo.',
    foto: u('1637576305711-23d3b0f72881', 1200),
    vigencia: 'este mes',
    fecha: 'hace 2 días',
  },
  {
    id: 'p-2',
    categoria: 'evento',
    titulo: 'salida grupal a galápagos · febrero.',
    texto: 'cupos limitados para el grupo del 14 al 18 de febrero. vuelo, hotel y tours incluidos.',
    foto: u('1595517930215-d2778a56ac93', 1200),
    vigencia: 'este mes',
    fecha: 'hace 5 días',
  },
  {
    id: 'p-3',
    categoria: 'nuevo',
    titulo: 'nuevo: buenos aires + cataratas.',
    texto: 'el combo más pedido de sudamérica: ciudad, tango y las cataratas del iguazú en un solo viaje.',
    foto: u('1538703012804-b74999aa11b9', 1200),
    vigencia: 'este mes',
    fecha: 'hace 1 semana',
  },
]

/* MÉTRICAS DEL PANEL (de ejemplo) */
export const metricas = {
  googleVistas: { valor: 3260, cambio: 27 },
  webVisitas: { valor: 1910, cambio: 22 },
  pedidosWhatsapp: { valor: 148, cambio: 15 },
  comoLlegar: { valor: 87, cambio: 9 },
  llamadas: { valor: 64, cambio: 4 },
  busquedas: [
    { texto: 'agencia de viajes quito sur', veces: 418 },
    { texto: 'paquetes punta cana desde quito', veces: 276 },
    { texto: 'agencia de viajes quicentro sur', veces: 193 },
    { texto: 'viajes a cartagena', veces: 141 },
  ],
}
