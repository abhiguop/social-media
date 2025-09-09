  pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'abhigyop/social-media-backend'
    }
    
    parameters {
        booleanParam(name: 'PUBLISH_IMAGES', defaultValue: false, description: 'If true, logs into Docker Hub and pushes built images. Leave false if credentials are not configured yet.')
    }
    
    options {
        skipDefaultCheckout(true) // avoid duplicate implicit checkout
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
        
        stage('Check Docker') {
            steps {
                script {
                    def status
                    if (isUnix()) {
                        status = sh(label: 'Check docker availability', script: 'command -v docker >/dev/null 2>&1', returnStatus: true)
                    } else {
                        status = powershell(label: 'Check docker availability', returnStatus: true, script: 'if (Get-Command docker -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }')
                    }
                    if (status == 0) {
                        env.DOCKER_AVAILABLE = 'true'
                        echo 'Docker is available on this agent.'
                        if (isUnix()) {
                            sh 'docker version || true'
                        } else {
                            powershell 'docker version'
                        }
                    } else {
                        env.DOCKER_AVAILABLE = 'false'
                        echo 'Docker is NOT available on this agent. Docker-related stages will be skipped.'
                    }
                }
            }
        }
        
        stage('Docker Hub Login') {
            when {
                allOf {
                    expression { return env.DOCKER_AVAILABLE == 'true' }
                    expression { return params.PUBLISH_IMAGES }
                }
            }
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PSW')]) {
                            if (isUnix()) {
                                sh 'echo "$DH_PSW" | docker login -u "$DH_USER" --password-stdin'
                            } else {
                                powershell 'echo $env:DH_PSW | docker login -u $env:DH_USER --password-stdin'
                            }
                        }
                    } catch (err) {
                        echo "Docker Hub credentials with ID 'docker-hub-credentials' are missing or misconfigured."
                        error "Configure a Jenkins Username/Password credential named 'docker-hub-credentials' to proceed."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { return env.DOCKER_AVAILABLE == 'true' }
            }
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
            when {
                allOf {
                    expression { return env.DOCKER_AVAILABLE == 'true' }
                    expression { return params.PUBLISH_IMAGES }
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PSW')]) {
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
        }
        
        stage('Deploy') {
            when {
                expression { return env.DOCKER_AVAILABLE == 'true' }
            }
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
            script {
                if (env.WORKSPACE?.trim()) {
                    deleteDir() // ensures workspace cleanup
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
