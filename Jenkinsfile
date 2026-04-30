pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from the configured Git repository
                checkout scm
            }
        }
        
        stage('Deploy') {
            steps {
                // This is a placeholder for your actual deployment commands
                echo 'Deploying application to the NGD Application Server...'
                
                // For a Linux server running Apache or Nginx, you typically copy files
                // uncomment and adjust the paths below according to your server setup
                sh '''
                    echo "Preparing deployment on Port 8081..."
                    
                    # Stop and remove the existing container if it's already running from a previous build
                    docker stop ngd-app-container || true
                    docker rm ngd-app-container || true
                    
                    # Build the new Docker image based on the latest code
                    docker build -t ngd-app-image .
                    
                    # Run the container. 
                    # -p 8081:80 maps the host's port 8081 to the container's Nginx port 80
                    docker run -d -p 8081:80 --name ngd-app-container ngd-app-image
                    
                    echo "Application deployed successfully and running on http://<your-server-ip>:8081!"
                '''
            }
        }
    }
}
