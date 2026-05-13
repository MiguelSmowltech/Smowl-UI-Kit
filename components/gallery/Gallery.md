# Gallery Component

Galería de imágenes con miniaturas, navegación por teclado y pantalla completa.

## Estructura del componente

```
components/gallery/
├── gallery.html      → HTML del componente
├── gallery.css       → Estilos del componente
├── gallery.js        → Lógica del componente
├── Gallery.md        → Documentación
└── index.html        → Página de demostración
```

## Cómo se usa

### 1. Importar el componente

```html
<script type="module" src="ruta/gallery/gallery.js"></script>
```

### 2. Añadir al HTML

```html
<gallery-component id="miGaleria"></gallery-component>
```

### 3. Configurar las imágenes

```javascript
const galeria = document.getElementById('miGaleria');
galeria.images = [
  { src: 'foto.jpg', thumb: 'miniatura.jpg', alt: 'Descripción' },
  { src: 'foto2.jpg', thumb: 'mini2.jpg', alt: 'Otra foto',
    title: 'Título', desc: 'Descripción larga' },
];
```

### 4. Incluir tokens.css (opcional)

Si quieres usar las variables de diseño globales:

```html
<link rel="stylesheet" href="../../tokens.css">
```

El componente funciona igual sin `tokens.css` porque tiene valores por defecto.

## Datos de cada imagen

| Campo    | Obligatorio | Descripción |
|----------|-------------|-------------|
| `src`    | Sí          | URL de la imagen grande |
| `thumb`  | Sí          | URL de la miniatura |
| `alt`    | Sí          | Texto alternativo (accesibilidad) |
| `title`  | No          | Título que se ve en el caption |
| `desc`   | No          | Descripción larga del caption |
| `error`  | No          | `true` si la imagen falló al cargar |

## Atributos HTML

| Atributo             | Valores                     | Por defecto | Descripción |
|----------------------|-----------------------------|-------------|-------------|
| `viewport`           | `large`, `medium`, `small`  | `medium`    | Tamaño de la galería |
| `show-thumbnails`    | `true`, `false`             | `true`      | Muestra u oculta miniaturas |
| `show-caption`       | `true`, `false`             | `false`     | Muestra u oculta el texto |
| `show-navigators`    | `true`, `false`             | `true`      | Muestra u oculta botones < > |
| `fullscreen`         | (atributo booleano)         | —           | Activa pantalla completa |

Ejemplo:

```html
<gallery-component viewport="large" show-caption="true"></gallery-component>
```

## Propiedades desde JavaScript

| Propiedad           | Tipo      | Descripción |
|--------------------|-----------|-------------|
| `.images`          | `Array`   | Lista de imágenes |
| `.activeIndex`     | `Number`  | Índice de la imagen actual (0 = primera) |
| `.viewport`        | `String`  | `'large'`, `'medium'` o `'small'` |
| `.showThumbnails`  | `Boolean` | `true` = se ven miniaturas |
| `.showCaption`     | `Boolean` | `true` = se ve el caption |
| `.showNavigators`  | `Boolean` | `true` = se ven los botones |
| `.fullscreen`      | `Boolean` | `true` = pantalla completa |

Ejemplo:

```javascript
galeria.viewport = 'large';
galeria.showThumbnails = false;
galeria.fullscreen = true;
```

## Eventos

| Evento               | Cuándo se dispara                 | Datos que envía |
|----------------------|-----------------------------------|-----------------|
| `slide-change`       | Al cambiar de imagen              | `{ index }` |
| `fullscreen-toggle`  | Con doble clic en la imagen       | — |
| `fullscreen-change`  | Al abrir o cerrar fullscreen      | `{ fullscreen }` |

Ejemplo:

```javascript
galeria.addEventListener('slide-change', (e) => {
  console.log('Imagen actual:', e.detail.index);
});

galeria.addEventListener('fullscreen-change', (e) => {
  console.log('Fullscreen:', e.detail.fullscreen);
});
```

## CSS Parts

Para personalizar estilos desde fuera del Shadow DOM:

```css
gallery-component::part(container)  { border-radius: 12px; }
gallery-component::part(image)      { object-fit: cover; }
gallery-component::part(thumbnails) { background: #f5f5f5; }
gallery-component::part(caption)    { color: #fff; }
gallery-component::part(prev-btn),
gallery-component::part(next-btn)   { background: #fff; }
gallery-component::part(close-btn)  { background: #fff; }
```

| Part           | Elemento |
|----------------|----------|
| `container`    | Galería entera |
| `slide`        | Área de la imagen principal |
| `image`        | La imagen grande |
| `caption`      | Texto sobre la imagen |
| `thumbnails`   | Tira de miniaturas |
| `thumb-track`  | Lista de miniaturas |
| `prev-btn`     | Botón anterior |
| `next-btn`     | Botón siguiente |
| `close-btn`    | Botón cerrar fullscreen |

## Tamaños (viewport)

| Valor    | Ancho total | Alto imagen | Alto miniaturas |
|----------|-------------|-------------|-----------------|
| `large`  | 1000px      | 440px       | 110px |
| `medium` | 803px       | 342px       | 110px |
| `small`  | 640px       | 274px       | 90px |

## Accesibilidad

| Qué hace | Cómo se implementa |
|----------|-------------------|
| Rol del componente | `role="region"` + `aria-roledescription="carousel"` |
| Slide actual | `role="group"` + `aria-roledescription="slide"` + `aria-label` dinámico |
| Miniaturas | `role="tablist"` / `role="tab"` + `aria-selected` |
| Navegación teclado | Flechas, Home, End, Enter, Space, Escape, F |
| Roving tabindex | Solo la miniatura activa tiene `tabindex="0"` |
| Fullscreen | Atributo `fullscreen` + botón cerrar |
| SVGs decorativos | `aria-hidden="true"` + `focusable="false"` |

### Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `←` `→` | Anterior / Siguiente imagen |
| `F` | Abrir / Cerrar pantalla completa |
| `Esc` | Cerrar pantalla completa |
| `Tab` | Navegar entre elementos |
| `Enter` / `Space` | Seleccionar miniatura |
| `Home` | Primera miniatura |
| `End` | Última miniatura |

## Demo

Abre `index.html` en tu navegador para ver el componente en acción con controles interactivos.

## Dependencias

-   Ninguna. Solo JavaScript del navegador (Custom Elements v1).
-   Tipografía: Montserrat (cargada desde Google Fonts en el CSS del componente).
