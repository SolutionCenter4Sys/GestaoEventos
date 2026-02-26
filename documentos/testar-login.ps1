# ============================================================
# TESTAR LOGIN - API Plataforma de Gestão de Eventos
# ============================================================
# Uso: .\testar-login.ps1
# Requer: Backend rodando (npm run start:dev)
# ============================================================

$apiUrl = "http://localhost:3000/api/auth/login"
$body = @{
    email = "admin@plataforma-eventos.com"
    senha = "Admin123!@#"
} | ConvertTo-Json

Write-Host "`nTestando login em: $apiUrl" -ForegroundColor Cyan
Write-Host "Credenciais: admin@plataforma-eventos.com / Admin123!@#`n" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json" -Body $body
    Write-Host "[OK] Login realizado com sucesso!`n" -ForegroundColor Green
    Write-Host "Usuario: $($response.usuario.nome)" -ForegroundColor White
    Write-Host "Email:  $($response.usuario.email)" -ForegroundColor White
    Write-Host "Perfil: $($response.usuario.perfil)" -ForegroundColor White
    Write-Host "`nAccess Token (primeiros 50 chars): $($response.accessToken.Substring(0, [Math]::Min(50, $response.accessToken.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "[ERRO] Falha no login." -ForegroundColor Red
    Write-Host "  Certifique-se de que o backend está rodando (.\iniciar-backend.ps1)" -ForegroundColor Yellow
    Write-Host "  Detalhes: $($_.Exception.Message)" -ForegroundColor Gray
}
