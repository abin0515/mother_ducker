# Backend Microservices

Two simple Spring Boot microservices for CI/CD pipeline learning.

## Services

### User Service (Port: 8081)
- **Endpoints:**
  - `GET /api/users` - Get all users
  - `GET /api/users/{id}` - Get user by ID
  - `POST /api/users` - Create user
  - `GET /api/users/health` - Health check

### Product Service (Port: 8082)
- **Endpoints:**
  - `GET /api/products` - Get all products
  - `GET /api/products/{id}` - Get product by ID
  - `POST /api/products` - Create product
  - `GET /api/products/health` - Health check

## Quick Start

### Run Individual Services
```bash
# User Service
cd user-service
mvn spring-boot:run

# Product Service
cd product-service
mvn spring-boot:run
```

### Build JARs
```bash
# User Service
cd user-service && mvn clean package

# Product Service
cd product-service && mvn clean package
```

### Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## API Examples

### User Service
```bash
# Create user
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get all users
curl http://localhost:8081/api/users
```

### Product Service
```bash
# Create product
curl -X POST http://localhost:8082/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "description": "Gaming laptop", "price": 999.99, "stock": 10}'

# Get all products
curl http://localhost:8082/api/products
```

## CI/CD Ready
- Simple Maven structure
- Docker support
- Health check endpoints
- No complex dependencies
- Perfect for learning CI/CD pipelines!