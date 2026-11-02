# Lecciones aprendidas

Se escribe en cada `/close`. Sirve para mejorar el arnés: qué pieza falló, cuál sobró y cuál faltó.

## Métricas por funcionalidad

| Funcionalidad | Talla | Fecha de cierre | Consumo (de `/usage`) | Veces que hizo falta la persona fuera de las puertas | Fallos escapados (encontrados en G3 o después) |
|---|---|---|---|---|---|
| `tareas` | M | 02-11-2026 | `/usage` (02-11-2026): 32,91 $, 87 min de API, 26,4 M de tokens leídos de caché y 524.400 escritos en caché, 54 % del límite de la sesión y 73 % del semanal. Podría no cubrir el tramo anterior al límite de uso. Solo subagentes, sin el cierre: unos 2,0 millones de tokens (Developer 1,05 M, QA 0,69 M, Arquitecto 0,18 M, UX y revisores 0,09 M) | 3: decir dónde estaba el repo, el comando `/feature` escrito en la terminal y reintentar tras el límite de uso | 0 |

## Lecciones

### `/bootstrap` bloque 1 (visión y reglas) · 01-11-2026

- **Qué falló:** la sesión se abrió en una carpeta vacía, sin clonar el repo, así que `/bootstrap` no se encontró y el trabajo arrancó sin arnés hasta clonarlo a mano. Al detectarlo, el hook `guard_bash.py` sí bloqueó un commit en `main`. También bloqueó el comando entero, incluida la creación de la rama que venía detrás.
- **Qué sobró:** para esta app, gran parte de la entrevista de visión: el encargo inicial ya respondía a casi todo y bastaron cuatro preguntas. Las secciones "decisiones que ayuda a tomar" y "métricas" dan poco en una app de juguete.
- **Qué faltó:** un aviso de `README.md` de que `/bootstrap` debe ejecutarse dentro del repo clonado. La línea de `CLAUDE.md` que decía "no rellenes nada" se contradecía con el paso del bloque 1 que manda rellenarlo; solo se resuelve leyendo la skill.
- **Cambio propuesto al arnés:** (1) añadir en `README.md` "clona el repo y abre Claude Code dentro"; (2) en `CLAUDE.md`, aclarar que la línea de aviso no aplica durante `/bootstrap`; (3) permitir a `/bootstrap` una entrevista reducida cuando el encargo ya cubre las respuestas.

### `/bootstrap` bloque 2 (arquitectura) · 01-11-2026

- **Qué falló:** nada se rompió, pero las plantillas dan por hecho que hay base de datos, migraciones y un despliegue. Con una página estática, varias filas quedan en "no aplica" y el bloque 3 pide cosas sin sentido aquí, como datos semilla o una vista previa desplegada.
- **Qué sobró:** el subagente `architect`: la skill permite hacer su papel en la conversación, y aquí bastó con eso. También la fila de tests de integración.
- **Qué faltó:** una versión de `/bootstrap` para apps sin servidor, que diga qué pasos se pueden saltar sin que parezca un incumplimiento.
- **Cambio propuesto al arnés:** marcar en `/bootstrap` como "si aplica" la base de datos, los datos semilla, las migraciones y la vista previa. Si no se despliega, el ensayo no prueba esa parte de G3 y debe quedar dicho.

### `/bootstrap` bloque 3 (puesta en marcha y sistema de diseño) · 01-11-2026

- **Qué falló:** `scripts/test-harness.sh` y `scripts/check.sh` pasan, pero el autotest no prueba las invariantes propias de la app, así que hubo que comprobarlas a mano metiendo un incumplimiento temporal. `harness.json` pide `init` "con datos semilla", y aquí solo instala dependencias. Se ignoró el aviso de `typecheck` y `lint` sin configurar, que se repite en cada comprobación aunque sea una decisión aprobada.
- **Qué sobró:** para esta app, gran parte de `/design-system`: tokens de estado sin uso previsto (`--ok`, `--warn`) y filas de tipografía que no aplican. También la vista previa desplegada del paso 10, que se saltó por decisión aprobada.
- **Qué faltó:** una forma de marcar un comando como "no aplica" en `checks` para que no se confunda con "sin configurar", una forma de medir el consumo por bloque y un paso que compruebe la identidad de git: los primeros commits fallaron por no tenerla configurada, y el comando siguió y subió la rama vacía.
- **Cambio propuesto al arnés:** (1) distinguir en `harness.json` entre comando vacío por olvido y `null` por decisión; (2) añadir a `/bootstrap` un paso que pruebe cada invariante con un incumplimiento; (3) reducir `/design-system` según la talla de la app.

