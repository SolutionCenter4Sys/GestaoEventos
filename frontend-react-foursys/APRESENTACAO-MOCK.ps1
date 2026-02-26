# Script: APRESENTACAO-MOCK.ps1
# Executa frontend React em modo mock para apresentacao.
# Chama o APRESENTACAO-MOCK.bat para garantir nvm + Node 20 no mesmo processo.

$batPath = Join-Path $PSScriptRoot "APRESENTACAO-MOCK.bat"
if (Test-Path $batPath) {
    & cmd /c "`"$batPath`""
} else {
    Write-Host "APRESENTACAO-MOCK.bat nao encontrado." -ForegroundColor Red
    exit 1
}
