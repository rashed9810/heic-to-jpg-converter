# Script to run the HEIC to JPG Converter application

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "Starting HEIC to JPG Converter application..." -ForegroundColor Cyan

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd backend; python -m uvicorn minimal_server:app --host 0.0.0.0 --port 8000" -PassThru -WindowStyle Normal

# Start the frontend development server
Write-Host "Starting frontend development server..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command cd frontend; npm run dev" -PassThru -WindowStyle Normal

# Display information
Write-Host ""
Write-Host "HEIC to JPG Converter is running!" -ForegroundColor Magenta
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow

# Handle script termination
try {
    # Keep the script running until Ctrl+C is pressed
    Wait-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
} finally {
    # Clean up processes when the script is terminated
    if ($backendProcess -and -not $backendProcess.HasExited) {
        Write-Host "Stopping backend server..." -ForegroundColor Yellow
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }

    if ($frontendProcess -and -not $frontendProcess.HasExited) {
        Write-Host "Stopping frontend server..." -ForegroundColor Yellow
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }

    Write-Host "HEIC to JPG Converter has been stopped." -ForegroundColor Magenta
}
