# Controles

Los controles son las reglas que **Claude Code aplica siempre**, decida lo que decida el modelo. Las instrucciones de `CLAUDE.md` son consejos; esto no.

Regla para añadir uno: solo si la regla **no admite excepciones**. Si una regla tiene excepciones razonables, va en `CLAUDE.md` o en `.claude/rules/`. Cada control salta a veces cuando no debe y hay que mantenerlo, así que el conjunto es pequeño.

**Requisito:** `python3` y `git` instalados. Si falta `python3`, los hooks de bloqueo fallan y, como tienen `onFailure: "block"`, bloquean (mejor parar que dejar pasar sin comprobar).

## Qué hay

| Control | Dónde | Qué bloquea | Por qué |
|---|---|---|---|
| **Comprobación al terminar** | Hook `Stop` → `.claude/hooks/stop_check.sh` | Terminar el turno con `scripts/check.sh` en rojo (tipos, lint, tests, invariantes). Si nada cambió desde la última comprobación correcta, no repite | "Terminado" significa comprobado, no "parece terminado" |
| **Ramas protegidas** | Hook `PreToolUse` (Bash) → `guard_bash.py` | `git push` a `main`/`master`, cualquier push estando en ellas y `git commit` en ellas (salvo el primer commit de un repositorio vacío) | Todo pasa por una rama y un PR; el merge lo hace la persona |
| **Historia** | `guard_bash.py` y reglas `deny` | `git push --force` (sí se permite `--force-with-lease` en la propia rama) y `git reset --hard origin/*` | No se reescribe trabajo ajeno |
| **Secretos** | Hook `PreToolUse` (Edit/Write) → `guard_files.py` y `guard_bash.py` | Escribir `.env` y `.env.*`, y leerlos o copiarlos desde la shell. `.env.example` sí se permite | Los secretos los gestiona la persona |
| **Producción** | `guard_bash.py` + `production_command_patterns` en `.claude/harness.json` | Cualquier comando que contenga uno de esos patrones (p. ej. `db push --linked`) | Los agentes trabajan en local; producción es cosa de la persona |
| **Tests de aceptación** | Hook propio del agente `developer` → `scope_guard.py --deny-acceptance` | Que el Developer edite `tests/acceptance/` y `e2e/` | Quien programa no reescribe la prueba que lo juzga |
| **Ámbito de cada agente** | Hooks propios de cada agente → `scope_guard.py --allow …` | Que UX, Arquitecto o QA escriban fuera de sus carpetas | Cada rol toca solo lo suyo (su memoria siempre se permite) |
| **Los controles no se tocan solos** | Reglas `ask` en `.claude/settings.json` | Editar `settings.json`, `harness.json` o los hooks sin que la persona lo apruebe | Un agente no puede quitarse sus propios límites |
| **CI** | `.github/workflows/ci.yml` | Un PR con el autotest del arnés o `scripts/check.sh` en rojo | La misma comprobación, fuera de la máquina |

## Configuración por app (`.claude/harness.json`)

| Clave | Qué es | Ejemplo |
|---|---|---|
| `checks.typecheck`, `checks.lint`, `checks.test` | Comandos que ejecuta `scripts/check.sh`. Vacío = se salta con aviso | `npx tsc --noEmit`, `npm run lint`, `npm test` |
| `init` | Arranque del entorno local para `scripts/init.sh` | `npx supabase start && npm run seed` |
| `protected_branches` | Ramas donde no se hace commit ni push | `["main"]` |
| `secret_files`, `secret_file_exceptions` | Archivos de secretos y excepciones | `[".env", ".env.*"]`, `[".env.example"]` |
| `production_command_patterns` | Trozos de comando que tocan producción | `["db push --linked", "--project-ref", "migrate deploy"]` |
| `acceptance_test_paths` | Carpetas de QA que el Developer no edita | `["tests/acceptance/", "e2e/"]` |

Las reglas de oro que se pueden comprobar con un script (p. ej. "ningún porcentaje de negocio en el código") van en `scripts/check-invariants.sh`, que trae ejemplos comentados.

## Cómo comprobar que funcionan

```bash
scripts/test-harness.sh   # 21 pruebas: cada control bloquea lo que debe y deja pasar lo demás
scripts/check.sh          # la comprobación completa
```

Prueba manual del hook `Stop`: pon `"test": "false"` en `.claude/harness.json`, pide a Claude cualquier cambio y verás que no puede terminar hasta que el comando pase. Si el hook bloquea varias veces seguidas sin que Claude haga nada, Claude Code acaba dejando terminar (ver la documentación de hooks).

## Lo que estos controles no cubren

- **Protección de `main` en GitHub**: hay que activarla a mano (Settings → Branches → regla para `main`: exigir PR y CI en verde). Es la barrera que no depende de Claude Code.
- **Comandos disfrazados**: un comando muy rebuscado (p. ej. `bash -c` con texto codificado) puede esquivar los patrones. Los controles evitan errores, no ataques.
- **Herramientas fuera de Claude Code**: lo que hagas tú en la terminal no pasa por los hooks.
