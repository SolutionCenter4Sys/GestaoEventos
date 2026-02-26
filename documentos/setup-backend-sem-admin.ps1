# ============================================================
# SETUP BACKEND - SEM PRECISAR SER ADMINISTRADOR
# ============================================================
# Este script usa apenas pastas do seu usuário e evita
# operacoes que exigem permissao de administrador.
# ============================================================

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendSource = Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend"

# Pasta de trabalho do usuario (sempre gravavel sem admin)
$userBackend = Join-Path $env:USERPROFILE "Plataforma-Eventos-Backend"

function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    [AVISO] $msg" -ForegroundColor Yellow }
function Write-Err  { param($msg) Write-Host "    [ERRO] $msg" -ForegroundColor Red }

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "  SETUP BACKEND (sem administrador)" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

# 1. Decidir onde rodar: na pasta do projeto OU na pasta do usuario
Write-Step "1/6 - Escolhendo pasta de trabalho..."
$useUserFolder = $false
if (Test-Path (Join-Path $backendSource "node_modules")) {
    Write-Ok "node_modules ja existe na pasta do projeto. Usando: $backendSource"
    $backendDir = $backendSource
} else {
    Write-Host "    Pasta do projeto sem node_modules." -ForegroundColor Gray
    $r = Read-Host "    Copiar backend para sua pasta de usuario para evitar EPERM? (S/N)"
    if ($r -eq "S" -or $r -eq "s") {
        $useUserFolder = $true
        if (-not (Test-Path $userBackend)) {
            Write-Host "    Copiando arquivos para $userBackend ..." -ForegroundColor Gray
            New-Item -ItemType Directory -Path $userBackend -Force | Out-Null
            Copy-Item -Path "$backendSource\*" -Destination $userBackend -Recurse -Force
            Copy-Item -Path (Join-Path $backendSource ".env") -Destination $userBackend -Force -ErrorAction SilentlyContinue
            Copy-Item -Path (Join-Path $backendSource ".env.example") -Destination $userBackend -Force -ErrorAction SilentlyContinue
            Write-Ok "Backend copiado para sua pasta de usuario."
        } else {
            Write-Ok "Pasta do usuario ja existe: $userBackend"
        }
        $backendDir = $userBackend
    } else {
        $backendDir = $backendSource
        Write-Warn "Continuando na pasta do projeto. Se npm install falhar com EPERM, execute de novo e escolha S."
    }
}

Set-Location $backendDir

# 2. Node.js
Write-Step "2/6 - Verificando Node.js..."
try {
    $v = node --version 2>$null
    if (-not $v) { throw "nao encontrado" }
    Write-Ok "Node.js: $v"
} catch {
    Write-Err "Node.js nao encontrado. Instale em: https://nodejs.org (versao LTS)"
    exit 1
}

# 3. .env
Write-Step "3/6 - Arquivo .env..."
$envPath = Join-Path $backendDir ".env"
if (-not (Test-Path $envPath)) {
    $ex = Join-Path $backendDir ".env.example"
    if (Test-Path $ex) {
        Copy-Item $ex $envPath
        Write-Ok ".env criado. Edite com suas credenciais do Supabase."
    } else {
        Write-Err ".env e .env.example nao encontrados."
        exit 1
    }
} else {
    Write-Ok ".env encontrado."
}

# 4. npm config para usuario (evita escrever em Program Files)
Write-Step "4/6 - Configurando npm para pasta do usuario..."
$npmPrefix = Join-Path $env:APPDATA "npm"
if (-not (Test-Path $npmPrefix)) { New-Item -ItemType Directory -Path $npmPrefix -Force | Out-Null }
npm config set prefix $npmPrefix 2>$null
npm config set cache (Join-Path $env:LOCALAPPDATA "npm-cache") 2>$null
Write-Ok "npm prefix: $npmPrefix"

# 5. Instalar dependencias (opcoes que reduzem EPERM)
Write-Step "5/6 - Instalando dependencias..."
Write-Warn "Pode levar 2-5 minutos. Feche o Cursor/IDE se der EPERM."
$env:CI = "true"  # evita alguns scripts pos-install problematicos
try {
    # Tenta primeiro sem optional (menos arquivos = menos chance de EPERM)
    npm install --no-optional --prefer-offline 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Tentando sem --no-optional..." -ForegroundColor Gray
        npm install --prefer-offline 2>&1
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "    Tentando install simples..." -ForegroundColor Gray
        npm install 2>&1
    }
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Dependencias instaladas."
    } else {
        throw "npm install retornou erro"
    }
} catch {
    Write-Err "Falha ao instalar."
    Write-Host "    Dica: Feche o Cursor, abra PowerShell e execute:" -ForegroundColor Yellow
    Write-Host "      cd `"$backendDir`"" -ForegroundColor Gray
    Write-Host "      npm install" -ForegroundColor Gray
    Write-Host "    Ou execute este script de novo e escolha copiar para pasta do usuario (S)." -ForegroundColor Yellow
    exit 1
}

# 6. Prisma - PostgreSQL/Supabase (caminho completo do node_modules)
Write-Step "6/6 - Banco de dados (PostgreSQL / Supabase)..."
$binDir = Join-Path $backendDir "node_modules\.bin"
$prismaExe = Join-Path $binDir "prisma.cmd"
if (-not (Test-Path $prismaExe)) { $prismaExe = Join-Path $binDir "prisma" }
if (-not (Test-Path $prismaExe)) {
    Write-Err "Prisma nao encontrado. Execute: npm install"
    exit 1
}
try {
    & $prismaExe generate
    if ($LASTEXITCODE -ne 0) { throw "prisma generate" }
    Write-Ok "Prisma Client gerado (PostgreSQL)."
    & $prismaExe migrate dev --name init
    if ($LASTEXITCODE -ne 0) { throw "prisma migrate" }
    Write-Ok "Migrations aplicadas."
    & $prismaExe db seed 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Ok "Seed executado." } else { Write-Warn "Seed ignorado (pode ja existir)." }
} catch {
    Write-Err "Erro Prisma. Verifique DATABASE_URL no .env (Supabase)"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SETUP CONCLUIDO (sem admin)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Admin: admin@plataforma-eventos.com / Admin123!@#" -ForegroundColor Gray
Write-Host ""
if ($useUserFolder) {
    Write-Host "  Backend esta em: $userBackend" -ForegroundColor Yellow
    Write-Host "  Para iniciar: cd `"$userBackend`" ; npm run start:dev" -ForegroundColor Gray
} else {
    Write-Host "  Para iniciar: cd `"$backendDir`" ; npm run start:dev" -ForegroundColor Gray
}
Write-Host "  API: http://localhost:3000/api" -ForegroundColor Gray
Write-Host ""
$start = Read-Host "Iniciar servidor agora? (S/N)"
if ($start -eq "S" -or $start -eq "s") {
    Write-Host "`nServidor iniciando... (Ctrl+C para parar)`n" -ForegroundColor Cyan
    npm run start:dev
}
