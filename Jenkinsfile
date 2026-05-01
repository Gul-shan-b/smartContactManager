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
                    
                    :: 3. Kill any existing process running on port 8080
                    FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| find "LISTENING" ^| find ":8080"') DO TaskKill.exe /PID %%T /F
                    
                    :: 4. Start a simple Node web server in the background on port 8080
                    cd /d "C:\\temp\\ngd-app"
                    :: Diagnostics: ensure Node is available for the Jenkins service account
                    where node
                    node -v

                    :: serve.js is tracked in the repo and copied above; just run it
                    set JENKINS_NODE_COOKIE=dontKillMe

                    :: Run node using PowerShell Start-Process to completely detach the process tree from Jenkins
                    powershell -NoProfile -Command "Remove-Item -Force -ErrorAction SilentlyContinue 'C:\\temp\\ngd-app\\server.log', 'C:\\temp\\ngd-app\\server_error.log'"
                    powershell -NoProfile -Command "Get-Content -Path 'C:\\temp\\ngd-app\\serve.js' -TotalCount 1"
                    powershell -NoProfile -Command "Start-Process node -ArgumentList 'serve.js' -WorkingDirectory 'C:\\temp\\ngd-app' -RedirectStandardOutput 'C:\\temp\\ngd-app\\server.log' -RedirectStandardError 'C:\\temp\\ngd-app\\server_error.log' -WindowStyle Hidden"

                    :: Quick log peek in case the process exits immediately
                    powershell -NoProfile -Command "Start-Sleep -Milliseconds 500; if (Test-Path 'C:\\temp\\ngd-app\\server.log') { Get-Content -Path 'C:\\temp\\ngd-app\\server.log' -TotalCount 50 }"

                          :: Health check: wait up to 10 seconds for port 8080 to listen
                          powershell -NoProfile -Command "$ok = $false; 1..10 | ForEach-Object { Start-Sleep -Milliseconds 500; if (Test-NetConnection -ComputerName 'localhost' -Port 8080 -InformationLevel Quiet) { $ok = $true; break } }; if (-not $ok) { Write-Host 'ERROR: Port 8080 did not start.'; if (Test-Path 'C:\\temp\\ngd-app\\server.log') { Get-Content 'C:\\temp\\ngd-app\\server.log' }; if (Test-Path 'C:\\temp\\ngd-app\\server_error.log') { Get-Content 'C:\\temp\\ngd-app\\server_error.log' }; exit 1 }"
                    
                          echo "Application deployed successfully and serving locally on port 8080!"
                '''
            }
        }
    }
}
