---
paths:
  - "index.html"
  - "src/**"
---

# Código de la app

- Sin dependencias en la app ni paso de compilación: solo HTML, CSS y JavaScript que el navegador carga tal cual.
- Nada de red ni orígenes externos: la cabecera `Content-Security-Policy` de `index.html` no se relaja.
- El texto de las tareas se inserta con `textContent`, nunca como HTML.
- Solo `src/storage.js` toca `localStorage`. Si cambia la forma de los datos, cambia también la clave versionada (`tasks.v1`) y se actualiza `docs/architecture/data-model.md`.
- Los textos de la interfaz, en español; el código, en inglés.
