pipeline {
    agent any
    environment {
        //
        // Build config
        //
        // prefix of the image to build, config triplet
        PROJECT_NAME = "gestionhogar"
        PROJECT_SERVICE = "frontend"
        PROJECT_STAGE = "develop"
        PROJECT_TRIPLET = "${PROJECT_NAME}-${PROJECT_SERVICE}-${PROJECT_STAGE}"

        //
        // VPS setup
        //
        REMOTE_USER = "fernando"
        REMOTE_IP = "157.180.33.183"
        // Folder where docker-compose and .env files are placed
        REMOTE_FOLDER = "/home/fernando/services/gestionhogar"

        //
        // Docker registry setup
        //
        REGISTRY_CREDENTIALS = "f16149d3-8913-40f9-80ff-9eca92eef798"
        REGISTRY_URL = "docker.io"
        REGISTRY_USER = "araozu"
        REGISTRY_REPO = "${PROJECT_TRIPLET}"
        // docker.io/digitalesacide/trazo-frontend-prod
        FULL_REGISTRY_URL = "${REGISTRY_URL}/${REGISTRY_USER}/${REGISTRY_REPO}"
        ESCAPED_REGISTRY_URL = "${REGISTRY_URL}\\/${REGISTRY_USER}\\/${REGISTRY_REPO}"

        // SSH command
        SSH_COM = "ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP}"
    }

    stages {
        stage("Build & push image") {
            steps {
                script {
                    withDockerRegistry(credentialsId: "${REGISTRY_CREDENTIALS}") {
                        def image = docker.build("${FULL_REGISTRY_URL}:${BUILD_NUMBER}", "-f deploy/Dockerfile .")
                        image.push()
                        image.push("latest")
                    }
                }
            }
        }
        stage("Restart frontend service") {
            steps {
                script {
                    def config = readYaml file: 'deploy/env.yaml'
                    def env = config.develop.frontend

                    def nonSensitiveVars = env.nonsensitive.collect { k, v -> "${k}=${v}" }
                    def sensitiveVars = env.sensitive

                    def credentialsList = sensitiveVars.collect { 
                        string(credentialsId: it, variable: it)
                    }

                    withCredentials(credentialsList) {
                        sshagent(['hetzner-helsink-01']) {
                            // Create a temporary script that will create the .env file
                            // This enables us to use shell variables to properly handle 
                            // the credentials without using binding.getVariable()
                            sh """
                                cat > ${WORKSPACE}/create_env.sh << 'EOL'
#!/bin/bash
cat << EOF
# Non-sensitive variables
GESTIONHOGAR_FRONTEND_VERSION=${BUILD_NUMBER}
${nonSensitiveVars.join('\n')}
# Sensitive variables
${sensitiveVars.collect { varName -> "${varName}=\${${varName}}" }.join('\n')}
EOF
EOL
                                chmod +x ${WORKSPACE}/create_env.sh
                            """

                            // Execute the script to generate env content and send it to remote
                            sh """
                                ${WORKSPACE}/create_env.sh | ${SSH_COM} 'umask 077 && cat > ${REMOTE_FOLDER}/.env.frontend'
                            """

                            // populate & restart
                            sh """
                                ${SSH_COM} 'cd ${REMOTE_FOLDER} && \
                                docker pull ${FULL_REGISTRY_URL}:${BUILD_NUMBER} && \
                                (rm .env || true) && \
                                touch .env.base && \
                                touch .env.backend && \
                                touch .env.frontend && \
                                cat .env.base >> .env && \
                                cat .env.backend >> .env && \
                                cat .env.frontend >> .env && \
                                docker compose up -d'
                            """
                        }
                    }
                }
            }
        }
    }
}
