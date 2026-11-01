# Playbook del arnés agéntico

> v1.1 · 01-11-2026 (QA en tres momentos y consumo de tokens) · Para crear el *workspace* agéntico de una app nueva (o de la v2 de Family Finance) con Claude Code.
> **Cómo se usa:** copia cada prompt en una sesión nueva, en orden. Revisa lo que produce y haz commit antes de pasar al siguiente.

## Resumen

1. **Se construye una vez y se reutiliza.** El arnés vive en un repositorio plantilla (`agentic-workspace-template`). Cada app nueva arranca desde él. Cuando esté estable, se puede empaquetar como plugin de Claude Code.
2. **El modelo tiene tres capas:** **artefactos** (la memoria compartida), **agentes** (los roles) y **controles** (lo que se cumple siempre, decida lo que decida el modelo).
3. **Tú decides en cuatro puertas:** visión (G0, una vez por app), spec (G1), diseño y plan (G2) y resultado (G3). Entre G2 y G3 los agentes trabajan solos.
4. **Son cuatro bloques de prompts:** A construye la plantilla (9 prompts, una vez), B arranca una app (3 prompts), C es el ciclo que se repite por funcionalidad y D migra Family Finance a la v2.
5. **Regla de oro: empieza simple.** Cada pieza del arnés supone algo que el modelo no sabe hacer solo. Añade piezas cuando algo falle y quita las que sobren con cada modelo nuevo.

---

## 1. El modelo

### 1.1 Tres capas

| Capa | Qué es | Piezas | Principio |
|---|---|---|---|
| **Artefactos** | La memoria compartida: los agentes se pasan el trabajo con archivos, no con la conversación | Visión, decisiones, PRD, diseño, modelo de datos, ADR, plan, `tasks.json`, progreso, informe de QA | Si no está escrito, no existe |
| **Agentes** | Roles con su propio contexto, herramientas y memoria | PM, UX/UI, Arquitecto, Developer, QA | Quien hace no evalúa |
| **Controles** | Reglas que Claude Code aplica siempre | Hooks, reglas de permisos, CI, `main` protegida | Lo que no admite excepciones no va en CLAUDE.md |

### 1.2 Roles

| Rol | Cómo trabaja | Recibe | Entrega | Puede tocar |
|---|---|---|---|---|
| **PM** | En la **sesión principal**, porque te entrevista (skills `/discover` y `/spec`). Un revisor aparte le busca huecos | Tu idea, visión, decisiones | PRD con criterios de aceptación (CA) comprobables | `docs/product/` |
| **UX/UI** | Subagente. Hace bocetos antes de programar y revisa capturas después | PRD aprobado, sistema de diseño | Flujos, estados y bocetos HTML de cada pantalla | `docs/design/` |
| **Arquitecto** | Subagente. Lee el código sin editarlo y guarda la coherencia | PRD, diseño, modelo de datos, ADR, código | Contradicciones, plan, `tasks.json`, cambios al modelo y revisión de coherencia del PR | `docs/architecture/`, `docs/delivery/` |
| **Developer** | Subagente o sesión principal, en su rama o *worktree* | Plan y `tasks.json` | Código, tests y commits pequeños | Código |
| **QA** | Subagente escéptico que actúa en tres momentos: revisa los CA (G1), escribe los tests de aceptación antes del código y verifica al final (tests, código y navegador). No edita el código de la app | PRD, plan y la app en marcha | Revisión de los CA, tests de aceptación en rojo y `qa-report.md` | `tests/acceptance/`, `e2e/`, `docs/delivery/` |

> Los subagentes trabajan y devuelven un resultado. La conversación contigo vive en la sesión principal, así que todo lo que sea entrevistarte va allí.

### 1.3 Flujo y puertas

```text
G0  /bootstrap (una vez por app)  → vision.md · CLAUDE.md · stack · sistema de diseño     ✋ apruebas

Por cada funcionalidad:
    /discover + /spec   PM te entrevista; QA revisa CA  → docs/product/prd-NN.md          ✋ G1
    /design             UX ∥ Arquitecto                 → design/ + plan.md + tasks.json  ✋ G2
    /build              QA escribe tests en rojo →
                        Developer los pone en verde ⇄ controles ⇄ QA verifica
                        (sin ti)                        → rama + PR + qa-report.md        ✋ G3
    /close              PM + Arquitecto                 → documentación al día y lecciones
```

