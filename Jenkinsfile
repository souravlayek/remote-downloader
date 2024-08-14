pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'
        IMAGE_NAME = 'souravlayek/remote-fetch'
        GIT_REPO = 'git@github.com:souravlayek/remotefetch.git'
        DOCKER_CREDENTIALS_ID = 'dockerhub' // Set your Docker credentials ID
        GIT_CREDENTIAL_ID = 'jenkinsSSH'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIAL_ID}"
            }
        }

        stage('Tag Management') {
            steps {
                script {
                    // Read the version from a VERSION file in the repo
                    def version = readFile('VERSION').trim()
                    // Increment the version number (simple semantic versioning)
                    def (major, minor, patch) = version.tokenize('.').collect { it as int }
                    patch += 1
                    def newVersion = "${major}.${minor}.${patch}"
                    writeFile file: 'VERSION', text: newVersion
                    env.TAG = newVersion
                    echo "New version: ${newVersion}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${TAG}")
                }
            }
        }

        stage('Push to Docker Registry') {
            steps {
                script {
                    docker.withRegistry("", "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
                    }
                }
            }
        }

        stage('Post-Build Actions') {
            steps {
                script {
                    // Commit the new version to the repository
                    sh 'git config user.email "jenkins@yourdomain.com"'
                    sh 'git config user.name "Jenkins"'
                    sh 'git add VERSION'
                    sh "git commit -m 'Bump version to ${TAG}'"
                    sh 'git push origin main'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
