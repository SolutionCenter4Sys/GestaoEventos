@echo off
title Corrigir Frontend React
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0corrigir-frontend.ps1"
pause
