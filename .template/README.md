# Plantilla para crear componentes

Cada componente sigue esta estructura:

```
components/mi-componente/
├── mi-componente.js    → El componente (Custom Element)
├── index.html          → Página de demostración
└── README.md           → Explicación rápida
```

## Reglas para escribir el código

### 1. Explica cada parte del código

Escribe comentarios que digan:

-   Qué hace cada trozo de código.
-   Por qué se hace así.
-   Cómo se usa desde fuera.

Usa frases cortas. Una idea por frase.

### 2. Separa el código en secciones

Usa líneas de separación como esta:

```
// ============================================================
// NOMBRE DE LA SECCIÓN
// ============================================================
```

### 3. Explica la API

Cada componente debe documentar:

| Qué          | Cómo se explica                                            |
|--------------|------------------------------------------------------------|
| Atributos    | Tabla con nombre, valores posibles, qué hace               |
| Propiedades  | Cómo se leen y escriben desde JavaScript                   |
| Eventos      | Cuándo se disparan, qué información llevan                 |
| CSS partes   | Qué partes se pueden personalizar con ::part()             |

### 4. La demostración (index.html)

La página de demostración debe mostrar:

-   El componente en diferentes estados (normal, marcado,
    deshabilitado, etc.)
-   El código HTML de cada ejemplo
-   Una tabla resumen con toda la API
-   Controles interactivos para probar el componente

## Lectura fácil

Escribe pensando en personas que:

-   No conocen el código
-   Tienen prisa y necesitan entender rápido
-   No hablan inglés técnico

### Cómo escribir

-   Usa palabras sencillas y cortas.
-   Una frase = una idea.
-   Explica las palabras difíciles.
-   Usa listas con viñetas.
-   Pon ejemplos que se puedan copiar y pegar.

### Cómo formatear

-   Usa títulos que digan de qué habla cada sección.
-   Separa las secciones con espacios en blanco.
-   Usa tablas para la información importante.
-   Los comentarios largos en el código deben tener
    una línea en blanco entre el texto y el código.