| Puerta | Qué apruebas | Qué miras |
|---|---|---|
| G0 | Visión, reglas de oro y stack | ¿Es la app que quiero? ¿Las reglas son las de verdad? |
| G1 | La spec | ¿Los CA describen lo que quiero, con cifras de ejemplo? |
| G2 | Diseño y plan | Bocetos, y las contradicciones y dudas, todas juntas y con la opción recomendada |
| G3 | El resultado | La vista previa desplegada, el informe de QA y los bloqueos que quedan. Después haces el merge |

### 1.4 Estructura de la plantilla

```text
CLAUDE.md                      ≤ 80 líneas: qué es, reglas de oro, comandos, mapa
.claude/
  settings.json                hooks y permisos (controles)
  agents/                      pm-reviewer · ux-designer · ui-reviewer · architect · developer · qa-evaluator
  skills/                      bootstrap · discover · spec · design-system · design · build · close · feature
  rules/                       reglas por carpeta (se cargan solo al tocarla)
docs/
  process/                     README del modelo · controls.md · lessons.md
  product/                     vision.md · decisions.md · discovery/ · prd-NN-*.md
  design/                      design-system.md · <feature>/ (flows, states, mockups)
  architecture/                README.md · data-model.md · adr/
  delivery/<feature>/          plan.md · tasks.json · progress.md · qa-report.md
scripts/                       check.sh · check-invariants.sh · init.sh
tests/acceptance/              tests de aceptación (QA), uno por CA; el developer no puede editarlos
e2e/                           tests de Playwright para los flujos de pantalla
.github/workflows/ci.yml
```

### 1.5 El contexto: qué carga cada uno, y cómo lo controlas tú

- **CLAUDE.md corto** (80 líneas como máximo), sin importar documentos largos: lo que está ahí se carga en cada sesión.
- **Reglas por carpeta** en `.claude/rules/`: las de `src/lib/finance` solo se cargan al tocar esa carpeta.
- **Skills** para los procedimientos: Claude ve solo su nombre y descripción hasta que la tarea los necesita.
- **Memoria por rol** (`memory: project`): QA recuerda los fallos típicos y el arquitecto, las decisiones técnicas.
- **El paso entre fases son archivos**, nunca "lo que hablamos".
- **Tú controlas el contexto en las puertas.** Lo que apruebas queda marcado `Estado: Aprobado (fecha)` y es lo único que los agentes toman por cierto.

### 1.6 Autonomía: las cinco preguntas

Antes de dejar a Claude trabajando solo, la guía de buenas prácticas de Claude Code pide responder cinco preguntas. El arnés las responde así:

| Pregunta | Respuesta del arnés |
|---|---|
| ¿Sabe qué es "terminado"? | Los CA del PRD y `tasks.json` con el estado pasa/falla de cada tarea |
| ¿Puede comprobar su trabajo? | Hook `Stop` (tipos, lint y tests), CI y QA en un contexto aparte |
| ¿Qué puede tocar? | Una rama por funcionalidad, *worktrees*, y reglas que bloquean `main`, los secretos y la base de datos de producción |
| ¿Qué le para? | `maxTurns` en cada agente, tres vueltas como máximo con QA por tarea y un presupuesto por ejecución |
| ¿Quién aprueba el resultado? | Tú, en G3: PR, vista previa e informe de QA. Los agentes nunca hacen merge |

### 1.7 Principios, con su fuente

- **El agente que hace no puede evaluarse a sí mismo.** Anthropic: *"Out of the box, Claude is a poor QA agent"*. Es más fácil ajustar un evaluador escéptico aparte. ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))
- **Un planificador antes de programar** evita quedarse corto. Fue la pieza que se mantuvo al simplificar el arnés. (misma fuente)
- **El estado vive en archivos:** lista de funcionalidades en JSON (el modelo la altera menos que el Markdown), archivo de progreso, commits descriptivos y un script de arranque. Una funcionalidad por vez. ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents))
- **Lo que no admite excepciones va en hooks o reglas de permisos, no en CLAUDE.md.** Pocos controles: si llegas a cuarenta, sobran. ([Best practices](https://code.claude.com/docs/en/best-practices))
- **Un revisor siempre encuentra algo.** Hay que pedirle solo lo que afecta a la corrección, nunca el estilo. (misma fuente)
- **Spec viva (*spec-anchored*):** la spec se actualiza al terminar. El flujo importa más que el formato de la spec. (Böckeler, Thoughtworks)
- **Simplicidad:** *"every component in a harness encodes an assumption about what the model can't do on its own"*. El arnés completo costó más de 20 veces lo que un solo agente, y funcionó. ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps), [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents))
- **Los agentes no tocan los tests que los juzgan:** solo cambian el estado pasa/falla. ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents))

