# Plan – tareas

> Estado: Implementado (02-11-2026) · Versión: 1.1 · Aprobado en G2 el 01-11-2026 · PRD: `docs/product/prd-01-tareas.md` (v1.2, Aprobado) · Diseño: `docs/design/tareas/` (Aprobado, 01-11-2026)
> Lo escribe el Arquitecto en `/design`. Las tareas están en `tasks.json`; el avance, en `progress.md`.

## Resumen

Se sustituye el "Hola, mundo" por la app de la lista de tareas, en 11 tareas. Primero se construyen las reglas y el guardado, que se prueban sin navegador (T-01 y T-02). Después, la pantalla, operación a operación (T-03 a T-07). Al final se resuelve lo transversal: una sola fila abierta, fallos de guardado, foco y móvil (T-08 a T-11).

No cambia la forma de los datos ni hay migración. No hace falta ningún ADR nuevo: la única decisión difícil de revertir, dónde viven los datos, ya está en el ADR 0001.

`tasks.json` recoge las respuestas de G2: en las cinco preguntas de abajo se aplicó la opción A.

## Contradicciones encontradas

| # | Dónde | Qué pasa | Propuesta |
|---|---|---|---|
| 1 | PRD CA-06 frente a RF-03 | CA-06 pide que el `textContent` de "su fila" sea exactamente "Comprar pan". La fila también contiene los botones, así que su `textContent` real incluye "Editar" y "Borrar", y el criterio nunca se cumpliría al pie de la letra. | Entender "fila" como el elemento del texto de la tarea (`task-text`, ver Interfaces). Corregir la redacción en el PRD v1.2 (pregunta 5). |
| 2 | PRD CA-45 frente a RF-11 | El criterio comprueba que el nombre contenga "B", pero "Borrar" ya contiene una "B": el test pasaría sin indicar la tarea. Además, RF-11 habla de cada botón y CA-45 solo mira los de la fila normal. | QA compara los nombres completos de la tabla de Interfaces, también en edición y en confirmación. Sin CA nuevo. |
| 3 | `states.md` (DP-05) frente a PRD CA-20 y CA-22 | El nombre propuesto para el "Borrar" de la confirmación, "Confirmar borrado de: B", no contiene la palabra visible "Borrar" ("borrado" no la incluye). Un test que busque el botón "Borrar" no lo encuentra, y quien maneja la app por voz diciendo "Borrar" tampoco. | Usar "Borrar tarea: B", el mismo nombre que en la fila normal. Los dos botones nunca están a la vez. UX lo cambia en `states.md`. |
| 4 | PRD CA-28 (c) frente a RF-04 | En CA-28 se "escribe B2" en un campo que ya contiene "B" y se espera "B2". Solo es cierto si el texto queda seleccionado al abrir la edición. Si no, saldría "BB2". El PRD no lo dice; `states.md` lo propone como provisional. | Pregunta 1. |
| 5 | PRD CA-28 (a) frente a `flows.md` H1 | CA-28 empieza escribiendo "C", pero al abrir la página el foco no está en el campo (ni RN-15 ni el diseño lo piden). | Sin foco automático, que además evitaría abrir el teclado del móvil nada más entrar. El test de QA pulsa antes Tab una vez para llegar al campo. Se aclara en el PRD v1.2 (pregunta 5). |
| 6 | PRD RN-14 (hueco) | Dice que añadir no cancela la fila abierta, pero no qué pasa al marcar la casilla de otra fila mientras una está abierta. Hay que decidirlo para construir. | Pregunta 2. |
| 7 | PRD RN-12 frente a `data-model.md` | RN-12 da por válida una tarea guardada con `text` de solo espacios o con `id` repetido. El modelo dice que `text` no puede quedar vacío tras el recorte y que `id` es único, y RN-09 depende de ese `id`. Solo se llega ahí tocando los datos a mano. | Pregunta 3. |
| 8 | `docs/architecture/README.md` (Tests) y `/build` frente a los CA | La arquitectura pone la aceptación en `tests/acceptance/` con `node --test`, sin navegador. Pero los 49 CA piden pantalla, foco, estilos calculados, consola o recargar. Además, `npm test` ejecuta `tests/acceptance/`: cualquier test en rojo ahí deja `scripts/check.sh` en rojo y el Developer no podría terminar ninguna tarea, porque el arnés se lo impide. | Los 49 CA van en Playwright, en `e2e/tareas/`. Los tests propios del Developer van en `tests/unit/`. La tabla de arquitectura se corrige en `/close`. |
| 9 | `scripts/check.sh` frente a `/build` paso 4 | `check.sh` no ejecuta Playwright. Con la decisión anterior, "en verde" no demuestra ningún CA. | El campo `verify` de cada tarea ejecuta sus tests de Playwright por ID, y la CI y QA pasan todos. No se toca `check.sh`: los tests en rojo lo dejarían bloqueado. |
| 10 | `e2e/hello.spec.js` frente a T-03 | Ese test exige el título "Hola, mundo", que T-03 elimina. El Developer no puede editar `e2e/`, así que se quedaría bloqueado. | QA lo sustituye al escribir los tests por `e2e/tareas/smoke.spec.js`, que conserva lo valioso: la página carga bajo la política de seguridad y sin errores en consola. |
| 11 | Rama actual `feat/tareas` frente a `/build` y `/close` | Las dos skills usan `feature/tareas`. `/build` crearía otra rama y `/close` no encontraría el PR. | Pregunta 4. |
| 12 | `design-system.md` y su vista previa frente al PRD | El sistema no recoge la fila en confirmación ni los avisos que no dependen de un campo. La vista previa muestra una casilla activa en edición (RN-14 la deshabilita) y "Guardar" como botón principal (el sistema admite uno por vista). `states.md` ya resuelve todo a favor del PRD. | No bloquea. Se sigue `states.md` y el sistema de diseño se actualiza en `/close`. |

