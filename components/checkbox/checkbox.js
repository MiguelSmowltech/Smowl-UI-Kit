/* ============================================================
   COMPONENTE: checkbox-component
   ============================================================
   Este archivo crea un elemento personalizado HTML.
   Se llama "checkbox-component".
   Sirve para marcar o desmarcar una opción.

   Cómo se usa en HTML:
   <checkbox-component>Texto de la opción</checkbox-component>

   Más información en:
   https://github.com/MiguelSmowltech/Smowl-UI-Kit
   ============================================================ */

// === PASO 1: Crear el template del componente =================
//
// Un "template" es un trozo de HTML que el navegador guarda
// en memoria. No se ve hasta que lo usamos.
// Aquí ponemos todo lo que necesita el checkbox:
//   - Los estilos (cómo se ve)
//   - La estructura HTML (las partes del checkbox)
//
// La etiqueta <style> dentro del template solo afecta
// a este componente. No afecta al resto de la página.
// Esto se llama "Shadow DOM" y es una protección.

const template = document.createElement('template');
template.innerHTML = `
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  /* ============================================================
     ESTILOS DEL CHECKBOX
     ============================================================
     Aquí se define cómo se ve el componente.
     - Uso variables CSS (colores, bordes, etc.)
     - Los colores se pueden cambiar desde fuera
     ============================================================ */

  /* :host es el componente entero.
     Todo lo que pongas aquí afecta al conjunto. */
  :host {
    --_bg: #fff;
    --_border: #EBEBEE;
    --_check: #0092D1;
    --_check-hover: #0078b3;
    --_disabled: #E0E0E4;
    --_label: #1C304B;
    --_label-disabled: #ADADB5;
    --radius: 4px;

    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
  }

  /* El cuadradito que se ve en pantalla */
  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid var(--_border);
    border-radius: var(--radius);
    background: var(--_bg);
    transition: all 0.15s;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* Cuando pasas el ratón por encima */
  :host(:hover) .checkbox {
    border-color: var(--_check);
  }

  /* Cuando está marcado */
  :host([checked]) .checkbox {
    background: var(--_check);
    border-color: var(--_check);
  }

  /* Cuando está marcado y pasas el ratón */
  :host([checked]:hover) .checkbox {
    background: var(--_check-hover);
    border-color: var(--_check-hover);
  }

  /* Cuando está deshabilitado (no se puede usar) */
  :host([disabled]) {
    cursor: default;
    pointer-events: none;
  }

  :host([disabled]) .checkbox {
    background: var(--_disabled);
    border-color: var(--_disabled);
  }

  :host([disabled][checked]) .checkbox {
    background: var(--_disabled);
    border-color: var(--_disabled);
  }

  :host([disabled]) .label {
    color: var(--_label-disabled);
  }

  /* El icono de check (el tick blanco) */
  .checkmark {
    width: 12px;
    height: 12px;
    opacity: 0;          /* No se ve cuando no está marcado */
    transition: opacity 0.15s;
  }

  /* Cuando está marcado, el tick se ve */
  :host([checked]) .checkmark {
    opacity: 1;
  }

  /* El borde que aparece al usar el teclado (accesibilidad) */
  :host(:focus-visible) .checkbox {
    outline: 2px solid var(--_check);
    outline-offset: 2px;
  }

  /* El texto que acompaña al checkbox */
  .label {
    color: var(--_label);
    font-size: 14px;
    line-height: 1.5;
    user-select: none;
  }
</style>

<!-- ============================================================
     ESTRUCTURA HTML DEL CHECKBOX
     ============================================================
     El checkbox tiene 2 partes:
     1. El cuadradito con el tick
     2. El texto (la etiqueta)

     La etiqueta <slot> permite poner texto desde fuera.
     Por ejemplo:
       <checkbox-component>Mi texto</checkbox-component>
     El texto "Mi texto" aparece dentro del <slot>.
     ============================================================ -->

<div class="checkbox" aria-hidden="true">
  <svg class="checkmark" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>
<span class="label" part="label"><slot></slot></span>
`;

// === PASO 2: Definir la clase del componente ===================
//
// Una clase es como un molde.
// Cada vez que usamos <checkbox-component> en el HTML,
// el navegador usa este molde para crear el elemento.
//
// La palabra "extends HTMLElement" significa que
// este componente se comporta como cualquier elemento HTML
// (como un <div> o un <button>).

class CheckboxComponent extends HTMLElement {

  // ------------------------------------------------------------
  // observedAttributes
  // ------------------------------------------------------------
  // Aquí se dice qué atributos HTML queremos vigilar.
  // Cuando cambian, el componente reacciona solo.
  //
  // Atributos disponibles:
  //   checked   → true/false  (marcado o no)
  //   disabled  → true/false  (se puede usar o no)

  static observedAttributes = ['checked', 'disabled'];

