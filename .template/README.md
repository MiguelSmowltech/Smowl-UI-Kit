# Component Template

Standard structure for all components:

```
components/component-name/
├── component-name.js     — Custom Element (<component-name>), Shadow DOM
├── index.html            — Demo page showing usage and controls
└── .demo-assets/         — (optional) images, fonts, etc.
```

## Conventions

- File and folder names: **kebab-case**
- Custom Element tag: **kebab-case** (e.g. `<gallery-component>`)
- Class name: **PascalCase** (e.g. `GalleryComponent`)
- Module: ES module (`export class` / `customElements.define()`)
- Styles: encapsulated in Shadow DOM via `<template>`
- API: attributes + properties + events + CSS parts
- Framework: zero dependencies, vanilla web components only