**Sobre las dudas de UX** (`flows.md`), sin objeción técnica a sus propuestas salvo DP-05 (contradicción 3). DP-02 y DP-03 son fáciles de construir con el foco tal como se plantea aquí. DP-06 se resuelve con un contenedor de avisos que siempre existe y solo tiene texto cuando hay aviso, lo que además cumple "no se ve el aviso" del PRD.

## Preguntas para la persona (G2)

Resueltas el 01-11-2026: opción A en todas. La rama ya es `feature/tareas` y el PRD ya está en la v1.2.

| # | Pregunta | Opciones | Recomendada y por qué |
|---|---|---|---|
| 1 | Al pulsar "Editar", ¿cómo queda el texto del campo? *(cambia el PRD: RF-04)* | **A.** Seleccionado: lo que se escriba lo sustituye. **B.** Con el cursor al final; CA-28 cambia para seleccionar antes de escribir. | **A.** Hace cierto CA-28 tal como está escrito y coincide con el diseño. A cambio, una tecla pulsada sin querer borra el texto, pero Esc lo recupera. Para corregir una letra basta una flecha. |
| 2 | Con una fila abierta, ¿qué pasa al marcar la casilla de otra fila? *(cambia el PRD: RN-14 y CA-35)* | **A.** La fila abierta sigue abierta y conserva lo escrito. **B.** Se cancela y se pierde lo escrito. | **A.** Es lo mismo que ya hace añadir una tarea. Solo abrir otra edición o confirmación cierra la anterior, y así no se pierde lo escrito por un toque en otra parte. |
| 3 | ¿Qué se hace con datos guardados que cumplen RN-12 pero rompen el modelo? *(cambia el PRD: RN-12 y CA-29)* | **A.** Se tratan como ilegibles si un `text` solo tiene espacios o si hay un `id` vacío o repetido. Un texto de más de 200 caracteres se acepta y se muestra. **B.** Se deja RN-12 como está. | **A.** Son dos comprobaciones y evitan filas en blanco y acciones que afectarían a dos filas. Más de 200 no se rechaza porque no rompe nada y no conviene perder una lista por eso. Añade dos valores a CA-29, sin CA nuevos. |
| 4 | ¿Cómo se resuelve el nombre de la rama? *(proceso)* | **A.** Renombrar `feat/tareas` a `feature/tareas`. **B.** Cambiar `/build` y `/close`. | **A.** La rama no tiene commits propios ni copia en GitHub, así que renombrarla no cuesta nada y el arnés queda intacto. Además, conviene hacer commit del PRD, el diseño y este plan antes de `/build`: hoy están sin confirmar en la carpeta de trabajo. |
| 5 | ¿Se recogen las aclaraciones de redacción en el PRD? *(cambia el PRD)* | **A.** Sí, en una v1.2 con las preguntas 1 a 3, CA-06, CA-28 (a) y CA-45, sin nuevos IDs. **B.** No, quedan solo en este plan. | **A.** QA escribe los tests a partir del PRD, y un documento aprobado no se contradice en silencio. Se mantienen 49 CA. |

