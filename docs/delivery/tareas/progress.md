# Progreso – tareas

> Lo escriben los agentes en `/build`, al terminar cada tarea. Es lo primero que lee una sesión nueva para retomar el trabajo.

## Estado

| Tareas | Passing | Failing | Blocked |
|---|---|---|---|
| 11 | 11 | 0 | 0 |

## Bloqueos

Lo que contradice la spec o el plan, o un test que parece mal. No se improvisa: se resuelve volviendo a G1 o G2.

| # | Tarea | Qué pasa | Quién lo resuelve |
|---|---|---|---|

## Registro

<!-- Una entrada por tarea, la más reciente arriba:
### T-01 · <fecha> · <agente>
- **Hecho:**
- **Verificado con:**
- **Aprendido:**
- **Queda:**
-->

### T-11 · 02-11-2026 · developer
- **Hecho:** estilos de fila según `states.md` (fallos 3, 4 y 5 de la verificación parcial 2). "Guardar" pasa a botón secundario (`src/app.js`, sin `button-primary`); regla `.task-check:disabled` con opacidad 0.5 y cursor `not-allowed`; desde 480 px el formulario de edición es una cuadrícula con el campo a la izquierda, "Guardar" y "Cancelar" a la derecha y el error debajo del campo (`src/styles.css`, solo clases). CA-44 ya pasaba.
- **Verificado con:** `npx playwright test` completo: 91 en verde, 0 en rojo; `scripts/check.sh` en verde.
- **Aprendido:** el error va dentro del formulario entre campo y botones en el DOM; la cuadrícula lo coloca sin cambiar el orden de tabulación.
- **Queda:** decisiones de QA sin resolver (doble toque en "Editar" a 360 px; tarea guardada de 250 caracteres). La decisión 2 de `plan.md` conviene reflejarla en `/close` (T-10).

### T-10 · 02-11-2026 · developer
- **Hecho:** CA-28 y CA-45 ya pasaban con lo construido en T-05 a T-09, sin cambios. Se corrige el fallo 2 de la verificación parcial 2 (DP-06): al redibujar con errores visibles, sus mensajes se volvían a insertar dentro de `role="alert"` y un lector los anunciaría otra vez. En `src/app.js`, el error de añadir ya no se reconstruye si está a la vista, y la fila en edición se reutiliza mientras siga abierta la misma edición: se pone al día en su sitio (`syncEditRow`) y las demás filas se colocan alrededor sin moverla (`placeRows`). El error sigue anunciándose al aparecer.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-28:|CA-45:"` (3 en verde), `e2e/tareas/hallazgos-qa.spec.js` y `hallazgos-qa-filas.spec.js` (los dos de DP-06 en verde; quedan en rojo los 3 de `states.md`, de T-11) y `scripts/check.sh` en verde. Suite completa: 88 en verde y 3 en rojo, los de T-11. Con un script temporal fuera del repositorio se comprobó además que los dos errores sí se anuncian al aparecer, y que con la fila reutilizada lo escrito se conserva al marcar otras filas, Guardar, Esc y reabrir funcionan, el error se va al cerrar y añadir con una edición abierta no la toca.
- **Aprendido:** mover un nodo dentro de la lista cuenta como insertarlo de nuevo; para no re-anunciar hay que dejar la fila quieta y colocar las demás alrededor.
- **Queda:** la decisión 2 de `plan.md` dice "se redibuja la lista entera"; ahora es así salvo la fila en edición, que se reutiliza. Conviene reflejarlo en `/close`. Para UX: repetir Guardar o Añadir vacío con el error ya visible no lo vuelve a anunciar (se toma DP-06 al pie de la letra, "al aparecer").

