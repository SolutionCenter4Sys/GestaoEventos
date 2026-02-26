# ============================================================
# RODAR BACKEND SEM SER ADMINISTRADOR
# ============================================================
# Faz setup (se precisar) e inicia o servidor.
# Usa sua pasta de usuario para evitar erro de permissao (EPERM).
#
# Uso: clique duplo em RODAR-BACKEND-SEM-ADMIN.bat
#      ou no PowerShell: .\rodar-backend-sem-admin.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendOrigem = Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend"
$backendUsuario = Join-Path $env:USERPROFILE "Plataforma-Eventos-Backend"

function Write-Step { param($m) Write-Host "`n>> $m" -ForegroundColor Cyan }
function Write-Ok   { param($m) Write-Host "   [OK] $m" -ForegroundColor Green }
function Write-Warn { param($m) Write-Host "   [!] $m" -ForegroundColor Yellow }
function Write-Err  { param($m) Write-Host "   [X] $m" -ForegroundColor Red }

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  Backend - Plataforma Eventos (sem admin)" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

# Onde vamos trabalhar: preferir pasta do usuario se ja existir com node_modules
$workDir = $null
if (Test-Path (Join-Path $backendUsuario "node_modules")) {
    $workDir = $backendUsuario
    Write-Host "`nUsando: sua pasta de usuario (ja configurada)" -ForegroundColor Gray
} elseif (Test-Path (Join-Path $backendOrigem "node_modules")) {
    $workDir = $backendOrigem
    Write-Host "`nUsando: pasta do projeto" -ForegroundColor Gray
} else {
    # Nada configurado: copiar para pasta do usuario e configurar la
    Write-Step "Primeira execucao: configurando na sua pasta de usuario..."
    if (-not (Test-Path $backendUsuario)) {
        New-Item -ItemType Directory -Path $backendUsuario -Force | Out-Null
        Copy-Item -Path "$backendOrigem\*" -Destination $backendUsuario -Recurse -Force
        foreach ($f in @(".env", ".env.example")) {
            $src = Join-Path $backendOrigem $f
            if (Test-Path $src) { Copy-Item $src (Join-Path $backendUsuario $f) -Force }
        }
        Write-Ok "Backend copiado para: $backendUsuario"
    }
    $workDir = $backendUsuario
}

Set-Location $workDir

# Node
Write-Step "Verificando Node.js..."
try {
    $nv = node --version 2>$null
    if (-not $nv) { throw "nao encontrado" }
    Write-Ok "Node $nv"
} catch {
    Write-Err "Node.js nao instalado. Baixe em https://nodejs.org"
    Read-Host "Enter para sair"
    exit 1
}

# .env
if (-not (Test-Path (Join-Path $workDir ".env"))) {
    $ex = Join-Path $workDir ".env.example"
    if (Test-Path $ex) { Copy-Item $ex (Join-Path $workDir ".env"); Write-Ok ".env criado" }
    else { Write-Err "Arquivo .env nao encontrado"; exit 1 }
}

# npm na pasta do usuario
npm config set prefix (Join-Path $env:APPDATA "npm") 2>$null
npm config set cache (Join-Path $env:LOCALAPPDATA "npm-cache") 2>$null

# Dependencias
if (-not (Test-Path (Join-Path $workDir "node_modules"))) {
    Write-Step "Instalando dependencias (pode demorar 2-5 min)..."
    $env:CI = "true"
    npm install --no-optional 2>&1
    if ($LASTEXITCODE -ne 0) { npm install 2>&1 }
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Falha no npm install. Feche o Cursor e tente de novo."
        Read-Host "Enter para sair"
        exit 1
    }
    Write-Ok "Dependencias instaladas."
}

# Prisma - PostgreSQL no Supabase
Write-Step "Banco de dados (PostgreSQL / Supabase)..."
$binDir = Join-Path $workDir "node_modules\.bin"
$prismaExe = Join-Path $binDir "prisma.cmd"
if (-not (Test-Path $prismaExe)) { $prismaExe = Join-Path $binDir "prisma" }
if (-not (Test-Path $prismaExe)) {
    Write-Err "Prisma nao encontrado em node_modules. Execute: npm install"
    Read-Host "Enter para sair"
    exit 1
}
& $prismaExe generate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Prisma generate falhou. Verifique .env (DATABASE_URL do Supabase)."
    Read-Host "Enter para sair"
    exit 1
}
Write-Ok "Prisma Client gerado (PostgreSQL)."
& $prismaExe migrate dev --name init 2>&1
if ($LASTEXITCODE -eq 0) {
    & $prismaExe db seed 2>$null
    Write-Ok "Banco OK. Admin: admin@plataforma-eventos.com / Admin123!@#"
} else {
    Write-Warn "Migrate/seed com aviso (pode ser normal). Continuando..."
}

# Iniciar
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Iniciando servidor..." -ForegroundColor Green
Write-Host "  API: http://localhost:3000/api" -ForegroundColor Gray
Write-Host "  Ctrl+C para parar" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
npm run start:dev