### 1.8 QA en tres momentos

| Momento | Qué hace QA | Por qué |
|---|---|---|
| **1 · Antes de G1** (en `/spec`) | Revisa los CA: que se puedan comprobar, que cubran casos límite y errores, que tengan cifras de ejemplo. Propone CA nuevos o más precisos; **el PM decide** y tú apruebas en G1 | Un CA ambiguo produce código ambiguo. Es el fallo más barato de arreglar |
| **2 · Al empezar `/build`** | Escribe los **tests de aceptación en rojo** a partir de los CA, cada uno en el nivel más barato que lo demuestre: unitario (reglas y cálculos), integración (base de datos, permisos), e2e (flujos de pantalla). El developer los pone en verde y **un hook le impide editarlos** | Quien escribe el código no escribe la prueba que lo juzga. La independencia la garantiza el arnés, no la buena voluntad |
| **3 · Al final** | Verifica contra el código y contra la app: ejecuta todos los tests, revisa que cada CA tenga un test que de verdad lo compruebe (no uno trivial), lee el código buscando reglas de negocio mal aplicadas y hace una prueba exploratoria en el navegador de lo que los tests no cubren | Los tests pasan y aun así algo falla: mirar la app como usuario lo encuentra |

**Reparto con otros revisores:** QA mira **si cumple lo pedido** (comportamiento frente a los CA). El arquitecto mira **si es coherente** (modelo de datos, reglas de oro, decisiones). `/code-review` mira **si hay fallos de código**. Tres preguntas distintas, sin solaparse.

### 1.9 Consumo de tokens sin perder calidad

El mayor gasto no es revisar: es **rehacer**. El replanteo del PRD 04 (v1.1) costó más que cualquier revisión. Por eso la calidad al principio ahorra tokens. Las palancas, de mayor a menor impacto:

| Palanca | Cómo |
|---|---|
| **1 · Evitar retrabajo** | Spec revisada por QA en G1 y contradicciones resueltas en G2, antes de escribir código |
| **2 · Lo determinista no gasta tokens** | Hooks, tests, CI y scripts comprueban sin coste de modelo. Cada fallo que QA encuentra a mano se convierte en un test que la CI repite gratis |
| **3 · Ceremonia proporcional** | Tres tallas de funcionalidad (bloque C): S sin UX ni prueba exploratoria; M con lo básico; L con el arnés completo. El evaluador solo compensa cuando la tarea supera lo que el modelo hace bien solo |
| **4 · Menos contexto cargado** | CLAUDE.md corto, reglas por carpeta, skills bajo demanda. Entre fases, sesión nueva leyendo archivos breves (no el historial). Documentos largos con índice para leer solo la sección que hace falta |
| **5 · El modelo y el esfuerzo justos por rol** | Modelo grande y esfuerzo alto donde se piensa (PM, arquitecto, developer en tareas difíciles). Modelo medio para el developer en tareas rutinarias. Modelo pequeño para comprobaciones sencillas (enlaces, buscar archivos). Se fija en cada agente (`model`, `effort`) |
| **6 · Subagentes solo cuando aportan** | Cada subagente vuelve a leer contexto. Úsalos para independencia (QA, revisores) o paralelismo real, no para "delegar por delegar" |
| **7 · Navegador con mesura** | Las capturas pesan. QA lee la página como texto (árbol de accesibilidad) y saca capturas solo cuando lo visual importa |
| **8 · Límites y medición** | `maxTurns` por agente, 3 vueltas de QA como máximo, presupuesto por ejecución. En cada `/close`, `/usage` por skill y subagente |

**Cómo saber que no se pierde calidad:** en cada `/close` se apuntan dos cifras en `lessons.md`, el **consumo por funcionalidad** y los **fallos escapados** (los que encuentras tú en G3 o después). Si un recorte sube los fallos escapados, se deshace.

---

## 2. Cómo usar los prompts

