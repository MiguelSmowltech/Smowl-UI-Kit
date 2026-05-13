# Checkbox

Un componente que permite marcar o desmarcar una opción.

## Cómo se usa

1.  Añade el archivo `checkbox.js` a tu página.
2.  Usa la etiqueta `<checkbox-component>` en tu HTML.

## Ejemplo

```html
<script type="module" src="ruta/checkbox.js"></script>

<checkbox-component>Acepto las condiciones</checkbox-component>
<checkbox-component checked>Opción marcada</checkbox-component>
<checkbox-component disabled>Opción bloqueada</checkbox-component>
```

## Atributos

| Atributo    | ¿Qué hace?                             |
|-------------|----------------------------------------|
| `checked`   | Marca el checkbox desde el principio.  |
| `disabled`  | Bloquea el checkbox. No se puede usar. |
| `value`     | Guarda un texto para formularios.      |

## Propiedades desde JavaScript

| Propiedad    | Cómo se usa                           |
|-------------|---------------------------------------|
| `.checked`  | `miCheckbox.checked = true`           |
| `.disabled` | `miCheckbox.disabled = true`          |
| `.value`    | `miCheckbox.value` → devuelve el texto |

## Eventos

| Evento   | ¿Cuándo se dispara?              | Dónde está el estado |
|----------|----------------------------------|----------------------|
| `change` | Cuando se marca o desmarca       | `e.detail.checked`   |

## Demo

Abre `index.html` en tu navegador para ver el componente en acción.
