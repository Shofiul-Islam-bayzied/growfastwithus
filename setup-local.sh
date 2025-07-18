#!/bin/bash

echo "🚀 Setting up GrowFastWithUs for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    if psql -h localhost -U postgres -c "SELECT 1;" &> /dev/null; then
        echo "✅ PostgreSQL is running"
        
        # Create database and user if they don't exist
        echo "🗄️  Setting up database..."
        psql -h localhost -U postgres -c "CREATE DATABASE growfastwithus;" 2>/dev/null || echo "Database already exists"
        psql -h localhost -U postgres -c "CREATE USER growfast WITH PASSWORD 'password';" 2>/dev/null || echo "User already exists"
        psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;" 2>/dev/null || echo "Privileges already granted"
        
        # Run database migrations
        echo "🔄 Running database migrations..."
        npm run db:push
    else
        echo "⚠️  PostgreSQL is not accessible. Please start PostgreSQL or use a cloud database."
        echo "💡 You can use Neon (https://neon.tech) for a free cloud PostgreSQL database"
    fi
else
    echo "⚠️  PostgreSQL client not found. Please install PostgreSQL or use a cloud database."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:5000"
echo ""
echo "Admin panel: http://localhost:5000/admin-login"
echo "Default credentials: admin / growfast2025" 