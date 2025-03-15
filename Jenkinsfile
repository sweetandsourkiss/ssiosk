pipeline {
    agent any

    stages {
        stage("Pull") {
            steps {
                git branch: 'develope', credentialsId: 'gitlab_id', url: 'https://lab.ssafy.com/s09-webmobile3-sub2/S09P12A201'
            }
        }

        stage("Prepare") {
            steps {
                sh "cp /var/webconfig/back/application.yml ./back/ssiosk/src/main/resources/application.yml"
            }
        }

        stage("Build") {
            steps {
                sh 'docker build --no-cache -t frontend ./front'
                sh 'docker build --no-cache -t backend ./back/ssiosk'
            }
        }

        stage("Deploy") {
            steps {
                script {
                    try {
                        sh "docker ps -a | grep -q nginx && docker stop nginx && docker rm nginx"
                    } catch (e) {
                        echo "${e}"
                    }
                    sh "docker run -d --name nginx -p 3000:80 frontend"
                
                    try {
                        sh "docker ps -a | grep -q spring && docker stop spring && docker rm spring"
                    } catch (e) {
                        echo "${e}"
                    }
                    sh "docker run -d --name spring -p 5500:8080 backend"
                }
            }
        }
    }
}


