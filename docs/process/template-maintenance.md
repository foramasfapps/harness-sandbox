# Mantener la plantilla

Este documento es para quien trabaja **en el repositorio plantilla**, no en una app creada desde él.

## Reglas

- **No rellenes los marcadores `{{...}}`**: son los huecos que cada app completa con `/bootstrap`.
- **Genérico, no de un stack**: nada de comandos de un framework concreto fuera de los marcadores y del archivo de configuración de `scripts/check.sh`.
- **Antes de escribir configuración de Claude Code** (agentes, skills, hooks, settings, reglas), lee la documentación vigente en https://code.claude.com/docs. La sintaxis cambia rápido; no la asumas de memoria.
- **Pocas piezas.** Cada agente, skill o control supone algo que el modelo no sabe hacer solo. Añade piezas cuando algo falle y quita las que no aporten (ver `lessons.md`).
- **Documentación en español; nombres técnicos en inglés.**
- **Commits pequeños**, en una rama, con PR.

## Cómo evoluciona

1. Las apps creadas desde la plantilla anotan en su `docs/process/lessons.md` qué pieza del arnés falló, sobró o faltó.
2. Las lecciones que valen para todas las apps se traen aquí con un PR.
3. El [playbook](playbook.md) es la fuente del diseño: si cambia el modelo, se actualiza primero el playbook y después las piezas.

## Estado de construcción (bloque A del playbook)

| Paso | Contenido | Estado |
|---|---|---|
| A1 | Esqueleto, CLAUDE.md y plantillas de documentos | Hecho |
| A2 | Controles (hooks, permisos, CI, scripts) | Hecho (autotest: `scripts/test-harness.sh`) |
| A3 | PM: `/discover`, `/spec`, `pm-reviewer` | Hecho |
| A4 | UX/UI: `/design-system`, `ux-designer`, `ui-reviewer` | Hecho |
| A5 | Arquitecto y `/design` | Hecho |
| A6 | Developer, `init.sh` y `/build` | Hecho |
| A7 | QA en tres modos | Hecho |
| A8 | `/close` y coherencia documental | Hecho |
| A9 | `/feature`, `/bootstrap` y guía de empaquetado (`packaging.md`) | Hecho |
| A9b | **Ensayo** con una app de juguete por el ciclo completo | Pendiente: ver abajo |

## Ensayo pendiente (A9b)

Los controles están probados con `scripts/test-harness.sh`. Lo que aún no se ha probado es el **ciclo completo con agentes**. Para hacerlo:

1. Crea un repositorio desde la plantilla (p. ej. `harness-sandbox`).
2. `/bootstrap` con una app mínima: una lista de tareas con un único CRUD.
3. Una funcionalidad de talla M por `/discover` → `/spec` → `/design` → `/build` → `/close`.
4. Apunta en `lessons.md`: veces que hizo falta la persona fuera de las puertas, qué falló, consumo y tiempo.
5. Trae a esta plantilla, con un PR, los arreglos que salgan.
