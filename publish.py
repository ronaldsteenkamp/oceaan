"""Bouwt de oceaan, test hem en zet hem online.

Gebruik: python publish.py

1. Draait build.py (met zelftest; bij een fout stopt alles).
2. Zet de inhoud van dist/ als één commit op de branch gh-pages van GitHub. GitHub Pages toont die branch.
   De bouwresultaten staan zo nooit in main.

Git wordt gezocht in PATH of op de standaardplek in Windows. De GitHub Action in ci/pages.yml doet precies hetzelfde
(ook naar gh-pages) bij elke push naar main, zodra hij in .github/workflows/ staat; daarvoor heeft het GitHub-token
de scope "workflow" nodig. Tot die tijd gaat het met dit script.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
GIT = shutil.which("git") or r"C:\Program Files\Git\cmd\git.exe"


def git(*args, cwd=HERE):
    return subprocess.run([GIT, *args], cwd=cwd, check=True, capture_output=True, text=True).stdout.strip()


def main():
    subprocess.run([sys.executable, str(HERE / "build.py"), *sys.argv[1:]], check=True)
    remote = git("remote", "get-url", "origin")
    source = git("rev-parse", "--short", "HEAD")
    dirty = " (met wijzigingen die nog niet gecommit zijn)" if git("status", "--porcelain", "--", "src") else ""
    name, email = git("config", "user.name"), git("config", "user.email")
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "site"
        shutil.copytree(HERE / "dist", out)
        (out / ".nojekyll").write_text("")
        git("init", "-q", "-b", "gh-pages", cwd=out)
        git("add", "-A", cwd=out)
        git("-c", f"user.name={name}", "-c", f"user.email={email}", "commit", "-q", "-m", f"Oceaan gebouwd uit {source}{dirty}", cwd=out)
        git("push", "-q", "--force", remote, "gh-pages", cwd=out)
    print(f"Online gezet vanuit {source}{dirty}. GitHub Pages heeft er een minuut voor nodig.")


if __name__ == "__main__":
    main()
