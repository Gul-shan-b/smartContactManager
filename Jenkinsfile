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
                       copy /Y serve.js "C:\\temp\\ngd-app\\serve.js"
                    
                    :: 3. Kill any existing process running on port 8081
                    FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| find "LISTENING" ^| find ":8081"') DO TaskKill.exe /PID %%T /F
                    
                    :: 4. Start a simple Node web server in the background on port 8081
                    cd /d "C:\\temp\\ngd-app"
                    
                                        :: serve.js is tracked in the repo and copied above; just run it
                                        set JENKINS_NODE_COOKIE=dontKillMe
                    
                                        :: Run raw Node using wmic to completely detach the process tree from Jenkins
                                        :: Ensure working directory is C:/temp/ngd-app so relative paths resolve
                                        del /F /Q C:\temp\ngd-app\server.log 2>nul
                                        wmic process call create "cmd /c cd /d C:/temp/ngd-app ^&^& node serve.js ^> C:/temp/ngd-app/server.log 2^>^&1"
                    
                                        :: Health check: wait up to 10 seconds for port 8081 to listen
                                        powershell -NoProfile -Command "$ok = $false; 1..10 | ForEach-Object { Start-Sleep -Milliseconds 500; if (Test-NetConnection -ComputerName 'localhost' -Port 8081 -InformationLevel Quiet) { $ok = $true; break } }; if (-not $ok) { Write-Host 'ERROR: Port 8081 did not start.'; if (Test-Path 'C:\\temp\\ngd-app\\server.log') { Get-Content 'C:\\temp\\ngd-app\\server.log' }; exit 1 }"
                    
                                        echo "Application deployed successfully and serving locally on port 8081!"
                '''
            }
        }
    }
}
