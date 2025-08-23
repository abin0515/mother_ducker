#!/bin/bash

# YuesaoHub Platform Docker Logs Script

if [ -z "$1" ]; then
    echo "📋 Available services:"
    echo "   all           - All services"
    echo "   postgres      - PostgreSQL database"
    echo "   rabbitmq      - RabbitMQ message broker"
    echo "   user-service  - User microservice"
    echo "   api-gateway   - API Gateway"
    echo "   frontend      - Next.js frontend"
    echo ""
    echo "Usage: ./docker-logs.sh <service-name>"
    echo "Example: ./docker-logs.sh api-gateway"
    exit 1
fi

SERVICE=$1

if [ "$SERVICE" = "all" ]; then
    echo "📋 Showing logs for all services..."
    docker-compose logs -f
else
    echo "📋 Showing logs for $SERVICE..."
    docker-compose logs -f $SERVICE
fi