  // ------------------------------------------------------------
  // constructor()
  // ------------------------------------------------------------
  // Esto se ejecuta 1 vez, cuando se crea el componente.
  // Aquí:
  //   1. Abrimos el Shadow DOM (para aislar estilos)
  //   2. Copiamos el template dentro del componente

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // ------------------------------------------------------------
  // PROPIEDAD: checked
  // ------------------------------------------------------------
  // Indica si el checkbox está marcado o no.
  //
  // Se puede leer:
  //   componente.checked    → devuelve true o false
  //
  // Se puede escribir:
  //   componente.checked = true    → lo marca
  //   componente.checked = false   → lo desmarca
  //
  // También se puede usar como atributo HTML:
  //   <checkbox-component checked>

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) {
    this.toggleAttribute('checked', !!val);
    this._updateAria();
  }

  // ------------------------------------------------------------
  // PROPIEDAD: disabled
  // ------------------------------------------------------------
  // Indica si el checkbox está deshabilitado.
  // Cuando está deshabilitado, no se puede hacer clic.

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) {
    this.toggleAttribute('disabled', !!val);
    this._updateAria();
  }

  // ------------------------------------------------------------
  // PROPIEDAD: value
  // ------------------------------------------------------------
  // El valor del checkbox. Sirve para formularios.
  // Por defecto vale "on".

  get value() { return this.getAttribute('value') || 'on'; }
  set value(val) { this.setAttribute('value', val); }

  // ------------------------------------------------------------
  // connectedCallback()
  // ------------------------------------------------------------
  // Esto se ejecuta cuando el componente se añade a la página.
  //
  // Aquí:
  //   1. Decimos que este elemento es un checkbox (role)
  //   2. Actualizamos los atributos de accesibilidad (aria)
  //   3. Escuchamos clics y teclas
  //   4. Damos un tabindex para que se pueda navegar con teclado

  connectedCallback() {

    // "role" le dice a los lectores de pantalla
    // que esto es un checkbox
    this.setAttribute('role', 'checkbox');

    // Actualizamos aria-checked y aria-disabled
    this._updateAria();

    // Escuchamos eventos
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);

    // Tabindex permite llegar al checkbox
    // pulsando la tecla TAB
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  // ------------------------------------------------------------
  // disconnectedCallback()
  // ------------------------------------------------------------
  // Se ejecuta cuando el componente se quita de la página.
  // Aquí limpiamos los eventos para no dejar basura.

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  // ------------------------------------------------------------
  // attributeChangedCallback()
  // ------------------------------------------------------------
  // Se ejecuta cuando cambia un atributo HTML.
  // Por ejemplo, si alguien hace:
  //   componente.setAttribute('checked', '')
  // Este método se llama solo.

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._updateAria();
  }

  // ------------------------------------------------------------
  // _updateAria()
  // ------------------------------------------------------------
  // Actualiza los atributos de accesibilidad.
  // Los lectores de pantalla necesitan saber:
  //   - Si el checkbox está marcado (aria-checked)
  //   - Si el checkbox está deshabilitado (aria-disabled)

  _updateAria() {
    this.setAttribute('aria-checked', this.checked);
    this.setAttribute('aria-disabled', this.disabled);
  }

  // ------------------------------------------------------------
  // _onClick()
  // ------------------------------------------------------------
  // Qué pasa cuando se hace clic:
  //   1. Si está deshabilitado, no hace nada
  //   2. Cambia el estado (marcado ↔ desmarcado)
  //   3. Avisa con un evento "change"

  _onClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this._dispatch();
  }

  // ------------------------------------------------------------
  // _onKeydown()
  // ------------------------------------------------------------
  // Qué pasa cuando se pulsa una tecla:
  //   - Espacio (Space) → marca o desmarca
  //   - Enter → marca o desmarca

  _onKeydown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._onClick();
    }
  }

  // ------------------------------------------------------------
  // _dispatch()
  // ------------------------------------------------------------
  // Lanza un evento "change" para que otros programas
  puedan escucharlo.
  //
  // Ejemplo desde JavaScript:
  //   componente.addEventListener('change', (e) => {
  //     console.log(e.detail.checked);
  //   });
  //
  // Ejemplo desde el HTML (no soportado directamente,
  // pero se puede hacer con JavaScript).

  _dispatch() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,      // El evento sube por el árbol HTML
      composed: true,     // El evento sale del Shadow DOM
      detail: { checked: this.checked }
    }));
  }
}

// === PASO 3: Registrar el componente ===========================
//
// Le decimos al navegador: "Cuando veas la etiqueta
// <checkbox-component>, usa la clase CheckboxComponent".
//
// A partir de aquí, cualquier <checkbox-component>
// en el HTML ya funciona.

customElements.define('checkbox-component', CheckboxComponent);
