#!/bin/bash

echo "🔄 Rebuilding YuesaoHub Platform..."

# Stop all services
echo "⏹️  Stopping services..."
docker-compose down

# Clean up old images and cache
echo "🧹 Cleaning up old images..."
docker image prune -f
docker builder prune -f

# Rebuild and start services
echo "🔨 Rebuilding services..."
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
./docker-start.sh
