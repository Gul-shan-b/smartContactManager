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
                echo 'Deploying application to the NGD Application Server...'
                
                sh '''
                    echo "Preparing deployment without Docker..."
                    
                    # 1. Create a directory for your application
                    mkdir -p /tmp/ngd-app
                    
                    # 2. Copy the latest code to that directory
                    cp -r * /tmp/ngd-app/
                    
                    # 3. Kill any existing process running on port 8081 (to avoid "port already in use" errors)
                    fuser -k 8081/tcp || echo "No existing process on port 8081"
                    
                    # 4. Start a simple Python web server in the background on port 8081
                    # (Assuming Python 3 is installed on your Jenkins server, which is standard)
                    cd /tmp/ngd-app
                    nohup python3 -m http.server 8081 > server.log 2>&1 &
                    
                    echo "Application deployed successfully and serving locally on port 8081!"
                '''
            }
        }
    }
}
