@echo off
title Frontend Mock - Apresentacao
cd /d "%~dp0"

echo.
echo =============================================
echo   Frontend Mock - Apresentacao (localhost)
echo =============================================
echo.
echo Sem git, sem docker - apenas apresentacao.
echo.

REM 1. NVM: usar Node 20 (se nvm instalado)
where nvm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [1/3] Configurando Node 20 via nvm...
    call nvm install 20
    call nvm use 20
    echo.
) else (
    echo [1/3] NVM nao encontrado - usando Node atual.
    echo.
)

REM 2. Corrigir dependencias
echo [2/3] Corrigindo dependencias (limpar + reinstalar)...
call powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0corrigir-frontend.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Erro ao corrigir. Verifique FRONTEND-SWC-FIX.md
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando servidor...
echo.
echo   URL: http://localhost:4302
echo   Usuario mock injetado - sem login.
echo.

REM 3. Rodar mock
call powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rodar-mock.ps1"

pause
