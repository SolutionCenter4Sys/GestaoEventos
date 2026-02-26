@echo off
title Instalar dependencias - Backend
cd /d "%~dp0Plataforma-Gestao-Eventos_codigo-fonte\backend"

echo.
echo Instalando dependencias (npm install)...
echo.

npm install

echo.
if errorlevel 1 (
    echo [ERRO] Falha no npm install.
) else (
    echo [OK] Dependencias instaladas.
)
echo.
pause
