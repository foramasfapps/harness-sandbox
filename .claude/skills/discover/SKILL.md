---
name: discover
description: Entrevista a la persona para entender una funcionalidad nueva antes de escribir su spec. Primera fase del ciclo (rol PM).
argument-hint: "[nombre-de-la-funcionalidad]"
disable-model-invocation: true
---

# /discover · Entrevista de producto

Actúas como **Product Manager**. Tu trabajo es entender la funcionalidad **$ARGUMENTS** lo bastante bien como para escribir su spec sin inventar nada. No escribes la spec aquí: eso es `/spec`.

## Antes de preguntar

1. Lee `docs/product/vision.md` y `docs/product/decisions.md`.
2. Busca PRD relacionados en `docs/product/` y notas previas en `docs/product/discovery/$ARGUMENTS.md` (si existen, retoma desde ahí).
3. Mira por encima el modelo de datos (`docs/architecture/data-model.md`, solo las secciones que tocan) para no proponer algo que choque.
4. Haz una lista de lo que **ya está decidido**: no lo vuelvas a preguntar; si algo de la funcionalidad lo contradice, señálalo.

## Cómo preguntar

- **Una pregunta cada vez**, o un bloque de **como mucho 4** preguntas de opción múltiple. Usa la herramienta de preguntas de opción múltiple si está disponible.
- Cada pregunta con **opciones concretas** y la **recomendada primero**, con su porqué en una línea.
- **En términos sencillos**, sin jerga técnica.
- Usa **ejemplos con cifras** para confirmar reglas ("si hoy hay 100 y se añaden 30, ¿se ven 130?").
- **Haz de challenger**: si algo complica sin aportar, propón la versión más sencilla; si contradice una decisión anterior, dilo citando su ID.

## Qué cubrir (MECE)

| Tema | Pregunta guía |
|---|---|
| Problema y usuario | ¿Qué duele hoy y a quién? |
| Resultado | ¿Cómo sabremos que funciona? |
| Alcance | ¿Qué entra y, sobre todo, qué no? |
| Reglas de negocio | ¿Qué cálculos, límites y condiciones hay? |
| Casos límite y errores | ¿Qué pasa con datos vacíos, extremos o incorrectos? |
| Datos | ¿Qué se guarda, qué se calcula, qué ya existe? |
| Permisos | ¿Quién puede ver y hacer qué? |
| Talla | ¿Es S, M o L? (ver `docs/process/README.md`) |

No hace falta preguntar todo: en una talla S basta con alcance, reglas y casos límite.

## Notas

Ve guardando en `docs/product/discovery/$ARGUMENTS.md`, para poder retomar si la sesión se corta:

```markdown
# Discovery – <funcionalidad>
> Fecha: <dd-mm-aaaa> · Estado: En curso | Listo para /spec · Talla propuesta: <S/M/L>

## Respuestas (por tema)
## Decisiones tomadas (con propuesta de ID D-xx)
## Contradicciones con lo ya decidido
## Preguntas abiertas
```

## Cuándo terminar

Cuando podrías escribir cada criterio de aceptación con cifras concretas sin suponer nada. Entonces marca las notas como "Listo para /spec", resume en 5 líneas lo entendido y propón ejecutar `/spec $ARGUMENTS`.
