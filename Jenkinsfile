pipeline {
    agent { label 'docker' }
    
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
                sh 'docker version'
            }
        }
        
        stage('Docker Hub Login') {
     steps {
    sh '''
      echo "$DOCKER_HUB_CREDENTIALS_PSW" | docker login -u "$DOCKER_HUB_CREDENTIALS_USR" --password-stdin
    '''
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
