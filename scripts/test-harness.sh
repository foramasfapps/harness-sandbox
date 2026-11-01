#!/usr/bin/env bash
# Autotest del arnés: comprueba que cada control bloquea lo que debe y deja pasar lo demás.
# Se ejecuta en un repositorio temporal para no depender de la rama actual.
set -u
root="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -r "$root/.claude" "$tmp/"
cd "$tmp" || exit 1
git init -q -b main && git -c user.email=t@t -c user.name=t commit -q --allow-empty -m init
export CLAUDE_PROJECT_DIR="$tmp"

pass=0; fail=0
expect() { # expect <0|2> <descripción> <json> <script> [args...]
  local want="$1" desc="$2" input="$3"; shift 3
  local got
  printf '%s' "$input" | python3 "$@" >/dev/null 2>&1; got=$?
  if [ "$got" = "$want" ]; then pass=$((pass+1)); echo "  ✓ $desc"; else fail=$((fail+1)); echo "  ✗ $desc (esperado $want, salió $got)"; fi
}
H=".claude/hooks"
bash_in() { printf '{"tool_name":"Bash","tool_input":{"command":%s}}' "$(python3 -c 'import json,sys;print(json.dumps(sys.argv[1]))' "$1")"; }
file_in() { printf '{"tool_name":"Write","tool_input":{"file_path":"%s/%s"}}' "$tmp" "$1"; }

echo "guard_bash (en main)"
expect 2 "push a main" "$(bash_in "git push origin main")" $H/guard_bash.py
expect 2 "push estando en main" "$(bash_in "git push")" $H/guard_bash.py
expect 2 "commit en main" "$(bash_in "git commit -m x")" $H/guard_bash.py
expect 2 "push --force" "$(bash_in "git push --force origin feature/x")" $H/guard_bash.py
expect 2 "leer .env" "$(bash_in "cat .env")" $H/guard_bash.py
expect 0 "leer .env.example" "$(bash_in "cat .env.example")" $H/guard_bash.py
expect 0 "comando normal" "$(bash_in "npm test && git status")" $H/guard_bash.py

git switch -q -c feature/x
echo "guard_bash (en feature/x)"
expect 0 "commit en una rama" "$(bash_in "git commit -m x")" $H/guard_bash.py
expect 0 "push de la rama" "$(bash_in "git push -u origin feature/x")" $H/guard_bash.py
expect 0 "push --force-with-lease en la rama" "$(bash_in "git push --force-with-lease origin feature/x")" $H/guard_bash.py

python3 - <<'PY'
import json; p=".claude/harness.json"; c=json.load(open(p)); c["production_command_patterns"]=["db push --linked"]; json.dump(c,open(p,"w"))
PY
expect 2 "comando de producción configurado" "$(bash_in "supabase db push --linked")" $H/guard_bash.py

echo "guard_files"
expect 2 "escribir .env" "$(file_in ".env")" $H/guard_files.py
expect 2 "escribir .env.local" "$(file_in ".env.local")" $H/guard_files.py
expect 0 "escribir .env.example" "$(file_in ".env.example")" $H/guard_files.py
expect 0 "escribir código" "$(file_in "src/app.ts")" $H/guard_files.py

echo "scope_guard"
expect 2 "developer no edita tests de aceptación" "$(file_in "tests/acceptance/f/ca-01.test.ts")" $H/scope_guard.py --deny-acceptance
expect 2 "developer no edita e2e" "$(file_in "e2e/f.spec.ts")" $H/scope_guard.py --deny-acceptance
expect 0 "developer edita código" "$(file_in "src/app.ts")" $H/scope_guard.py --deny-acceptance
expect 0 "UX escribe en docs/design" "$(file_in "docs/design/f/flows.md")" $H/scope_guard.py --allow docs/design/
expect 2 "UX no escribe código" "$(file_in "src/app.ts")" $H/scope_guard.py --allow docs/design/
expect 0 "memoria del agente siempre permitida" "$(file_in ".claude/agent-memory/qa/MEMORY.md")" $H/scope_guard.py --allow docs/design/

echo
echo "Resultado: $pass correctas, $fail fallidas"
[ "$fail" -eq 0 ]
