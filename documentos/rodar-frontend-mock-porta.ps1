# Script: rodar-frontend-mock-porta.ps1
# Sobe o frontend Angular em uma porta diferente de 4200 (padrao: 4201).
# Use a URL com ?mock=1 para testar as telas sem o backend.
# Opcional: valida a compilacao com ng build antes de subir o serve.

param(
    [int] $Porta = 4201,
    [switch] $SkipBuild
)

$ErrorActionPreference = "Stop"
$frontendDir = Join-Path $PSScriptRoot "Plataforma-Gestao-Eventos_codigo-fonte\frontend"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Frontend MOCK - Porta $Porta" -ForegroundColor Cyan
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

# Validar compilacao (ng build) antes de servir, a menos que --SkipBuild
# Usar cmd /c evita o npx.ps1 do PowerShell que converte stderr do Node em excecao
if (-not $SkipBuild) {
    Write-Host ""
    Write-Host ">> Validando compilacao (ng build)..." -ForegroundColor Yellow
    cmd /c "npx ng build --configuration=development"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [X] Compilacao falhou. Corrija os erros acima ou execute com -SkipBuild para pular a validacao." -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] Compilacao OK." -ForegroundColor Green
}

Write-Host ""
Write-Host ">> Iniciando servidor na porta $Porta (ng serve --port $Porta)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Para testar as telas SEM o backend, use no navegador:" -ForegroundColor White
Write-Host "   http://localhost:${Porta}/?mock=1" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Login mock: qualquer e-mail e senha (ex: admin@eventos.com / 123456)" -ForegroundColor Gray
Write-Host "   Inscricao publica: http://localhost:${Porta}/inscricao/ev-1?mock=1" -ForegroundColor Gray
Write-Host ""

cmd /c "npx ng serve --port $Porta"

if ($LASTEXITCODE -ne 0) {
    Write-Host "   [X] ng serve falhou." -ForegroundColor Red
    exit 1
}
