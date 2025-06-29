# Quick Start Guide - Self-Hosting GrowFastWithUs

## 🚀 One-Click Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name (optional for local testing)

### Step 1: Environment Setup
```bash
# Clone your repository
git clone <your-repo-url> growfastwithus
cd growfastwithus

# Create environment file
cp .env.example .env
```

### Step 2: Configure Environment
Edit `.env` file with your settings:
```env
POSTGRES_PASSWORD=your_secure_password_here
SESSION_SECRET=your_32_character_session_secret_here
```

### Step 3: Deploy
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

Your website will be available at `http://localhost`

### Step 4: Initial Setup
1. Visit `http://localhost/admin-login`
2. Login with: **admin** / **growfast2025**
3. Configure your settings in the admin panel

---

## 📋 Manual VPS Deployment

### Quick Commands
```bash
# System setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib nginx git
sudo npm install -g pm2

# Database setup
sudo -u postgres createdb growfastwithus
sudo -u postgres createuser growfast

# Application deployment
git clone <your-repo-url> /var/www/growfastwithus
cd /var/www/growfastwithus
npm install
npm run build
npm run db:push

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## ⚡ Platform Deployments

### Vercel (Recommended for beginners)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

---

## 🔧 Essential Configuration

### Admin Panel Access
- URL: `https://yourdomain.com/admin-login`
- Default credentials: `admin` / `growfast2025`
- **Change password immediately after first login**

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=32-character-random-string
NODE_ENV=production
PORT=3000
```

### Database Migration
```bash
npm run db:push
```

---

## 📊 Monitoring

### Check Application Status
```bash
# Docker deployment
docker-compose logs app

# PM2 deployment
pm2 status
pm2 logs
```

### Health Check
Visit `http://yourdomain.com/api/health`

---

## 🛠️ Common Issues

**Database connection failed:**
- Check DATABASE_URL format
- Verify database server is running
- Test connection: `psql $DATABASE_URL`

**Application won't start:**
- Check logs: `pm2 logs` or `docker-compose logs`
- Verify all environment variables are set
- Check port availability: `sudo lsof -i :3000`

**Admin panel login issues:**
- Verify admin user exists in database
- Check session secret is properly set
- Clear browser cookies and try again

---

## 📞 Support

For detailed deployment instructions, see `DEPLOYMENT_GUIDE.md`

**Common hosting costs:**
- VPS: $5-20/month
- Vercel: Free tier available
- Railway: $5/month starter
- DigitalOcean: $6/month basic