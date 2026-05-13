/* ============================================================
   COMPONENTE: gallery-component
   ============================================================
   Este archivo crea un elemento HTML personalizado.
   Se llama "gallery-component".

   Sirve para mostrar imágenes en una galería
   con miniaturas y pantalla completa.

   Cómo se usa en HTML:
   <gallery-component id="miGaleria"></gallery-component>

   Cómo se configura desde JavaScript:
   const galeria = document.getElementById('miGaleria');
   galeria.images = [ ... ];

   Más información:
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

// ================================================================
// PASO 1: Cargar el template desde gallery.html
// ================================================================
//
// El HTML y CSS del componente están en "gallery.html".
// Los cargamos aquí para separar el diseño del código.
//
// Usamos "top-level await" porque este archivo es un módulo.
// El navegador espera a que termine la carga antes de continuar.

const tmplResponse = await fetch(new URL('gallery.html', import.meta.url));
const tmplHtml = await tmplResponse.text();
const parser = new DOMParser();
const tmplDoc = parser.parseFromString(tmplHtml, 'text/html');
const template = tmplDoc.querySelector('#gallery-template');

// ================================================================
// PASO 2: Definir la clase del componente
// ================================================================
//
// ¿Qué es una clase?
// ------------------
// Una clase es como un molde o una receta.
// Cada vez que el navegador encuentra
// la etiqueta <gallery-component> en el HTML,
// usa esta clase para crear el elemento.
//
// La clase "extends HTMLElement" significa que
// este componente se comporta como cualquier
// elemento HTML (<div>, <button>, etc.).
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
    this._gap = 8;
    this._viewport = 'medium';
    this._showThumbnails = true;
    this._showCaption = false;
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
  // PROPIEDAD: fullscreen
  // ------------------------------------------------------------
  // Activa o desactiva la pantalla completa.

  get fullscreen() { return this.hasAttribute('fullscreen'); }
  set fullscreen(val) {
    this.toggleAttribute('fullscreen', !!val);
    this._dispatch('fullscreen-change', { fullscreen: !!val });
  }

// ==============================================================
  // connectedCallback()
  // ==============================================================
  //
  // ¿Qué hace?
  // ----------
  // Se ejecuta AUTOMÁTICAMENTE cuando el componente
  // se añade a la página.
  //
  // ¿Qué pasa aquí?
  // ----------------
  // 1. Buscamos los elementos del Shadow DOM
  //    (mainImage, thumbTrack, caption, botones...)
  // 2. Conectamos los botones a sus funciones
  // 3. Conectamos el teclado para las miniaturas
  // 4. Conectamos el doble clic para fullscreen
  // 5. Aplicamos el tamaño inicial y dibujamos todo
  //
  // Nota: La función $(id) es una forma corta de escribir
  //   this.shadowRoot.getElementById('mainImage')
  // En lugar de eso, escribimos:
  //   this.$('mainImage')

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

    // Botón de cerrar pantalla completa
    this._closeBtn = this.$('closeBtn');
    this._closeBtn.addEventListener('click', () => {
      this.fullscreen = false;
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
    this._mainImage.alt = d.alt || 'Imagen ' + (this._activeIndex + 1);
    this._mainImage.setAttribute('aria-describedby',
      this._showCaption && d.title ? 'caption' : '');
    this._mainImage.classList.toggle('gallery__image--error', !!d.error);
    this._mainImage.classList.toggle('gallery__image--incidencia', !!d.incidencia);

    // Anunciamos el número de slide para lectores de pantalla
    const slideLabel = 'Slide ' + (this._activeIndex + 1) + ' of ' + this._images.length;
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
        + (item.error ? ' gallery__thumb--error' : '')
        + (item.incidencia ? ' gallery__thumb--incidencia' : '');
      btn.role = 'tab';
      btn.setAttribute('aria-selected', i === this._activeIndex);
      btn.setAttribute('aria-current', i === this._activeIndex ? 'true' : 'false');
      btn.setAttribute('aria-controls', 'galleryMain');
      btn.setAttribute('aria-label',
        item.alt || 'Imagen ' + (i + 1));
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
    const thumbW = firstThumb ? firstThumb.offsetWidth : 164;
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
