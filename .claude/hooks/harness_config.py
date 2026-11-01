"""Lee .claude/harness.json para los hooks y scripts del arnés."""
import json
import os
import sys


def project_dir() -> str:
    return os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def load() -> dict:
    path = os.path.join(project_dir(), ".claude", "harness.json")
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as e:
        print(f"harness.json no es JSON válido: {e}", file=sys.stderr)
        sys.exit(2)


def rel(path: str) -> str:
    """Ruta relativa al proyecto, con barras normales."""
    root = os.path.realpath(project_dir())
    full = os.path.realpath(path if os.path.isabs(path) else os.path.join(root, path))
    try:
        r = os.path.relpath(full, root)
    except ValueError:
        return full.replace("\\", "/")
    return r.replace("\\", "/")


def read_hook_input() -> dict:
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError:
        return {}


if __name__ == "__main__":
    # Uso desde bash: python3 harness_config.py <clave.subclave>
    data = load()
    for key in sys.argv[1].split("."):
        data = data.get(key, "") if isinstance(data, dict) else ""
    print(data if isinstance(data, str) else json.dumps(data))
