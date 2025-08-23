# Multi-stage build for API Gateway
FROM maven:3.9.5-amazoncorretto-21 AS builder

# Set working directory
WORKDIR /build

# First, install parent POM to local repository
COPY pom.xml ./pom.xml
RUN mvn install -N -DskipTests

# Then build shared-lib
COPY shared-lib ./shared-lib
WORKDIR /build/shared-lib
RUN mvn clean install -DskipTests

# Now build api-gateway
WORKDIR /build
COPY api-gateway ./api-gateway
WORKDIR /build/api-gateway
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:21

# Install curl for health checks
RUN yum update -y && yum install -y curl && yum clean all

# Create app directory
WORKDIR /app

# Copy the built JAR
COPY --from=builder /build/api-gateway/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]