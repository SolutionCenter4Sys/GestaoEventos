@echo off
title Frontend - Plataforma Eventos (modo MOCK)
cd /d "%~dp0"

REM Roda o frontend com instrucoes para usar dados mock (sem backend)
REM Acesse: http://localhost:4200/?mock=1

echo.
echo ============================================
echo   Frontend - Plataforma Eventos (MOCK)
echo ============================================
echo.
echo   Apos iniciar, acesse: http://localhost:4200/?mock=1
echo   Login: qualquer e-mail e senha
echo.

powershell -ExecutionPolicy Bypass -NoProfile -File ".\rodar-frontend-mock.ps1"

if errorlevel 1 pause
