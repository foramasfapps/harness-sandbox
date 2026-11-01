# Agentic Workspace Template

Plantilla de **arnés agéntico** para construir apps con Claude Code: agentes con roles (PM, UX/UI, Arquitecto, Developer, QA), documentos que hacen de memoria compartida y controles automáticos que se cumplen siempre.

## Uso

1. Crea un repositorio nuevo a partir de esta plantilla (**Use this template**).
2. Abre Claude Code en él y ejecuta `/bootstrap`.
3. Para cada funcionalidad: `/feature <nombre>` te dice el siguiente paso.

| Comando | Fase | Puerta |
|---|---|---|
| `/bootstrap` | Visión, reglas de oro, arquitectura, puesta en marcha, sistema de diseño | G0 |
| `/discover <f>` · `/spec <f>` | Entrevista y spec (PM; revisan pm-reviewer y QA) | G1 |
| `/design <f>` | Diseño (UX) y plan con tareas (Arquitecto) | G2 |
| `/build <f>` | QA escribe tests → Developer → QA verifica → PR | G3 |
| `/close <f>` | Documentación al día y retro del arnés | — |

## Documentación

- [Cómo trabajamos](docs/process/README.md): el modelo explicado sin jerga.
- [Controles](docs/process/controls.md): qué bloquea el arnés y cómo comprobarlo (`scripts/test-harness.sh`).
- [Playbook](docs/process/playbook.md): el diseño completo y los prompts que lo generaron.
- [Usar y empaquetar](docs/process/packaging.md) · [Mantener la plantilla](docs/process/template-maintenance.md).

Requisitos: Claude Code, `git` y `python3`.