- **Una sesión nueva por prompt** (o `/clear`). Usa el modo plan (Shift+Tab) en los grandes.
- **Cada prompt pide leer la documentación vigente de Claude Code** antes de escribir configuración, porque la sintaxis cambia rápido.
- **Cada prompt pide proponer el plan y esperar tu ok.** Revisa el resultado y haz commit antes del siguiente.
- Donde veas `<<...>>`, rellena tú.

---

## Bloque A · Construir la plantilla (una vez)

Crea un repositorio vacío `agentic-workspace-template` y abre Claude Code en él.

### A1 · Esqueleto y constitución

```prompt
Vamos a construir una plantilla reutilizable de "arnés agéntico" para desarrollar apps con Claude Code. Este repositorio es la plantilla: cada app nueva se creará a partir de él.

Antes de escribir nada:
1. Lee la documentación vigente de Claude Code sobre CLAUDE.md, .claude/rules, skills, subagentes, hooks y settings (https://code.claude.com/docs). No asumas la sintaxis de memoria.
2. Propón el plan y espera mi visto bueno.

En este paso, solo el esqueleto:
- Esta estructura de carpetas: <<pegar la sección 1.4 del playbook>>
- CLAUDE.md de plantilla, de 80 líneas como máximo, con estas secciones: Qué es la app · Reglas de oro (invariantes no negociables) · Comandos (dev, test, lint, typecheck, e2e) · Forma de trabajar (fases y puertas G0 a G3) · Mapa de documentos. Usa marcadores {{...}} donde cada app tenga que rellenar. Sin @imports de documentos largos.
- docs/process/README.md: explica el modelo (tres capas, roles, fases y puertas) en español sencillo, para alguien no técnico.
- Plantillas con sus encabezados: docs/product/vision.md, docs/product/decisions.md (tabla ID | Decisión | Por qué | Estado | Dónde), docs/product/prd-template.md, docs/design/design-system.md, docs/architecture/README.md, docs/architecture/data-model.md, docs/architecture/adr/0000-template.md y docs/delivery/_template/ con plan.md, tasks.json, progress.md y qa-report.md.
- Convención: documentación en español y código en inglés.

Todavía no crees agentes, skills ni hooks.
```

### A2 · Controles que se cumplen siempre

```prompt
Paso 2: los controles que Claude Code aplica siempre. Lee antes la documentación vigente de hooks, permisos y settings. Propón el plan y espera mi ok.

Crea:
1. .claude/settings.json con:
   - Un hook Stop que ejecute scripts/check.sh y, si falla, impida terminar el turno y devuelva el error a Claude.
   - Un hook PreToolUse que bloquee: editar archivos .env*, cualquier comando que aplique migraciones o escriba en la base de datos de producción, git push a main y git push --force.
   - Las reglas deny equivalentes, como segunda barrera.
2. scripts/check.sh genérico (typecheck, lint y tests unitarios) que lea los comandos de un archivo de configuración, para no depender del stack, y salga con código 2 si algo falla.
3. scripts/check-invariants.sh: punto de extensión para las reglas propias de cada app (p. ej. "ningún porcentaje ni importe de negocio escrito en el código"). Vacío por defecto, con un ejemplo comentado. check.sh lo llama.
4. .github/workflows/ci.yml que ejecute lo mismo en cada pull request.
5. docs/process/controls.md: qué bloquea cada control, por qué y cómo comprobar que funciona.

El conjunto tiene que ser pequeño: solo reglas sin excepciones. Al terminar, demuéstrame cada hook con una prueba que lo haga saltar.
```

### A3 · Product Manager

