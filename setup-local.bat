@echo off
echo 🚀 Setting up GrowFastWithUs for local development...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit .env file with your database credentials
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:5000
echo.
echo Admin panel: http://localhost:5000/admin-login
echo Default credentials: admin / growfast2025
echo.
echo 💡 For database setup, you can:
echo    - Install PostgreSQL locally
echo    - Use Neon (https://neon.tech) for free cloud database
echo    - Use Railway, Supabase, or other cloud providers
echo.
pause 