#!/usr/bin/env python3
"""PreToolUse (Edit|Write|NotebookEdit) para un agente concreto.
--allow PREFIJO ...  solo deja escribir bajo esos prefijos.
--deny PREFIJO ...   no deja escribir bajo esos prefijos.
--deny-acceptance    no deja escribir en acceptance_test_paths de harness.json.
La memoria de los agentes (.claude/agent-memory*/) siempre se permite."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from harness_config import load, read_hook_input, rel  # noqa: E402

args = sys.argv[1:]
allow, deny, mode = [], [], None
for a in args:
    if a in ("--allow", "--deny"):
        mode = a
    elif a == "--deny-acceptance":
        deny.extend(load().get("acceptance_test_paths", ["tests/acceptance/", "e2e/"]))
    elif mode == "--allow":
        allow.append(a)
    elif mode == "--deny":
        deny.append(a)

tool_input = read_hook_input().get("tool_input", {})
path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
if not path:
    sys.exit(0)
r = rel(path)

if r.startswith((".claude/agent-memory/", ".claude/agent-memory-local/")):
    sys.exit(0)
if any(r.startswith(d) for d in deny):
    print(
        f"Bloqueado por el arnés: este agente no puede escribir en '{r}'. "
        "Si crees que ese archivo está mal, apúntalo como bloqueo en progress.md.",
        file=sys.stderr,
    )
    sys.exit(2)
if allow and not any(r.startswith(a) for a in allow):
    print(
        f"Bloqueado por el arnés: este agente solo escribe en {', '.join(allow)} y '{r}' queda fuera.",
        file=sys.stderr,
    )
    sys.exit(2)
sys.exit(0)
