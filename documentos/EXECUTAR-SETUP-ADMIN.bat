@echo off
REM ============================================================
REM Executa o setup do backend (recomendado como Administrador)
REM Clique direito neste arquivo -> Executar como administrador
REM ============================================================

cd /d "%~dp0"

echo.
echo ========================================
echo   SETUP BACKEND - Plataforma de Eventos
echo ========================================
echo.

REM Tenta executar PowerShell com politica de execucao bypass
powershell -ExecutionPolicy Bypass -File ".\setup-backend.ps1"

if errorlevel 1 (
    echo.
    echo [ERRO] Script falhou. Tente abrir PowerShell como Admin e executar:
    echo   cd "%~dp0"
    echo   .\setup-backend.ps1
    echo.
    pause
)
