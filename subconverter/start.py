import sys
import subprocess
from pathlib import Path
import time

home = Path.home()

if sys.platform == "win32":
  dl_dir = home / "Downloads"
  sc_exe = home / "aether" / "portable" / "subconverter" / "subconverter.exe"
elif sys.platform == "darwin":
  dl_dir = home / "Downloads"
  sc_exe = home / "aether" / "portable" / "subconverter" / "subconverter"
elif sys.platform.startswith("linux"):
  dl_dir = home / "downloads"
  sc_exe = home / "aether" / "portable" / "subconverter" / "subconverter"
else:
  sys.exit(0)

try:
  print("Starting services...")

  sc_proc = subprocess.Popen(
    [str(sc_exe)],
    cwd=str(sc_exe.parent),
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
  )

  time.sleep(1)

  http_proc = subprocess.Popen(
    [sys.executable, "-m", "http.server", "24776"],
    cwd=str(dl_dir),
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
  )

  print("\nProfiles:")
  print("  Clash: http://127.0.0.1:25500/clash")
  print("  Surge: http://127.0.0.1:25500/surge&ver=5&tfo=true")
  input("\nPress Enter to exit...")
finally:
  sc_proc.terminate()
  http_proc.terminate()
