@echo off
title Frontend React Foursys - Modo Mock
cd /d "%~dp0"

echo.
echo =============================================
echo   Frontend React FOURSYS - Modo Mock
echo   Design System Foursys + Dados Mock
echo =============================================
echo.
echo   URL: http://localhost:4302
echo   Usuario mock: Organizador (sem login)
echo.
echo =============================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rodar-mock.ps1"

pause
