# Script: rodar-frontend-mock.ps1
# Sobe o frontend Angular em modo MOCK (sem necessidade de backend).
# Use a URL com ?mock=1 para ativar os dados simulados.

$ErrorActionPreference = "Stop"
$frontendDir = Join-Path $PSScriptRoot "Plataforma-Gestao-Eventos_codigo-fonte\frontend"
$port = 4200
$mockUrl = "http://localhost:$port/?mock=1"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Frontend - Plataforma Eventos (modo MOCK)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $frontendDir)) {
    Write-Host "   [X] Pasta do frontend nao encontrada: $frontendDir" -ForegroundColor Red
    exit 1
}

Set-Location $frontendDir

# Node
$nodeVersion = $null
try { $nodeVersion = node -v 2>$null } catch {}
if (-not $nodeVersion) {
    Write-Host "   [X] Node.js nao encontrado. Instale de https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host ">> Node.js: $nodeVersion" -ForegroundColor Green

# npm install se nao tiver node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host ">> Instalando dependencias (npm install)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [X] npm install falhou." -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] Dependencias instaladas." -ForegroundColor Green
}

Write-Host ""
Write-Host ">> Iniciando servidor de desenvolvimento (ng serve)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Para usar MODO MOCK (sem backend), acesse:" -ForegroundColor White
Write-Host "   $mockUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Login mock: qualquer e-mail e senha (ex: admin@eventos.com / 123456)" -ForegroundColor Gray
Write-Host "   Inscricao publica: http://localhost:$port/inscricao/ev-1?mock=1" -ForegroundColor Gray
Write-Host ""
Write-Host "   Ou execute: npm run start:mock (dentro da pasta frontend)" -ForegroundColor Gray
Write-Host ""

# Inicia o servidor
npx ng serve --port $port

if ($LASTEXITCODE -ne 0) {
    Write-Host "   [X] ng serve falhou." -ForegroundColor Red
    exit 1
}
