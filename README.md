# Smowl UI Kit

Framework-agnostic web component demos for the Smowltech Design System.

## Structure

```
components/
  gallery/
    gallery.js     — Custom Element (<gallery-component>)
    index.html     — Interactive demo with controls
```

## Usage

```html
<script type="module" src="components/gallery/gallery.js"></script>

<gallery-component id="myGallery"></gallery-component>

<script type="module">
  const gallery = document.getElementById('myGallery');
  gallery.images = [
    { src: '..., thumb: '...', alt: '...', title: '...', desc: '...' }
  ];
</script>
```

### Attributes

| Attribute         | Values                           | Default    |
|-------------------|----------------------------------|------------|
| `viewport`        | `large` / `medium` / `small`     | `medium`   |
| `show-thumbnails` | `true` / `false`                 | `true`     |
| `show-caption`    | `true` / `false`                 | `false`    |
| `show-navigators`  | `true` / `false`                 | `true`     |

### Properties

```js
gallery.images        // Array of { src, thumb, alt, title?, desc?, error? }
gallery.activeIndex   // Current slide index
gallery.viewport      // 'large' | 'medium' | 'small'
gallery.showThumbnails
gallery.showCaption
gallery.showNavigators
```

### Events

| Event               | Detail          | Description                    |
|---------------------|-----------------|--------------------------------|
| `slide-change`      | `{ index }`     | Emitted when active slide changes |
| `fullscreen-toggle` | —               | Emitted on image double-click  |

### CSS Parts

Use `::part()` to style from outside the Shadow DOM:

```css
gallery-component::part(container)  { border-radius: 8px; }
gallery-component::part(image)      { object-fit: contain; }
gallery-component::part(thumbnails) { background: #fff; }
gallery-component::part(prev-btn),
gallery-component::part(next-btn)   { background: #fff; }
gallery-component::part(caption)    { color: #fff; }
```

## Components

| Component | Description | Status |
|-----------|-------------|--------|
| [Gallery](components/gallery/) | Image gallery with thumbnails, fullscreen, keyboard nav | Active |
