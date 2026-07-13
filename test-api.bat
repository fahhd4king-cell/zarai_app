@echo off
REM Testing Script for Zarai App (Windows)
REM This script automates the testing process

setlocal enabledelayedexpansion

echo ===================================
echo Starting Zarai App Testing...
echo ===================================
echo.

REM Configuration
set BACKEND_URL=http://localhost:3000
set TEST_EMAIL=test_%RANDOM%@example.com
set TEST_PASSWORD=Password123!
set TEST_NAME=المزارع التجريبية

REM Initialize variables
set TOKEN=
set USER_ID=
set FARM_ID=

echo Testing Backend at %BACKEND_URL%
echo.

REM Test 1: Health Check
echo [1] Checking Backend Health...
curl -s %BACKEND_URL%/api/health
if !ERRORLEVEL! NEQ 0 (
    echo ERROR: Backend is not running
    echo Please run: cd backend ^&^& npm run dev
    exit /b 1
)
echo.
echo Backend is running successfully!
echo.

REM Test 2: Register
echo [2] Testing User Registration...
for /f %%A in ('curl -s -X POST %BACKEND_URL%/api/auth/register ^^
  -H "Content-Type: application/json" ^^
  -d "{\"email\": \"!TEST_EMAIL!\", \"password\": \"!TEST_PASSWORD!\", \"name\": \"!TEST_NAME!\", \"phone\": \"+966501234567\"}"') do (
    set response=%%A
)
echo Response: !response!
echo.

REM Test 3: Login
echo [3] Testing User Login...
for /f %%A in ('curl -s -X POST %BACKEND_URL%/api/auth/login ^^
  -H "Content-Type: application/json" ^^
  -d "{\"email\": \"farmer@example.com\", \"password\": \"password123\"}"') do (
    set response=%%A
)
echo Response: !response!
echo.

echo Testing Complete!
echo.
echo Next Steps:
echo 1. Test Frontend: http://localhost:5173
echo 2. Test Mobile: cd frontend-mobile ^&^& npm start
echo 3. Use Postman for detailed API testing
echo.
pause
