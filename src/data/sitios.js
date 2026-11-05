/* ==========================================================================
   LUGARES DE CADA DESTINO
   --------------------------------------------------------------------------
   /#/destinos/cartagena            → muestra estos lugares
   /#/destinos/cartagena/islas-del-rosario → página del lugar

   La clave es el id del destino (el de src/data/negocio.js / slug en Supabase).
   Textos: descripción general del lugar. Duración e "incluido" son de EJEMPLO:
   ajústalos a lo que realmente ofrece Viafa.
   ========================================================================== */

const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`

export const sitios = {
  cartagena: [
    {
      id: 'ciudad-amurallada', nombre: 'ciudad amurallada', tipo: 'ciudad', duracion: 'medio día', incluido: true,
      resumen: 'calles de colores, balcones con flores y plazas coloniales: el corazón de cartagena.',
      descripcion: 'El centro histórico de Cartagena, patrimonio de la humanidad, se recorre a pie entre casas coloniales, iglesias y plazas como la de Santo Domingo y la Torre del Reloj. Al atardecer, las murallas son el mejor lugar para ver caer el sol sobre el Caribe.',
      fotos: [u('1715503485452-89d50b42ff5d'), u('1560242374-ca6dd3434522'), u('1633394027858-fff49145f120')],
    },
    {
      id: 'islas-del-rosario', nombre: 'islas del rosario', tipo: 'playa', duracion: 'día completo', incluido: true,
      resumen: 'archipiélago de aguas turquesa a una hora en lancha desde la ciudad.',
      descripcion: 'Un parque natural de islas coralinas con aguas cristalinas, ideal para nadar, hacer snorkel y descansar en playas de arena blanca. El tour sale temprano en lancha desde el muelle de la Bodeguita y regresa por la tarde.',
      fotos: [u('1637576305711-23d3b0f72881'), u('1637560550470-4dbd48112d11'), u('1757117084397-7a7ad1795788')],
    },
    {
      id: 'castillo-san-felipe', nombre: 'castillo san felipe', tipo: 'historia', duracion: '2 horas', incluido: true,
      resumen: 'la fortaleza española más grande de américa, con vista a toda la ciudad.',
      descripcion: 'Construido para defender la ciudad de los piratas, el Castillo de San Felipe de Barajas tiene túneles, baterías y una de las mejores vistas de Cartagena. Se visita junto con el city tour.',
      fotos: [u('1613069552490-dbb6cb30cd90'), u('1667569918005-4d600cbc43e8'), u('1593186033406-b82dbfd30c4e')],
    },
    {
      id: 'getsemani', nombre: 'getsemaní', tipo: 'ciudad', duracion: 'tarde / noche', incluido: false,
      resumen: 'el barrio bohemio: murales, banderines, música y la mejor vida nocturna.',
      descripcion: 'Junto a la ciudad amurallada, Getsemaní es el barrio de los murales, las calles con banderines y la Plaza de la Trinidad, donde cada noche hay música en vivo, comida callejera y ambiente local.',
      fotos: [u('1677594091599-2bcee36b0cf6'), u('1583531352515-8884af319dc1')],
    },
    {
      id: 'playa-blanca-baru', nombre: 'playa blanca · barú', tipo: 'playa', duracion: 'día completo', incluido: false,
      resumen: 'arena blanca y mar turquesa en la península de barú.',
      descripcion: 'Una de las playas más bonitas cerca de Cartagena. Se llega por carretera o en lancha y es perfecta para pasar el día entre el mar, almuerzo de pescado frito y hamaca.',
      fotos: [u('1757116828247-8a941f2ac962'), u('1757117084397-7a7ad1795788'), u('1646082991412-7ba56f8e7c36')],
    },
  ],

  'punta-cana': [
    {
      id: 'playa-bavaro', nombre: 'playa bávaro', tipo: 'playa', duracion: 'todos los días', incluido: true,
      resumen: 'kilómetros de arena blanca y palmeras frente a tu hotel todo incluido.',
      descripcion: 'Bávaro es una de las playas más famosas del Caribe: arena fina, palmeras y agua tranquila, con hoteles todo incluido a pie de playa. Ideal para descansar, hacer deportes acuáticos o caminar al atardecer.',
      fotos: [u('1507525428034-b723cf961d3e'), u('1506953823976-52e1fdc0149a'), u('1569700946659-fe1941c71fe4')],
    },
    {
      id: 'isla-saona', nombre: 'isla saona', tipo: 'playa', duracion: 'día completo', incluido: true,
      resumen: 'la isla de postal: catamarán, piscina natural y almuerzo en la playa.',
      descripcion: 'Una excursión clásica de Punta Cana: se navega en catamarán hacia la isla, con parada en la piscina natural de aguas bajas con estrellas de mar, y almuerzo buffet en la playa.',
      fotos: [u('1669517270484-df54ad8d54c8'), u('1639222188528-3498adec4f40'), u('1701314562838-a565a7ad8b01')],
    },
  ],

  'buenos-aires-iguazu': [
    {
      id: 'cataratas-del-iguazu', nombre: 'cataratas del iguazú', tipo: 'naturaleza', duracion: 'día completo', incluido: true,
      resumen: 'una de las siete maravillas naturales: pasarelas sobre la garganta del diablo.',
      descripcion: 'Más de 270 saltos de agua en plena selva. Las pasarelas del lado argentino llegan hasta la Garganta del Diablo, donde se siente toda la fuerza del río Iguazú.',
      fotos: [u('1590246185449-e9e2ddd683bb'), u('1538703012804-b74999aa11b9'), u('1598496437753-333a2880a98f')],
    },
    {
      id: 'caminito', nombre: 'caminito · la boca', tipo: 'ciudad', duracion: 'medio día', incluido: true,
      resumen: 'el barrio de las casas de colores y el tango en la calle.',
      descripcion: 'La calle-museo de La Boca, con sus casas de chapa pintadas de colores, artistas callejeros y parejas bailando tango. Parte del city tour por Buenos Aires.',
      fotos: [u('1679417302656-9b5170584526'), u('1612294037637-ec328d0e075e'), u('1691216011700-681f22d79339')],
    },
    {
      id: 'show-de-tango', nombre: 'cena y show de tango', tipo: 'noche', duracion: 'noche', incluido: true,
      resumen: 'una noche porteña con cena y el mejor tango en vivo.',
      descripcion: 'Una cena de tres tiempos con vino argentino y un espectáculo de tango con orquesta y bailarines profesionales en una casa de tango tradicional.',
      fotos: [u('1572029848405-42f2a2bc3ccd'), u('1572028492280-555f97b4fdd0')],
    },
  ],

  'buenos-aires': [
    {
      id: 'obelisco', nombre: 'obelisco y 9 de julio', tipo: 'ciudad', duracion: 'medio día', incluido: true,
      resumen: 'el símbolo de la ciudad sobre la avenida más ancha del mundo.',
      descripcion: 'El Obelisco y la Avenida 9 de Julio son el punto de partida del city tour, que recorre también el Teatro Colón, la Plaza de Mayo y la Casa Rosada.',
      fotos: [u('1589909202802-8f4aadce1849'), u('1612294037637-ec328d0e075e')],
    },
    {
      id: 'puerto-madero', nombre: 'puerto madero', tipo: 'ciudad', duracion: 'tarde / noche', incluido: false,
      resumen: 'el barrio moderno junto al río, con el puente de la mujer.',
      descripcion: 'Los antiguos docks convertidos en restaurantes y paseos junto al agua. Al anochecer, el Puente de la Mujer y los edificios iluminados son una postal de la ciudad.',
      fotos: [u('1638496960563-acbd69e97d09'), u('1610135206707-0f03e4800631')],
    },
    {
      id: 'palermo', nombre: 'palermo', tipo: 'ciudad', duracion: 'libre', incluido: false,
      resumen: 'cafés, parques, tiendas de diseño y restaurantes.',
      descripcion: 'El barrio donde está tu hotel: bosques y lagos, cafés con mesas en la vereda, ferias de diseño y la mejor oferta gastronómica de Buenos Aires.',
      fotos: [u('1674478206488-af64c9d53de8'), u('1612294037637-ec328d0e075e')],
    },
    {
      id: 'show-de-tango', nombre: 'cena y show de tango', tipo: 'noche', duracion: 'noche', incluido: true,
      resumen: 'una noche porteña con cena y el mejor tango en vivo.',
      descripcion: 'Una cena de tres tiempos con vino argentino y un espectáculo de tango con orquesta y bailarines profesionales en una casa de tango tradicional.',
      fotos: [u('1572029848405-42f2a2bc3ccd'), u('1572028492280-555f97b4fdd0')],
    },
  ],

  galapagos: [
    {
      id: 'tortuga-bay', nombre: 'bahía tortuga', tipo: 'playa', duracion: 'medio día', incluido: true,
      resumen: 'playa de arena blanca con iguanas marinas, a pie desde puerto ayora.',
      descripcion: 'Una caminata entre cactus lleva a una de las playas más bonitas de las islas, donde las iguanas marinas toman sol en la arena y hay una bahía tranquila para nadar.',
      fotos: [u('1621692359460-36d7be2367a4'), u('1602081425217-293014ae0f71')],
    },
    {
      id: 'isla-bartolome', nombre: 'isla bartolomé', tipo: 'naturaleza', duracion: 'día completo', incluido: true,
      resumen: 'el mirador más famoso de galápagos y snorkel con pingüinos.',
      descripcion: 'Tras subir las escaleras del volcán se ve el Pináculo, la vista más fotografiada de Galápagos. Después, snorkel en aguas donde se pueden ver pingüinos, lobos marinos y peces de colores.',
      fotos: [u('1645571049250-7eb982250f86'), u('1706957614198-8d2e5f0ed6ea')],
    },
    {
      id: 'tortugas-gigantes', nombre: 'tortugas gigantes', tipo: 'naturaleza', duracion: 'medio día', incluido: true,
      resumen: 'tortugas gigantes en libertad en la parte alta de santa cruz.',
      descripcion: 'En las reservas de la parte alta de Santa Cruz las tortugas gigantes caminan libres entre la vegetación. La visita se combina con los túneles de lava y la Estación Científica Charles Darwin.',
      fotos: [u('1521217155737-0d5632e9813f'), u('1676910914506-39578e3446b1')],
    },
    {
      id: 'lobos-marinos', nombre: 'lobos marinos', tipo: 'naturaleza', duracion: 'libre', incluido: false,
      resumen: 'los anfitriones de las islas, en playas y muelles.',
      descripcion: 'Los lobos marinos están por todas partes: en playas, muelles y rocas. Nadar con ellos en las excursiones de snorkel es una de las experiencias más recordadas del viaje.',
      fotos: [u('1728068944767-3b419e9ef6be'), u('1595517930215-d2778a56ac93'), u('1748139899624-a74b6d62d2a2')],
    },
  ],

  cancun: [
    {
      id: 'zona-hotelera', nombre: 'zona hotelera', tipo: 'playa', duracion: 'todos los días', incluido: true,
      resumen: 'la franja de playas turquesa donde está tu hotel todo incluido.',
      descripcion: 'Una franja de 22 km entre el mar Caribe y la laguna Nichupté, con playas de arena blanca, hoteles todo incluido, restaurantes y vida nocturna.',
      fotos: [u('1630252421399-ddde79af47b3'), u('1510097467424-192d713fd8b2')],
    },
    {
      id: 'chichen-itza', nombre: 'chichén itzá', tipo: 'historia', duracion: 'día completo', incluido: false,
      resumen: 'la gran ciudad maya y su pirámide de kukulcán.',
      descripcion: 'Una de las maravillas del mundo moderno. La excursión incluye la visita guiada a la zona arqueológica y suele combinarse con un cenote y el pueblo colonial de Valladolid.',
      fotos: [u('1568402102990-bc541580b59f'), u('1561577101-aa749bffbb70')],
    },
    {
      id: 'isla-mujeres', nombre: 'isla mujeres', tipo: 'playa', duracion: 'día completo', incluido: false,
      resumen: 'catamarán, snorkel y playa norte, a minutos de cancún.',
      descripcion: 'Se llega en catamarán con parada para hacer snorkel en el arrecife. En la isla, Playa Norte tiene aguas bajas y turquesa, y se recorre en carrito de golf.',
      fotos: [u('1612550467658-97cb7b05043a'), u('1773802461520-0c0c811ce2bd')],
    },
    {
      id: 'cenotes', nombre: 'cenotes', tipo: 'naturaleza', duracion: 'medio día', incluido: false,
      resumen: 'pozos de agua cristalina dentro de cavernas para nadar.',
      descripcion: 'Los cenotes son pozos naturales de agua dulce y cristalina, algunos dentro de cavernas. Nadar en ellos es una de las experiencias únicas de la península de Yucatán.',
      fotos: [u('1546838849-6eb6269ae2db'), u('1520974822564-9b91874afe9c'), u('1719941463960-f3310fe64e46')],
    },
  ],
}
