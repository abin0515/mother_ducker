# 🚀 Simple CI/CD Deployment Guide

The Railway GitHub Action had issues, so here are **3 working alternatives** for your CI/CD deployment:

## 🔥 **Option 1: Heroku (Easiest & Most Reliable)**

### **Step 1: Create Heroku Account**
1. Go to [heroku.com](https://heroku.com) and sign up
2. Install Heroku CLI: `brew install heroku/brew/heroku`
3. Login: `heroku login`

### **Step 2: Create Apps**
```bash
# Create two Heroku apps
heroku create your-user-service-app
heroku create your-product-service-app

# Note the app names for later
```

### **Step 3: Configure GitHub Secrets**
Go to GitHub repo → Settings → Secrets → Actions, add:
- `HEROKU_API_KEY`: Get from Heroku Account Settings → API Key
- `HEROKU_EMAIL`: Your Heroku email
- `HEROKU_USER_SERVICE_APP`: `your-user-service-app`
- `HEROKU_PRODUCT_SERVICE_APP`: `your-product-service-app`

### **Step 4: Enable Heroku Deployment**
The `deploy-to-heroku.yml` workflow is ready! Just push:
```bash
git add .
git commit -m "feat: add Heroku deployment"
git push origin main
```

**Your live URLs will be:**
- User Service: `https://your-user-service-app.herokuapp.com`
- Product Service: `https://your-product-service-app.herokuapp.com`

## 🌐 **Option 2: Render (Good Free Tier)**

### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create new project from your repository

### **Step 2: Create Services**
Create two Web Services:

**User Service:**
- Name: `user-service`
- Root Directory: `backend/user-service`
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -jar target/user-service-0.0.1-SNAPSHOT.jar`
- Environment: Docker (or Native if you prefer)

**Product Service:**
- Name: `product-service`  
- Root Directory: `backend/product-service`
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -jar target/product-service-0.0.1-SNAPSHOT.jar`

### **Step 3: Auto-Deploy**
Render automatically deploys on every push to main branch!

## 🚂 **Option 3: Railway (Manual Setup)**

Since the GitHub Action doesn't work, set up Railway manually:

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Import your repository

### **Step 2: Configure Services**
- Create service for `backend/user-service/`
- Create service for `backend/product-service/`
- Railway will auto-detect Dockerfiles and deploy

## 🧪 **Testing Your Deployed Services**

Once deployed, test with Postman:

### **Heroku URLs:**
```
https://your-user-service-app.herokuapp.com/api/users/health
https://your-product-service-app.herokuapp.com/api/products/health
```

### **API Endpoints:**
```bash
# Health Checks
GET https://your-app.herokuapp.com/api/users/health
GET https://your-app.herokuapp.com/api/products/health

# Create User
POST https://your-user-service-app.herokuapp.com/api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Create Product  
POST https://your-product-service-app.herokuapp.com/api/products
{
  "name": "Laptop",
  "description": "Gaming laptop", 
  "price": 999.99,
  "stock": 10
}

# Get All
GET https://your-user-service-app.herokuapp.com/api/users
GET https://your-product-service-app.herokuapp.com/api/products
```

## 🎯 **Recommended: Start with Heroku**

Heroku is the **easiest and most reliable** option:
- ✅ Proven GitHub Actions support
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy database integration
- ✅ Excellent documentation
- ✅ Professional deployment platform

## 🔄 **The Complete Experience**

1. **Make code changes** (add new endpoint, modify logic)
2. **Push to GitHub**: `git push origin main`
3. **GitHub Actions runs**: Tests → Build → Deploy to Heroku
4. **Live URLs update**: Test immediately with Postman
5. **Real CI/CD**: Just like professional teams!

This gives you the **complete CI/CD experience** you wanted! 🚀
