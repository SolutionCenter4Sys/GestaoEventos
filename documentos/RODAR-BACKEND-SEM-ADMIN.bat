@echo off
title Backend - Plataforma Eventos (sem admin)
cd /d "%~dp0"

REM Permite rodar o PowerShell script sem precisar de admin
powershell -ExecutionPolicy Bypass -NoProfile -File ".\rodar-backend-sem-admin.ps1"

if errorlevel 1 pause
