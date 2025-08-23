#!/bin/bash

# YuesaoHub Platform Docker Shutdown Script

echo "🛑 Stopping YuesaoHub Platform Docker services..."

# Stop all services
docker-compose down

echo "✅ All services stopped."

# Optionally remove volumes (uncomment if you want to clear data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

echo "📊 Final Status:"
docker-compose ps