```prompt
Paso 3: el rol de Product Manager. Lee la documentación vigente de skills y subagentes. Propón el plan y espera mi ok.

El PM trabaja en la sesión principal, porque me entrevista. Crea:

1. .claude/skills/discover/SKILL.md (solo lo invoco yo): entrevista para una funcionalidad nueva.
   - Antes de preguntar, lee vision.md, decisions.md y los PRD relacionados. No pregunta lo que ya está decidido.
   - Pregunta de una en una, o en bloques de opción múltiple (como mucho 4), con la opción recomendada primero y su porqué.
   - Cubre de forma MECE: problema y para quién, resultado esperado, alcance y fuera de alcance, reglas de negocio, casos límite, datos, permisos y métricas de éxito.
   - Hace de challenger: señala contradicciones con decisiones anteriores y propone simplificaciones.
   - Termina cuando podría escribir la spec sin inventar nada. Guarda las notas en docs/product/discovery/<feature>.md.

2. .claude/skills/spec/SKILL.md: convierte el discovery en docs/product/prd-NN-<feature>.md con esta estructura: objetivo, usuarios, historias, alcance, requisitos (RF-xx), reglas de negocio (RN-xx), flujos, criterios de aceptación (CA-xx) en formato Dado / Cuando / Entonces con cifras de ejemplo concretas, preguntas abiertas y cambios al modelo de datos.
   - Cada CA tiene que poder comprobarlo alguien que no escribió la spec.
   - Añade las decisiones nuevas a decisions.md con su ID.
   - El PRD termina en estado "Pendiente de G1".

3. .claude/agents/pm-reviewer.md (solo lectura): revisa un PRD buscando ambigüedades, huecos MECE y contradicciones con decisions.md. Devuelve una lista priorizada y no reescribe nada.

4. Antes de presentarme el PRD, /spec llama en paralelo a pm-reviewer y a qa-evaluator en modo "revisión de CA" (se define en el paso 7; hasta entonces, déjalo preparado). El PM decide qué acepta de cada uno, corrige el PRD y me enseña qué cambió y qué descartó y por qué.
```

### A4 · UX/UI

```prompt
Paso 4: el rol de UX/UI. Propón el plan y espera mi ok.

1. .claude/skills/design-system/SKILL.md (lo invoco yo, una vez por app): me entrevista sobre marca, tono, referencias y dispositivos, y crea docs/design/design-system.md con tokens (color en claro y oscuro, tipografía, espaciado), componentes, patrones de pantalla, tono de los textos y reglas de accesibilidad.

2. .claude/agents/ux-designer.md: a partir de un PRD aprobado y del sistema de diseño, produce en docs/design/<feature>/:
   - flows.md: recorridos por historia de usuario, pantallas y navegación.
   - states.md: para cada pantalla, los estados vacío, cargando, error y con datos, en móvil y en escritorio, con los textos reales en el idioma de la app.
   - mockups/*.html: bocetos estáticos con el sistema de diseño, sin lógica, uno por pantalla.
   - Una lista de dudas de producto que encuentre. No las resuelve: las devuelve.
   Principios: claridad antes que decoración; accesibilidad (contraste, foco visible, tamaños táctiles); coherencia con las pantallas que ya existen.

3. .claude/agents/ui-reviewer.md (solo lectura y navegador): abre la app en marcha con Playwright, saca capturas en móvil y escritorio, en claro y oscuro, y las compara con los bocetos y el sistema de diseño. Informa de las diferencias por gravedad.
```

### A5 · Arquitecto / tech lead

```prompt
Paso 5: el arquitecto / tech lead, guardián de la coherencia. Propón el plan y espera mi ok.

1. .claude/agents/architect.md: lee el código sin editarlo, escribe solo en docs/architecture y docs/delivery, y usa memory: project. Al recibir un PRD aprobado con su diseño:
   a. Cruza PRD, diseño, data-model.md, ADR, decisions.md y el código existente.
   b. Escribe docs/delivery/<feature>/plan.md con: contradicciones encontradas (tabla Dónde | Qué pasa | Propuesta), decisiones técnicas propuestas, cambios al modelo de datos, riesgos y orden de construcción.
   c. Escribe tasks.json: tareas pequeñas (una migración, un módulo o una pantalla), cada una con id, descripción, los CA que cubre, cómo se verifica (comando o test), dependencias y "status": "failing". Regla: los agentes solo cambian el status. No borran ni reescriben tareas sin volver a G2.
   d. Propone un ADR para cada decisión difícil de revertir.
   Todas las preguntas para mí van juntas, cada una con su opción recomendada.

2. Modo revisión de coherencia: dado un diff o un PR, comprueba que respeta las reglas de oro de CLAUDE.md, el modelo de datos y las decisiones. Informa solo de lo que afecta a la corrección o la coherencia, nunca del estilo.

3. .claude/skills/design/SKILL.md (/design <feature>): lanza ux-designer y architect en paralelo, junta sus dudas sin duplicados y me las presenta para G2. Cuando apruebo, marca plan y diseño como "Aprobado (fecha)".
```