### `/bootstrap` puerta G0 · 01-11-2026

- **Qué falló:** el cierre no dice cuándo se aprueba si la CI sigue en curso; hizo falta una aprobación condicionada a que terminara en verde.
- **Qué sobró:** nada.
- **Qué faltó:** en `/bootstrap`, una regla sobre el orden entre aprobar G0 y hacer merge del PR. Los documentos pasan a `Aprobado` dentro de un PR todavía sin fusionar, así que en `main` siguen sin aprobar hasta el merge.
- **Cambio propuesto al arnés:** indicar en `/bootstrap` que G0 exige la CI terminada en verde y que el merge del PR la cierra.

### `tareas` · `/feature` y `/discover` · 01-11-2026

- **Qué falló:** se entregó `/feature tareas` en un bloque de terminal, y al ejecutarlo la shell respondió que no existía. `disable-model-invocation` impide lanzar la skill en nombre de la persona, así que cada fase exige un mensaje suyo, aunque ya la haya pedido.
- **Qué sobró:** repasar en la entrevista temas ya cerrados por `vision.md` (problema, resultado y permisos): en esta app solo aportó recogerlos en las notas.
- **Qué faltó:** el orden de las tareas era la regla con más casos, y la vista previa de diseño no la anticipaba. Una regla sobre cómo avisar de que los comandos del arnés se escriben en el chat.
- **Cambio propuesto al arnés:** (1) indicar en `/feature` y en las skills que el siguiente comando se escribe en el chat, no en la terminal; (2) permitir a `/discover` saltarse los temas que `vision.md` ya resuelve.

### `tareas` · `/spec` · 01-11-2026

- **Qué falló:** el primer borrador tenía errores reales que el redactor no vio. CA-03 contradecía RN-01 por un ejemplo mal planteado en la entrevista, y CA-06 pasaba aunque no se recortaran los espacios. La revisión independiente los detectó. Al pedir a QA "no edites ningún archivo", tampoco pudo guardar su memoria.
- **Qué sobró:** los criterios pasaron de 28 a 49 y las reglas de 12 a 15. Es mucho para una lista de tareas: la talla M no frena el volumen, y las dos revisiones se solaparon en varios huecos (dos pestañas, varias filas abiertas, carácter).
- **Qué faltó:** un tope orientativo de criterios por talla y una pauta para agrupar variantes. También faltó una forma de marcar en la revisión lo que es "defecto" frente a "mejora opcional".
- **Cambio propuesto al arnés:** (1) en `/spec`, dar un tope orientativo de criterios por talla; (2) pedir a `pm-reviewer` que no entre en cifras de CA y a `qa-evaluator` que no entre en alcance; (3) en el modo revisión de QA, permitir escribir en su memoria aunque no edite el PRD.

### `tareas` · `/design` · 01-11-2026

- **Qué falló:** el arnés se contradice en sus tests. Con criterios que necesitan navegador, los tests de aceptación en rojo dejan `check.sh` en rojo si van en `tests/acceptance/`, y `check.sh` no ejecuta Playwright si van en `e2e/`. Además, solo `/build` y `/close` indican el nombre de rama `feature/<feature>`, y `/discover` no lo dice: se creó `feat/tareas`. `e2e/hello.spec.js` también bloquea al Developer, que no puede editar `e2e/` aunque su tarea elimine el hola mundo.
- **Qué sobró:** el arquitecto gastó 127.000 tokens y 9 minutos en 11 tareas de una lista de tareas, más que todo el resto de la fase. Parte de sus 12 contradicciones son detalles de redacción.
- **Qué faltó:** en `/design`, una regla para las dudas de producto con respuesta obvia: de 9 de UX y 5 del arquitecto, solo 4 necesitaban a la persona. También faltó indicar que hay que hacer commit de los documentos antes de `/build`.
- **Cambio propuesto al arnés:** (1) definir dónde viven los tests de aceptación de pantalla y cómo se ejecutan en `check.sh` sin bloquear al Developer; (2) fijar el nombre de rama en `/discover`; (3) dar a los agentes de `/design` un límite de esfuerzo según la talla.

### `tareas` · `/build` · 02-11-2026

