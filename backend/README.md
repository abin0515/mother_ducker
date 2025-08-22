# 月嫂 Platform - Microservices Backend

A modern microservices platform connecting postpartum caregivers (月嫂) with families seeking their services.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  User Service   │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│ • Routing       │◄──►│ • User profiles │◄──►│ • User data     │
│ • Auth          │    │ • Firebase auth │    │ • Profiles      │
│ • Rate limiting │    │ • User search   │    │ • Roles         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
         ┌─────────────────┐
         │   Firebase      │
         │                 │
         │ • Authentication│
         │ • User tokens   │
         └─────────────────┘
```

## 🚀 Tech Stack

- **Spring Boot 3.x** + **Java 21**
- **Spring Cloud Gateway** (API Gateway)
- **Spring Data JPA** + **PostgreSQL**
- **Firebase Authentication**
- **RabbitMQ** (Event-driven architecture)
- **Docker** (Containerization)

## 📁 Project Structure

```
backend/
├── api-gateway/                 # Spring Cloud Gateway
├── user-service/                # User management service
├── shared-lib/                  # Common DTOs, exceptions, utilities
├── docker-compose.yml           # Local development
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Java 21
- Docker & Docker Compose
- Maven 3.8+
- Firebase project with service account

### 1. Setup Firebase

1. Create a Firebase project
2. Download service account JSON file
3. Place it in the project root as `firebase-service-account.json`

### 2. Build the Project

```bash
# Build all modules
mvn clean install

# Build individual services
cd api-gateway && mvn clean package
cd ../user-service && mvn clean package
```

### 3. Run Servers Locally

#### Start PostgreSQL (Required for User Service)

```bash
# Start PostgreSQL container
docker-compose up postgres -d

# Check if PostgreSQL is running
docker-compose ps
```

#### Start User Service

```bash
# Navigate to user service directory
cd user-service

# Run the service
mvn spring-boot:run

# The service will start on http://localhost:8081
```

#### Start API Gateway

```bash
# Open a new terminal and navigate to API Gateway directory
cd api-gateway

# Run the gateway
mvn spring-boot:run

# The gateway will start on http://localhost:8080
```

#### Alternative: Run Both Services in Background

```bash
# Start User Service in background
cd user-service && mvn spring-boot:run &

# Start API Gateway in background
cd api-gateway && mvn spring-boot:run &

# Check if services are running
curl http://localhost:8081/actuator/health
curl http://localhost:8080/health
```

### 4. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Access Services

- **API Gateway**: http://localhost:8080
- **User Service**: http://localhost:8081
- **PostgreSQL**: localhost:5432
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

## 📡 API Endpoints

### User Service

```
POST   /api/v1/users              # Create user
GET    /api/v1/users/{id}         # Get user by ID
GET    /api/v1/users/firebase/{uid} # Get user by Firebase UID
GET    /api/v1/users/type/{type}  # Get users by type
GET    /api/v1/users              # Get all users
```

### Example Request

```bash
# Create a new user
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "firebaseUid": "firebase-uid-123",
    "email": "user@example.com",
    "phone": "+8613800138000",
    "userType": "CAREGIVER"
  }'
```

## 🔐 Authentication

The platform uses **Firebase Authentication**:

1. **Frontend** authenticates with Firebase
2. **API Gateway** validates Firebase tokens
3. **Services** receive user context via headers

### Headers Added by Gateway

- `X-User-ID`: Firebase UID
- `X-User-Email`: User email
- `X-User-Name`: User display name

## 🐰 Event-Driven Architecture

Services communicate via **RabbitMQ events**:

### User Events

- `USER_CREATED`: When a new user is created
- `USER_UPDATED`: When user profile is updated

### Event Flow

```
User Service → RabbitMQ → Other Services
```

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific service tests
cd user-service && mvn test
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/yuzao_platform` |
| `RABBITMQ_HOST` | RabbitMQ host | `localhost` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Firebase service account path | `./firebase-service-account.json` |
| `LOG_LEVEL` | Logging level | `INFO` |

### Profiles

- **dev**: Development configuration
- **prod**: Production configuration

## 🚀 Deployment

### Docker

```bash
# Build images
docker build -t yuzao-api-gateway ./api-gateway
docker build -t yuzao-user-service ./user-service

# Run containers
docker run -p 8080:8080 yuzao-api-gateway
docker run -p 8081:8081 yuzao-user-service
```

### Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

## 📊 Monitoring

### Health Checks

- **API Gateway**: http://localhost:8080/actuator/health
- **User Service**: http://localhost:8081/actuator/health

### Metrics

- **API Gateway**: http://localhost:8080/actuator/metrics
- **User Service**: http://localhost:8081/actuator/metrics

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running
2. **RabbitMQ Connection**: Check RabbitMQ service status
3. **Firebase Auth**: Verify service account file exists
4. **Port Conflicts**: Check if ports 8080, 8081 are available

### Logs

```bash
# View service logs
docker-compose logs api-gateway
docker-compose logs user-service

# Follow logs
docker-compose logs -f user-service
```

## 🤝 Contributing

1. Follow the established code patterns
2. Write tests for new features
3. Update documentation
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for connecting families with quality care**
