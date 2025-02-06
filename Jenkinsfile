pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/omaima144/maven.git'
            }
        }

        stage('Hello World') {
            steps {
                echo 'Hello, World!'
            }
        }
    }
}
