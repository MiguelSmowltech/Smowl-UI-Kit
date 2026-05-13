/* ============================================================
   COMPONENTE: gallery-component
   ============================================================
   Este archivo crea un elemento personalizado HTML.
   Se llama "gallery-component".
   Sirve para mostrar imágenes en una galería
   con miniaturas y pantalla completa.

   Cómo se usa en HTML:
   <gallery-component id="miGaleria"></gallery-component>

   Más información en:
   https://github.com/MiguelSmowltech/Smowl-UI-Kit
   ============================================================ */

// === PASO 1: Crear el template del componente =================
//
// Un "template" es un trozo de HTML que el navegador guarda
// en memoria. No se ve hasta que lo usamos.
//
// Aquí ponemos todo lo que necesita la galería:
//   - Los estilos (cómo se ve)
//   - La estructura HTML (las partes de la galería)
//
// Los estilos dentro del template solo afectan
// a este componente. No afectan al resto de la página.
// Esto se llama "Shadow DOM".

const template = document.createElement('template');
template.innerHTML = `
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  /* ============================================================
     ESTILOS DE LA GALERÍA
     ============================================================
     Aquí se define cómo se ve el componente.
     Los colores se pueden cambiar desde fuera
     con las variables CSS.
     ============================================================ */

  :host {
    --color-brand-500: #0092D1;
    --color-danger-500: #C51321;
    --color-danger-100: #FBD0D4;
    --color-primary-700: #1C304B;
    --color-primary-800: #0B131E;
    --color-primary-100: #EBEBEE;
    --color-primary-600: #5C6573;
    --color-neutral-0: #FFFFFF;
    --radius-md: 8px;
    --radius-sm: 4px;
    --radius-round: 64px;
    --spacing-2xs: 8px;
    --gap: 16px;

    display: block;
    font-family: 'Montserrat', sans-serif;
  }

  /* La galería entera */
  .gallery {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    background: var(--color-primary-800);
    border-radius: var(--radius-md);
    overflow: hidden;
    position: relative;
  }

  /* Tamaños según el viewport */
  .gallery--large  { width: 1000px; }
  .gallery--medium { width: 803px; }
  .gallery--small  { width: 640px; }

  /* Pantalla completa */
  :host([fullscreen]) .gallery {
    position: fixed;
    inset: 0;
    width: 100vw !important;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    z-index: 9999;
  }

  :host([fullscreen]) .gallery__main {
    flex: 1;
    height: auto !important;
    min-height: 0;
  }

  :host([fullscreen]) .gallery__image {
    object-fit: contain;
  }

  :host([fullscreen]) .gallery__thumbnails {
    width: 100%;
    align-self: stretch;
  }

  :host([fullscreen]) .gallery__nav-btn { opacity: 1; }
  :host([fullscreen]) .gallery__nav--prev { left: 0; padding: 10px; }
  :host([fullscreen]) .gallery__nav--next { right: 0; padding: 10px; }

  /* Área donde se ve la imagen grande */
  .gallery__main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery--large  .gallery__main { height: 440px; }
  .gallery--medium .gallery__main { height: 342px; }
  .gallery--small  .gallery__main { height: 274px; }

  /* La imagen grande */
  .gallery__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  /* Cuando la imagen tiene un error */
  .gallery__image--error {
    border: 4px solid var(--color-danger-500);
    outline: 2px solid var(--color-danger-100);
    outline-offset: -6px;
    border-radius: var(--radius-md);
    box-sizing: border-box;
  }

  /* Botones de anterior y siguiente */
  .gallery__nav {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 10px 8px;
    z-index: 20;
  }

  .gallery__nav--prev { left: 0; }
  .gallery__nav--next { right: 0; }

  .gallery__nav-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-round);
    background: var(--color-neutral-0);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    opacity: 0;  /* Se ven solo al pasar el ratón */
  }

  .gallery__main:hover .gallery__nav-btn { opacity: 1; }
  .gallery__nav-btn.visible { opacity: 1; }
  .gallery__nav-btn:hover { opacity: 0.85; transform: scale(1.05); }
  .gallery__nav-btn:focus-visible { outline: 2px solid var(--color-brand-500); outline-offset: 2px; }
  .gallery__nav-btn svg { width: 24px; height: 24px; fill: var(--color-primary-700); }

  /* El texto que se superpone a la imagen */
  .gallery__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
    font-size: 14px;
    z-index: 10;
  }

  .gallery__caption-title { font-weight: 600; font-size: 16px; margin-bottom: 2px; }
  .gallery__caption-desc { font-size: 13px; opacity: 0.85; }

  /* Tira de miniaturas */
  .gallery__thumbnails {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: var(--spacing-2xs);
    background: var(--color-neutral-0);
    border-top: 1px solid var(--color-primary-100);
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }

  .gallery--large  .gallery__thumbnails,
  .gallery--medium .gallery__thumbnails { height: 110px; }
  .gallery--small  .gallery__thumbnails { height: 90px; }

  .gallery__thumb-scroll {
    display: flex;
    align-items: center;
    gap: var(--gap);
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .gallery--large  .gallery__thumb-scroll,
  .gallery--medium .gallery__thumb-scroll { height: 90px; }
  .gallery--small  .gallery__thumb-scroll { height: 74px; }

  .gallery__thumb-track {
    display: flex;
    gap: var(--gap);
    transition: transform 0.3s ease;
  }

  /* Cada miniatura */
  .gallery__thumb {
    flex-shrink: 0;
    border-radius: var(--radius-md);
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
    padding: 0;
    background: transparent;
    overflow: hidden;
  }

  .gallery--large  .gallery__thumb,
  .gallery--medium .gallery__thumb { width: 160px; height: 90px; }
  .gallery--small  .gallery__thumb { width: 130px; height: 74px; }

  .gallery__thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    pointer-events: none;
  }

  .gallery__thumb:hover { border-color: #0061F4; opacity: 0.85; }
  .gallery__thumb:focus-visible { outline: 2px solid var(--color-brand-500); outline-offset: 2px; }
  .gallery__thumb--active { border-color: #0061F4; opacity: 1; }
  .gallery__thumb--error { border: 4px solid var(--color-danger-500); }

  /* Botones para desplazar las miniaturas */
  .gallery__thumb-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--color-neutral-0);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    padding: 8px;
    border: 1px solid var(--color-primary-100);
  }

  .gallery__thumb-btn:hover { background: #f0f0f0; }
  .gallery__thumb-btn svg { width: 24px; height: 24px; fill: var(--color-primary-700); }
  .gallery__thumb-btn:disabled { opacity: 0.3; cursor: default; }
</style>

<!-- ============================================================
     ESTRUCTURA HTML DE LA GALERÍA
     ============================================================
     La galería tiene 2 partes:
     1. El área principal con la imagen grande
     2. La tira de miniaturas debajo

     Cada parte tiene sus botones de navegación.
     ============================================================ -->

<div class="gallery" id="gallery" role="region"
     aria-roledescription="carousel"
     aria-label="Galería de imágenes"
     part="container">

  <!-- ========== ÁREA PRINCIPAL ========== -->
  <div class="gallery__main" id="galleryMain"
       role="group" aria-roledescription="slide"
       aria-live="polite" aria-atomic="true"
       part="slide">

    <!-- Botón anterior -->
    <div class="gallery__nav gallery__nav--prev">
      <button class="gallery__nav-btn" id="navPrevBtn"
              aria-label="Imagen anterior"
              aria-controls="galleryMain"
              part="prev-btn">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
    </div>

    <!-- La imagen grande -->
    <img class="gallery__image" id="mainImage"
         src="" alt="" part="image" />

    <!-- Botón siguiente -->
    <div class="gallery__nav gallery__nav--next">
      <button class="gallery__nav-btn" id="navNextBtn"
              aria-label="Imagen siguiente"
              aria-controls="galleryMain"
              part="next-btn">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </div>

    <!-- Texto explicativo sobre la imagen -->
    <div class="gallery__caption" id="caption"
         aria-live="polite" part="caption">
    </div>
  </div>

  <!-- ========== TIRA DE MINIATURAS ========== -->
  <div class="gallery__thumbnails" id="thumbnails"
       role="region"
       aria-label="Miniaturas de la galería"
       part="thumbnails">

    <!-- Botón para ir a la izquierda -->
    <button class="gallery__thumb-btn" id="thumbPrev"
            aria-label="Anterior" part="thumb-prev">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>

    <!-- Contenedor de las miniaturas -->
    <div class="gallery__thumb-scroll">
      <div class="gallery__thumb-track" id="thumbTrack"
           role="tablist" aria-orientation="horizontal"
           aria-label="Lista de miniaturas"
           part="thumb-track"></div>
    </div>

    <!-- Botón para ir a la derecha -->
    <button class="gallery__thumb-btn" id="thumbNext"
            aria-label="Siguiente" part="thumb-next">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>
  </div>
</div>
`;