### T-09 · 02-11-2026 · developer
- **Hecho:** aviso "No se han podido guardar los cambios." (`#save-slot`, `role="status"`, después del de lectura, DP-08) y `persist()` en `src/app.js`, usado al añadir, marcar, editar y borrar: solo un guardado correcto pone `readable = true` (RN-13, también fallo 2 de la verificación 1) y el siguiente guardado correcto quita el aviso (CA-31). Cubre CA-25, CA-30, CA-31 y CA-32.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-25:|CA-30:|CA-31:|CA-32:"` (4 en verde), `e2e/tareas/hallazgos-qa.spec.js` y `hallazgos-qa-filas.spec.js` (RN-13 en verde) y `scripts/check.sh` en verde. Suite de `e2e/tareas`: 87 en verde y 4 en rojo, todos de T-10 y T-11 (DP-06 y tres de `states.md`).
- **Aprendido:** había cuatro caminos con el mismo fallo; centralizarlos en `persist()` evita que uno quede suelto.
- **Queda:** DP-06 (T-10) y los estilos de Guardar, casilla deshabilitada y posición de botones (T-11).

### T-08 · 01-11-2026 · developer
- **Hecho:** los CA-33 a CA-36 ya pasaban con lo construido en T-06 y T-07, sin cambios. Se corrige un fallo que esos tests no ven: Esc se escuchaba en toda la lista, así que con B en edición y "B2" escrito, un Esc con el foco en la casilla o un botón de otra fila cancelaba B y perdía lo escrito (también en la confirmación). Ahora Esc solo actúa desde la fila abierta (decisión 5 de `plan.md`). Único cambio de código: el `keydown` de `src/app.js`.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-33:|CA-34:|CA-35:|CA-36:"` (4 en verde) y `scripts/check.sh` en verde. La suite completa da 60 en verde y 5 en rojo, los mismos antes y después del cambio: CA-25, CA-30, CA-31, CA-32 y RN-13, de T-09. El arreglo de Esc se comprobó en Chromium con un script temporal fuera del repositorio, que falló antes del cambio y pasó después; también comprobó que el error de la fila se conserva al marcar otra y se va al abrir otra, y que reabrir B muestra el texto original.
- **Aprendido:** un test en verde antes de empezar no demuestra la tarea: hay que probar también los casos vecinos.
- **Queda:** el arreglo de Esc no tiene test automático en el repositorio, porque `e2e/` es de QA y no hay tests de pantalla en `tests/unit/`. QA debería añadirlo: con B en edición y "B2" escrito, Esc con el foco en otra fila mantiene la edición y "B2"; lo mismo con la confirmación. Otra cosa sin tocar: al redibujar con un error de edición visible, su `role="alert"` se crea de nuevo y un lector de pantalla podría anunciarlo otra vez (a mirar en T-10).

### T-07 · 01-11-2026 · developer
- **Hecho:** borrar con confirmación en la fila: "Borrar" abre "¿Borrar esta tarea?" con "Borrar" (destructivo, nombre "Borrar tarea: B") y "Cancelar"; foco en Cancelar; Cancelar/Esc devuelven el foco a "Borrar" de la fila; confirmar usa `removeTask`, guarda y deja el foco en el campo de añadir. Casilla deshabilitada y "Editar" ausente en confirmación.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-20:|CA-21:|CA-22:|CA-23:|CA-37:|CA-48:"` (6 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** `state.openRow` ya admitía `mode: "confirm"`, solo faltaba pintarlo.
- **Queda:** una sola fila abierta (T-08), fallo de guardado (T-09), foco y estilos finos (T-10, T-11).

### T-06 · 01-11-2026 · developer
- **Hecho:** edición en la fila: Editar abre campo con el texto seleccionado, Guardar/Enter (`editTask`), Cancelar/Esc, error de vacío bajo el campo con foco en él; lo escrito vive en `state.openRow`. Casilla deshabilitada mientras se edita.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-09:|CA-13:|...|CA-41:"` (12 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** el submit delegado en la lista basta (Enter y botón Guardar comparten camino).
- **Queda:** una sola fila abierta (T-08), fallo de guardado (T-09), foco y estilos finos (T-10, T-11).

