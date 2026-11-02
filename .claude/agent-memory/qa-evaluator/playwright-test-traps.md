---
name: playwright-test-traps
description: Trampas de Playwright en esta app que redibuja la lista, y cómo demostrar que un test en rojo podrá ponerse en verde y detecta fallos
metadata:
  type: feedback
---

Un test en rojo no demuestra nada si la app no existe: todos fallan por falta de elementos, incluidos los mal escritos. En Modo 2, además del rojo, ejecuta los tests contra una app de referencia e inyéctale fallos, sin escribirla en el proyecto. Cómo hacerlo sin archivos: [[qa-tests-en-memoria]].

**Why:** en `tareas` (01-11-2026), 65 fallos inyectados revelaron dos comprobaciones débiles que el rojo no mostraba: el foco de DP-02 con Intro (nunca salía del campo) y el nombre accesible tras escribir (no había redibujo).

**How to apply:**
- Usa `click()` en las casillas, no `check()`: la fila cambia de sitio al marcarla y `check()` comprueba después el elemento que ya no está.
- Para comprobar algo que depende del redibujo (lo escrito, los nombres accesibles), fuerza antes un redibujo, por ejemplo marcando otra fila.
- `-g` no distingue mayúsculas y también compara la ruta del archivo: comprueba con `--list` que cada `verify` de `tasks.json` selecciona justo sus tests. Por eso los títulos no citan otro CA con dos puntos y "smoke" solo aparece en `smoke.spec.js`.
- Con textos repetidos (RN-09), compara también el `id`: "Pan, Pan✓" sale igual si se completa la fila equivocada.
- Prepara los datos antes de `addInitScript` y recarga después: el fallo de `setItem` actúa desde la siguiente carga y no estorba al preparar.
- En zsh, `echo === texto` da error (`== not found`) y corta el comando.
