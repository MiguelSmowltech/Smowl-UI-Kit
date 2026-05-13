const template = document.createElement('template');
template.innerHTML = `
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
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

  :host(:hover) .checkbox {
    border-color: var(--_check);
  }

  :host([checked]) .checkbox {
    background: var(--_check);
    border-color: var(--_check);
  }

  :host([checked]:hover) .checkbox {
    background: var(--_check-hover);
    border-color: var(--_check-hover);
  }

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

  .checkmark {
    width: 12px;
    height: 12px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  :host([checked]) .checkmark {
    opacity: 1;
  }

  :host(:focus-visible) .checkbox {
    outline: 2px solid var(--_check);
    outline-offset: 2px;
  }

  .label {
    color: var(--_label);
    font-size: 14px;
    line-height: 1.5;
    user-select: none;
  }
</style>
<div class="checkbox" aria-hidden="true">
  <svg class="checkmark" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>
<span class="label" part="label"><slot></slot></span>
`;

class CheckboxComponent extends HTMLElement {
  static observedAttributes = ['checked', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) {
    this.toggleAttribute('checked', !!val);
    this._updateAria();
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(val) {
    this.toggleAttribute('disabled', !!val);
    this._updateAria();
  }

  get value() { return this.getAttribute('value') || 'on'; }
  set value(val) { this.setAttribute('value', val); }

  connectedCallback() {
    this.setAttribute('role', 'checkbox');
    this._updateAria();
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._updateAria();
  }

  _updateAria() {
    this.setAttribute('aria-checked', this.checked);
    this.setAttribute('aria-disabled', this.disabled);
  }

  _onClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this._dispatch();
  }

  _onKeydown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._onClick();
    }
  }

  _dispatch() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { checked: this.checked }
    }));
  }
}

customElements.define('checkbox-component', CheckboxComponent);
