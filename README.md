# Smowl UI Kit

Componentes HTML reutilizables. Sin frameworks.
Cada componente es un elemento HTML personalizado.

## Cómo se usa

```html
<script type="module" src="components/gallery/gallery.js"></script>

<gallery-component id="miGaleria"></gallery-component>

<script type="module">
  import './components/gallery/gallery.js';

  const galeria = document.getElementById('miGaleria');
  galeria.images = [
    { src: 'foto.jpg', thumb: 'miniatura.jpg', alt: 'Descripción' }
  ];
</script>
```

## Componentes

| Componente | Etiqueta HTML | ¿Qué hace? |
|---|---|---|
| [Gallery](components/gallery/) | `<gallery-component>` | Muestra imágenes con miniaturas y pantalla completa |

## Estructura del proyecto

```
├── README.md
├── .template/           → Plantilla con instrucciones
└── components/
    └── gallery/
        ├── gallery.js   → El componente
        └── index.html   → Página de demostración
```

## Convenciones

-   Nombres de archivo: `kebab-case`
-   Etiqueta HTML: `kebab-case`
-   Clase en JavaScript: `PascalCase`
-   Sin dependencias. Solo JavaScript del navegador.