- **Qué falló:** el `verify` de cada tarea solo filtra por `CA-xx:`, así que los tests que añade QA en sus verificaciones no los ejecutaba nadie hasta que el orquestador lo pidió a mano. `scope_guard.py` no deja a QA escribir en el scratchpad. Un límite de uso cortó la segunda verificación de QA, y se retomó sin perder trabajo.
- **Qué sobró:** las dos verificaciones parciales y la final gastaron unos 505.000 tokens, frente a unos 1.050.000 de las 12 invocaciones del Developer y 135.000 de los tests de aceptación. Para una talla M con 49 CA, una verificación parcial más la final habrían bastado.
- **Qué faltó:** decir en `tasks.json` cómo se ejecutan los tests nuevos de QA, por ejemplo con un `verify` por archivo y no por ID. También una regla para el `favicon.ico`: el Chromium reducido de Playwright no lo pide y el completo sí.
- **Valor real:** QA encontró 14 fallos que los CA no veían, de ellos 1 alto (404 en consola) y 2 medios (RN-13 y avisos sin anunciar). Ninguno llegó a G3. Developer y QA nunca necesitaron a la persona, y las 11 tareas se cerraron sin bloqueos.
- **Cambio propuesto al arnés:** (1) que `/build` ejecute la suite e2e completa al comprobar cada tarea, no solo su `verify`; (2) bajar a una verificación parcial en talla M; (3) permitir a QA escribir en el scratchpad.

### `tareas` · `/close` y retro del ensayo · 02-11-2026

- **Qué falló:**
  - **Tests y comprobaciones:** el arnés no cuadra los tests de pantalla con `check.sh`. Los de aceptación tuvieron que ir a `e2e/`, `check.sh` no los ejecuta, y solo la CI y QA ejecutaban la suite completa.
  - **Arranque:** la sesión empezó fuera del repo clonado, así que `/bootstrap` no existía hasta clonarlo.
  - **Consumo:** no se puede medir por fase desde dentro de la sesión.
- **Qué sobró:**
  - **Ceremonia para la talla:** una lista de tareas de talla M pasó por 49 CA, 15 reglas, 12 contradicciones de diseño y 3 verificaciones de QA. El coste estuvo en la revisión más que en el código.
  - **Documentación:** `vision.md` y `/design-system` traen secciones que en una app de juguete no aportan.
- **Qué faltó:**
  - **Nombre de rama:** fijarlo antes de `/build`.
  - **Comandos en el chat:** decir de forma visible que los comandos del arnés se escriben en el chat, no en la terminal.
  - **Pasos que no aplican:** una forma de marcarlos (base de datos, vista previa) sin que parezcan olvidos.
- **Lo que funcionó:**
  - **Controles:** el hook de commits en `main`, las invariantes y el reparto de carpetas por rol funcionaron sin fallar.
  - **Revisión independiente:** detectó errores reales en tres fases: 2 CA mal planteados en `/spec`, 12 contradicciones en `/design` y 14 fallos en `/build`.
  - **Fallos escapados:** 0 llegaron a G3.
- **Cambios propuestos al arnés** (no aplicados; los decide la persona):
  1. `README.md`: "clona el repo y abre Claude Code dentro antes de `/bootstrap`".
  2. `/discover` crea la rama `feature/<feature>`; `/build` y `/close` ya la esperan.
  3. Tests de aceptación de pantalla en `e2e/<feature>/`. `/build` ejecuta la suite e2e completa al comprobar cada tarea, y `check.sh` ejecuta la e2e de las tareas en `passing`.
  4. Topes orientativos por talla: CA en `/spec`, esfuerzo del arquitecto en `/design` y número de verificaciones de QA en `/build` (en M, una parcial y la final).
  5. `harness.json`: distinguir un comando vacío por olvido de un `null` por decisión aprobada.
  6. `/bootstrap`: marcar como "si aplica" la base de datos, los datos semilla, las migraciones y la vista previa, y probar cada invariante con un incumplimiento.
  7. Indicar en `/feature` y en el final de cada skill que el siguiente comando se escribe en el chat.
  8. Permitir a QA escribir en el scratchpad y en su memoria en modo revisión.

<!-- Una entrada por cierre:
### <feature> · <fecha>
- **Qué falló:**
- **Qué sobró:**
- **Qué faltó:**
- **Cambio propuesto al arnés:** (agente, skill o control concreto; se aplica solo con aprobación)
-->
