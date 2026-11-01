---
name: tareas-design
description: Decisiones de diseño de la pantalla Tareas (docs/design/tareas/) en borrador, pendientes de aprobación
metadata:
  type: project
---

Diseño de Tareas entregado el 01-11-2026 como flows.md + states.md (talla M, sin bocetos). Estado: Borrador; no se han aprobado los patrones.

- "Borrar" es secundario en fila normal y destructivo (contorno `--error`, no relleno) en la confirmación; "Añadir" es el único botón principal; "Guardar" es secundario.
- Fila de tarea gana variantes "confirmando borrado" y "editando con error"; avisos de lectura/guardado en bloque bajo el formulario con `--warn`, sin botón de cerrar.
- No hay estado de carga: localStorage es síncrono.
- Móvil: botones de fila bajo el texto; desde 480 px, a la derecha.

**Why:** el PRD fija los textos y el foco (RN-15); el diseño solo decide disposición y variantes.
**How to apply:** si se aprueban, reutilizar estas variantes en futuras funcionalidades; si el PRD cambia, revisar DP-01 a DP-09 de flows.md. Verificar que los archivos siguen existiendo antes de citarlos.
