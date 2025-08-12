# 🚀 CI/CD Deployment Guide

This guide shows you how to set up **complete CI/CD pipeline** with automatic deployment to production servers that you can test with Postman.

## 🎯 **The Complete CI/CD Experience**

```mermaid
graph LR
    A[Push Code] --> B[GitHub Actions]
    B --> C[Run Tests]
    C --> D[Build Images]
    D --> E[Deploy to Railway]
    E --> F[Live URLs for Testing]
```

## 🚂 **Option 1: Railway (Recommended)**

### **Step 1: Setup Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your `mother_ducker` repository

### **Step 2: Create Services**
1. Create new project in Railway
2. Add two services:
   - **user-service** (from `backend/user-service/`)
   - **product-service** (from `backend/product-service/`)

### **Step 3: Configure GitHub Secrets**
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add secret: `RAILWAY_TOKEN`
3. Get the token from Railway dashboard → Account Settings → Tokens

### **Step 4: Deploy!**
```bash
git add .
git commit -m "feat: add Railway deployment configuration"
git push origin main
```

**Your services will be live at:**
- User Service: `https://user-service-production.up.railway.app`
- Product Service: `https://product-service-production.up.railway.app`

## 🌐 **Option 2: Render**

### **Step 1: Setup Render Account**
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create new Web Services for both microservices

### **Step 2: Service Configuration**
```yaml
# User Service
Name: user-service
Environment: Docker
Build Command: cd backend/user-service && mvn clean package -DskipTests
Start Command: java -jar target/user-service-0.0.1-SNAPSHOT.jar
Port: 8081

# Product Service  
Name: product-service
Environment: Docker
Build Command: cd backend/product-service && mvn clean package -DskipTests
Start Command: java -jar target/product-service-0.0.1-SNAPSHOT.jar
Port: 8082
```

## 🔥 **Option 3: Heroku**

### **Step 1: Setup Heroku Account**
1. Create account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Login: `heroku login`

### **Step 2: Create Apps**
```bash
# Create Heroku apps
heroku create your-user-service
heroku create your-product-service

# Set buildpack for Java
heroku buildpacks:set heroku/java -a your-user-service
heroku buildpacks:set heroku/java -a your-product-service
```

### **Step 3: Add Heroku deployment to GitHub Actions**
Add this to your workflow:
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.12
  with:
    heroku_api_key: ${{secrets.HEROKU_API_KEY}}
    heroku_app_name: "your-user-service"
    heroku_email: "your-email@example.com"
```

## 🧪 **Testing Your Live Services**

Once deployed, you can test with Postman using the live URLs:

### **Railway URLs:**
```
User Service: https://user-service-production.up.railway.app
Product Service: https://product-service-production.up.railway.app
```

### **API Endpoints to Test:**
```
# Health Checks
GET https://user-service-production.up.railway.app/api/users/health
GET https://product-service-production.up.railway.app/api/products/health

# Create User
POST https://user-service-production.up.railway.app/api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Create Product
POST https://product-service-production.up.railway.app/api/products
{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 999.99,
  "stock": 10
}

# Get All
GET https://user-service-production.up.railway.app/api/users
GET https://product-service-production.up.railway.app/api/products
```

## 🔄 **The Full CI/CD Experience**

1. **Make a change** to your code (e.g., add a new endpoint)
2. **Push to GitHub**: `git push origin main`
3. **Watch GitHub Actions**: Tests → Build → Deploy
4. **Test live URLs**: Services automatically update!
5. **Use Postman**: Test your changes on live servers

## 📊 **Monitoring Your Deployments**

- **GitHub Actions**: See deployment status
- **Railway Dashboard**: Monitor service health, logs, metrics
- **Live URLs**: Always accessible for testing

## 🎉 **Benefits of This Setup**

- ✅ **Automatic deployments** on every push
- ✅ **Live URLs** for Postman testing
- ✅ **Real production environment**
- ✅ **Database persistence** (if configured)
- ✅ **HTTPS by default**
- ✅ **Monitoring and logs**
- ✅ **True CI/CD experience**

This is exactly how professional software teams work! 🚀
