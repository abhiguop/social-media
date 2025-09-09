pipeline {
    agent any

    environment {
        IMAGE_NAME = 'abhigyop/social-media-backend'
        // Point Docker client to DinD container
        DOCKER_HOST = 'tcp://docker-dind:2375'
    }

    parameters {
        booleanParam(name: 'PUBLISH_IMAGES', defaultValue: false, description: 'If true, logs into Docker Hub and pushes built images.')
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[
                            url: 'https://github.com/abhiguop/social-media'
                        ]]
                    ])
                }
            }
        }

        stage('Check Docker') {
            steps {
                script {
                    def status = sh(script: 'docker version', returnStatus: true)
                    if (status == 0) {
                        echo 'Docker is available via DinD.'
                        env.DOCKER_AVAILABLE = 'true'
                        sh 'docker version'
                    } else {
                        echo 'Docker is NOT available. Docker stages will be skipped.'
                        env.DOCKER_AVAILABLE = 'false'
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
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PSW')]) {
                        sh 'echo "$DH_PSW" | docker login -u "$DH_USER" --password-stdin'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { env.DOCKER_AVAILABLE == 'true' }
            }
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
            when {
                expression { env.DOCKER_AVAILABLE == 'true' }
            }
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d --build || true'
            }
        }
    }

    post {
        always {
            script {
                if (env.WORKSPACE?.trim()) {
                    deleteDir()
                } else {
                    echo 'No workspace context; skipping deleteDir.'
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
