pipeline {
    agent any
    
    environment {
        // Docker registry (can be DockerHub, AWS ECR, etc.)
        DOCKER_REGISTRY = 'localhost:5000'  // Local registry for testing
        IMAGE_TAG = "${BUILD_NUMBER}"
        
        // Service names
        USER_SERVICE_IMAGE = "mother-ducker/user-service"
        PRODUCT_SERVICE_IMAGE = "mother-ducker/product-service"
    }
    
    // Using Maven from Docker containers instead of Jenkins tools
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build & Test') {
            parallel {
                stage('User Service Tests') {
                    steps {
                        echo '🧪 Running User Service tests...'
                        dir('backend/user-service') {
                            sh '''
                                # Build only the test stage of our Dockerfile
                                docker build --target build -t user-service-test -f Dockerfile .
                                docker run --rm user-service-test bash -c "mvn test"
                            '''
                        }
                    }
                    post {
                        always {
                            // Publish test results using built-in junit step
                            script {
                                if (fileExists('backend/user-service/target/surefire-reports/*.xml')) {
                                    junit 'backend/user-service/target/surefire-reports/*.xml'
                                }
                            }
                        }
                    }
                }
                
                stage('Product Service Tests') {
                    steps {
                        echo '🧪 Running Product Service tests...'
                        dir('backend/product-service') {
                            sh '''
                                # Build only the test stage of our Dockerfile
                                docker build --target build -t product-service-test -f Dockerfile .
                                docker run --rm product-service-test bash -c "mvn test"
                            '''
                        }
                    }
                    post {
                        always {
                            // Publish test results using built-in junit step
                            script {
                                if (fileExists('backend/product-service/target/surefire-reports/*.xml')) {
                                    junit 'backend/product-service/target/surefire-reports/*.xml'
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build User Service Image') {
                    steps {
                        echo '🐳 Building User Service Docker image...'
                        script {
                            def userServiceImage = docker.build("${USER_SERVICE_IMAGE}:${IMAGE_TAG}", "./backend/user-service")
                            userServiceImage.tag("${USER_SERVICE_IMAGE}:latest")
                        }
                    }
                }
                
                stage('Build Product Service Image') {
                    steps {
                        echo '🐳 Building Product Service Docker image...'
                        script {
                            def productServiceImage = docker.build("${PRODUCT_SERVICE_IMAGE}:${IMAGE_TAG}", "./backend/product-service")
                            productServiceImage.tag("${PRODUCT_SERVICE_IMAGE}:latest")
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo '🔒 Running security scans...'
                // Add security scanning tools here (e.g., Trivy, Snyk)
                sh '''
                    echo "Security scan placeholder"
                    # docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${USER_SERVICE_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        
        stage('Deploy to Local') {
            steps {
                echo '🚀 Deploying to local environment...'
                script {
                    // Stop existing containers
                    sh '''
                        docker-compose down || true
                        docker system prune -f || true
                    '''
                    
                    // Deploy with docker-compose
                    sh '''
                        export USER_SERVICE_TAG=${IMAGE_TAG}
                        export PRODUCT_SERVICE_TAG=${IMAGE_TAG}
                        docker-compose up -d user-service product-service nginx
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health checks...'
                script {
                    // Wait for services to start
                    sleep(time: 30, unit: 'SECONDS')
                    
                    // Check User Service health
                    sh '''
                        for i in {1..10}; do
                            if curl -f http://localhost:8081/actuator/health; then
                                echo "✅ User Service is healthy"
                                break
                            fi
                            echo "⏳ Waiting for User Service... (attempt $i/10)"
                            sleep 10
                        done
                    '''
                    
                    // Check Product Service health
                    sh '''
                        for i in {1..10}; do
                            if curl -f http://localhost:8082/actuator/health; then
                                echo "✅ Product Service is healthy"
                                break
                            fi
                            echo "⏳ Waiting for Product Service... (attempt $i/10)"
                            sleep 10
                        done
                    '''
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo '🔗 Running integration tests...'
                script {
                    // Test API endpoints
                    sh '''
                        # Test User Service
                        curl -X GET http://localhost:8081/api/users
                        
                        # Test Product Service  
                        curl -X GET http://localhost:8082/api/products
                        
                        # Test through Nginx proxy
                        curl -X GET http://localhost/api/users
                        curl -X GET http://localhost/api/products
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            // Clean up workspace
            cleanWs()
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🔗 User Service: http://localhost:8081"
            echo "🔗 Product Service: http://localhost:8082" 
            echo "🌐 Gateway: http://localhost"
            // Note: Install Slack plugin for notifications
        }
        
        failure {
            echo '❌ Pipeline failed!'
            echo "📋 Check build logs for details"
            echo "🔗 Build URL: ${BUILD_URL}"
            // Note: Install Slack plugin for notifications
        }
    }
}
