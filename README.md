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
├── tokens.css             → Variables CSS globales
├── .template/             → Plantilla con instrucciones
└── components/
    └── gallery/
        ├── gallery.html   → Estructura HTML del componente
        ├── gallery.css    → Estilos del componente
        ├── gallery.js     → Lógica del componente
        └── index.html     → Página de demostración
```

## tokens.css

El archivo `tokens.css` contiene todas las variables del sistema de diseño:
colores, espacios, bordes, tipografía.
Cada componente demo debe incluirlo en su página:

```html
<link rel="stylesheet" href="../../tokens.css">
```

Los componentes también tienen valores por defecto en su `:host`,
por lo que funcionan incluso sin `tokens.css`.

## Convenciones

-   Nombres de archivo: `kebab-case`
-   Etiqueta HTML: `kebab-case`
-   Clase en JavaScript: `PascalCase`
-   Sin dependencias. Solo JavaScript del navegador.
