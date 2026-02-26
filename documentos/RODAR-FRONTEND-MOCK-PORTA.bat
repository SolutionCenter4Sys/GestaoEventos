@echo off
title Frontend MOCK - Porta customizada
cd /d "%~dp0"

REM Uso: RODAR-FRONTEND-MOCK-PORTA.bat [porta] [skipbuild]
REM Exemplo: RODAR-FRONTEND-MOCK-PORTA.bat 4201
REM          RODAR-FRONTEND-MOCK-PORTA.bat 4300 skipbuild   = porta 4300, sem validar compilacao
REM Porta padrao: 4201

set PORTA=4201
set SKIP=
if not "%~1"=="" set PORTA=%~1
if /i "%~2"=="skipbuild" set SKIP=-SkipBuild

echo.
echo Porta: %PORTA%
if defined SKIP echo (validacao de compilacao desativada)
echo.

powershell -ExecutionPolicy Bypass -NoProfile -File ".\rodar-frontend-mock-porta.ps1" -Porta %PORTA% %SKIP%

if errorlevel 1 pause
