# Script: corrigir-frontend.ps1
# Corrige erros do SWC e dependencias do frontend React.
# Resolve: "nao e um aplicativo Win32 valido" / "Failed to load SWC binary"

$ErrorActionPreference = "Stop"
$frontendDir = $PSScriptRoot

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Corrigir Frontend React (SWC / dependencias)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $frontendDir

# 1. Verificar Node
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "   [X] Node.js nao encontrado. Instale de https://nodejs.org" -ForegroundColor Red
    exit 1
}

$nodeMajor = 0
if ($nodeVersion -match 'v(\d+)') { $nodeMajor = [int]$matches[1] }

if ($nodeMajor -ge 23) {
    Write-Host "   [i] Node $nodeVersion detectado. Node 23+ pode causar erro no SWC." -ForegroundColor Yellow
    Write-Host "   [i] Recomendado: use Node 20 LTS. Continuando correcao..." -ForegroundColor Yellow
}

# 2. Limpar (robocopy /mir evita erro de caminho longo no Windows)
Write-Host ">> Removendo node_modules, package-lock.json, .next..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $emptyDir = Join-Path $env:TEMP "empty_rm_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    robocopy $emptyDir "node_modules" /mir /nfl /ndl /njh /njs /nc /ns /np | Out-Null
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $emptyDir -Force -ErrorAction SilentlyContinue
    Write-Host "   - node_modules removido" -ForegroundColor Gray
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
    Write-Host "   - package-lock.json removido" -ForegroundColor Gray
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   - .next removido" -ForegroundColor Gray
}

# 3. Reinstalar
Write-Host ""
Write-Host ">> Reinstalando dependencias (npm install)..." -ForegroundColor Yellow
cmd /c "npm install"
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [X] npm install falhou." -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Dependencias instaladas." -ForegroundColor Green

# 4. Rebuild do SWC (forca reinstalacao do binario)
Write-Host ""
Write-Host ">> Reconstruindo modulos nativos (npm rebuild)..." -ForegroundColor Yellow
cmd /c "npm rebuild @next/swc-win32-x64-msvc" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    cmd /c "npm rebuild" 2>$null | Out-Null
}
Write-Host "   OK" -ForegroundColor Green

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Correcao concluida. Execute: .\rodar-mock.ps1" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Se o erro persistir, instale o Visual C++ Redistributable:" -ForegroundColor Gray
Write-Host "  https://aka.ms/vs/17/release/vc_redist.x64.exe" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou use Node 20 LTS (mais estavel com Next.js):" -ForegroundColor Gray
Write-Host "  nvm install 20" -ForegroundColor Gray
Write-Host "  nvm use 20" -ForegroundColor Gray
Write-Host ""
