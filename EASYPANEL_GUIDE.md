# EasyPanel Deployment Guide - GrowFastWithUs

## Overview

EasyPanel is a modern server management tool that provides a web-based interface for deploying applications using Docker. It's perfect for users who want the power of VPS hosting with a user-friendly dashboard.

## Prerequisites

- VPS or dedicated server (Ubuntu 20.04+ recommended)
- Domain name pointed to your server
- SSH access to your server
- Minimum 1GB RAM, 1 CPU core

## Step 1: Install EasyPanel

### Server Setup
```bash
# Update your server
sudo apt update && sudo apt upgrade -y

# Install EasyPanel
curl -sSL https://get.easypanel.io | sh
```

### Access EasyPanel
1. Open browser to `https://your-server-ip:3000`
2. Complete initial setup wizard
3. Create admin account

## Step 2: Prepare Your Repository

Ensure your GitHub repository contains these files:
- `package.json` (already present)
- `.env.example` (already present)
- `Dockerfile` (already present)

## Step 3: Create Database Service

### Add PostgreSQL Database
1. In EasyPanel dashboard, click **"Create Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Configure database:

```
Service Name: growfastwithus-db
Database Name: growfastwithus
Username: growfast
Password: [generate secure password]
Port: 5432
```

4. Click **"Create"** and wait for deployment
5. Note the internal connection details

## Step 4: Create Application Service

### Add Node.js Application
1. Click **"Create Service"** → **"App"**
2. Configure basic settings:

```
Service Name: growfastwithus
Source Type: Git Repository
Repository URL: https://github.com/yourusername/growfastwithus
Branch: main
```

### Build Configuration
```
Build Command: npm install && npm run build
Start Command: npm start
Port: 3000
```

### Environment Variables
Add these environment variables in EasyPanel:

```env
NODE_ENV=production
DATABASE_URL=postgresql://growfast:YOUR_DB_PASSWORD@growfastwithus-db:5432/growfastwithus
SESSION_SECRET=your_32_character_random_session_secret_here
PORT=3000
PGHOST=growfastwithus-db
PGPORT=5432
PGUSER=growfast
PGPASSWORD=YOUR_DB_PASSWORD
PGDATABASE=growfastwithus
```

## Step 5: Domain and SSL Setup

### Add Domain
1. Go to your app service settings
2. Click **"Domains"** tab
3. Add your domain name: `yourdomain.com`
4. Add www subdomain: `www.yourdomain.com`

### Enable SSL
1. EasyPanel automatically provides Let's Encrypt SSL
2. Toggle **"Enable SSL"** for each domain
3. Wait for certificate generation

## Step 6: Deploy Application

### Initial Deployment
1. Click **"Deploy"** button in your app dashboard
2. Monitor build logs in real-time
3. Deployment typically takes 2-5 minutes

### Database Migration
After successful deployment:
1. Go to your app service
2. Click **"Console"** tab
3. Run database migration:
```bash
npm run db:push
```

## Step 7: Initial Setup

### Admin Access
1. Visit `https://yourdomain.com/admin-login`
2. Login with default credentials:
   - Username: `admin`
   - Password: `growfast2025`
3. **Immediately change password** in admin settings

### Configure Email Settings
1. Go to admin panel → Email Settings
2. Configure SMTP settings for notifications
3. Test email connection

## Step 8: Monitoring and Maintenance

### Application Monitoring
- **Logs**: View in EasyPanel app dashboard → Logs tab
- **Metrics**: Monitor CPU, memory usage in dashboard
- **Health**: Check app status and uptime

### Automatic Updates
1. Enable GitHub webhook in EasyPanel
2. App redeploys automatically on git push
3. Monitor deployments in activity log

