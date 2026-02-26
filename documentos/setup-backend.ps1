# ============================================================
# SCRIPT DE SETUP - Backend Plataforma de Gestão de Eventos
# ============================================================
# Uso: Execute como Administrador (clique direito -> Executar como administrador)
# Ou no PowerShell: .\setup-backend.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend"

# Cores para output
function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    [AVISO] $msg" -ForegroundColor Yellow }
function Write-Err  { param($msg) Write-Host "    [ERRO] $msg" -ForegroundColor Red }

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "  SETUP BACKEND - Plataforma de Eventos" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

# 1. Verificar Node.js
Write-Step "1/6 - Verificando Node.js..."
try {
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) { throw "Node não encontrado" }
    Write-Ok "Node.js instalado: $nodeVersion"
} catch {
    Write-Err "Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
}

# 2. Verificar pasta do backend
Write-Step "2/6 - Verificando pasta do backend..."
if (-not (Test-Path $backendDir)) {
    Write-Err "Pasta não encontrada: $backendDir"
    exit 1
}
Set-Location $backendDir
Write-Ok "Diretório: $backendDir"

# 3. Verificar .env
Write-Step "3/6 - Verificando arquivo .env..."
$envPath = Join-Path $backendDir ".env"
if (-not (Test-Path $envPath)) {
    Write-Warn ".env não encontrado. Copiando de .env.example..."
    if (Test-Path (Join-Path $backendDir ".env.example")) {
        Copy-Item (Join-Path $backendDir ".env.example") $envPath
        Write-Ok ".env criado. Edite com suas credenciais do Supabase."
    } else {
        Write-Err "Arquivo .env.example não encontrado."
        exit 1
    }
} else {
    Write-Ok "Arquivo .env encontrado."
}

# 4. Instalar dependências
Write-Step "4/6 - Instalando dependências (npm install)..."
Write-Warn "Isso pode levar 2-5 minutos..."
try {
    npm cache clean --force 2>$null
    $npmResult = npm install 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Primeira tentativa falhou. Tentando com --legacy-peer-deps..."
        npm install --legacy-peer-deps 2>&1
    }
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Dependências instaladas."
    } else {
        throw "npm install falhou"
    }
} catch {
    Write-Err "Falha ao instalar dependências."
    Write-Host "    Tente manualmente: cd backend && npm install" -ForegroundColor Yellow
    Write-Host "    Ou execute este script como Administrador." -ForegroundColor Yellow
    exit 1
}

# 5. Prisma - PostgreSQL/Supabase (caminho completo do node_modules)
Write-Step "5/6 - Configurando banco de dados (PostgreSQL / Supabase)..."
$binDir = Join-Path $backendDir "node_modules\.bin"
$prismaExe = Join-Path $binDir "prisma.cmd"
if (-not (Test-Path $prismaExe)) { $prismaExe = Join-Path $binDir "prisma" }
if (-not (Test-Path $prismaExe)) {
    Write-Err "Prisma nao encontrado. Execute: npm install"
    exit 1
}
try {
    Write-Host "    Gerando Prisma Client..." -ForegroundColor Gray
    & $prismaExe generate
    if ($LASTEXITCODE -ne 0) { throw "prisma generate falhou" }
    Write-Ok "Prisma Client gerado (PostgreSQL)."

    Write-Host "    Executando migrations..." -ForegroundColor Gray
    & $prismaExe migrate dev --name init
    if ($LASTEXITCODE -ne 0) { throw "prisma migrate falhou" }
    Write-Ok "Migrations aplicadas."

    Write-Host "    Executando seed (Admin + Templates)..." -ForegroundColor Gray
    & $prismaExe db seed
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Seed falhou (pode ser normal se já existir). Continuando..."
    } else {
        Write-Ok "Seed executado. Admin: admin@plataforma-eventos.com / Admin123!@#"
    }
} catch {
    Write-Err "Erro no Prisma: $_"
    Write-Host "    Verifique a DATABASE_URL no arquivo .env (Supabase)" -ForegroundColor Yellow
    exit 1
}

# 6. Conclusão
Write-Step "6/6 - Conclusão"
Write-Ok "Setup concluído com sucesso!"
Write-Host ""
Write-Host "  Credenciais do Admin:" -ForegroundColor White
Write-Host "    Email: admin@plataforma-eventos.com" -ForegroundColor Gray
Write-Host "    Senha:  Admin123!@#" -ForegroundColor Gray
Write-Host ""
Write-Host "  Para iniciar o backend:" -ForegroundColor White
Write-Host "    cd `"$backendDir`"" -ForegroundColor Gray
Write-Host "    npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  API disponível em: http://localhost:3000/api" -ForegroundColor Gray
Write-Host "  Testar login: POST http://localhost:3000/api/auth/login" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Perguntar se deseja iniciar o servidor
$start = Read-Host "Deseja iniciar o servidor agora? (S/N)"
if ($start -eq "S" -or $start -eq "s") {
    Write-Host "`nIniciando servidor... (Ctrl+C para parar)`n" -ForegroundColor Cyan
    npm run start:dev
}
