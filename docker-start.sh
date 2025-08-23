#!/bin/bash

# YuesaoHub Platform Docker Startup Script

echo "🚀 Starting YuesaoHub Platform with Docker..."

# Check if docker.env exists
if [ ! -f "docker.env" ]; then
    echo "❌ docker.env file not found!"
    echo "Please create docker.env with your Firebase configuration."
    exit 1
fi

# Check if Firebase service account exists
if [ ! -f "backend/yuesaohub-firebase-adminsdk-fbsvc-a7175b2740.json" ]; then
    echo "❌ Firebase service account file not found!"
    echo "Please ensure backend/yuesaohub-firebase-adminsdk-fbsvc-a7175b2740.json exists."
    exit 1
fi

# Load environment variables (skip comments)
export $(grep -v '^#' docker.env | xargs)

echo "🐳 Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to be healthy..."

# Wait for services to be ready
echo "Waiting for PostgreSQL..."
docker-compose exec -T postgres pg_isready -U postgres -d yuesaohub_platform

echo "Waiting for RabbitMQ..."
docker-compose exec -T rabbitmq rabbitmqctl status

echo "Waiting for User Service..."
# Wait up to 120 seconds for User Service
for i in {1..60}; do
    if curl -f http://localhost:8081/actuator/health >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

echo "Waiting for API Gateway..."
# Wait up to 60 seconds for API Gateway
for i in {1..30}; do
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

echo "✅ All services are up and running!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend:      http://localhost:3000"
echo "   API Gateway:   http://localhost:8080"
echo "   User Service:  http://localhost:8081"
echo "   RabbitMQ UI:   http://localhost:15672 (user: yuesaohub, pass: yuesaohub_password)"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "💡 To clean up Docker storage after development:"
echo "   ./docker-clean.sh"
