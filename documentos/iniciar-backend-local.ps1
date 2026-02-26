# ============================================================
# INICIAR BACKEND - Procura na pasta do projeto ou na do usuario
# ============================================================
# Use este script se voce rodou setup-backend-sem-admin.ps1
# e copiou o backend para sua pasta de usuario.
# ============================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$noAdminPath = Join-Path $env:USERPROFILE "Plataforma-Eventos-Backend"
$projectPath = Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend"

$backendDir = $null
if (Test-Path (Join-Path $noAdminPath "node_modules")) {
    $backendDir = $noAdminPath
    Write-Host "`nUsando backend da sua pasta de usuario (setup sem admin).`n" -ForegroundColor Cyan
} elseif (Test-Path (Join-Path $projectPath "node_modules")) {
    $backendDir = $projectPath
    Write-Host "`nUsando backend da pasta do projeto.`n" -ForegroundColor Cyan
}

if (-not $backendDir) {
    Write-Host "[ERRO] Nenhum backend com node_modules encontrado." -ForegroundColor Red
    Write-Host "  Execute primeiro: .\setup-backend-sem-admin.ps1" -ForegroundColor Yellow
    exit 1
}

Set-Location $backendDir
npm run start:dev
