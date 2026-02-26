@echo off
title Corrigir Prisma e rodar backend
cd /d "%~dp0"

echo.
echo 1. Reinstalando dependencias (Prisma 4 - sem erro WASM)...
echo.
cd "Plataforma-Gestao-Eventos_codigo-fonte\backend"
call npm install
if errorlevel 1 (
    echo [ERRO] npm install falhou.
    pause
    exit /b 1
)
cd /d "%~dp0"

echo.
echo 2. Executando script do backend...
echo.
powershell -ExecutionPolicy Bypass -NoProfile -File ".\rodar-backend-sem-admin.ps1"

pause
