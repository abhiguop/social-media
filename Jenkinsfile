pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        IMAGE_NAME = 'your-dockerhub-username/social-media-backend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    appImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}", "-f backend/Dockerfile .")
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker compose down || docker-compose down || true'
                sh 'docker compose up -d --build || docker-compose up -d --build'
            }
        }
    }
    
    post {
        always {
            deleteDir() // safer than cleanWs() in Declarative pipelines
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
