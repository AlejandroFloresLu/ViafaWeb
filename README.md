# Demo · Viafa Agencia de Viajes

Rediseño de la web de Viafa con el mismo formato que Lugares de la J y **los colores de la marca**
(sacados de su logo): azul rey `#0A0A98`, naranja `#F7941D` y azul mar `#0A6898`.

## Verlo rápido (sin instalar nada)
Abre **`viafa-demo.html`** con doble clic. Necesita internet para las fotos y el mapa.

## Verlo en localhost (y en el celular)
```bash
npm install     # solo la primera vez
npm run dev     # abre http://localhost:5173
```
En el celular (mismo wifi), abre la dirección **Network** que aparece en la consola.

## La demo: 3 pasos (barra de abajo)
1. **Su web**: destinos, los más vendidos, promociones, referencias, "estamos en Google",
   horario, mapa de Quicentro Sur y cómo llegar. Cada botón "cotizar" abre WhatsApp con el destino.
2. **Su panel**: cuántos los vieron en Google, visitas, cotizaciones por WhatsApp, búsquedas,
   destinos más vistos, su ficha de Google y reseñas.
3. **Publicar**: foto, categoría, texto y vigencia, con vista previa. Al publicar aparece en su web.

En el panel, **"reiniciar demo"** borra lo publicado.

## Datos
- **Reales** (de viafaecuador.com.ec): nombre, dirección, teléfonos, WhatsApp, correo, destinos
  (Cartagena, Punta Cana, Buenos Aires/Iguazú) y los 4 "¿porqué confiar en nosotros?".
- **De ejemplo** (confirmar con Viafa): precios, horario, calificación y reseñas de Google,
  testimonios, métricas del panel, publicaciones y los destinos Galápagos y Cancún.

Todo el contenido se edita en `src/data/negocio.js`. Los colores, en `src/index.css`.
`npm run build` vuelve a generar el archivo único en `dist/index.html`.
