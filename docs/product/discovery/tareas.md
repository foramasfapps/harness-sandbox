# Discovery – tareas

> Fecha: 01-11-2026 · Estado: Listo para /spec · Talla propuesta: M

## Respuestas (por tema)

### Problema y usuario

Ya decidido en `vision.md`: una sola persona, en su navegador, quiere apuntar lo que tiene que hacer y ver qué le queda.

### Resultado

Ya decidido (D-03): el éxito es completar el ciclo del arnés y registrar las lecciones.

### Alcance

Crear, editar, completar, desmarcar y borrar tareas, y conservarlas al recargar. Lo demás queda fuera según `vision.md`.

### Reglas de negocio

- **Orden al crear:** las nuevas van arriba. Con B, A, al añadir C se ve C, B, A. (Corregido en `/spec`: la pregunta de la entrevista decía "A y B", y de arriba abajo daría C, A, B.)
- **Orden al completar:** la tarea baja al final de la lista. Con C, B, A, al completar B se ve C, A, B✓. Si luego se completa A, se ve C, B✓, A✓.
- **Orden al desmarcar:** la tarea vuelve arriba del todo. Con C, B✓, A✓, al desmarcar B se ve B, C, A✓.
- **Borrar:** la propia fila pide confirmación con "¿Borrar esta tarea?", Borrar y Cancelar. Una tarea borrada no se puede recuperar.
- **Longitud:** hasta 200 caracteres; el campo no deja escribir más.
- **Repetidas:** se permiten tareas con el mismo texto.
- **Completadas:** se editan y se borran igual que las pendientes.

### Casos límite y errores

- **Editar y dejar vacía:** muestra un error, no guarda y sigue editando. Cancelar o Esc recupera el texto original.
- **Texto solo con espacios:** cuenta como vacío (`data-model.md`).
- **El navegador no deja guardar:** muestra "No se han podido guardar los cambios" y la lista sigue funcionando. Lo no guardado se pierde al recargar.

### Datos

Sin cambios en `task` (`id`, `text`, `completed`). El orden se guarda en el propio orden de la lista.

### Permisos

No aplica: no hay cuentas y solo hay una persona.

### Talla

M: una pantalla con el modelo de datos ya aprobado y patrones del sistema de diseño.

## Decisiones tomadas (con propuesta de ID D-xx)

- D-05: orden de la lista: nuevas y desmarcadas arriba; completadas al final.
- D-06: borrar pide confirmación en la propia fila, sin opción de recuperar.
- D-07: máximo de 200 caracteres por tarea; se permiten repetidas.
- D-08: si no se puede guardar, se avisa y la app sigue funcionando.

## Contradicciones con lo ya decidido

- Ninguna. El aviso del navegador para confirmar se apartaba del sistema de diseño aprobado, y por eso se descartó.

## Preguntas abiertas

- **Crear una tarea vacía:** no se preguntó de forma expresa. Propuesta para `/spec`: no se crea y se muestra "Escribe algo para añadir la tarea.", como en el sistema de diseño.
- **Datos guardados ilegibles:** no se preguntó. Propuesta para `/spec`: la app avisa y no sobrescribe esos datos hasta el siguiente cambio de la persona.