## Decisiones técnicas

| # | Decisión | Por qué | ¿ADR? |
|---|---|---|---|
| 1 | Reparto de `docs/architecture/README.md`: reglas en `src/tasks.js`, `localStorage` solo en `src/storage.js`, pantalla en `src/app.js`, estilos en `src/styles.css`. RN-12 se comprueba en `tasks.js`; leer y convertir el JSON, en `storage.js`. | Ya aprobado, y permite probar las reglas sin navegador. | No |
| 2 | Un único estado en memoria (`tasks`, fila abierta, mensajes). La fila abierta guarda `id`, modo (`edit` o `confirm`), lo escrito y su error. Tras cada acción se redibuja la lista entera, salvo la fila en edición (ver "Cambios en la v1.1"). | Es lo más sencillo sin framework. Que lo escrito esté en el estado es lo que permite cumplir CA-35 aunque se redibuje. | No |
| 3 | Cada acción indica dónde queda el foco (tarea y control), y se aplica justo después de redibujar. | Mover o recrear una fila pierde el foco del navegador; así se cumple RN-15 de una sola manera. | No |
| 4 | Añadir y editar usan `<form novalidate>`, botón de envío y `preventDefault()`. "Cancelar" es `type="button"`. Sin `required`. | Intro funciona de forma nativa y no se dispara mientras se compone un carácter. Sin `required`, el navegador no muestra sus propios globos en lugar de los mensajes del PRD. | No |
| 5 | Esc se escucha en la fila abierta: funciona con el foco en cualquiera de sus controles, y no fuera de ella. | RF-04 y RF-05, y coincide con `flows.md`. | No |
| 6 | RN-08 se aplica con `maxLength` en los campos, con su valor tomado de `MAX_TEXT_LENGTH`. El código no recorta el texto. | El navegador ya descarta lo que sobra antes de recortar espacios (CA-49), y el 200 está en un solo sitio. | No |
| 7 | Se guarda la lista completa tras cada cambio correcto, también al guardar una edición sin cambios. Nunca se escribe al abrir. | Cumple CA-31 sin lógica extra y RN-13 (lo ilegible no se toca). | No |
| 8 | `storage.js` nunca lanza errores y accede a `window.localStorage` dentro de un `try`, en cada llamada y nunca al importar. | CA-30: el simple acceso puede fallar. | No |
| 9 | La app no escribe en consola al fallar la lectura o el guardado. | CA-29 exige consola sin errores. | No |
| 10 | Los 49 CA se prueban con Playwright (contradicción 8). | Todos dependen de la pantalla: incluso los de orden exigen el tachado calculado. | No |

**Trampas para el Developer** (las detectan los controles o los tests):

- La política de seguridad de `index.html` impide estilos en línea: nada de `style="…"` ni `setAttribute("style", …)`. Se usan clases y `src/styles.css`.
- `scripts/check-invariants.sh` rechaza `innerHTML` incluso para vaciar: se usa `replaceChildren()`. También rechaza cualquier `https://` en `src/`, aunque esté en un comentario.
- `getItem` devuelve `null` si la clave no existe, y eso es una lista vacía; el texto `"null"` guardado es ilegible (CA-29). Hay que comprobar que cada elemento es un objeto antes de leer sus campos (`[null]` no debe lanzar un error).
- El tachado va en el propio elemento `task-text`, no en la fila, porque el valor calculado no se hereda.
- Los `aria-label` llevan el texto de la tarea con `setAttribute`, usando el texto guardado y no lo que se está escribiendo.

