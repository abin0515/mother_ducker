# 🚀 Cloudflare Tunnel Startup Guide - After Reboot

## Quick Start Checklist After Computer Restart

### ✅ Your Configured Services:
- **Main Site**: https://yuesaohub.com, https://www.yuesaohub.com
- **API**: https://api.yuesaohub.com
- **RabbitMQ**: https://rabbitmq.yuesaohub.com
- **Database**: db.yuesaohub.com:5432 ⚠️ (Secure access only)
- **Tunnel ID**: ff1483e6-0bb3-4134-bad9-5e2375563598

## 📋 Step-by-Step Startup Process

### Step 1: Open PowerShell as Administrator
1. Press `Win + X` and select "Windows PowerShell (Admin)"
2. Navigate to your project directory:
   ```powershell
   cd F:\code\mother_ducker
   ```

### Step 2: Start Docker Application
```powershell
# Start all your application containers
docker-compose -f docker-compose-tunnel.yml up -d
```

### Step 3: Verify Docker Services
```powershell
# Check if all containers are running and healthy
docker ps --filter "name=yuesaohub"
```
**Expected**: You should see 5 containers (postgres, rabbitmq, user-service, api-gateway, frontend) all showing "Up" or "healthy" status.

### Step 4: Start Cloudflare Tunnel
```powershell
# Option A: Simple startup (recommended)
.\start-tunnel.bat

# Option B: Manual startup with logs
.\cloudflared.exe tunnel --config tunnel-config.yml run mother-ducker
```

### Step 5: Verify Everything is Working
```powershell
# Run comprehensive test
.\test-tunnel.ps1
```

## ⚡ Quick Commands Reference

**Check Tunnel Status:**
```powershell
.\cloudflared.exe tunnel info mother-ducker
```

**Stop Tunnel:**
```powershell
Get-Process cloudflared | Stop-Process
```

**Restart Docker Services:**
```powershell
docker-compose -f docker-compose-tunnel.yml restart
```

## 🔍 Troubleshooting Common Issues

### ❌ Docker Containers Not Starting
```powershell
# Check what's wrong
docker-compose -f docker-compose-tunnel.yml logs

# Restart specific service
docker-compose -f docker-compose-tunnel.yml restart frontend
```

### ❌ Tunnel Connection Failed
```powershell
# Check if tunnel exists
.\cloudflared.exe tunnel list

# Restart tunnel
Get-Process cloudflared | Stop-Process
.\start-tunnel.bat
```

### ❌ Website Not Accessible
1. **Check tunnel status**: `.\cloudflared.exe tunnel info mother-ducker`
2. **Check Docker containers**: `docker ps --filter "name=yuesaohub"`
3. **Run full test**: `.\test-tunnel.ps1`
4. **Wait 5-10 minutes** for DNS propagation if you just restarted

### ❌ Database Connection Issues
- **Check container**: `docker logs yuesaohub-postgres`
- **Test connection**: Try connecting to `localhost:5432` first
- **Security reminder**: Change default password if accessing remotely

## 💡 Pro Tips

### Auto-Start on Boot (Optional)
Create a Windows startup script:
1. Create `startup-tunnel.bat` in Windows Startup folder
2. Add these commands:
   ```batch
   cd /d F:\code\mother_ducker
   docker-compose -f docker-compose-tunnel.yml up -d
   timeout /t 30
   start /b cloudflared.exe tunnel --config tunnel-config.yml run mother-ducker
   ```

### Background Operation
To run tunnel in background:
```powershell
Start-Process -FilePath ".\cloudflared.exe" -ArgumentList "tunnel","--config","tunnel-config.yml","run","mother-ducker" -WindowStyle Hidden
```

## 📁 Essential Files in Your Directory

```
F:\code\mother_ducker\
├── cloudflared.exe                 # Tunnel client executable
├── tunnel-config.yml              # Tunnel configuration (all domains configured)
├── docker-compose-tunnel.yml      # Production Docker configuration
├── start-tunnel.bat               # Simple tunnel startup script
├── test-tunnel.ps1                # Test all services
├── keep-tunnel-running.ps1        # Monitor and auto-restart tunnel
└── CLOUDFLARE_TUNNEL_GUIDE.md     # This startup guide
```

## 🆘 Emergency Commands

**If everything is broken:**
```powershell
# Stop everything and restart fresh
Get-Process cloudflared | Stop-Process
docker-compose -f docker-compose-tunnel.yml down
docker-compose -f docker-compose-tunnel.yml up -d
.\start-tunnel.bat
```

**Check if ports are in use:**
```powershell
netstat -an | findstr :3000    # Frontend
netstat -an | findstr :8080    # API Gateway  
netstat -an | findstr :5432    # PostgreSQL
```

---

## ✅ Success Indicators

When everything is working correctly:
- ✅ `docker ps` shows 5 healthy containers
- ✅ `.\cloudflared.exe tunnel info mother-ducker` shows active connections
- ✅ `.\test-tunnel.ps1` shows all services OK
- ✅ https://yuesaohub.com loads your application

**Your tunnel is now live and accessible worldwide! 🌍**
