# Progreso – tareas

> Lo escriben los agentes en `/build`, al terminar cada tarea. Es lo primero que lee una sesión nueva para retomar el trabajo.

## Estado

| Tareas | Passing | Failing | Blocked |
|---|---|---|---|
| 11 | 7 | 4 | 0 |

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
