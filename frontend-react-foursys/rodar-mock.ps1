# Script: rodar-mock.ps1
# Sobe o frontend React em modo MOCK (sem backend) para validar telas.
# Injeta usuario mock automaticamente - sem necessidade de login.

$ErrorActionPreference = "Stop"
$frontendDir = $PSScriptRoot
$port = 4302
$mockUrl = "http://localhost:$port"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Frontend React FOURSYS - Modo MOCK" -ForegroundColor Cyan
Write-Host "  Design System Foursys + Dados Mock" -ForegroundColor Cyan
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
$nodeMajor = 0
if ($nodeVersion -match 'v(\d+)') { $nodeMajor = [int]$matches[1] }
if ($nodeMajor -ge 23) {
    Write-Host ">> Node.js: $nodeVersion (recomendado: Node 20 LTS para evitar erro SWC)" -ForegroundColor Yellow
} else {
    Write-Host ">> Node.js: $nodeVersion" -ForegroundColor Green
}

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
Write-Host ">> Iniciando servidor em modo MOCK (porta $port)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   URL: $mockUrl" -ForegroundColor Cyan
Write-Host "   Turbopack: ativado (compilacao mais rapida)" -ForegroundColor Gray
Write-Host "   Usuario mock: Organizador (admin, marketing, vendas, professor)" -ForegroundColor Gray
Write-Host "   Login nao e necessario - acesso direto ao dashboard." -ForegroundColor Gray
Write-Host ""

# Define variavel de ambiente para modo mock
$env:NEXT_PUBLIC_MOCK = "1"

# Inicia o servidor
npx next dev -p $port --turbo

if ($LASTEXITCODE -ne 0) {
    Write-Host "   [X] next dev falhou." -ForegroundColor Red
    exit 1
}
