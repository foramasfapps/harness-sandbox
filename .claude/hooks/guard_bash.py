#!/usr/bin/env python3
"""PreToolUse (Bash): bloquea push o commit en ramas protegidas, push --force,
leer archivos de secretos y comandos contra producción."""
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from harness_config import load, project_dir, read_hook_input  # noqa: E402

command = read_hook_input().get("tool_input", {}).get("command", "")
if not command:
    sys.exit(0)

cfg = load()
protected = cfg.get("protected_branches", ["main", "master"])


def block(reason: str) -> None:
    print(f"Bloqueado por el arnés: {reason}", file=sys.stderr)
    sys.exit(2)


def git(*args: str) -> str:
    try:
        return subprocess.run(
            ["git", *args], cwd=project_dir(), capture_output=True, text=True, timeout=5
        ).stdout.strip()
    except Exception:
        return ""


# Separa comandos compuestos para analizar cada parte.
parts = [p.strip() for p in re.split(r"&&|\|\||;|\||\n", command) if p.strip()]
current = git("rev-parse", "--abbrev-ref", "HEAD")
has_commits = bool(git("rev-parse", "--verify", "-q", "HEAD"))

for part in parts:
    if re.search(r"\bgit\b(\s+-\S+(\s+\S+)?)*\s+push\b", part):
        if re.search(r"(\s--force(?!-with-lease)\b|\s-f\b|\s\+\S)", part):
            block("git push --force reescribe historia. Usa --force-with-lease en tu propia rama, o pide a la persona.")
        tokens = re.split(r"\s+", part)
        for b in protected:
            if any(t == b or t.endswith(":" + b) or t == f"HEAD:{b}" for t in tokens):
                block(f"push a la rama protegida '{b}'. Trabaja en una rama y abre un PR; el merge lo hace la persona.")
        if current in protected and not any(t.startswith(("feature/", "fix/", "harness/")) for t in tokens):
            block(f"estás en la rama protegida '{current}'. Crea una rama (git switch -c feature/<nombre>) y haz push de esa.")
    if re.search(r"\bgit\b(\s+-\S+(\s+\S+)?)*\s+commit\b", part) and current in protected and has_commits:
        block(f"commit en la rama protegida '{current}'. Crea una rama antes de hacer commit.")

# Leer o volcar archivos de secretos desde la shell.
secret_names = cfg.get("secret_files", [".env", ".env.*"])
exceptions = set(cfg.get("secret_file_exceptions", [".env.example"]))
for token in re.findall(r"[\w./-]*\.env[\w.-]*", command):
    base = os.path.basename(token)
    if base in exceptions:
        continue
    if any(re.fullmatch(p.replace(".", r"\.").replace("*", ".*"), base) for p in secret_names):
        if re.search(r"\b(cat|less|more|head|tail|bat|cp|mv|scp|curl|grep|sed|awk|source)\b", command):
            block(f"acceso a '{token}' desde la shell. Los secretos no se leen ni se copian.")

# Comandos que tocan producción, definidos por cada app.
for pattern in cfg.get("production_command_patterns", []):
    if pattern and pattern.lower() in command.lower():
        block(
            f"el comando coincide con '{pattern}', marcado como de producción en .claude/harness.json. "
            "Las operaciones contra producción las hace la persona."
        )

sys.exit(0)
