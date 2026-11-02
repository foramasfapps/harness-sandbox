# Arquitectura

> Estado: Aprobado (01-11-2026) · Actualizado en `/close` de `tareas` (02-11-2026) · Se escribe en G0 (B2 del playbook) y la mantiene el Arquitecto.

## Stack

| Pieza | Elección | Por qué | ADR |
|---|---|---|---|
| Interfaz | HTML, CSS y JavaScript puros, sin framework ni paso de compilación | Una pantalla con cuatro operaciones no justifica más piezas | 0001 |
| Librería de componentes | Ninguna | Los pocos controles son nativos del navegador | 0001 |
| Datos | `localStorage` del navegador | Sin cuentas ni servidor (D-01) | 0001 |
| Servidor local | `python3 -m http.server`, solo en `127.0.0.1` | El arnés ya exige `python3`, y los módulos de JavaScript no cargan abriendo el archivo directamente | — |
| Tests | `node --test` y Playwright | `node --test` viene con Node; Playwright es la única dependencia y solo se usa en desarrollo | — |
| Comprobación de tipos y lint | Sin configurar | Evita dependencias en una app tan pequeña; `scripts/check.sh` lo avisa y sigue | — |

## Entornos

| Entorno | Para qué | Datos |
|---|---|---|
| Local | Desarrollo, agentes y revisión en G3 | `localStorage` del navegador local; los tests preparan sus propios datos |
| Vista previa | No se despliega; en G3 se revisa en local | — |
| Producción | No hay | — |

No hay base de datos, migraciones ni datos de producción a los que proteger.

## Estructura del código

| Ruta | Qué vive ahí |
|---|---|
| `index.html` | La página, con los contenedores de avisos ya presentes |
| `favicon.ico` | Icono de la página. Sin él, el navegador registra un error 404 en consola (CA-29) |
| `src/tasks.js` | Reglas de las tareas, sin tocar la pantalla ni el guardado: funciones puras que devuelven una lista nueva, `MAX_TEXT_LENGTH` e `isValidTaskList` |
| `src/storage.js` | Leer y guardar en `localStorage`. Es el único que lo toca y nunca lanza errores |
| `src/app.js` | Pantalla y eventos |
| `src/styles.css` | Estilos, solo con clases |
| `tests/unit/` | Tests unitarios del Developer |
| `tests/acceptance/` | Tests de aceptación sin pantalla (QA). Vacía de momento |
| `e2e/<feature>/` | Tests de aceptación y e2e con Playwright (QA) |

## Cómo funciona la pantalla

Sin framework, la pantalla sigue un patrón sencillo, fijado en `docs/delivery/tareas/plan.md` (decisiones 2 a 5 y "Cambios en la v1.1"):

- **Un único estado en memoria** en `src/app.js`: la lista, la fila abierta (`id`, modo `edit` o `confirm`, lo escrito y su error), dónde queda el foco y los avisos. Lo escrito vive en el estado, así que no se pierde al redibujar.
- **Tras cada acción se redibuja la lista**, con una excepción: la fila en edición se reutiliza mientras siga abierta la misma edición, y las demás filas se colocan a su alrededor sin moverla. Volver a insertarla haría que un lector de pantalla anunciara otra vez su error (DP-06).
- **Los avisos** (error de añadir, lectura y guardado) tienen su contenedor en `index.html` desde el principio (`role="alert"` o `role="status"`). Solo se rellenan al aparecer y no se reconstruyen mientras están a la vista, por la misma razón.
- **El foco** lo indica cada acción (tarea y control) y se aplica justo después de redibujar (RN-15).
- **Esc** solo actúa con el foco dentro de la fila abierta.
- **Guardar** pasa siempre por un único punto, que actualiza a la vez el aviso de lectura y el de guardado (RN-13, CA-25, CA-31).

## Seguridad

- No hay cuentas, secretos ni servidor propio.
- Una cabecera de seguridad en `index.html` (`Content-Security-Policy: default-src 'self'; base-uri 'none'; form-action 'none'`) impide al navegador cargar scripts externos y enviar datos fuera. Hace cumplir la regla "las tareas no salen del navegador". Por eso tampoco se admiten estilos en línea ni iconos `data:`.
- El texto de las tareas se inserta con `textContent`, nunca con `innerHTML`.
- `scripts/check-invariants.sh` comprueba estas dos reglas: rechaza llamadas de red y cualquier `https://` en `index.html` y `src/` (también en comentarios), exige la cabecera y rechaza `innerHTML` y similares en `src/`, incluso para vaciar (se usa `replaceChildren()`). También exige `lang="es"`.

## Tests

| Nivel | Qué cubre | Herramienta | Dónde |
|---|---|---|---|
| Unitario | Reglas de las tareas, guardado y cabecera de `index.html` | `node --test` | `tests/unit/` |
| Integración | No aplica: no hay base de datos ni permisos | — | — |
| Aceptación | Un test por criterio de aceptación (lo escribe QA). Si el CA depende de la pantalla, Playwright; si no, `node --test` | Playwright (Chromium) o `node --test` | `e2e/<feature>/`, o `tests/acceptance/<feature>/` sin pantalla |
| e2e | Carga de la página bajo la cabecera de seguridad y sin errores en consola (`smoke.spec.js`), y los hallazgos de QA | Playwright (Chromium) | `e2e/<feature>/` |

Reglas que conviene saber:

- `npm test`, y por tanto `scripts/check.sh`, ejecuta `tests/**`. Un test de aceptación en rojo en `tests/acceptance/` deja `check.sh` en rojo y el Developer no puede terminar ninguna tarea. Los tests que nacen en rojo van en `e2e/<feature>/`.
- `scripts/check.sh` no ejecuta Playwright: "en verde" no demuestra ningún CA de pantalla. Cada tarea los demuestra con su `verify` (Playwright filtrado por ID, `-g "CA-03:"`), y la CI ejecuta todo `e2e/`.
- Los tests se nombran `CA-03: …`, con dos puntos, para que el filtro por ID no coincida de más.
- Solo se prueba en Chromium de escritorio; el móvil, con un viewport de 360 px. Safari en iOS queda sin comprobar.

## Despliegue

Ninguno por ahora. La app se ejecuta en local y la revisión de G3 se hace ahí. Si más adelante hiciera falta publicarla, bastaría cualquier alojamiento de archivos estáticos con HTTPS, como GitHub Pages: `crypto.randomUUID()`, con el que se crean los `id`, solo existe en HTTPS o en `127.0.0.1`/`localhost`. Abrir el servidor local a la red para probar desde un móvil real rompería "Añadir".

## Cambios

### 02-11-2026 · `/close` de `tareas`

Motivo: aplicar lo propuesto en `docs/delivery/tareas/plan.md` (contradicciones 8 y 9) y reflejar lo construido.

- Tests: la aceptación pasa a Playwright en `e2e/<feature>/` cuando el CA depende de la pantalla, y se explican los límites de `check.sh`.
- Nueva sección "Cómo funciona la pantalla", con la excepción a la decisión 2 del plan (fila en edición reutilizada).
- Estructura: `favicon.ico`, `tests/acceptance/` y `e2e/<feature>/` por separado.
- Seguridad: la cabecera real (`base-uri` y `form-action`) y lo que ya comprueba `check-invariants.sh`, que antes figuraba como pendiente.
- Despliegue: requisito de HTTPS por `crypto.randomUUID()`.