## Cambios al modelo de datos

Sin migración: la forma de los datos no cambia, la clave sigue siendo `tasks.v1` y no hay nada desplegado. Lo que ya esté guardado en un navegador sigue siendo válido.

Propuesta para `docs/architecture/data-model.md` (versión 1), **que se aplica en `/close`**, en "Reglas de validación":

- *(PRD 01)* `text` admite como máximo 200 caracteres, contados como la longitud de JavaScript. Se aplica en los campos, antes de recortar los espacios (RN-08).
- *(PRD 01)* Lo guardado es válido si es una lista JSON en la que cada tarea tiene `id` de tipo texto, `text` de tipo texto no vacío y `completed` verdadero o falso. Basta una tarea inválida para tratar toda la lista como ilegible (RN-12). Si se aprueba la pregunta 3: `text` no puede tener solo espacios, ni `id` estar vacío o repetido.
- *(PRD 01)* La clave inexistente o `[]` es una lista vacía (RN-12).
- *(PRD 01)* Las tareas nuevas y las desmarcadas se colocan al principio de la lista guardada, y las completadas al final (RN-01 a RN-03).

También para `/close`: en `docs/architecture/README.md`, tabla de Tests, la aceptación pasa a "Playwright en `e2e/<feature>/` cuando el CA depende de la pantalla".

## Interfaces

### Datos

`localStorage`, clave `tasks.v1`: lista JSON de `{ "id": string, "text": string, "completed": boolean }`, en el orden de la pantalla.

### Pantalla (contrato de los tests)

Las filas se localizan por posición, nunca por texto, porque puede haber repetidas (RN-09). Con la tarea "B":

| Elemento | Localizador de Playwright | Nombre accesible completo |
|---|---|---|
| Campo de añadir | `page.getByRole("textbox", { name: "Nueva tarea" })` | Nueva tarea |
| Botón de añadir | `page.getByRole("button", { name: "Añadir", exact: true })` | Añadir |
| Lista | `page.getByRole("list", { name: "Tareas" })` | Tareas |
| Filas | `lista.getByRole("listitem")` (0 si no hay tareas) | — |
| Texto de la tarea | `fila.getByTestId("task-text")` (`data-testid`) | — |
| Casilla | `fila.getByRole("checkbox")` | B |
| Editar | `fila.getByRole("button", { name: /^Editar/ })` | Editar tarea: B |
| Borrar, fila normal | `fila.getByRole("button", { name: /^Borrar/ })` | Borrar tarea: B |
| Campo de edición | `fila.getByRole("textbox")` | Editar tarea: B |
| Guardar | `fila.getByRole("button", { name: /^Guardar/ })` | Guardar cambios de: B |
| Cancelar, en edición | `fila.getByRole("button", { name: /^Cancelar/ })` | Cancelar edición de: B |
| Borrar, en confirmación | `fila.getByRole("button", { name: /^Borrar/ })` | Borrar tarea: B |
| Cancelar, en confirmación | `fila.getByRole("button", { name: /^Cancelar/ })` | Cancelar borrado de: B |

- Los mensajes y avisos se localizan por su texto exacto del PRD. "Añade tu primera tarea." va fuera de la lista, así que nunca cuenta como fila.
- Cuando no hay aviso, su texto no está en la página. El título (`h1`) lo fija DP-01: ningún test depende de él.
- Orden de tabulación: campo de añadir, "Añadir", y fila a fila como indica `flows.md` H6. En la confirmación, "Borrar" va antes que "Cancelar".

### Notas para QA

