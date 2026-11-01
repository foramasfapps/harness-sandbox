# Usar y empaquetar la plantilla

## Hoy: repositorio plantilla (recomendado)

1. En GitHub, en este repositorio: **Settings → General → Template repository** (activar una vez).
2. Para una app nueva: **Use this template → Create a new repository**.
3. Abre Claude Code en el repositorio nuevo y ejecuta `/bootstrap`.

**Por qué así:** todo viaja con el repositorio (agentes, skills, controles y documentos), cada app puede adaptar su arnés y **funciona igual en sesiones en la nube** (claude.ai/code), que leen el `.claude/` del repositorio pero no los plugins instalados en tu ordenador.

**Traer mejoras a una app ya creada:** copia los archivos de `.claude/` y `scripts/` que hayan cambiado (o pide a Claude que compare la app con la plantilla y proponga el PR). Las lecciones que valen para todas las apps vuelven a la plantilla con un PR (ver `template-maintenance.md`).

## Más adelante: plugin de Claude Code

Cuando los agentes y skills estén estables y quieras compartirlos entre muchas apps sin copiarlos, se pueden empaquetar como plugin. Comprueba antes la documentación vigente (https://code.claude.com/docs/en/plugins/create.md); a fecha de esta guía:

| Va al plugin | Se queda en cada repositorio |
|---|---|
| Agentes (`agents/`), skills (`skills/`), hooks (`hooks/hooks.json`, con `${CLAUDE_PLUGIN_ROOT}` en las rutas de los scripts) | `CLAUDE.md`, `.claude/rules/`, `.claude/harness.json`, `scripts/`, `docs/`, CI |

Estructura: `.claude-plugin/plugin.json` (nombre, versión, descripción) más las carpetas de componentes en la raíz del plugin. Se prueba en local con `claude --plugin-dir <carpeta>` y se distribuye con un marketplace (un repositorio con `.claude-plugin/marketplace.json`).

**Contras a tener en cuenta:** los skills pasan a llamarse `/<plugin>:<skill>`; un plugin habilitado añade sus descripciones al contexto de todas las sesiones; y las sesiones en la nube no cargan los plugins de tu ordenador. Por eso no se recomienda hasta que la plantilla haya pasado por dos o tres apps.
