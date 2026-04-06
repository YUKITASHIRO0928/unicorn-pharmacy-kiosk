@echo off
echo ================================
echo   ユニコーン薬局 受付システム
echo ================================
echo.

cd /d "%~dp0"

echo サーバーを起動しています...
start /min cmd /c "npx next start --hostname 0.0.0.0 --port 3000"

timeout /t 5 /nobreak > nul

echo ブラウザを起動しています...
start chrome --kiosk --disable-translate --no-first-run http://localhost:3000

echo.
echo 受付システムが起動しました！
echo 終了するにはこのウィンドウを閉じてください。
pause
