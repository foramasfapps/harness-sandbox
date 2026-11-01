# Lecciones aprendidas

Se escribe en cada `/close`. Sirve para mejorar el arnés: qué pieza falló, cuál sobró y cuál faltó.

## Métricas por funcionalidad

| Funcionalidad | Talla | Fecha de cierre | Consumo (de `/usage`) | Veces que hizo falta la persona fuera de las puertas | Fallos escapados (encontrados en G3 o después) |
|---|---|---|---|---|---|

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

<!-- Una entrada por cierre:
### <feature> · <fecha>
- **Qué falló:**
- **Qué sobró:**
- **Qué faltó:**
- **Cambio propuesto al arnés:** (agente, skill o control concreto; se aplica solo con aprobación)
-->