- **Preparar datos:** `page.goto("/")`, escribir en `localStorage` con `page.evaluate` y `page.reload()`. No usar `addInitScript` para los datos, porque se repite en cada recarga y falsearía CA-22, CA-24 o CA-32.
- **Simular fallos:** con `addInitScript`, antes de abrir la página. Sustituir `Storage.prototype.setItem` para que lance `QuotaExceededError`, con una variable que permita recuperarlo en CA-31. Para CA-30, redefinir el acceso a `window.localStorage` para que lance `SecurityError`.
- **`B✓`:** comprueba tres cosas: casilla marcada, `completed: true` en `tasks.v1` y `textDecorationLine` de `task-text` igual a `line-through`. Conviene un único ayudante en `e2e/tareas/`.
- **Escribir frente a pegar:** `pressSequentially` para escribir. Para pegar, permisos de portapapeles y `ControlOrMeta+V`. Si el portapapeles resulta inestable en la CI, `keyboard.insertText` también respeta el máximo: se anota en `qa-report.md` si se usa.
- **CA-28:** empieza con un Tab (contradicción 5) y comprueba `activeElement` y `outline-style` tras cada tecla.
- **CA-44:** viewport de 360 px; el proyecto usa 1280 px por defecto.
- **Nombres de los tests:** `CA-03: …`, con dos puntos, porque `verify` filtra por `CA-03:` y así `CA-0` no coincide de más.
- **`e2e/hello.spec.js`:** se sustituye por `e2e/tareas/smoke.spec.js` (contradicción 10).

### Módulos (para los tests unitarios del Developer)

```js
// src/tasks.js: funciones puras; devuelven una lista nueva
export const MAX_TEXT_LENGTH = 200;
export function addTask(tasks, rawText, newId = () => crypto.randomUUID()); // lista nueva, o null si el texto queda vacío (RN-01, RN-05)
export function editTask(tasks, id, rawText);                               // lista nueva, o null si el texto queda vacío (RN-04, RN-05)
export function setCompleted(tasks, id, completed);                         // RN-02, RN-03
export function removeTask(tasks, id);
export function isValidTaskList(value);                                     // RN-12

// src/storage.js: nunca lanza errores
export const STORAGE_KEY = "tasks.v1";
export function loadTasks();       // { tasks, readable }: sin clave o [] da { tasks: [], readable: true }
export function saveTasks(tasks);  // true si se guardó, false si no
```

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Hay que redibujar sin perder foco ni lo escrito: es lo más fácil de romper, y un fallo pasa desapercibido con ratón. | Decisiones 2 y 3 desde T-03. T-08 y T-10 marcadas como `hard`, con CA-28 comprobando cada tecla. |
| `scripts/check.sh` en verde no demuestra los CA (contradicción 9). | `verify` con Playwright en cada tarea, QA cada 4 tareas y la CI con e2e. |
| `crypto.randomUUID()` (exigido por `data-model.md`) solo existe en HTTPS o en local. Probar desde un móvil real por la red local rompería el botón "Añadir". | El servidor local solo escucha en `127.0.0.1`. En G3, el móvil se prueba con 360 px en el navegador del ordenador. Si se publica, con HTTPS, como en GitHub Pages. |
| Tres comportamientos del navegador se dan por supuestos y no los he comprobado ejecutándolos: `<form>` con `preventDefault()` no dispara `form-action 'none'`; `maxLength` no parte un emoji al pegar; el contorno de foco se ve al mover el foco por código tras redibujar. | T-04 demuestra los dos primeros y T-10 el tercero, con tests. Si alguno falla, se apunta como bloqueo en `progress.md`. |
| Solo se prueba en Chromium de escritorio, aunque el PRD habla de móvil. | Se acepta en un ensayo (D-03). Queda sin comprobar Safari en iOS, y se deja dicho en G3. |
| Si no se aprueba la v1.2 (pregunta 5), QA partirá de un PRD con CA-06, CA-28 y CA-45 poco precisos. | QA sigue las notas de este plan, y cualquier diferencia se apunta en `qa-report.md`. |

## Orden de construcción

