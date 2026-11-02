# Registro de decisiones de producto

> Lo mantiene el PM (`/spec`, `/close`). Cada decisión tiene un ID estable que citan los PRD, los planes y el código.

**Estados:** **Pendiente** (decidida, sin construir) · **Implementada** (en `main`) · **Cambia** (sustituida; se indica por cuál) · **Aplazada** (fuera del alcance actual) · **Abierta** (sin decidir).

| ID | Decisión | Por qué | Estado | Dónde |
|---|---|---|---|---|
| D-01 | Las tareas se guardan solo en el navegador de la persona | Evita cuentas y servidor. A cambio, no pasan a otro dispositivo y se pierden si se borran los datos del navegador | Pendiente | `vision.md` |
| D-02 | La app es una sola funcionalidad de talla M | Las cuatro operaciones comparten pantalla y datos, y el ensayo pide un ciclo con una funcionalidad M | Pendiente | `vision.md` |
| D-03 | El éxito se mide por completar el ciclo y registrar lecciones, no por el uso de la app | Es un ensayo del arnés | Pendiente | `vision.md` |
| D-04 | La interfaz va en español | Coincide con la documentación; el código sigue en inglés | Pendiente | `CLAUDE.md` |
| D-05 | Las tareas nuevas y las desmarcadas van arriba; las completadas, al final | Lo pendiente queda junto y lo último a la vista. A cambio, las filas se mueven al marcarlas | Pendiente | PRD 01, RN-01 a RN-03 |
| D-06 | Borrar pide confirmación en la propia fila, sin opción de recuperar | Evita perder tareas por un toque y encaja con el sistema de diseño | Pendiente | PRD 01, RF-05, RN-10 |
| D-07 | Máximo de 200 caracteres por tarea; se permiten repetidas | Basta para una frase y protege la lista de textos muy largos | Pendiente | PRD 01, RN-08, RN-09 |
| D-08 | Si no se puede guardar, se avisa y la app sigue funcionando | Bloquearla la dejaría inutilizable. Lo no guardado se pierde al recargar | Pendiente | PRD 01, RF-09 |
| D-09 | Crear una tarea vacía muestra un mensaje y no crea nada | Cumple la regla de oro "ninguna tarea queda sin texto" | Pendiente | PRD 01, RN-06 |
| D-10 | Si lo guardado no se puede leer, se avisa de que el próximo cambio guardado lo reemplazará | No se destruye nada sin avisar antes | Pendiente | PRD 01, RF-10, RN-12, RN-13 |
| D-11 | Solo una fila a la vez en edición o en confirmación; abrir otra cancela la anterior sin guardar | Es la regla más sencilla y evita filas a medias | Pendiente | PRD 01, RN-14 |
| D-12 | Coordinar dos pestañas abiertas queda fuera de alcance | La última en guardar pisa a la otra; es aceptable para una persona y un ensayo | Pendiente | PRD 01, sección 4 |
| D-13 | Al abrir la edición, el texto queda seleccionado | Lo que se escribe lo sustituye y Esc lo recupera | Pendiente | PRD 01, RF-04 |
| D-14 | Marcar la casilla de otra fila no cancela la fila abierta | No se pierde lo escrito por un toque en otra parte, igual que al añadir | Pendiente | PRD 01, RN-14 |
| D-15 | Son ilegibles los datos con un `text` de solo espacios o un `id` vacío o repetido; se aceptan textos de más de 200 | Evita filas en blanco y acciones sobre dos filas, sin perder una lista por un texto largo | Pendiente | PRD 01, RN-12 |

## Preguntas abiertas

| ID | Pregunta | Estado |
|---|---|---|
