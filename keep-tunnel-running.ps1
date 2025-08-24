# Keep Cloudflare Tunnel Running Script
# This script ensures your tunnel stays active and provides monitoring

Write-Host "=== Cloudflare Tunnel Monitor ===" -ForegroundColor Green
Write-Host ""

# Function to check tunnel status
function Test-TunnelStatus {
    try {
        $result = & .\cloudflared.exe tunnel info mother-ducker 2>$null
        if ($result -match "CONNECTOR ID") {
            return $true
        }
        return $false
    } catch {
        return $false
    }
}

# Function to start tunnel if not running
function Start-TunnelIfNeeded {
    if (!(Test-TunnelStatus)) {
        Write-Host "Tunnel not running. Starting..." -ForegroundColor Yellow
        Start-Process -FilePath ".\cloudflared.exe" -ArgumentList "tunnel","--config","tunnel-config.yml","run","mother-ducker" -WindowStyle Hidden
        Start-Sleep -Seconds 5
        
        if (Test-TunnelStatus) {
            Write-Host "✓ Tunnel started successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to start tunnel" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ Tunnel is already running" -ForegroundColor Green
    }
}

# Check and start tunnel
Start-TunnelIfNeeded

# Display current status
Write-Host ""
Write-Host "Current Status:" -ForegroundColor Yellow
& .\cloudflared.exe tunnel info mother-ducker

Write-Host ""
Write-Host "Your application URLs:" -ForegroundColor Yellow
Write-Host "Frontend: https://app.yuesaohub.com" -ForegroundColor Cyan
Write-Host "API: https://api.yuesaohub.com" -ForegroundColor Cyan
Write-Host "RabbitMQ: https://rabbitmq.yuesaohub.com" -ForegroundColor Cyan

Write-Host ""
Write-Host "To stop the tunnel, find the cloudflared process and terminate it:" -ForegroundColor Yellow
Write-Host "Get-Process cloudflared | Stop-Process" -ForegroundColor Cyan

Write-Host ""
Write-Host "Tunnel is now running in the background!" -ForegroundColor Green
