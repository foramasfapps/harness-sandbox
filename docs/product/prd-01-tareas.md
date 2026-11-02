# PRD 01 – Tareas

> Estado: Aprobado (01-11-2026) · Talla: M · Versión: 1.2 · Fecha: 01-11-2026
> Discovery: `docs/product/discovery/tareas.md` · Decisiones nuevas: D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-13, D-14, D-15

## 1. Objetivo

Permitir que una persona apunte lo que tiene que hacer y vea lo que le queda, sin cuentas ni instalación. Es además la funcionalidad con la que se ensaya el ciclo completo del arnés (D-03).

## 2. Usuarios

Una sola persona, en su propio navegador, en móvil o escritorio.

## 3. Historias de usuario

- Como persona usuaria, quiero añadir una tarea para no olvidarla.
- Como persona usuaria, quiero editar el texto de una tarea para corregirla.
- Como persona usuaria, quiero marcar una tarea como completada para distinguirla de lo pendiente, y desmarcarla si me equivoqué.
- Como persona usuaria, quiero borrar una tarea que ya no necesito, sin perderla por un toque equivocado.
- Como persona usuaria, quiero encontrar mis tareas al volver a abrir la página.

## 4. Alcance

| Incluido | Fuera de alcance (y por qué) |
|---|---|
| Crear, editar, completar, desmarcar y borrar tareas | Sincronizar entre dispositivos: exige cuenta y servidor (D-01) |
| Conservar las tareas al recargar en el mismo navegador | Fechas, prioridades y etiquetas: no hacen falta para el ensayo |
| Avisar si no se puede guardar o leer lo guardado | Recuperar una tarea borrada: la confirmación ya evita los toques equivocados (D-06) |
| Usar la app con teclado y en pantallas de móvil | Reordenar a mano, filtrar, buscar, exportar o contar pendientes: no aportan al ensayo |
| | Coordinar dos pestañas abiertas: la última que guarda pisa a la otra; se acepta en una app para una persona (D-12) |

## 5. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | La pantalla muestra un campo y un botón "Añadir" para crear una tarea; también se añade con Intro. |
| RF-02 | Tras añadir una tarea, el campo se vacía y conserva el foco. |
| RF-03 | Cada tarea muestra su texto, una casilla para completarla o desmarcarla, y los botones "Editar" y "Borrar". |
| RF-04 | "Editar" sustituye el texto y esos dos botones por un campo con ese texto, ya seleccionado, y los botones "Guardar" y "Cancelar"; Intro guarda y Esc cancela. |
| RF-05 | "Borrar" sustituye los botones de la fila por "¿Borrar esta tarea?" y los botones "Borrar" y "Cancelar", con el texto de la tarea aún visible; Esc cancela. |
| RF-06 | Una tarea completada se muestra tachada y con la casilla marcada. |
| RF-07 | Sin tareas, la lista muestra "Añade tu primera tarea.". |
| RF-08 | Cada cambio se guarda en el navegador y se conserva al recargar la página. |
| RF-09 | Si no se puede guardar, se muestra "No se han podido guardar los cambios." y la lista sigue funcionando. Lo no guardado se pierde al recargar. |
| RF-10 | Si lo guardado no se puede leer, se muestra "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán." y la lista empieza vacía. |
| RF-11 | Todo se puede hacer solo con teclado, con el foco visible y sin perderse (RN-15). Cada casilla y cada botón de una fila indica a un lector de pantalla a qué tarea pertenece. |
| RF-12 | La pantalla se adapta a un ancho de 360 px sin desplazamiento horizontal, incluso con textos de 200 caracteres sin espacios. |

## 6. Reglas de negocio y cálculos

