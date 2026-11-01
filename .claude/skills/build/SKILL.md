---
name: build
description: Construcción autónoma de una funcionalidad con plan aprobado. QA escribe los tests de aceptación, el developer resuelve las tareas una a una, QA verifica y se abre un PR para la puerta G3. Nunca hace merge.
argument-hint: "[nombre-de-la-funcionalidad]"
disable-model-invocation: true
---

# /build · Construcción autónoma

Orquestas la construcción de **$ARGUMENTS** sin la persona, hasta dejar un PR listo para **G3**. Tú no programas: coordinas subagentes y compruebas.

## Requisitos (si falta algo, para y dilo)

- `docs/delivery/$ARGUMENTS/tasks.json` con `"approved"` relleno (G2). En talla S basta con el PRD aprobado y un `tasks.json` aprobado.
- `scripts/check.sh` existe y `.claude/harness.json` tiene al menos `checks.test` configurado.

## Límites

- Como mucho **3 vueltas** developer ⇄ QA por tarea; después, la tarea queda `blocked`.
- Como mucho **3 invocaciones del developer por tarea** en total.
- Si más de un tercio de las tareas quedan bloqueadas, **para**: es un problema de spec o de plan, no de código.

## Pasos

1. **Rama**: si existe `feature/$ARGUMENTS`, cámbiate a ella y lee `progress.md` para retomar; si no, créala desde `main` actualizado (`git switch -c feature/$ARGUMENTS`).
2. **Entorno**: `scripts/init.sh` y `scripts/check.sh`. Si ya falla antes de empezar, para y dilo.
3. **Tests de aceptación** (si `tasks.json` aún no los tiene): subagente **qa-evaluator** en modo **tests de aceptación**. Comprueba que existen, que **fallan** (rojo) y que están anotados en `tasks.json`. Commit: `test: tests de aceptación de $ARGUMENTS`.
4. **Tareas**, en orden de dependencias, solo las `failing`:
   - Subagente **developer** con: la funcionalidad, el id de la tarea y nada más (lee él los archivos).
   - Con `"difficulty": "hard"`, lánzalo con el modelo grande y esfuerzo alto.
   - Al volver, **comprueba tú**: `scripts/check.sh` en verde, el estado en `tasks.json` y que hay commit. Si dice `passing` y algo no cuadra, vuelve a ponerla en `failing` con una nota.
   - Si queda `blocked`, sigue con las tareas que no dependan de ella.
5. **Verificación**: cada 4 tareas terminadas y siempre al final, subagente **qa-evaluator** en modo **verificación final** (al final, completa; entre medias, solo las tareas nuevas). Por cada fallo, la tarea vuelve a `failing` y el developer la retoma con el fallo concreto del informe.
6. **Revisión visual** (talla L, o pantallas nuevas): subagente **ui-reviewer**. Los problemas de gravedad alta vuelven al developer.
7. **Coherencia**: subagente **architect** en modo **revisar coherencia** sobre `git diff main...HEAD`. Lo de gravedad alta vuelve al developer.
8. **Comprobación final**: `scripts/check.sh` en verde y `qa-report.md` actualizado.
9. **PR**: `git push -u origin feature/$ARGUMENTS` y abre un PR hacia `main` (con `gh`, con la herramienta de GitHub disponible o, si no hay ninguna, deja el texto en `docs/delivery/$ARGUMENTS/pr.md`). Si el repositorio tiene plantilla de PR, úsala. Contenido:
   - Qué hace la funcionalidad (enlace al PRD) y talla.
   - Tabla de CA con su resultado (de `qa-report.md`).
   - Bloqueos y lo que queda, con enlace a `progress.md`.
   - Cómo probarlo en la vista previa: pasos concretos con los datos de ejemplo.
10. **Nunca hagas merge** ni marques el PR como aprobado.

## Al terminar, a la persona (G3)

Breve: enlace al PR, CA que pasan y fallan, bloqueos que necesitan una decisión suya (con opción recomendada) y los 3–5 pasos para probarlo en la vista previa. Recuérdale que después del merge toca `/close $ARGUMENTS`.
