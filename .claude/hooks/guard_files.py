#!/usr/bin/env python3
"""PreToolUse (Edit|Write|NotebookEdit): bloquea escribir archivos de secretos."""
import fnmatch
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from harness_config import load, read_hook_input, rel  # noqa: E402

data = read_hook_input()
tool_input = data.get("tool_input", {})
path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
if not path:
    sys.exit(0)

cfg = load()
name = os.path.basename(path)
r = rel(path)
exceptions = cfg.get("secret_file_exceptions", [".env.example"])
patterns = cfg.get("secret_files", [".env", ".env.*"])

if name not in exceptions and any(fnmatch.fnmatch(name, p) or fnmatch.fnmatch(r, p) for p in patterns):
    print(
        f"Bloqueado por el arnés: '{r}' es un archivo de secretos. "
        "Los secretos los gestiona la persona; usa variables de entorno y documenta la variable en .env.example.",
        file=sys.stderr,
    )
    sys.exit(2)
sys.exit(0)