| ID | Regla |
|---|---|
| RN-01 | Una tarea nueva se coloca al principio de la lista. |
| RN-02 | Una tarea que se completa se coloca al final de la lista. |
| RN-03 | Una tarea que se desmarca se coloca al principio de la lista. |
| RN-04 | Editar una tarea no cambia su posición ni si está completada. Las completadas se editan y se borran igual que las pendientes. |
| RN-05 | El texto se guarda sin los espacios del principio y del final. Si queda vacío, no se guarda. |
| RN-06 | Al crear con el texto vacío, se muestra "Escribe algo para añadir la tarea.", no se crea nada y el campo no cambia. El mensaje desaparece al añadir una tarea válida. |
| RN-07 | Al guardar una edición con el texto vacío, se muestra "Escribe algo para guardar la tarea.", no se guarda y sigue la edición. El mensaje desaparece al guardar un texto válido o al cancelar. Cancelar o Esc recupera el texto original. |
| RN-08 | Los campos no admiten más de 200 caracteres, contados como la longitud de JavaScript (un emoji suele contar como 2). Lo que se escriba o pegue de más se descarta. El recorte de espacios de RN-05 se aplica después. |
| RN-09 | Se permiten tareas con el mismo texto; cada acción afecta solo a la fila donde se hace. |
| RN-10 | Una tarea borrada no se puede recuperar. |
| RN-11 | El texto de una tarea siempre se muestra tal cual, sin interpretarse como HTML, también al editarlo y al recargar. |
| RN-12 | Lo guardado no se puede leer si no es JSON válido, si no es una lista o si alguna tarea no tiene `id` y `text` de tipo texto, `text` no vacío y `completed` de verdadero o falso. También es ilegible si un `text` solo tiene espacios o si un `id` está vacío o repetido. Un `text` de más de 200 caracteres se acepta y se muestra. Basta una tarea inválida para tratar toda la lista como ilegible. Tampoco se puede leer si el navegador bloquea el acceso. Que la clave no exista o valga `[]` es una lista vacía, sin aviso. |
| RN-13 | Lo ilegible no se sobrescribe hasta el primer cambio guardado con éxito. Un intento rechazado no cuenta como cambio. El aviso de lectura desaparece con ese cambio. El aviso de guardado desaparece con el siguiente guardado correcto. Si no se puede ni leer ni guardar, se ven los dos. |
| RN-14 | Solo una fila puede estar en edición o en confirmación de borrado. Abrir una de las dos en otra fila cancela la anterior sin guardar. La casilla de esa fila queda deshabilitada mientras dure. Añadir una tarea o marcar la casilla de otra fila no la cancela y conserva lo escrito. |
| RN-15 | El foco queda así: al añadir, en el campo de añadir; al usar una casilla, en esa misma casilla, en su nueva posición; al abrir la edición, en su campo; al guardar o cancelar la edición, en "Editar" de esa fila; al abrir la confirmación, en su "Cancelar"; al cancelarla, en "Borrar" de esa fila; al confirmar el borrado, en el campo de añadir. |

## 7. Flujos y pantallas

Una sola pantalla, con el campo de añadir arriba y la lista debajo. Editar y confirmar el borrado ocurren en la propia fila. El detalle visual lo hace UX en `docs/design/tareas/`. Los textos de este PRD son los definitivos y mandan sobre los ejemplos del sistema de diseño.

## 8. Criterios de aceptación

Cada criterio lo tiene que poder comprobar alguien que no escribió esta spec, con cifras concretas.

Notación: las listas van de arriba abajo. `B✓` significa casilla marcada, `completed: true` y `text-decoration` calculado `line-through`; sin ✓, lo contrario. "No se ve el aviso" significa que el texto no está en la página. "Lista vacía" significa que `tasks.v1` vale `[]`, salvo que se indique otra cosa.