### Backups
- **Database**: EasyPanel provides automatic PostgreSQL backups
- **Files**: Application is stateless, code stored in Git
- **Frequency**: Daily backups recommended

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check build logs in EasyPanel
# Common fixes:
- Verify package.json scripts
- Check Node.js version compatibility
- Ensure all dependencies are listed
```

**Database Connection Error:**
```bash
# Verify environment variables
# Check database service status
# Confirm internal networking between services
```

**Domain Not Working:**
```bash
# Verify DNS settings point to server IP
# Check domain configuration in EasyPanel
# Ensure SSL certificate is generated
```

### Log Access
- **Application Logs**: EasyPanel dashboard → App → Logs
- **Database Logs**: EasyPanel dashboard → Database → Logs
- **System Logs**: SSH to server → `journalctl -f`

## Performance Optimization

### Resource Allocation
```yaml
# Recommended settings in EasyPanel:
CPU: 1 core (minimum) / 2 cores (recommended)
Memory: 1GB (minimum) / 2GB (recommended)
```

### Scaling Options
- **Vertical Scaling**: Increase CPU/memory in EasyPanel
- **Horizontal Scaling**: Add multiple app instances with load balancer
- **Database Scaling**: Upgrade PostgreSQL plan or add read replicas

## Security Best Practices

### Application Security
1. Change default admin password immediately
2. Use strong SESSION_SECRET (32+ characters)
3. Enable HTTPS for all domains
4. Regular security updates

### Server Security
```bash
# EasyPanel handles most security automatically
# Additional hardening:
sudo ufw enable
sudo ufw allow 22,80,443,3000
```

## Cost Estimation

### VPS Requirements
- **Basic**: $5-10/month (1GB RAM, 1 CPU)
- **Recommended**: $10-20/month (2GB RAM, 2 CPU)
- **High Traffic**: $20-40/month (4GB RAM, 4 CPU)

### Popular VPS Providers
- **DigitalOcean**: $6/month basic droplet
- **Linode**: $5/month nanode
- **Vultr**: $6/month regular performance
- **Hetzner**: €4.15/month CX11

## Backup and Recovery

### Database Backup
```bash
# EasyPanel automatic backups
# Manual backup via console:
pg_dump -h growfastwithus-db -U growfast growfastwithus > backup.sql
```

### Application Backup
- Code: Stored in Git repository
- Database: EasyPanel automatic backups
- Uploaded files: Configure volume mounting if needed

### Recovery Process
1. Restore database from EasyPanel backup
2. Redeploy application from Git
3. Verify admin access and functionality

## Advanced Configuration

### Custom Docker Build
If you need custom Docker configuration:

```dockerfile
# Create custom Dockerfile in repository
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Settings
```env
# Development
NODE_ENV=development
DEBUG=true

# Production
NODE_ENV=production
DEBUG=false
```

### Load Balancing
For high traffic:
1. Create multiple app instances
2. Add EasyPanel load balancer
3. Configure health checks

## Migration from Other Platforms

### From Vercel/Netlify
1. Export environment variables
2. Update build commands for EasyPanel
3. Configure PostgreSQL database
4. Update domain DNS

### From Docker Compose
1. Convert services to EasyPanel services
2. Migrate environment variables
3. Update internal service networking
4. Deploy each service separately

## Support and Resources

### EasyPanel Documentation
- Official docs: https://easypanel.io/docs
- Community: EasyPanel Discord server
- GitHub: https://github.com/easypanel-io/easypanel

### Application Support
- Admin panel provides built-in help
- Check logs for error diagnostics
- Monitor performance metrics

## Quick Command Reference

```bash
# EasyPanel Installation
curl -sSL https://get.easypanel.io | sh

# Database Migration (in app console)
npm run db:push

# View Logs (SSH to server)
docker logs [container-name]

# Restart Service (EasyPanel UI)
# Go to service → Actions → Restart

# Update Application (automatic)
# Git push to main branch triggers redeploy
```

## Next Steps

After successful deployment:

1. **Configure Admin Panel**
   - Change default password
   - Set up email notifications
   - Customize theme and branding

2. **Content Management**
   - Add your business content
   - Upload logos and images
   - Configure contact forms

3. **Marketing Setup**
   - Connect analytics
   - Set up SEO optimization
   - Configure social media links

4. **Monitoring**
   - Set up uptime monitoring
   - Configure backup alerts
   - Monitor performance metrics

Your GrowFastWithUs website is now live and ready to help grow your automation business!