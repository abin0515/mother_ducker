# Test Cloudflare Tunnel Connectivity
# This script helps test if your tunnel is working correctly

Write-Host "=== Cloudflare Tunnel Connectivity Test ===" -ForegroundColor Green
Write-Host ""

Write-Host "Your application URLs:" -ForegroundColor Yellow
Write-Host "Frontend: https://yuesaohub.com (or https://www.yuesaohub.com)" -ForegroundColor Cyan
Write-Host "API: https://api.yuesaohub.com" -ForegroundColor Cyan  
Write-Host "RabbitMQ: https://rabbitmq.yuesaohub.com" -ForegroundColor Cyan
Write-Host "Database: db.yuesaohub.com:5432 ⚠️ (Secure access only)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing local services..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5
    Write-Host "✓ Frontend (port 3000): " -NoNewline -ForegroundColor Green
    Write-Host "OK" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend (port 3000): " -NoNewline -ForegroundColor Red
    Write-Host "Not responding" -ForegroundColor Red
}

try {
    $api = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method Get -TimeoutSec 5
    Write-Host "✓ API Gateway (port 8080): " -NoNewline -ForegroundColor Green
    Write-Host "OK" -ForegroundColor Green
} catch {
    Write-Host "✗ API Gateway (port 8080): " -NoNewline -ForegroundColor Red
    Write-Host "Not responding" -ForegroundColor Red
}

try {
    $rabbitmq = Invoke-WebRequest -Uri "http://localhost:15672" -Method Head -TimeoutSec 5
    Write-Host "✓ RabbitMQ (port 15672): " -NoNewline -ForegroundColor Green
    Write-Host "OK" -ForegroundColor Green
} catch {
    Write-Host "✗ RabbitMQ (port 15672): " -NoNewline -ForegroundColor Red
    Write-Host "Not responding" -ForegroundColor Red
}

# Test PostgreSQL port
try {
    $tcpConnection = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue
    if ($tcpConnection.TcpTestSucceeded) {
        Write-Host "✓ PostgreSQL (port 5432): " -NoNewline -ForegroundColor Green
        Write-Host "OK" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL (port 5432): " -NoNewline -ForegroundColor Red
        Write-Host "Not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ PostgreSQL (port 5432): " -NoNewline -ForegroundColor Red
    Write-Host "Test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Docker containers status:" -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=yuesaohub"

Write-Host ""
Write-Host "To start the tunnel:" -ForegroundColor Yellow
Write-Host ".\cloudflared.exe tunnel --config tunnel-config.yml run mother-ducker" -ForegroundColor Cyan

Write-Host ""
Write-Host "To run tunnel in background:" -ForegroundColor Yellow
Write-Host "Start-Process -FilePath '.\cloudflared.exe' -ArgumentList 'tunnel','--config','tunnel-config.yml','run','mother-ducker' -WindowStyle Hidden" -ForegroundColor Cyan

Write-Host ""
