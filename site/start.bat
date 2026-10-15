@echo off
cd /d "%~dp0"
where python >nul 2>nul && (set PY=python) || (set PY=py)
start "" http://localhost:5500/index.html
start "" http://localhost:5500/admin.html
%PY% server.py
pause