### T-05 · 01-11-2026 · developer
- **Hecho:** casilla conectada con `setCompleted` (listener `change` delegado en la lista), guardado y foco que sigue a la casilla tras recolocar la fila.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-10:|CA-11:|CA-12:|CA-38:|CA-47:"` (5 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** el redibujado completo conserva el foco gracias a `data-control="check"`.
- **Queda:** nada.

### T-03 (reabierta por QA) · 01-11-2026 · developer
- **Hecho:** fallos 1, 3, 4, 5, 6, 7, 8 y 9 del informe. `favicon.ico` real en la raíz con `<link rel="icon">` (un `data:` lo bloquea la CSP); contenedores `role="alert"` (error de añadir) y `role="status"` (aviso de lectura) presentes desde el inicio, con el error antes del aviso; campo con error a 2 px; aviso de lectura como bloque con borde `--warn`, fondo `--surface`, icono y texto `--fg`; la lista se oculta cuando está vacía; placeholder en `--muted`; `maxLength` del campo tomado de `MAX_TEXT_LENGTH` en `app.js`.
- **Verificado con:** `npx playwright test e2e/tareas`: pasan CA-01..08, 26, 27, 29 (incluido el de navegador completo), 42, 43, 46, 49, smoke y todos los de `hallazgos-qa` salvo RN-13; `scripts/check.sh` en verde.
- **Aprendido:** el aviso de lectura no se reconstruye en cada redibujado para no re-anunciarlo.
- **Queda:** fallo 2 (RN-13) y CA-30, de T-09. Los otros fallos en rojo son de T-05 a T-11.

### T-04 · 01-11-2026 · developer
- **Hecho:** formulario de añadir conectado (botón y Enter) con `addTask`, guardado, error de vacío, campo vacío y con foco, y `maxlength="200"` en el campo. El mensaje de vacío pasó a crearse/quitarse del DOM (`#empty-slot`) porque `hidden` seguía contando como texto en la página.
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-02:|...|CA-49:"` (12 en verde, más CA-01, CA-26, CA-29 y smoke) y `scripts/check.sh` en verde.
- **Aprendido:** `preventDefault()` en el submit no choca con `form-action 'none'`, y `maxlength` no parte el emoji al pegar (riesgos de plan.md comprobados).
- **Queda:** el fallo de guardado (T-09) aún no muestra aviso.

### T-03 · 01-11-2026 · developer
- **Hecho:** `index.html` nuevo (sin "Hola, mundo"), `src/styles.css` con tokens claro/oscuro y `src/app.js` con estado único, carga, lista, mensaje de vacío y aviso de lectura. Botones sin acción todavía; el foco tras redibujar queda preparado (`state.focus`).
- **Verificado con:** `npx playwright test e2e/tareas -g "CA-01:|CA-26:|CA-29:|smoke"` (5 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** el aviso de lectura solo existe en el DOM cuando toca; el mensaje de vacío usa `hidden`.
- **Queda:** conectar añadir (T-04), completar, editar y borrar; estilos de edición y confirmación llegan con sus tareas.

### T-02 · 01-11-2026 · developer
- **Hecho:** `src/storage.js` (STORAGE_KEY, loadTasks, saveTasks) y `tests/unit/storage.test.js`.
- **Verificado con:** `node --test tests/unit/storage.test.js` (10 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** loadTasks reutiliza isValidTaskList; sin clave da lista vacía legible y nunca escribe.
- **Queda:** nada.

### T-01 · 01-11-2026 · developer
- **Hecho:** `src/tasks.js` (addTask, editTask, setCompleted, removeTask, isValidTaskList, MAX_TEXT_LENGTH) y `tests/unit/tasks.test.js`.
- **Verificado con:** `node --test tests/unit/tasks.test.js` (15 en verde) y `scripts/check.sh` en verde.
- **Aprendido:** setCompleted con un id inexistente devuelve una copia sin cambios.
- **Queda:** nada.
