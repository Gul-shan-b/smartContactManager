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
                    
                    :: 4. Start a simple Python web server in the background on port 8081
                    cd /d "C:\\temp\\ngd-app"
                    
                    :: Use the absolute path to Python since Jenkins can't see the user AppData PATH
                    powershell -Command "Start-Process 'C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python313\\python.exe' -ArgumentList '-m', 'http.server', '8081' -WindowStyle Hidden"
                    
                    echo "Application deployed successfully and serving locally on port 8081!"
                '''
            }
        }
    }
}
