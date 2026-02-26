# Instala dependencias do backend (npm install)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "Plataforma-Gestao-Eventos_codigo-fonte\backend")
Write-Host "`nInstalando dependencias (npm install)...`n" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) { Write-Host "`n[OK] Dependencias instaladas.`n" -ForegroundColor Green }
else { Write-Host "`n[ERRO] Falha no npm install.`n" -ForegroundColor Red }
Read-Host "Pressione Enter para sair"
