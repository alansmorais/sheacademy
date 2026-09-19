@echo off
echo ====================================================
echo SHE Academy - Local Build Helper
echo ====================================================
echo.
echo This will prepare your website for uploading.
echo Requirements: Node.js must be installed on your PC.
echo.
pause

echo.
echo [1/2] Installing necessary tools...
call npm install

echo.
echo [2/2] Creating the 'dist' folder...
call npm run build

echo.
echo ====================================================
echo DONE! 
echo.
echo SUCCESS: A 'docs' folder has been created.
echo IMPORTANT: Upload EVERYTHING to GitHub, then in 
echo Settings -> Pages, select the '/docs' folder.
echo ====================================================
pause
