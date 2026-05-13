/* ============================================================
   COMPONENTE: icon-button
   ============================================================
   Botón con icono SVG.

   Cómo se usa:
     <icon-button aria-label="Anterior">
       <svg viewBox="0 0 24 24">
         <path d="..."/>
       </svg>
     </icon-button>

   Atributos:
     disabled  → Deshabilita el botón
     aria-label → Texto para accesibilidad (obligatorio)

   Eventos:
     click  → Cuando se pulsa el botón
   ============================================================ */

// Cargar el template desde icon-button.html
const tmplResp = await fetch(new URL('icon-button.html', import.meta.url));
const tmplHtml = await tmplResp.text();
const parser = new DOMParser();
const tmplDoc = parser.parseFromString(tmplHtml, 'text/html');
const template = tmplDoc.querySelector('#icon-button-template');

class IconButton extends HTMLElement {

  static observedAttributes = ['disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) { this.toggleAttribute('disabled', !!val); }

  connectedCallback() {
    this._btn = this.shadowRoot.getElementById('btn');
    this._btn.addEventListener('click', (e) => {
      if (this.disabled) {
        e.stopImmediatePropagation();
        return;
      }
    });
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
  }
}

customElements.define('icon-button', IconButton);
