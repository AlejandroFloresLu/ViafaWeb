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
     id = dirección de su página: /#/destinos/punta-cana
     pdf = ficha descargable (por ahora PDFs de EJEMPLO en la carpeta pdf/).
     Cartagena, Punta Cana y Buenos Aires están en su web.
     Galápagos y Cancún son agregados de EJEMPLO. Precios de EJEMPLO. */
  carta: [
    {
      id: 'punta-cana', nombre: 'punta cana', region: 'caribe', noches: 5,
      detalle: '5 noches · todo incluido · vuelo + hotel + traslados', precio: 1290, masVendido: true, vistas: 486,
      foto: u('1705507972578-78537a2dda73', 1400),
      galeria: [u('1569700946659-fe1941c71fe4', 1200), u('1637576305711-23d3b0f72881', 1200), u('1705507972578-78537a2dda73', 1200)],
      incluye: ['vuelo ida y vuelta desde quito', 'hotel todo incluido 5 noches', 'traslados aeropuerto – hotel – aeropuerto', 'asistencia de viaje', 'impuestos aéreos'],
      pdf: 'pdf/punta-cana.pdf',
    },
    {
      id: 'cartagena', nombre: 'cartagena', region: 'caribe', noches: 4,
      detalle: '4 noches · hotel en ciudad amurallada · desayunos', precio: 690, masVendido: true, vistas: 431,
      foto: u('1536308037887-165852797016', 1400),
      galeria: [u('1534943441045-1009d7cb0bb9', 1200), u('1583531352515-8884af319dc1', 1200), u('1536308037887-165852797016', 1200)],
      incluye: ['vuelo ida y vuelta desde quito', 'hotel en la ciudad amurallada 4 noches', 'desayunos diarios', 'city tour y tour a islas del rosario', 'traslados y asistencia de viaje'],
      pdf: 'pdf/cartagena.pdf',
    },
    {
      id: 'buenos-aires-iguazu', nombre: 'buenos aires + iguazú', region: 'sudamérica', noches: 7,
      detalle: '7 noches · city tour + cataratas · vuelos internos', precio: 1450, masVendido: true, vistas: 302,
      foto: u('1590246185449-e9e2ddd683bb', 1400),
      galeria: [u('1538703012804-b74999aa11b9', 1200), u('1589909202802-8f4aadce1849', 1200), u('1612294037637-ec328d0e075e', 1200)],
      incluye: ['vuelos quito – buenos aires – iguazú – quito', '4 noches en buenos aires + 3 en iguazú', 'desayunos diarios', 'city tour y excursión a las cataratas', 'traslados y asistencia de viaje'],
      pdf: 'pdf/buenos-aires-iguazu.pdf',
    },
    {
      id: 'galapagos', nombre: 'galápagos', region: 'ecuador', noches: 4,
      detalle: '4 noches · santa cruz · tours a islas', precio: 980, vistas: 255,
      foto: u('1706957614198-8d2e5f0ed6ea', 1400),
      galeria: [u('1595517930215-d2778a56ac93', 1200), u('1503301360699-4f60cf292ec8', 1200), u('1706957614198-8d2e5f0ed6ea', 1200)],
      incluye: ['vuelo ida y vuelta desde quito', 'hotel en santa cruz 4 noches', 'tours a isla bartolomé y playa tortuga bay', 'desayunos y almuerzos en tours', 'traslados y guía naturalista'],
      pdf: 'pdf/galapagos.pdf',
    },
    {
      id: 'cancun', nombre: 'cancún', region: 'caribe', noches: 5,
      detalle: '5 noches · todo incluido · zona hotelera', precio: 1350, vistas: 214,
      foto: u('1630252421399-ddde79af47b3', 1400),
      galeria: [u('1510097467424-192d713fd8b2', 1200), u('1630252421399-ddde79af47b3', 1200)],
      incluye: ['vuelo ida y vuelta desde quito', 'hotel todo incluido en zona hotelera 5 noches', 'traslados aeropuerto – hotel – aeropuerto', 'asistencia de viaje'],
      pdf: 'pdf/cancun.pdf',
    },
    {
      id: 'buenos-aires', nombre: 'buenos aires', region: 'sudamérica', noches: 5,
      detalle: '5 noches · palermo · tango show', precio: 990, vistas: 176,
      foto: u('1589909202802-8f4aadce1849', 1400),
      galeria: [u('1612294037637-ec328d0e075e', 1200), u('1589909202802-8f4aadce1849', 1200)],
      incluye: ['vuelo ida y vuelta desde quito', 'hotel en palermo 5 noches', 'desayunos diarios', 'city tour y cena con show de tango', 'traslados y asistencia de viaje'],
      pdf: 'pdf/buenos-aires.pdf',
    },
  ],

  // Reseñas en Google — DE EJEMPLO
  resenasGoogle: [
    { autor: 'Carla V.', estrellas: 5, texto: 'Nos armaron el viaje a Punta Cana en dos días y nos dieron facilidades de pago. Todo salió perfecto.', hace: 'hace 3 días' },
    { autor: 'Diego P.', estrellas: 5, texto: 'Excelente atención en Quicentro Sur. Nos ayudaron hasta con un cambio de vuelo a última hora.', hace: 'hace 2 semanas' },
  ],

  // "Esto dicen nuestros clientes" — DE EJEMPLO (el gerente los cambia desde /admin)
  referencias: [
    { autor: 'familia Andrade', viaje: 'punta cana', texto: 'Era nuestro primer viaje con los niños y nos sentimos acompañados en todo momento.', foto: u('1721840432289-d0041522103d', 1000) },
    { autor: 'Paola y Luis', viaje: 'cartagena', texto: 'La luna de miel que soñábamos. El hotel en la ciudad amurallada fue un acierto.', foto: u('1568050878862-c8b4bdc99bc3', 1000) },
    { autor: 'grupo de amigos del sur', viaje: 'galápagos', texto: 'Organizaron todo para 18 personas sin un solo problema. Ya estamos planeando el próximo.', foto: u('1531844251246-9a1bfaae09fc', 1000) },
    { autor: 'familia Ortiz', viaje: 'cancún', texto: 'Nos ayudaron a pagar en cuotas y el hotel todo incluido superó lo que esperábamos.', foto: u('1576696058573-12b47c49559e', 1000) },
  ],

  // "Lugares que visitó Viafa" — collage de fotos (DE EJEMPLO; el gerente las cambia desde /admin)
  galeriaViajes: [
    { lugar: 'galápagos', foto: u('1595517930215-d2778a56ac93', 1200) },
    { lugar: 'cartagena', foto: u('1536308037887-165852797016', 1000) },
    { lugar: 'cataratas del iguazú', foto: u('1590246185449-e9e2ddd683bb', 1000) },
    { lugar: 'punta cana', foto: u('1637576305711-23d3b0f72881', 1000) },
    { lugar: 'chichén itzá', foto: u('1568402102990-bc541580b59f', 1000) },
    { lugar: 'buenos aires', foto: u('1679417302656-9b5170584526', 1000) },
    { lugar: 'isla saona', foto: u('1669517270484-df54ad8d54c8', 1000) },
    { lugar: 'salida grupal', foto: u('1539635278303-d4002c07eae3', 1000) },
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
