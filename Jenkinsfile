pipeline {
    agent none
    stages {
        agent {
            docker { image 'node:14-alpine' }
        }
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
    }
}