| ID | Dado | Cuando | Entonces | Cubre |
|---|---|---|---|---|
| CA-01 | Que `tasks.v1` no existe y, por separado, que vale `[]` | Se abre la página | Se ve "Añade tu primera tarea.", 0 tareas y ningún aviso de lectura | RF-07, RN-12 |
| CA-02 | Una lista vacía | Se escribe "Comprar pan" y se pulsa "Añadir" | Hay 1 tarea, "Comprar pan", con 1 casilla sin marcar y los botones "Editar" y "Borrar"; el mensaje de lista vacía desaparece; el campo queda vacío y con el foco | RF-01, RF-02, RF-03 |
| CA-03 | La lista B, A | Se escribe "C" y se pulsa Intro | La lista es C, B, A, y el campo queda vacío y con el foco | RF-01, RF-02, RN-01 |
| CA-04 | Una lista vacía | Con el campo vacío y con 3 espacios, se prueba "Añadir" e Intro (4 combinaciones) | En todas: 0 tareas, se ve "Escribe algo para añadir la tarea." y sigue "Añade tu primera tarea." | RN-05, RN-06 |
| CA-05 | Se ve el error de CA-04 | Se añade "Comprar pan" | El error desaparece y hay 1 tarea | RN-06 |
| CA-06 | Una lista vacía | Se añade "  Comprar pan  ", con 2 espacios a cada lado | El `text` de la tarea en `tasks.v1` y el `textContent` del elemento `task-text` de su fila son exactamente "Comprar pan" (11 caracteres) | RN-05 |
| CA-07 | Una lista vacía | Se escribe y, por separado, se pega un texto de 200 "a" seguidas de "b" | El campo contiene las 200 "a", sin "b", y al añadir la tarea también | RN-08 |
| CA-08 | La lista con "Pan" | Se añade otra tarea "Pan" | Hay 2 tareas "Pan" | RN-09 |
| CA-09 | Una lista vacía | Se añade `<b>hola</b>`, se recarga, se edita a `<img src=x onerror=alert(1)>` y se guarda | En cada paso el `textContent` es literal, la fila contiene 0 elementos `b` e `img`, y no aparece ningún diálogo | RN-11 |
| CA-10 | La lista C, B, A | Se marca la casilla de B | La lista es C, A, B✓ | RF-03, RF-06, RN-02 |
| CA-11 | La lista C, A, B✓ | Se marca la casilla de A | La lista es C, B✓, A✓ | RN-02 |
| CA-12 | La lista C, B✓, A✓ | Se desmarca la casilla de B | La lista es B, C, A✓ | RF-06, RN-03 |
| CA-13 | La lista C, B, A | Se pulsa "Editar" en B | La fila de B muestra un campo con "B" y los botones "Guardar" y "Cancelar"; su texto fijo, "Editar" y "Borrar" no están | RF-04 |
| CA-14 | Se está editando B en la lista C, B, A | Se cambia el texto a "B2" y se pulsa "Guardar" | La lista es C, B2, A | RF-04, RN-04 |
| CA-15 | Se está editando B | Se cambia el texto a "B2" y se pulsa Intro | La tarea queda como "B2" | RF-04 |
| CA-16 | Se está editando B | Se cambia el texto a "B2" y se pulsa "Cancelar" y, por separado, Esc | En ambos casos la tarea sigue como "B" | RF-04, RN-07 |
| CA-17 | Se está editando B | Con el texto vacío y con 3 espacios, se prueba "Guardar" e Intro (4 combinaciones) | En todas: se ve "Escribe algo para guardar la tarea."; sigue la edición; al recargar, la tarea sigue como "B" | RN-05, RN-07 |
| CA-18 | La lista C, A, B✓ | Se edita B a "B2" y se guarda | La lista es C, A, B2✓ | RN-04 |
| CA-19 | Se está editando B | Se escribe y, por separado, se pega un texto de 200 "a" seguidas de "b" sustituyendo el contenido, y se guarda | El campo contiene las 200 "a", sin "b", y la tarea guardada también | RN-08 |
| CA-20 | La lista C, B, A | Se pulsa "Borrar" en B | La fila de B muestra "¿Borrar esta tarea?", "Borrar" y "Cancelar", y sigue visible el texto "B"; "Editar" no está; siguen las 3 tareas | RF-05 |
| CA-21 | Se ve la confirmación de CA-20 | Se pulsa "Cancelar" | Siguen C, B, A, y B muestra otra vez "Editar" y "Borrar" | RF-05 |
| CA-22 | Se ve la confirmación de CA-20 | Se pulsa "Borrar" | La lista es C, A, y al recargar sigue sin B | RF-05, RF-08, RN-10 |
| CA-23 | La lista con solo "Pan" | Se borra "Pan", se confirma y se recarga | Hay 0 tareas, se ve "Añade tu primera tarea." y ningún aviso de lectura | RF-07 |
| CA-24 | Se han hecho estos cambios: añadir C, B y A, en ese orden; completar B; editar C a "C2" | Se recarga la página | La lista es A, C2, B✓ | RF-08 |
| CA-25 | `localStorage.setItem` lanza `QuotaExceededError` y la lista es B, A | Se añade "Pan", se completa B, se edita A a "A2" y se borra "Pan" | Tras cada paso se ve "No se han podido guardar los cambios." y las listas son Pan, B, A → Pan, A, B✓ → Pan, A2, B✓ → A2, B✓ | RF-09 |
| CA-26 | `tasks.v1` vale `no-es-json` | Se abre la página | Se ve "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán." y "Añade tu primera tarea."; hay 0 tareas; la clave sigue valiendo `no-es-json` | RF-10, RN-12, RN-13 |
| CA-27 | Se ve el aviso de CA-26 | Se añade "Pan" | El aviso desaparece sin recargar, `tasks.v1` es una lista JSON con 1 tarea y, al recargar, la lista es "Pan" | RF-08, RN-13 |
| CA-28 | La lista B, A, sin usar el ratón | (a) Tab una vez para llegar al campo, se escribe "C" e Intro; (b) Espacio en la casilla de C; (c) Intro en "Editar" de B, se escribe "B2" e Intro; (d) Intro en "Borrar" de A, se llega con Tab o Mayús+Tab al "Borrar" de la confirmación e Intro | Las listas son (a) C, B, A; (b) B, A, C✓; (c) B2, A, C✓; (d) B2, C✓. El foco queda como dice RN-15. Tras cada tecla, `document.activeElement` no es `body` y su `outline-style` calculado no es `none` | RF-11, RN-15 |
| CA-29 | `tasks.v1` vale, en cada prueba: `null`, `123`, `{"a":1}`, `[1,2]`, `[{"id":"x"}]`, `[{"id":"1","text":"","completed":false}]`, `[{"id":"1","text":"A","completed":false},{"id":"x"}]`, `[{"id":"1","text":"   ","completed":false}]`, `[{"id":"","text":"A","completed":false}]` o `[{"id":"1","text":"A","completed":false},{"id":"1","text":"B","completed":false}]` | Se abre la página | En las 10 se ve el aviso de lectura, hay 0 tareas, no hay errores en consola y la clave conserva su valor | RF-10, RN-12 |
| CA-30 | Acceder a `window.localStorage` lanza `SecurityError` | Se abre la página y se añade "Pan" | La página no se rompe; al abrir se ve el aviso de lectura; al añadir se ven los dos avisos y "Pan" en la lista | RF-09, RF-10, RN-13 |
| CA-31 | Se ve el aviso de guardado y la lista es Pan, B, A, sin guardar | `setItem` vuelve a funcionar y se completa B | El aviso desaparece y, al recargar, la lista es Pan, A, B✓ | RF-09, RN-13 |
| CA-32 | Se ve el aviso de guardado, la lista es Pan, B, A y en `tasks.v1` está guardada la lista B, A | Se recarga sin que `setItem` se haya recuperado | La lista es B, A | RF-09 |
| CA-33 | La lista C, B, A, editando B con "B2" | Se pulsa "Editar" y, por separado, "Borrar" en A | A queda en edición o en confirmación; B sale de la edición y sigue como "B"; hay 1 sola fila en ese estado | RN-14 |
| CA-34 | La lista C, B, A | Se edita B y, por separado, se abre la confirmación de borrado de B | En ambos casos la casilla de B está deshabilitada; la de C no | RN-14 |
| CA-35 | La lista C, B, A, editando B con "B2" | Se añade "D" y, por separado, se marca la casilla de C | Al añadir, la lista es D, C, B, A; al marcar, es B, A, C✓. En ambos casos B sigue en edición y con "B2" en su campo | RN-01, RN-02, RN-14 |
| CA-36 | La lista Pan, Pan | Sobre esa misma lista, por separado: se completa la segunda; se edita la segunda a "Pan2"; se borra la primera | Quedan Pan, Pan✓; Pan, Pan2; y 1 sola tarea "Pan" | RN-09 |
| CA-37 | La lista C, A, B✓ | Se borra B, se confirma y se recarga | La lista es C, A | RN-04, RF-08 |
| CA-38 | La lista C, B✓, A✓ | Se desmarca B y se recarga | La lista es B, C, A✓ | RF-08, RN-03 |
| CA-39 | La lista C, B, A | Se edita B a "  B2  " y se guarda | El `text` en `tasks.v1` es exactamente "B2" | RN-05 |
| CA-40 | Se ve el error de CA-17 | Se pulsa "Cancelar" y, por separado, Esc | En ambos casos la tarea es "B", sin error, y al volver a editar el campo contiene "B" | RN-07 |
| CA-41 | Se ve el error de CA-17 | Se escribe "B2" y se guarda | La tarea es "B2" y el error desaparece | RN-07 |
| CA-42 | El campo de añadir contiene 150 caracteres | Se pegan 100 más al final | El campo contiene 200 | RN-08 |
| CA-43 | Se ve el aviso de CA-26 | Se pulsa "Añadir" con el campo vacío y se recarga | `tasks.v1` sigue valiendo `no-es-json` y se ve el aviso | RN-13 |
| CA-44 | Una tarea de 200 "a" sin espacios y un ancho de 360 px | Se muestra la lista | `scrollWidth` del documento es ≤ 360, y la casilla, "Editar" y "Borrar" se ven | RF-12 |
| CA-45 | La lista C, B, A | Se consulta el árbol de accesibilidad | En la fila de B, los nombres completos de la casilla y de los botones, también en edición y en confirmación, coinciden con la tabla de `docs/design/tareas/states.md` e indican la tarea B | RF-11 |
| CA-46 | La lista C, A, B✓ | Se añade "D" | La lista es D, C, A, B✓ | RN-01 |
| CA-47 | La lista con solo A | Se completa y después se desmarca | La lista es A✓ y después A | RN-02, RN-03 |
| CA-48 | Se ve la confirmación de CA-20 | Se pulsa Esc | Siguen C, B, A, y B muestra otra vez "Editar" y "Borrar" | RF-05 |
| CA-49 | Una lista vacía | Se pegan 5 espacios seguidos de 200 "a" y se añade | El campo contiene los 5 espacios y 195 "a", y el `text` guardado son 195 "a" | RN-05, RN-08 |

