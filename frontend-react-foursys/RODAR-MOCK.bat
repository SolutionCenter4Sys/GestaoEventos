@echo off
title Frontend React - Modo MOCK
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rodar-mock.ps1"
pause
