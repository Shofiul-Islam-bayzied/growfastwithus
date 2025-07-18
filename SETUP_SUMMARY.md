# 🚀 GrowFastWithUs - Complete Setup & Deployment Guide

## 📋 Project Overview

This is a **full-stack business automation website** that helps businesses automate their growth processes. The application includes:

### 🎯 Core Features
- **Modern Landing Page** with beautiful UI/UX
- **Admin Dashboard** for content management
- **Lead Management** system with contact forms
- **Template System** for business automation workflows
- **Analytics & Performance** tracking
- **Email Campaigns** and A/B testing
- **Content Scheduling** and backup systems

### 🛠️ Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Clerk (optional)
- **Deployment**: Docker + Nginx + PM2

## 🗄️ Database Schema Analysis

The application has a comprehensive database with these main tables:

### Core Tables
- **`users`** - User accounts and authentication
- **`contacts`** - Lead management and contact forms
- **`templates`** - Business automation templates
- **`reviews`** - Customer testimonials and reviews

### Admin Management
- **`site_settings`** - Website configuration and content
- **`admin_users`** - Admin user management
- **`email_settings`** - Email configuration
- **`activity_logs`** - User activity tracking

### Advanced Features
- **`analytics`** - Performance and user analytics
- **`scheduled_content`** - Content scheduling system
- **`content_backups`** - Data backup and recovery
- **`email_campaigns`** - Email marketing campaigns
- **`ab_tests`** - A/B testing for optimization
- **`lead_scoring`** - Lead qualification system
- **`performance_metrics`** - System performance monitoring

## 🏃‍♂️ Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+ (or cloud database)
- Git

### Quick Start (Windows)
```bash
# Run the automated setup
setup-local.bat
```

### Quick Start (Mac/Linux)
```bash
# Make script executable and run
chmod +x setup-local.sh
./setup-local.sh
```

### Manual Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
cp env.example .env
# Edit .env with your database credentials
```

3. **Database Setup Options**

**Option A: Local PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/

# Create database and user
sudo -u postgres createdb growfastwithus
sudo -u postgres createuser growfast
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;"
```

**Option B: Cloud Database (Recommended)**
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com

4. **Run Migrations**
```bash
npm run db:push
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Access Application**
- Website: http://localhost:5000
- Admin Panel: http://localhost:5000/admin-login
- Default Admin: `admin` / `growfast2025`

## 🐳 Docker Deployment

### Quick Docker Setup
```bash
# Create environment file
cp env.example .env
# Edit .env with your settings

# Start with Docker Compose
docker-compose up -d

# Visit http://localhost
```

### Production Docker
```bash
# Build and run
docker build -t growfastwithus .
docker run -p 3000:3000 --env-file .env growfastwithus
```

## 🚀 Production Deployment

### Option 1: VPS Deployment (Automated)

**One-Command Deployment:**
```bash
chmod +x deploy-production.sh
./deploy-production.sh yourdomain.com your_secure_db_password
```

This script automatically:
- Installs all required software (Node.js, PostgreSQL, Nginx, PM2)
- Sets up the database
- Configures the application
- Sets up SSL certificates
- Configures firewall
- Starts the application

### Option 2: Manual VPS Setup

1. **Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Database Setup**
```bash
sudo -u postgres createdb growfastwithus
sudo -u postgres createuser growfast
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE growfastwithus TO growfast;"
```

3. **Application Deployment**
```bash
# Clone repository
git clone <your-repo-url> /var/www/growfastwithus
cd /var/www/growfastwithus

# Install and build
npm install
npm run build

# Setup environment
cp env.example .env
# Edit .env with production settings

# Run migrations
npm run db:push

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

4. **Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/growfastwithus
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

```bash
sudo ln -s /etc/nginx/sites-available/growfastwithus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Platform Deployments

**Vercel (Recommended for beginners):**
1. Connect GitHub repository to Vercel
2. Add environment variables in dashboard
3. Deploy automatically on git push

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Server port | No | `3000` |
| `SESSION_SECRET` | Session encryption | Yes | `32-char-random-string` |
| `CLERK_PUBLISHABLE_KEY` | Clerk auth public key | No | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk auth secret key | No | `sk_test_...` |

## 📁 Project Structure

```
growfastwithus/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── home.tsx   # Landing page
│   │   │   ├── templates.tsx # Template listing
│   │   │   ├── admin/     # Admin dashboard
│   │   │   └── ...
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
├── server/                # Node.js backend
│   ├── routes.ts          # API endpoints (603 lines)
│   ├── storage.ts         # Database operations (385 lines)
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared code
│   └── schema.ts         # Database schema (292 lines)
├── migrations/           # Database migrations
├── dist/                # Built application
├── docker-compose.yml   # Docker configuration
├── Dockerfile          # Docker build file
├── ecosystem.config.js  # PM2 configuration
└── nginx.conf          # Nginx configuration
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Run database migrations |
| `npm run check` | TypeScript type checking |

## 🔐 Security Checklist

- [ ] Change default admin password (`admin` / `growfast2025`)
- [ ] Use strong session secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Keep dependencies updated
- [ ] Monitor application logs
- [ ] Set up rate limiting

## 📊 Monitoring & Maintenance

### Health Checks
- Application: `GET /api/health`
- Database: Check connection logs
- Nginx: `sudo systemctl status nginx`

### Logs
```bash
# PM2 logs
pm2 logs growfastwithus

# Docker logs
docker-compose logs app

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups
```bash
# Create backup
pg_dump growfastwithus > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql growfastwithus < backup_file.sql
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check DATABASE_URL format
- Verify database server is running
- Test connection: `psql $DATABASE_URL`

**Application Won't Start:**
- Check logs: `pm2 logs` or `docker-compose logs`
- Verify all environment variables are set
- Check port availability: `sudo lsof -i :3000`

**Admin Panel Login Issues:**
- Verify admin user exists in database
- Check session secret is properly set
- Clear browser cookies and try again

**Build Errors:**
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node -v` (should be 18+)
- Verify TypeScript compilation: `npm run check`

## 💰 Hosting Costs

**Budget Options:**
- **VPS**: $5-20/month (DigitalOcean, Linode, Vultr)
- **Vercel**: Free tier available
- **Railway**: $5/month starter
- **Neon**: Free tier for database

**Recommended Setup:**
- VPS: $10/month (2GB RAM, 1 vCPU)
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- **Total**: ~$135/year

## 🎯 Next Steps

1. **Local Development:**
   - Run `setup-local.bat` (Windows) or `./setup-local.sh` (Mac/Linux)
   - Explore the admin panel
   - Customize content and styling

2. **Production Deployment:**
   - Choose hosting platform
   - Run `./deploy-production.sh yourdomain.com` for VPS
   - Or use platform-specific deployment

3. **Customization:**
   - Modify branding and content
   - Add custom templates
   - Integrate with external services

4. **Scaling:**
   - Set up monitoring and alerts
   - Implement caching strategies
   - Add CDN for static assets

---

## 📞 Support Resources

- **Documentation**: Check `/docs` folder
- **Deployment Guides**: `DEPLOYMENT_GUIDE.md`, `QUICK_START.md`
- **Admin Features**: `ADMIN_FEATURES_GUIDE.md`
- **Website Management**: `WEBSITE_MANAGEMENT_GUIDE.md`

**Happy coding! 🚀** 