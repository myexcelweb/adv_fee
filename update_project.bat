@echo off
cd /d "E:\MAIN FOLDER ALL DATA 2025\VITE REACT\SITE\web\website court fee only"

echo ===============================
echo   GIT AUTO UPDATE STARTED
echo ===============================

git add .

set /p msg=Enter commit message: 

if "%msg%"=="" (
    set msg=Auto update
)

git commit -m "%msg%"
git push

echo ===============================
echo   PUSH COMPLETED
echo ===============================

pause