// ============================================================
// PASO 2: Definir la clase del componente
// ============================================================
//
// Una clase es como un molde.
// Cada vez que usamos <gallery-component> en el HTML,
// el navegador usa este molde para crear el elemento.

class GalleryComponent extends HTMLElement {

  // ------------------------------------------------------------
  // observedAttributes
  // ------------------------------------------------------------
  // Atributos HTML que queremos vigilar.
  // Cuando cambian, el componente reacciona solo.

  static observedAttributes = [
    'viewport',
    'show-thumbnails',
    'show-caption',
    'show-navigators',
    'fullscreen'
  ];

  // ------------------------------------------------------------
  // constructor()
  // ------------------------------------------------------------
  // Se ejecuta 1 vez, cuando se crea el componente.
  // Aquí abrimos el Shadow DOM y copiamos el template.

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Valores iniciales
    this._images = [];
    this._activeIndex = 0;
    this._thumbPage = 0;
    this._gap = 16;
    this._viewport = 'medium';
    this._showThumbnails = true;
    this._showCaption = false;
    this._showNavigators = true;
  }

  // ------------------------------------------------------------
  // PROPIEDAD: images
  // ------------------------------------------------------------
  // Las imágenes que se muestran en la galería.
  //
  // Cómo se usa:
  //   gallery.images = [
  //     {
  //       src: 'foto.jpg',       ← imagen grande
  //       thumb: 'miniatura.jpg', ← miniatura
  //       alt: 'Descripción',     ← texto alternativo
  //       title: 'Título',        ← título (opcional)
  //       desc: 'Explicación',    ← descripción (opcional)
  //       error: true             ← si falla al cargar (opcional)
  //     }
  //   ];

  get images() { return this._images; }
  set images(val) { this._images = val; this._render(); }

  // ------------------------------------------------------------
  // PROPIEDAD: activeIndex
  // ------------------------------------------------------------
  // La imagen que se está viendo ahora.
  // La primera imagen es la 0.

  get activeIndex() { return this._activeIndex; }
  set activeIndex(val) { this._goTo(val); }

  // ------------------------------------------------------------
  // PROPIEDAD: viewport
  // ------------------------------------------------------------
  // El tamaño de la galería.
  // Valores: 'large' (grande), 'medium' (mediano), 'small' (pequeño)

  get viewport() { return this._viewport; }
  set viewport(val) { this._viewport = val; this._applyViewport(); }

  // ------------------------------------------------------------
  // PROPIEDAD: showThumbnails
  // ------------------------------------------------------------
  // Muestra o esconde la tira de miniaturas.

  get showThumbnails() { return this._showThumbnails; }
  set showThumbnails(val) { this._showThumbnails = val; this._render(); }

  // ------------------------------------------------------------
  // PROPIEDAD: showCaption
  // ------------------------------------------------------------
  // Muestra o esconde el texto sobre la imagen.

  get showCaption() { return this._showCaption; }
  set showCaption(val) { this._showCaption = val; this._render(); }

  // ------------------------------------------------------------
  // PROPIEDAD: showNavigators
  // ------------------------------------------------------------
  // Muestra o esconde los botones anterior y siguiente.

  get showNavigators() { return this._showNavigators; }
  set showNavigators(val) { this._showNavigators = val; this._render(); }

  // ------------------------------------------------------------
  // PROPIEDAD: fullscreen
  // ------------------------------------------------------------
  // Activa o desactiva la pantalla completa.

  get fullscreen() { return this.hasAttribute('fullscreen'); }
  set fullscreen(val) {
    this.toggleAttribute('fullscreen', !!val);
  }

  // ------------------------------------------------------------
  // connectedCallback()
  // ------------------------------------------------------------
  // Se ejecuta cuando el componente se añade a la página.
  // Aquí conectamos los botones y preparamos todo.

  connectedCallback() {
    this.$ = (id) => this.shadowRoot.getElementById(id);
    this._mainImage = this.$('mainImage');
    this._thumbTrack = this.$('thumbTrack');
    this._caption = this.$('caption');
    this._navPrevBtn = this.$('navPrevBtn');
    this._navNextBtn = this.$('navNextBtn');
    this._thumbPrev = this.$('thumbPrev');
    this._thumbNext = this.$('thumbNext');
    this._gallery = this.$('gallery');

    // Conectamos los botones
    this._navPrevBtn.addEventListener('click', () => this._prev());
    this._navNextBtn.addEventListener('click', () => this._next());
    this._thumbPrev.addEventListener('click', () => {
      if (this._thumbPage > 0) { this._thumbPage--; this._render(); }
    });
    this._thumbNext.addEventListener('click', () => {
      this._thumbPage++; this._render();
    });

    // Navegación con teclado en las miniaturas
    this._thumbTrack.addEventListener('keydown', (e) => this._onThumbKeydown(e));

    // Doble clic en la imagen → pantalla completa
    this._mainImage.addEventListener('dblclick', () => {
      this._dispatch('fullscreen-toggle');
    });

    this._applyViewport();
    this._render();
  }

  // ------------------------------------------------------------
  // attributeChangedCallback()
  // ------------------------------------------------------------
  // Se ejecuta cuando cambia un atributo HTML.
  // Por ejemplo: <gallery-component show-caption="true">

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    switch (name) {
      case 'viewport':
        this._viewport = newVal || 'medium';
        if (this._mainImage) this._applyViewport();
        break;
      case 'show-thumbnails':
        this._showThumbnails = newVal !== 'false';
        if (this._mainImage) this._render();
        break;
      case 'show-caption':
        this._showCaption = newVal === 'true';
        if (this._mainImage) this._render();
        break;
      case 'show-navigators':
        this._showNavigators = newVal !== 'false';
        if (this._mainImage) this._render();
        break;
      case 'fullscreen':
        break;
    }
  }

  // ============================================================
  // MÉTODOS INTERNOS
  // ============================================================
  // Estos métodos empiezan con "_".
  // Solo se usan dentro del componente.

  // Aplica el tamaño de la galería
  _applyViewport() {
    const cls = this._gallery.className.replace(/gallery--\w+/g, '').trim();
    this._gallery.className = `gallery gallery--${this._viewport}`;
    this._thumbPage = 0;
    this._render();
  }

  // Dibuja todo el componente
  _render() {
    const d = this._images[this._activeIndex];
    if (!d) {
      this._mainImage.style.display = 'none';
      return;
    }
    this._mainImage.style.display = 'block';
    this._mainImage.src = d.src || '';
    this._mainImage.alt = d.alt || '';
    this._mainImage.setAttribute('aria-describedby',
      this._showCaption && d.title ? 'caption' : '');
    this._mainImage.classList.toggle('gallery__image--error', !!d.error);

    // Anunciamos el número de slide para lectores de pantalla
    const slideLabel = 'Slide ' + (this._activeIndex + 1)
      + ' of ' + this._images.length
      + (d.title ? ': ' + d.title : '');
    this.$('galleryMain').setAttribute('aria-label', slideLabel);

    this._renderThumbnails();
    this._renderCaption(d);
    this._updateNavVisibility();
  }

  // Dibuja las miniaturas
  _renderThumbnails() {
    this._thumbTrack.innerHTML = '';
    this._images.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery__thumb'
        + (i === this._activeIndex ? ' gallery__thumb--active' : '')
        + (item.error ? ' gallery__thumb--error' : '');
      btn.role = 'tab';
      btn.setAttribute('aria-selected', i === this._activeIndex);
      btn.setAttribute('aria-current', i === this._activeIndex ? 'true' : 'false');
      btn.setAttribute('aria-controls', 'galleryMain');
      btn.setAttribute('aria-label',
        item.alt + (item.title ? ': ' + item.title : ''));
      btn.tabIndex = i === this._activeIndex ? 0 : -1;
      btn.addEventListener('click', () => this._goTo(i));
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); this._goTo(i);
        }
      });

      const thumbImg = document.createElement('img');
      thumbImg.src = item.thumb || '';
      thumbImg.alt = '';
      thumbImg.setAttribute('aria-hidden', 'true');
      btn.appendChild(thumbImg);
      this._thumbTrack.appendChild(btn);
    });

    // Calculamos el desplazamiento
    const firstThumb = this._thumbTrack.querySelector('.gallery__thumb');
    const thumbW = firstThumb ? firstThumb.querySelector('img').offsetWidth : 160;
    const offset = this._thumbPage * (thumbW + this._gap);
    this._thumbTrack.style.transform = `translateX(-${offset}px)`;

    // Actualizamos los botones de desplazar
    const scrollEl = this._thumbTrack.parentElement;
    const trackW = scrollEl.clientWidth;
    const numVisible = Math.max(1,
      Math.floor((trackW + this._gap) / (thumbW + this._gap)));
    const maxPage = Math.max(0, this._images.length - numVisible);
    if (this._thumbPage > maxPage) this._thumbPage = maxPage;
    this._thumbPrev.disabled = this._thumbPage <= 0;
    this._thumbNext.disabled = this._thumbPage >= maxPage;
  }

  // Dibuja el texto sobre la imagen
  _renderCaption(d) {
    this._caption.innerHTML = '';
    if (this._showCaption && d.title) {
      const t = document.createElement('div');
      t.className = 'gallery__caption-title';
      t.textContent = d.title;
      this._caption.appendChild(t);
      if (d.desc) {
        const s = document.createElement('div');
        s.className = 'gallery__caption-desc';
        s.textContent = d.desc;
        this._caption.appendChild(s);
      }
    }
  }

  // Muestra o esconde los botones de navegación y miniaturas
  _updateNavVisibility() {
    const navPrev = this._navPrevBtn.closest('.gallery__nav');
    const navNext = this._navNextBtn.closest('.gallery__nav');
    this._navPrevBtn.classList.toggle('visible', this._showNavigators);
    this._navNextBtn.classList.toggle('visible', this._showNavigators);
    navPrev.style.display = this._showNavigators ? '' : 'none';
    navNext.style.display = this._showNavigators ? '' : 'none';
    this.$('thumbnails').style.display = this._showThumbnails ? '' : 'none';
  }

  // Va a una imagen en concreto
  _goTo(index) {
    this._activeIndex = index;
    this._render();
    this._dispatch('slide-change', { index });
  }

  // Va a la imagen anterior
  _prev() {
    this._goTo((this._activeIndex - 1 + this._images.length)
      % this._images.length);
  }

  // Va a la imagen siguiente
  _next() {
    this._goTo((this._activeIndex + 1) % this._images.length);
  }

  // Navegación con teclado en las miniaturas
  _onThumbKeydown(e) {
    const thumbs = this._thumbTrack.querySelectorAll('.gallery__thumb');
    if (!thumbs.length) return;
    let idx = this._activeIndex;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      idx = (idx + 1) % thumbs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      idx = (idx - 1 + thumbs.length) % thumbs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      idx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      idx = thumbs.length - 1;
    } else {
      return;
    }
    this._goTo(idx);
    setTimeout(() => {
      const t = this._thumbTrack.querySelectorAll('.gallery__thumb');
      t[idx]?.focus();
    }, 0);
  }

  // Lanza un evento para que otros programas puedan escucharlo
  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail: detail || {}
    }));
  }
}

// ============================================================
// PASO 3: Registrar el componente
// ============================================================
//
// Le decimos al navegador: "Cuando veas la etiqueta
// <gallery-component>, usa la clase GalleryComponent".
// A partir de aquí, cualquier <gallery-component>
// en el HTML ya funciona.

customElements.define('gallery-component', GalleryComponent);
