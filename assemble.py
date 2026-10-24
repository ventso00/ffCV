from pathlib import Path
import subprocess
subprocess.run(["node", "scripts/build.mjs"], cwd=Path(__file__).parent, check=True)
