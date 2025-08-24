# Test Database Connection via Tunnel
# This script tests PostgreSQL connectivity without requiring psql client

Write-Host "=== Database Connection Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Local container connection
Write-Host "Testing local container connection..." -ForegroundColor Yellow
try {
    $localTest = Test-NetConnection -ComputerName "localhost" -Port 5432 -WarningAction SilentlyContinue
    if ($localTest.TcpTestSucceeded) {
        Write-Host "✓ Local PostgreSQL (localhost:5432): " -NoNewline -ForegroundColor Green
        Write-Host "ACCESSIBLE" -ForegroundColor Green
    } else {
        Write-Host "✗ Local PostgreSQL (localhost:5432): " -NoNewline -ForegroundColor Red
        Write-Host "NOT ACCESSIBLE" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Local test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Tunnel connection
Write-Host "Testing tunnel connection..." -ForegroundColor Yellow
try {
    $tunnelTest = Test-NetConnection -ComputerName "db.yuesaohub.com" -Port 5432 -WarningAction SilentlyContinue
    if ($tunnelTest.TcpTestSucceeded) {
        Write-Host "✓ Tunnel PostgreSQL (db.yuesaohub.com:5432): " -NoNewline -ForegroundColor Green
        Write-Host "ACCESSIBLE" -ForegroundColor Green
    } else {
        Write-Host "✗ Tunnel PostgreSQL (db.yuesaohub.com:5432): " -NoNewline -ForegroundColor Red
        Write-Host "NOT ACCESSIBLE" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Tunnel test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Container status
Write-Host "Checking container status..." -ForegroundColor Yellow
try {
    $containerStatus = docker ps --format "{{.Names}}: {{.Status}}" --filter "name=yuesaohub-postgres"
    if ($containerStatus) {
        Write-Host "✓ Container Status: $containerStatus" -ForegroundColor Green
    } else {
        Write-Host "✗ Container Status: Not found or not running" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Container check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Tunnel status
Write-Host "Checking tunnel status..." -ForegroundColor Yellow
try {
    $tunnelInfo = & .\cloudflared.exe tunnel info mother-ducker 2>$null
    if ($tunnelInfo -match "CONNECTOR ID") {
        Write-Host "✓ Tunnel Status: Active and connected" -ForegroundColor Green
    } else {
        Write-Host "✗ Tunnel Status: Not running or not connected" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Tunnel check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Connection Information ===" -ForegroundColor Cyan
Write-Host "For external devices, use these connection details:" -ForegroundColor White
Write-Host "Host: db.yuesaohub.com" -ForegroundColor Yellow
Write-Host "Port: 5432" -ForegroundColor Yellow
Write-Host "Database: yuesaohub_platform" -ForegroundColor Yellow
Write-Host "Username: postgres" -ForegroundColor Yellow
Write-Host "Password: 990515" -ForegroundColor Yellow

Write-Host ""
Write-Host "=== Recommended Database Clients ===" -ForegroundColor Cyan
Write-Host "Since psql is not installed on Windows, try these GUI tools:" -ForegroundColor White
Write-Host "1. pgAdmin (https://www.pgadmin.org/)" -ForegroundColor Green
Write-Host "2. DBeaver (https://dbeaver.io/)" -ForegroundColor Green
Write-Host "3. DataGrip (JetBrains)" -ForegroundColor Green
Write-Host "4. Azure Data Studio (Microsoft)" -ForegroundColor Green

Write-Host ""
