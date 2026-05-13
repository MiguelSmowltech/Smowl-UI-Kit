# Smowl UI Kit

Framework-agnostic web component demos for the Smowltech Design System.

## Structure

```
├── README.md
├── .template/                        — Template with conventions
└── components/
    └── component-name/
        ├── component-name.js         — Custom Element definition
        └── index.html                — Demo page
```

Each component is a **vanilla Custom Element** with:

- Shadow DOM for style encapsulation
- Attributes + properties for configuration
- Events for communication
- CSS `::part()` for external styling
- Zero framework dependencies

## Conventions

| Convention | Rule |
|---|---|
| File names | `kebab-case` |
| Element tag | `kebab-case` (e.g. `<gallery-component>`) |
| Class name | `PascalCase` (e.g. `GalleryComponent`) |
| Module | ES module (`type="module"`) |
| Dependencies | None (vanilla JS only) |

## Components

| Component | Tag | Description | Status |
|---|---|---|---|
| [Gallery](components/gallery/) | `<gallery-component>` | Image gallery with thumbnails, fullscreen, keyboard nav | Active |

## Usage

```html
<script type="module" src="components/gallery/gallery.js"></script>
<gallery-component id="gallery"></gallery-component>
<script type="module">
  import './components/gallery/gallery.js';
  document.getElementById('gallery').images = [
    { src: 'image.jpg', thumb: 'thumb.jpg', alt: 'Description' }
  ];
</script>
```