### A6 · Construcción autónoma

```prompt
Paso 6: la construcción autónoma. Propón el plan y espera mi ok.

1. .claude/agents/developer.md: implementa una tarea de tasks.json cada vez.
   - Al empezar: lee progress.md, el git log reciente, la tarea y sus CA. Arranca el entorno con scripts/init.sh y ejecuta los tests para comprobar que parte de un estado sano.
   - Escribe los tests primero cuando la tarea tenga lógica de negocio.
   - Al terminar: check.sh en verde, un commit pequeño con mensaje descriptivo, status "passing" solo si ha ejecutado la verificación de la tarea, y una nota en progress.md (qué hizo, qué aprendió, qué queda).
   - Si algo contradice la spec o el plan, no improvisa: lo apunta como bloqueo en progress.md y sigue con otra tarea independiente.
   - No puede editar los tests de aceptación (tests/acceptance/ y e2e/): un hook PreToolUse propio de este agente lo bloquea. Si cree que un test está mal, lo apunta como bloqueo para QA.
   - model y effort: medio por defecto; el orquestador puede subirlos en tareas marcadas "difícil" en tasks.json.

2. scripts/init.sh: arranca el entorno local (la app y una base de datos local, nunca la de producción), y se puede ejecutar varias veces sin romper nada.

3. .claude/skills/build/SKILL.md (/build <feature>), que orquesta:
   - Crea la rama feature/<feature>.
   - Primero, QA escribe los tests de aceptación en rojo (modo 2 del paso 7) y hace commit.
   - Recorre tasks.json en el orden de las dependencias con el developer (en worktree cuando convenga).
   - Lanza QA cada pocas tareas y al final. Si QA falla, devuelve los fallos al developer, con un máximo de 3 vueltas por tarea; después, bloqueo.
   - Al final abre un PR con resumen, CA cubiertos, informe de QA y bloqueos.
   - Tiene un límite de turnos y de presupuesto configurable. Nunca hace merge.
```

### A7 · QA (evaluador)

```prompt
Paso 7: el evaluador. Es la pieza que más calidad aporta, así que exígete. Propón el plan y espera mi ok.

.claude/agents/qa-evaluator.md:
- Herramientas: lectura, Bash para ejecutar tests y Playwright. Nunca edita el código de la app: solo escribe en tests/acceptance/, e2e/ y docs/delivery/. Usa memory: project (fallos típicos de esta app).
- Postura: escéptico. No escribiste este código y tu trabajo es encontrar por qué NO cumple. Si no puedes demostrar que un CA se cumple, el CA falla.

Tres modos, según quién lo llame:

1. Revisión de CA (lo llama /spec, antes de G1). Para cada CA: ¿se puede comprobar sin interpretar?, ¿tiene cifras de ejemplo?, ¿cubre casos límite, errores y permisos? Propone CA nuevos o reescritos, con su porqué. No toca el PRD: devuelve la lista al PM.

2. Tests de aceptación (lo llama /build, antes de programar). A partir de los CA y de las interfaces del plan, escribe un test por CA en el nivel más barato que lo demuestre: unitario para reglas y cálculos, integración para base de datos y permisos, e2e de Playwright solo para flujos de pantalla. Todos deben fallar (rojo) antes del código. Anota en tasks.json qué test cubre cada CA.

3. Verificación final (lo llama /build al terminar):
   a. Ejecuta todos los tests.
   b. Revisa el código frente a los CA: que cada CA tenga un test que de verdad lo compruebe (no uno trivial ni uno que el developer haya debilitado) y que las reglas de negocio estén aplicadas como dice el PRD.
   c. Prueba exploratoria en la app real de lo que los tests no cubren, leyendo la página como texto (árbol de accesibilidad) y con capturas solo cuando lo visual importa.
   d. Escribe docs/delivery/<feature>/qa-report.md: tabla CA | Nivel | Resultado | Prueba | Pasos para reproducir, y los fallos por gravedad. Nada de estilo.
   e. Cada fallo encontrado a mano se convierte en un test nuevo, para que la CI lo repita gratis.

Calibración: incluye en el agente dos ejemplos de buen informe y uno malo (aprobar algo a medias), para que entienda el listón.
```

### A8 · Cierre y coherencia documental

