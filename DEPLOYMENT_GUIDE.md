# GrowFastWithUs - Self-Hosting Deployment Guide

## Overview
This guide will help you deploy your GrowFastWithUs website to your own server or hosting platform. The application is a full-stack Node.js application with PostgreSQL database.

## System Requirements

### Minimum Server Specifications
- **CPU**: 1 vCore (2 vCores recommended)
- **RAM**: 1GB (2GB recommended)
- **Storage**: 10GB SSD
- **Network**: 100 Mbps connection
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### Software Requirements
- Node.js 18+ (20 recommended)
- PostgreSQL 13+ (15 recommended)
- PM2 (for process management)
- Nginx (for reverse proxy)
- SSL Certificate (Let's Encrypt recommended)

## Quick Start (VPS/Cloud Server)

### Step 1: Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE growfastwithus;
CREATE USER growfast WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;
\q

# Enable PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Step 3: Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/growfastwithus
sudo chown $USER:$USER /var/www/growfastwithus
cd /var/www/growfastwithus

# Clone your repository (replace with your git repository)
git clone <your-repository-url> .

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 4: Environment Configuration

Create production environment file:

```bash
# Create .env file
nano .env
```

Add the following configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://growfast:your_secure_password_here@localhost:5432/growfastwithus
PGHOST=localhost
PGPORT=5432
PGUSER=growfast
PGPASSWORD=your_secure_password_here
PGDATABASE=growfastwithus

# Application Configuration
NODE_ENV=production
PORT=3000

# Session Secret (generate a secure random string)
SESSION_SECRET=your_very_secure_session_secret_here_minimum_32_characters

# Domain Configuration
DOMAIN=yourdomain.com
```

### Step 5: Database Migration

```bash
# Run database migrations
npm run db:push
```

### Step 6: PM2 Process Management

```bash
# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command above
```

### Step 7: Nginx Configuration

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/growfastwithus
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/growfastwithus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Platform-Specific Deployments

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://growfast:password@db:5432/growfastwithus
      - SESSION_SECRET=your_session_secret_here
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=growfastwithus
      - POSTGRES_USER=growfast
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with Docker:

```bash
docker-compose up -d
```

### Vercel Deployment

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "SESSION_SECRET": "@session_secret"
  }
}
```

Deploy:

```bash
npm install -g vercel
vercel --prod
```

### Railway Deployment

Create `railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"

[environments.production.variables]
NODE_ENV = "production"
```

Deploy:

```bash
npm install -g @railway/cli
railway login
railway deploy
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Session encryption key | `random-32-character-string` |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `DOMAIN` | Your domain name | `localhost` |

## Admin Panel Setup

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `growfast2025`

### First Login Steps
1. Navigate to `https://yourdomain.com/admin-login`
2. Login with default credentials
3. **Important**: Change admin password immediately
4. Configure email settings for notifications
5. Customize theme and branding

## Database Backup & Maintenance

### Automated Backups

Create backup script:

```bash
#!/bin/bash
# /home/user/backup.sh

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/growfastwithus"
DB_NAME="growfastwithus"
DB_USER="growfast"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql"
```

Setup daily backup cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/user/backup.sh
```

### Database Restoration

```bash
# Restore from backup
psql -U growfast -h localhost growfastwithus < /var/backups/growfastwithus/backup_TIMESTAMP.sql
```

## Monitoring & Logs

### Application Logs

```bash
# View PM2 logs
pm2 logs

# View specific application logs
pm2 logs growfastwithus

# Monitor in real-time
pm2 monit
```

### System Monitoring

```bash
# Check application status
pm2 status

# Check database status
sudo systemctl status postgresql

# Check nginx status
sudo systemctl status nginx

# View system resources
htop
```

## Security Best Practices

### Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (if using SSH)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check firewall status
sudo ufw status
```

### Database Security

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/*/main/postgresql.conf

# Set listen_addresses to localhost only
listen_addresses = 'localhost'

# Edit pg_hba.conf for authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Application Security

1. **Change default admin password immediately**
2. **Use strong SESSION_SECRET** (minimum 32 characters)
3. **Enable HTTPS** with valid SSL certificate
4. **Regular security updates**:
   ```bash
   sudo apt update && sudo apt upgrade
   npm audit fix
   ```

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check PM2 logs
pm2 logs

# Check if port is in use
sudo lsof -i :3000

# Restart application
pm2 restart growfastwithus
```

**Database connection errors:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -U growfast -h localhost growfastwithus

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

**Nginx errors:**
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## Updates & Maintenance

### Application Updates

```bash
# Navigate to application directory
cd /var/www/growfastwithus

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Update database schema if needed
npm run db:push

# Restart application
pm2 restart growfastwithus
```

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js (if needed)
# Check current version: node --version
# Follow Node.js update instructions for your system

# Update PM2
npm update -g pm2
```

## Performance Optimization

### Application Optimization

1. **Enable gzip compression** in Nginx
2. **Set up caching** for static assets
3. **Database connection pooling** (already configured)
4. **Monitor memory usage** with PM2

### Nginx Optimization

Add to Nginx configuration:

```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

# Enable caching for static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Support & Resources

### Useful Commands

```bash
# Check all services status
sudo systemctl status postgresql nginx

# View system resources
free -h
df -h
htop

# Application management
pm2 list
pm2 restart all
pm2 stop all
pm2 delete all
```

### Log Locations

- **Application logs**: `pm2 logs` or `/home/user/.pm2/logs/`
- **Nginx logs**: `/var/log/nginx/`
- **PostgreSQL logs**: `/var/log/postgresql/`
- **System logs**: `/var/log/syslog`

## Cost Estimation

### VPS Hosting (Monthly)
- **Basic (1GB RAM, 1 vCPU)**: $5-10/month
- **Recommended (2GB RAM, 2 vCPU)**: $10-20/month
- **High Traffic (4GB RAM, 4 vCPU)**: $20-40/month

### Cloud Platform Pricing
- **Vercel**: Free tier available, Pro starts at $20/month
- **Railway**: $5/month for hobby, $20/month for pro
- **DigitalOcean**: $6/month for basic droplet
- **AWS/Google Cloud**: Variable based on usage

Choose the option that best fits your budget and technical requirements.