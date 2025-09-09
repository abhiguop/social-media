pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'abhigyop/social-media-backend'
        DOCKER_HOST = 'tcp://docker-dind:2375'   // Use DinD
    }
    
    parameters {
        booleanParam(name: 'PUBLISH_IMAGES', defaultValue: false, description: 'Push Docker images to Docker Hub')
    }
    
    options {
        skipDefaultCheckout(true)
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/abhiguop/social-media',
                        // credentialsId: 'github-credentials'
                    ]]
                ])
            }
        }
        
        stage('Check Docker') {
            steps {
                script {
                    def status = sh(script: 'docker version', returnStatus: true)
                    if (status == 0) {
                        env.DOCKER_AVAILABLE = 'true'
                        echo 'Docker is available via DinD.'
                    } else {
                        env.DOCKER_AVAILABLE = 'false'
                        echo 'Docker is NOT available. Docker stages will be skipped.'
                    }
                }
            }
        }
        
        stage('Docker Hub Login') {
            when {
                allOf {
                    expression { env.DOCKER_AVAILABLE == 'true' }
                    expression { params.PUBLISH_IMAGES }
                }
            }
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PSW')]) {
                            sh 'echo "$DH_PSW" | docker login -u "$DH_USER" --password-stdin'
                        }
                    } catch (err) {
                        echo "Docker Hub credentials missing or misconfigured."
                        error "Configure Jenkins credentials 'docker-hub-credentials'."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when { expression { env.DOCKER_AVAILABLE == 'true' } }
            steps {
                sh """
                    docker build -f backend/Dockerfile -t ${IMAGE_NAME}:${env.BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest
                """
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                allOf {
                    expression { env.DOCKER_AVAILABLE == 'true' }
                    expression { params.PUBLISH_IMAGES }
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PSW')]) {
                    sh """
                        docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Deploy') {
            when { expression { env.DOCKER_AVAILABLE == 'true' } }
            steps {
                sh """
                    docker compose -H tcp://docker-dind:2375 down || true
                    docker compose -H tcp://docker-dind:2375 up -d --build
                """
            }
        }
    }
    
    post {
        always { deleteDir() }
        success { echo 'Pipeline completed successfully!' }
        failure { echo 'Pipeline failed!' }
    }
}