```prompt
Paso 8: el cierre, para que la spec siga viva. Propón el plan y espera mi ok.

.claude/skills/close/SKILL.md (/close <feature>), después del merge:
1. PM: pasa el PRD a "Implementado", con lo que cambió durante la construcción, y las decisiones a "Implementada" en decisions.md.
2. Arquitecto: actualiza data-model.md, los ADR y docs/architecture.
3. Comprobación de deriva: busca contradicciones entre CLAUDE.md, decisions.md, los PRD, el modelo de datos y el código. Las lista y propone cómo arreglarlas.
4. Retro corta en docs/process/lessons.md: qué falló del arnés y qué pieza sobró o faltó. Propone cambios concretos a agentes, skills o hooks, sin aplicarlos.
```

### A9 · Encadenar, ensayar y empaquetar

```prompt
Paso 9: encadenar y probar el arnés entero.

1. .claude/skills/feature/SKILL.md (/feature <nombre>): guía del ciclo completo. Detecta en qué fase está una funcionalidad por el estado de sus documentos y propone el siguiente paso. Nunca salta una puerta: G1, G2 y G3 necesitan mi aprobación explícita.
2. .claude/skills/bootstrap/SKILL.md (/bootstrap): arranque de una app nueva desde la plantilla (visión, reglas de oro, stack y sistema de diseño), con G0 al final.
3. Ensayo: crea una app de juguete (una lista de tareas con un único CRUD) y pasa una funcionalidad por todo el ciclo. Mide cuántas veces me necesitaste, qué falló y el tiempo y coste aproximados (/usage). Ajusta y apúntalo en lessons.md.
4. Empaquetado: explícame cómo usar este repositorio como plantilla de GitHub y cómo convertirlo en un plugin de Claude Code (agentes, skills y hooks) cuando esté estable. Hazlo solo si te lo confirmo.
```

---

## Bloque B · Arrancar una app nueva (G0)

Crea el repositorio desde la plantilla y abre Claude Code en él.

### B1 · Visión y reglas de oro

```prompt
Esta es una app nueva creada desde la plantilla del arnés. Lee CLAUDE.md y docs/process/README.md, y ejecuta /bootstrap.

Entrevístame para escribir docs/product/vision.md: problema, usuarios, propuesta de valor, decisiones que la app debe ayudar a tomar, qué NO es, alcance del MVP y métricas de éxito. La idea en una frase: <<tu idea>>.

Después:
- Propón las reglas de oro (invariantes) y rellena CLAUDE.md.
- Propón el mapa de funcionalidades (backlog de PRD) en orden de construcción, con su porqué.
Todo queda en estado "Pendiente de G0".
```

### B2 · Arquitectura base

```prompt
La visión está aprobada. Como arquitecto, propón:
- El stack, con alternativas y una recomendación.
- El modelo de datos v0.
- Los entornos: local, vista previa y producción, con una base de datos que no sea la de producción para que trabajen los agentes.
- Seguridad, tests (unitarios y e2e) y despliegue.

Escribe un ADR para cada decisión difícil de revertir. Explícalo en términos sencillos y espera mi ok antes de crear código.
```

### B3 · Puesta en marcha técnica y sistema de diseño

```prompt
La arquitectura está aprobada. Ahora:
1. Crea el proyecto y configura check.sh e init.sh con los comandos reales, la CI, la base de datos local y las reglas de check-invariants que salen de las reglas de oro.
2. Dime paso a paso lo que tengo que hacer yo fuera de aquí: proteger main en GitHub, vistas previas en el servicio de despliegue, secretos.
3. Ejecuta /design-system.
4. Comprueba que los hooks saltan con este stack.

Termina con un "hola mundo" desplegado en vista previa, la CI en verde y un primer test e2e pasando.
```

---

## Bloque C · El ciclo de cada funcionalidad (se repite)

Aquí ya no hacen falta prompts largos: los skills llevan el procedimiento.

| Paso | Escribes | Haces tú |
|---|---|---|
| 1 | `/discover <feature>` | Contestas la entrevista (de 15 a 30 minutos) |
| 2 | `/spec <feature>` | Lees el PRD y respondes "G1 aprobado" o "cambios: …" |
| 3 | `/design <feature>` | Revisas los bocetos, resuelves las dudas en bloque y respondes "G2 aprobado" |
| 4 | `/build <feature>` | Te vas. Mejor en una sesión en la nube (claude.ai/code), que sigue sin tu ordenador |
| 5 | Revisión G3 | Pruebas la vista previa, lees `qa-report.md` y haces merge o pides cambios en el PR |
| 6 | `/close <feature>` | Lees las lecciones y decides qué cambiar del arnés |