1. **Base sin pantalla:** T-01 (reglas) → T-02 (guardado).
2. **Pantalla:** T-03 (carga, lista, avisos de lectura) → T-04 (añadir).
3. **Operaciones:** T-05 (completar) y T-07 (borrar) sobre T-04; T-06 (editar) además sobre T-05, porque CA-24 usa las dos.
4. **Transversal:** T-08 (una fila abierta), T-09 (fallos de guardado), T-10 (foco y accesibilidad) y T-11 (móvil y estilos).

T-01 y T-02 no cubren ningún CA directamente: se comprueban con tests unitarios y sus reglas se demuestran en las tareas de pantalla. Cada CA se asigna a la tarea en la que puede ponerse en verde, porque el Developer no puede marcar una tarea como terminada con sus tests en rojo.

## Cambios en la v1.1

Fecha: 02-11-2026 (`/close`). Motivo: recoger lo que cambió al construir frente a lo aprobado en G2. Sale de `progress.md` (T-03, T-08 y T-10) y de `qa-report.md`. No cambia ninguna tarea, CA ni interfaz.

### Excepción a la decisión 2: la fila en edición se reutiliza

- **Qué decía:** tras cada acción se redibuja la lista entera.
- **Qué se construyó:** se redibuja la lista entera salvo la fila en edición. Mientras sigue abierta la misma edición (misma tarea, con el mismo texto y estado guardados), esa fila no se vuelve a crear: se pone al día en su sitio (lo escrito, el borde de error y el mensaje de error) y las demás filas se colocan antes y después de ella sin moverla. En cuanto se cierra la edición, o cambia la tarea que se edita, la fila se crea de nuevo como antes.
- **Por qué:** DP-06 pide que los errores se anuncien al lector de pantalla al aparecer. Con la lista entera redibujada, el error de edición se volvía a insertar en cada acción (por ejemplo, al marcar otra fila) y el lector lo anunciaba otra vez. Mover un nodo dentro de la lista también cuenta como insertarlo, por eso la fila se deja quieta y se mueven las demás. Lo detectó QA en la verificación parcial 2 y se corrigió en T-10.
- **Lo mismo para los avisos fuera de la lista:** el error de añadir y los avisos de lectura y guardado tienen su contenedor en `index.html` desde el principio, y su mensaje no se reconstruye mientras está a la vista (T-03, T-09 y T-10). Encaja con lo que el plan ya decía de DP-06 en "Sobre las dudas de UX".
- **Qué sigue igual:** el estado único y lo escrito guardado en él (decisión 2), el foco aplicado después de redibujar (decisión 3) y el contrato de pantalla de "Interfaces".
- **Consecuencia aceptada:** repetir "Añadir" o "Guardar" vacío con el error ya visible no lo vuelve a anunciar (DP-06 tomado al pie de la letra: "al aparecer"). Queda como P-09 en el PRD.

### Otros ajustes durante la construcción

- **Decisión 5 (Esc):** el primer código escuchaba Esc en toda la lista, y un Esc desde otra fila cancelaba la fila abierta y perdía lo escrito. T-08 lo dejó como dice la decisión: solo con el foco dentro de la fila abierta. Tras un clic en una zona de la fila abierta que no es un control, Esc no actúa (P-10 en el PRD).
- **Icono de la página:** se añadió `favicon.ico` en la raíz. Sin él, un navegador completo registra un 404 en consola y CA-29 falla fuera de los tests. Un icono `data:` lo bloquea la cabecera de seguridad.
- **Riesgos comprobados:** `preventDefault()` en el envío no choca con `form-action 'none'` y `maxLength` no parte un emoji al pegar (T-04); el contorno de foco se ve al mover el foco por código tras redibujar (CA-28, T-10).

### Aplicado en `/close`

- Las reglas de "Cambios al modelo de datos" están en `docs/architecture/data-model.md` (versión 1).
- La tabla de Tests de `docs/architecture/README.md` recoge la contradicción 8, y la nueva sección "Cómo funciona la pantalla" recoge esta excepción.
- `docs/architecture/adr/0001-static-page-with-localstorage.md` anota sus consecuencias observadas. No hizo falta ningún ADR nuevo.
