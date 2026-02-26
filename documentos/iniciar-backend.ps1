# ============================================================
# INICIAR BACKEND - Plataforma de Gestão de Eventos
# ============================================================
# Uso: .\iniciar-backend.ps1
# ============================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend"

if (-not (Test-Path $backendDir)) {
    Write-Host "[ERRO] Pasta do backend não encontrada." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $backendDir "node_modules"))) {
    Write-Host "[AVISO] Dependências não instaladas. Execute primeiro: .\setup-backend.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nIniciando backend em: $backendDir`n" -ForegroundColor Cyan
Set-Location $backendDir
npm run start:dev
