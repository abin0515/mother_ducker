# 🚀 Jenkins + Docker + Local Deployment Guide

This guide will help you set up a complete CI/CD pipeline using Jenkins, Docker, and local deployment for your Mother Ducker microservices.

## 📋 Prerequisites

1. **Docker & Docker Compose**: Install from [docker.com](https://www.docker.com/get-started)
2. **Git**: For version control
3. **Java 17**: For local development (optional)
4. **4GB+ RAM**: For running all containers

## 🛠️ Quick Start

### Step 1: Start All Services

```bash
# Clone the repository (if not already done)
git clone https://github.com/abin0515/mother_ducker.git
cd mother_ducker

# Start all services with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

### Step 2: Access Services

After startup (takes 2-3 minutes):

- **🌐 API Gateway**: http://localhost (Nginx proxy)
- **👤 User Service**: http://localhost:8081/api/users
- **📦 Product Service**: http://localhost:8082/api/products  
- **🔧 Jenkins**: http://localhost:8080
- **📊 Health Checks**: 
  - http://localhost:8081/actuator/health
  - http://localhost:8082/actuator/health

## 🔧 Jenkins Setup

### Initial Jenkins Configuration

1. **Get Jenkins Admin Password**:
```bash
# Get initial admin password
docker exec mother-ducker-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

2. **Access Jenkins**: Go to http://localhost:8080
3. **Install Suggested Plugins**: Click "Install suggested plugins"
4. **Create Admin User**: Set up your admin account

### Configure Jenkins Tools

1. **Go to**: Manage Jenkins → Global Tool Configuration

2. **Configure Maven**:
   - Name: `Maven-3.9`
   - Install automatically: ✅
   - Version: `3.9.6`

3. **Configure Git**: Should be auto-detected

4. **Save Configuration**

### Create Jenkins Pipeline Job

1. **New Item** → **Pipeline** → Name: `mother-ducker-pipeline`

2. **Pipeline Configuration**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/abin0515/mother_ducker.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

3. **Save & Build Now**

## 🐳 Docker Architecture

### Container Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Nginx     │  │ User Service│  │Product Svc  │        │
│  │  (Port 80)  │  │ (Port 8081) │  │(Port 8082)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│                  ┌─────────────┐                          │
│                  │   Jenkins   │                          │
│                  │ (Port 8080) │                          │
│                  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### Service Communication

- **Nginx**: Routes `/api/users` → User Service, `/api/products` → Product Service
- **Jenkins**: Builds, tests, and deploys both services
- **Services**: Independent Spring Boot applications in containers

## 🔄 CI/CD Pipeline Flow

### Pipeline Stages

1. **🔄 Checkout**: Pull latest code from GitHub
2. **🧪 Build & Test**: Run Maven tests in parallel
3. **🐳 Build Images**: Create Docker images for both services
4. **🔒 Security Scan**: Scan images for vulnerabilities (optional)
5. **🚀 Deploy**: Deploy containers locally
6. **🏥 Health Check**: Verify services are running
7. **🔗 Integration Tests**: Test API endpoints

### Trigger Options

- **Automatic**: On every push to `main` branch
- **Manual**: Click "Build Now" in Jenkins
- **Scheduled**: Configure cron schedule in Jenkins
- **Webhook**: GitHub webhook triggers (advanced setup)

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f jenkins

# Follow real-time logs
docker-compose logs -f --tail=100
```

### Health Monitoring

```bash
# Check container status
docker-compose ps

# Check health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health

# Test API endpoints
curl http://localhost/api/users
curl http://localhost/api/products
```

## 🧪 Testing

### Manual Testing with curl

```bash
# Through Nginx proxy (recommended)
curl -X GET http://localhost/api/users
curl -X GET http://localhost/api/products

# Direct service access
curl -X GET http://localhost:8081/api/users
curl -X GET http://localhost:8082/api/products

# Create test data
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 29.99, "description": "A test product"}'
```

### Postman Testing

1. **Import Collection**: Use your existing Postman collection
2. **Update Base URLs**:
   - Change `localhost:8081` → `localhost/api/users`
   - Change `localhost:8082` → `localhost/api/products`
3. **Test All Endpoints**: CRUD operations should work through Nginx

## 🔧 Configuration

### Environment Variables

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=docker
  - SERVER_PORT=8081
  - CUSTOM_CONFIG=value
```

### Port Configuration

Default ports:
- **80**: Nginx (API Gateway)
- **8080**: Jenkins
- **8081**: User Service (internal)
- **8082**: Product Service (internal)

To change ports, edit `docker-compose.yml`:

```yaml
ports:
  - "9090:8080"  # Jenkins on port 9090
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**:
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

2. **Jenkins Won't Start**:
```bash
# Check logs
docker-compose logs jenkins
# Restart Jenkins
docker-compose restart jenkins
```

3. **Services Not Accessible**:
```bash
# Check container status
docker-compose ps
# Restart all services
docker-compose restart
```

4. **Build Failures**:
```bash
# Check Jenkins logs
docker-compose logs jenkins
# Rebuild images
docker-compose build --no-cache
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v
docker system prune -a -f

# Start fresh
docker-compose up -d
```

## 🚀 Advanced Features

### GitHub Webhook Integration

1. **Install ngrok**: For local webhook testing
```bash
ngrok http 8080
```

2. **Configure GitHub Webhook**:
   - URL: `https://your-ngrok-url.ngrok.io/github-webhook/`
   - Events: Push, Pull Request

### Slack Notifications

1. **Install Slack Plugin**: In Jenkins Plugin Manager
2. **Configure Slack**: Manage Jenkins → Configure System → Slack
3. **Update Jenkinsfile**: Uncomment Slack notification sections

### Database Integration

Add PostgreSQL to `docker-compose.yml`:

```yaml
postgres:
  image: postgres:15
  environment:
    POSTGRES_DB: motherducker
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: password
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# In docker-compose.yml
user-service:
  deploy:
    replicas: 3
  # Add load balancer configuration
```

### Resource Limits

```yaml
user-service:
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        memory: 256M
```

## 🎯 Production Considerations

### Security

- [ ] Use secrets management (Docker secrets, HashiCorp Vault)
- [ ] Enable HTTPS with SSL certificates
- [ ] Implement proper authentication/authorization
- [ ] Regular security scanning

### Monitoring

- [ ] Add Prometheus + Grafana
- [ ] Implement centralized logging (ELK stack)
- [ ] Set up alerting (PagerDuty, Slack)

### Backup & Recovery

- [ ] Database backups
- [ ] Jenkins configuration backups
- [ ] Container image registry

## 📚 Learning Resources

- **Jenkins**: [jenkins.io/doc](https://jenkins.io/doc)
- **Docker Compose**: [docs.docker.com/compose](https://docs.docker.com/compose)
- **Spring Boot Docker**: [spring.io/guides/docker](https://spring.io/guides/topicals/spring-boot-docker)

---

**🎉 Congratulations! You now have a production-like CI/CD pipeline running locally!**

This setup mirrors what you'd find in most enterprise environments. You're ready to deploy to real servers by simply changing the deployment target in your Jenkinsfile! 🚀
