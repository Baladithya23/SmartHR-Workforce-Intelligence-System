# SmartHR – Backend Startup Script
# Run this from the project root or the backend/ folder
# Requires JDK 22 and Maven

$JAVA_HOME_22 = "C:\Program Files\Java\jdk-22"
$MVN = "C:\Users\Pream Kumar\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
$BACKEND_DIR = "$PSScriptRoot\backend"

$env:JAVA_HOME = $JAVA_HOME_22
$env:PATH = "$JAVA_HOME_22\bin;$env:PATH"

Write-Host "Starting SmartHR Backend with JDK 22..." -ForegroundColor Cyan
Write-Host "  JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Gray
Write-Host ""

Set-Location $BACKEND_DIR
& $MVN spring-boot:run
