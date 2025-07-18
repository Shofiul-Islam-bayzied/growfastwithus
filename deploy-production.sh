#!/bin/bash

# Production Deployment Script for GrowFastWithUs
# This script automates the deployment process on a VPS

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Configuration
APP_NAME="growfastwithus"
APP_DIR="/var/www/$APP_NAME"
DOMAIN=${1:-"yourdomain.com"}
DB_PASSWORD=${2:-"your_secure_password_here"}

if [ "$DOMAIN" = "yourdomain.com" ]; then
    echo "❌ Please provide your domain name as the first argument"
    echo "Usage: ./deploy-production.sh yourdomain.com [db_password]"
    exit 1
fi

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   App Directory: $APP_DIR"
echo "   Database Password: [hidden]"

# Update system
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "✅ Node.js version: $(node -v)"

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
fi
echo "✅ PostgreSQL installed"

# Install PM2
echo "⚡ Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi
echo "✅ PM2 installed"

# Install Nginx
echo "🌐 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi
echo "✅ Nginx installed"

# Install Git
echo "📚 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
fi
echo "✅ Git installed"

# Setup database
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE $APP_NAME;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER growfast WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $APP_NAME TO growfast;" 2>/dev/null || echo "Privileges already granted"
echo "✅ Database setup complete"

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    echo "🔄 Updating existing repository..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    # Replace with your actual repository URL
    git clone https://github.com/yourusername/growfastwithus.git .
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create production environment file
echo "⚙️ Creating production environment file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://growfast:$DB_PASSWORD@localhost:5432/$APP_NAME
PGHOST=localhost
PGPORT=5432
PGUSER=growfast
PGPASSWORD=$DB_PASSWORD
PGDATABASE=$APP_NAME

# Application Configuration
NODE_ENV=production
PORT=3000

# Session Secret (generate a secure random string)
SESSION_SECRET=$(openssl rand -base64 32)

# Domain Configuration
DOMAIN=$DOMAIN
EOF

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:push

# Build application
echo "🔨 Building application..."
npm run build

# Setup PM2
echo "⚡ Setting up PM2..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js --env production --name $APP_NAME
pm2 save
pm2 startup

# Setup Nginx
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
else
    echo "📦 Installing Certbot..."
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# Setup firewall
echo "🛡️ Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Summary:"
echo "   Website: https://$DOMAIN"
echo "   Admin Panel: https://$DOMAIN/admin-login"
echo "   Default Admin: admin / growfast2025"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: pm2 logs $APP_NAME"
echo "   Restart app: pm2 restart $APP_NAME"
echo "   Status: pm2 status"
echo ""
echo "⚠️  Important:"
echo "   1. Change the default admin password immediately"
echo "   2. Set up regular database backups"
echo "   3. Monitor application logs"
echo "   4. Keep system updated"
echo ""
echo "📊 Monitoring:"
echo "   Health check: https://$DOMAIN/api/health"
echo "   Nginx status: sudo systemctl status nginx"
echo "   PostgreSQL status: sudo systemctl status postgresql" 