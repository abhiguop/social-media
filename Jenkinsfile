pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        IMAGE_NAME = 'abhigyop/social-media-backend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],  // use the actual branch
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: 'https://github.com/abhiguop/social-media',
                            // credentialsId: 'github-credentials' // uncomment if private repo
                        ]]
                    ])
                }
            }
        }
        
        stage('Verify Docker') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker version'
                    } else {
                        powershell 'docker version'
                    }
                }
            }
        }
        
        stage('Docker Hub Login') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'echo "$DOCKER_HUB_CREDENTIALS_PSW" | docker login -u "$DOCKER_HUB_CREDENTIALS_USR" --password-stdin'
                    } else {
                        powershell 'echo $env:DOCKER_HUB_CREDENTIALS_PSW | docker login -u $env:DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh """
                          docker build -f backend/Dockerfile -t ${IMAGE_NAME}:${env.BUILD_NUMBER} .
                          docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest
                        """
                    } else {
                        powershell """
                          docker build -f backend/Dockerfile -t ${IMAGE_NAME}:${env.BUILD_NUMBER} .
                          docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    if (isUnix()) {
                        sh """
                          docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}
                          docker push ${IMAGE_NAME}:latest
                        """
                    } else {
                        powershell """
                          docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}
                          docker push ${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose down || docker-compose down || true'
                        sh 'docker compose up -d --build || docker-compose up -d --build'
                    } else {
                        powershell 'docker compose down; if ($LASTEXITCODE -ne 0) { docker-compose down }'
                        powershell 'docker compose up -d --build; if ($LASTEXITCODE -ne 0) { docker-compose up -d --build }'
                    }
                }
            }
        }
    }
    
    post {
        always {
            deleteDir() // ensures workspace cleanup
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
