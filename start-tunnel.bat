@echo off
REM Start Cloudflare Tunnel for Mother Ducker Application
REM Make sure to update tunnel-config.yml with your tunnel UUID and domain first

echo Starting Cloudflare Tunnel...
echo Make sure your Docker application is running first!
echo.

REM Check if Docker containers are running
docker ps --format "table {{.Names}}\t{{.Status}}" --filter "name=yuesaohub"

echo.
echo Starting tunnel with configuration...
cloudflared.exe tunnel --config tunnel-config.yml run mother-ducker

pause
