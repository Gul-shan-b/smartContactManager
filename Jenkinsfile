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
                echo 'Deploying application to the NGD Application Server (Windows)...'
                
                bat '''
                    echo "Preparing deployment on Windows..."
                    
                    :: 1. Create a directory for your application
                    IF NOT EXIST "C:\\temp\\ngd-app" mkdir "C:\\temp\\ngd-app"
                    
                    :: 2. Copy the latest code to that directory
                    xcopy /E /Y /C /I * "C:\\temp\\ngd-app\\"
                    
                    :: 3. Kill any existing process running on port 8081
                    FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| find "LISTENING" ^| find ":8081"') DO TaskKill.exe /PID %%T /F
                    
                    :: 4. Start a simple Node web server in the background on port 8081
                    cd /d "C:\\temp\\ngd-app"
                    
                    :: Write a tiny Node.js server script to serve the directory securely
                    echo const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer(function(req, res) { let filePath = '.' + req.url; if (filePath == './') filePath = './index.html'; let extname = path.extname(filePath); let contentType = 'text/html'; switch (extname) { case '.js': contentType = 'text/javascript'; break; case '.css': contentType = 'text/css'; break; } fs.readFile(filePath, function(error, content) { if (error) { res.writeHead(500); res.end('Error'); } else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); } }); }); server.listen(8081); > serve.js
                    
                    set JENKINS_NODE_COOKIE=dontKillMe
                    
                    :: Run raw Node using wmic to completely detach the process tree from Jenkins
                    wmic process call create "node C:\\temp\\ngd-app\\serve.js"
                    
                    echo "Application deployed successfully and serving locally on port 8081!"
                    
                    echo "Application deployed successfully and serving locally on port 8081!"
                '''
            }
        }
    }
}