**Tallas: la ceremonia depende del tamaño.** El PM propone la talla en `/spec` y tú la confirmas en G1.

| Talla | Ejemplo | Qué se hace |
|---|---|---|
| **S** | Un campo nuevo, un texto, un fallo pequeño | Sin `/discover` ni UX. Spec de media página, tests de aceptación, `/build` con verificación por tests (sin prueba exploratoria) |
| **M** | Una pantalla nueva sobre un modelo existente | Ciclo completo, sin bocetos si reutiliza patrones del sistema de diseño |
| **L** | Un PRD como los de la v1 (modelo de datos nuevo, varias pantallas) | Arnés completo, con prueba exploratoria y revisión visual |

**Si /build se atasca:** lee los bloqueos de `progress.md`. Si es un problema de spec, vuelve a G1 o G2. No lo resuelvas en el chat de construcción.

---

## Bloque D · Family Finance v2

Cuando la v1 esté terminada:

```prompt
Vamos a preparar la v2 de Family Finance con el arnés de la plantilla <<URL del repositorio plantilla>>. Antes de tocar nada, propón el plan y espera mi ok. No pierdas contenido: mueve y enlaza, no reescribas.

1. CLAUDE.md: redúcelo a 80 líneas como máximo y quita los @imports de documentos largos. Pasa a .claude/rules las reglas de carpeta: src/lib/finance (lógica financiera con tests, céntimos, moneda), supabase/migrations (RLS, change_log, compatibilidad con la app desplegada) y UI.
2. Documentos: lleva los existentes a la estructura nueva. vision.md sale de discovery-backlog §1. decisions.md se mantiene. Cada plan-prd-NN pasa a docs/delivery/prd-NN/plan.md. Los PRD siguen en docs/product.
3. Controles: check.sh con tsc, eslint y vitest. check-invariants con "ningún porcentaje, importe ni parámetro de la política en el código". Bloqueo de migraciones y escrituras contra el proyecto de producción de Supabase. Supabase local con datos semilla para los agentes, nunca datos reales.
4. e2e: base de Playwright con un usuario de prueba y datos semilla.
5. Piloto: la primera funcionalidad de la v2 por el ciclo completo, de /discover a /close. Al final, lessons.md con lo aprendido.
```

---

## 3. Riesgos y cómo evitarlos

| Riesgo | Cómo se evita |
|---|---|
| **Coste.** El arnés completo gasta mucho más que un agente solo | QA completo solo en funcionalidades grandes. Modelos pequeños en los revisores sencillos. Mirar `/usage` en cada `/close` |
| **Burocracia.** Fases que no aportan | Si una pieza no encuentra nada en dos ciclos, se quita. `lessons.md` lo registra |
| **Datos reales.** Un agente que toca producción | Base de datos local y reglas que bloquean producción. Las migraciones a producción las aplicas tú |
| **Revisor quisquilloso.** Siempre encuentra algo | Pedirle solo lo que afecta a la corrección o la coherencia, nunca el estilo |
| **Spec congelada.** Construir revela cosas | Un hallazgo es un bloqueo y se vuelve a G1 o G2. El developer no improvisa |
| **La sintaxis cambia** | Cada prompt pide leer la documentación vigente. Revisar el arnés con cada modelo nuevo |

---

## Fuentes

**Primarias:**
- Anthropic, [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (J. Young, 26-11-2025)
- Anthropic, [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) (P. Rajasekaran, 24-03-2026)
- Anthropic, [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (19-12-2024)
- Claude Code, [Best practices](https://code.claude.com/docs/en/best-practices) y [Subagents](https://code.claude.com/docs/en/sub-agents.md)

**Secundarias:**
- B. Böckeler, [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) y el [podcast de Thoughtworks](https://www.thoughtworks.com/insights/podcasts/technology-podcasts/what-is-spec-driven-development). Solo vi resúmenes: el dominio está bloqueado en la sesión donde se escribió esto
- [GitHub Spec Kit](https://github.github.com/spec-kit/) y [roles de BMAD](https://www.mintlify.com/bmad-code-org/BMAD-METHOD/reference/agents/overview)