Casos límite y errores incluidos: texto vacío o con solo espacios, espacios sobrantes, más de 200 caracteres, texto con HTML, tareas repetidas, borrar la última tarea, editar y borrar completadas, varias filas abiertas, no poder guardar, datos ilegibles y almacenamiento bloqueado. Permisos: no aplica, porque no hay cuentas.

## 9. Cambios al modelo de datos

Sin campos nuevos. `docs/architecture/data-model.md` debe añadir en sus reglas de validación el máximo de 200 caracteres (RN-08) y la forma válida de los datos (RN-12), y aclarar que RN-01 a RN-03 se aplican al reordenar la lista guardada.

## 10. Preguntas abiertas

| ID | Pregunta | Propuesta | Estado |
|---|---|---|---|
| P-01 | ¿Qué pasa al crear una tarea vacía? | No se crea y se muestra un mensaje (RN-06, D-09) | Confirmada en G1 (01-11-2026) |
| P-02 | ¿Qué pasa si los datos guardados no se pueden leer? | Se avisa de que el próximo cambio los reemplazará (RF-10, RN-13, D-10) | Confirmada en G1 (01-11-2026) |
| P-03 | ¿Qué pasa si se abre otra edición sin guardar la anterior? | Se cancela la anterior y se pierde lo escrito, sin preguntar (RN-14, D-11) | Confirmada en G1 (01-11-2026) |
| P-04 | ¿Hace falta coordinar dos pestañas abiertas? | No: queda fuera de alcance (D-12) | Confirmada en G1 (01-11-2026) |

## Cambios en la v1.2

Fecha: 01-11-2026. Motivo: respuestas de la persona y aclaraciones aprobadas en G2.

- RF-04: el texto queda seleccionado al abrir la edición (D-13).
- RN-14 y CA-35: marcar la casilla de otra fila no cancela la fila abierta (D-14).
- RN-12 y CA-29: son ilegibles también un `text` de solo espacios y un `id` vacío o repetido; se aceptan los textos de más de 200 caracteres (D-15). CA-29 pasa de 7 a 10 valores.
- CA-06: "su fila" pasa a ser el elemento `task-text`, porque la fila también contiene los botones.
- CA-28 (a): se pulsa Tab antes de escribir, porque la página no pone el foco en el campo al abrir.
- CA-45: se comparan los nombres completos, porque "Borrar" ya contiene una "B".

Sin requisitos, reglas ni criterios con ID nuevo: siguen 49 CA.
