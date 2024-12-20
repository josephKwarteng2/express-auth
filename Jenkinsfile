// Jenkins pipeline script for expressjs app

def cleanup() {
    sh 'rm -rf node_modules'
}


pipeline {

    agent {
        label 'agent1'
    }

    tools {
        nodejs 'node'
    }

    environment {
        INSTANCE = 'root@192.46.232.47'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                withCredentials([usernamePassword(credentialsId: 'github-cred', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
                    git url: 'https://${GITHUB_USERNAME}:${GITHUB_PASSWORD}@github.com/josephKwarteng2/express-auth.git', branch: 'main'
                }
            }
        }

        stage('Testing') {
            steps {
                    dir('express-auth') {
                    echo 'Testing...'
                    // sh 'npm install'
                    // sh 'npm test'
                    cleanup()
                }
            }
        }

        stage('Deploy to Instance') {
            steps {
            echo 'Deploying to instance...'
            withCredentials([string(credentialsId: 'linode', variable: 'LINODE_PASS')]) {
                sh '''
                    cd express-auth
                    sshpass -p ${LINODE_PASS} scp -o StrictHostKeyChecking=no -r ./* ${INSTANCE}:/root
                    sshpass -p ${LINODE_PASS} ssh -o StrictHostKeyChecking=no ${INSTANCE} << EOF
                        cd /root
                        chmod +x /root/start-with-delay.sh
                        docker compose down
                        docker system prune -f
                        docker compose up -d --build
                        exit
                    EOF
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}