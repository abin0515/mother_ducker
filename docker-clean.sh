#!/bin/bash

echo "🧹 Cleaning Docker resources..."

# Remove dangling images (old builds)
echo "Removing dangling images..."
docker image prune -f

# Remove unused build cache
echo "Removing build cache..."
docker builder prune -f

# Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# Remove unused networks
echo "Removing unused networks..."
docker network prune -f

echo "✅ Docker cleanup complete!"
echo ""
echo "📊 Updated storage usage:"
docker system df
