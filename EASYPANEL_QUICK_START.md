# 🚀 EasyPanel Quick Start Guide - GrowFastWithUs

## Overview
This guide will help you deploy GrowFastWithUs to EasyPanel in under 10 minutes!

## Prerequisites
- VPS with EasyPanel installed
- Domain name pointed to your server
- GitHub repository with this code

## Step 1: Install EasyPanel (if not already installed)

```bash
# SSH into your server and run:
curl -sSL https://get.easypanel.io | sh
```

Access EasyPanel at: `https://your-server-ip:3000`

## Step 2: Create Database Service

1. **Open EasyPanel Dashboard**
2. **Click "Create Service"**
3. **Select "Database" → "PostgreSQL"**
4. **Configure:**
   ```
   Service Name: growfastwithus-db
   Database Name: growfastwithus
   Username: growfast
   Password: [generate secure password]
   Port: 5432
   ```
5. **Click "Create"**

## Step 3: Create Application Service

1. **Click "Create Service" → "App"**
2. **Configure Basic Settings:**
   ```
   Service Name: growfastwithus
   Source Type: Git Repository
   Repository URL: https://github.com/yourusername/growfastwithus
   Branch: main
   ```
3. **Build Configuration:**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   Port: 3000
   ```

## Step 4: Set Environment Variables

Add these in your app service settings:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://growfast:YOUR_DB_PASSWORD@growfastwithus-db:5432/growfastwithus
SESSION_SECRET=your_32_character_random_session_secret_here
PGHOST=growfastwithus-db
PGPORT=5432
PGUSER=growfast
PGPASSWORD=YOUR_DB_PASSWORD
PGDATABASE=growfastwithus
```

**Replace:**
- `YOUR_DB_PASSWORD` with the password you set for the database
- `your_32_character_random_session_secret_here` with a secure random string

## Step 5: Add Domain

1. **Go to your app service settings**
2. **Click "Domains" tab**
3. **Add your domain:** `yourdomain.com`
4. **Add www subdomain:** `www.yourdomain.com`
5. **Enable SSL** (EasyPanel does this automatically)

## Step 6: Deploy

1. **Click "Deploy" button**
2. **Wait 2-5 minutes for build to complete**
3. **Monitor logs in real-time**

## Step 7: Run Database Setup

After successful deployment:

1. **Go to your app service**
2. **Click "Console" tab**
3. **Run these commands:**

```bash
# Run database migrations
npm run db:push

# Run EasyPanel deployment script
npm run easypanel:deploy
```

## Step 8: Access Your Website

### Website
- **URL:** `https://yourdomain.com`
- **Features:** Landing page, templates, contact forms

### Admin Panel
- **URL:** `https://yourdomain.com/admin-login`
- **Default Login:** `admin` / `growfast2025`
- **⚠️ IMPORTANT:** Change password immediately!

## Step 9: Initial Configuration

### 1. Change Admin Password
1. Go to admin panel
2. Navigate to Settings
3. Change default password

### 2. Configure Email Settings
1. Go to admin panel → Email Settings
2. Set up SMTP for notifications
3. Test email connection

### 3. Customize Website
1. Go to admin panel → Content
2. Update site name, tagline, contact info
3. Customize theme colors

## Troubleshooting

### Build Fails
```bash
# Check build logs in EasyPanel
# Common issues:
- Verify all dependencies in package.json
- Check Node.js version (requires 18+)
- Ensure repository is public or has proper access
```

### Database Connection Error
```bash
# Verify environment variables
# Check database service status
# Confirm internal networking
```

### Domain Not Working
```bash
# Verify DNS settings point to server IP
# Check domain configuration in EasyPanel
# Ensure SSL certificate is generated
```

## Monitoring

### EasyPanel Dashboard
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory usage
- **Health:** Application status

### Application Health
- **Health Check:** `https://yourdomain.com/api/health`
- **Status:** Should return `{"status":"healthy"}`

## Security Checklist

- [ ] Changed default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Configured email settings
- [ ] Enabled SSL/HTTPS
- [ ] Set up regular backups
- [ ] Monitored application logs

## Support

### EasyPanel Support
- **Documentation:** https://easypanel.io/docs
- **Community:** https://discord.gg/easypanel

### Application Support
- **GitHub Issues:** Create issue in repository
- **Documentation:** Check README.md and guides

## Next Steps

1. **Customize Content:** Update website content via admin panel
2. **Add Templates:** Create new business automation templates
3. **Configure Analytics:** Set up Google Analytics and tracking
4. **Set Up Backups:** Configure automatic database backups
5. **Monitor Performance:** Use EasyPanel metrics to optimize

---

**🎉 Congratulations! Your GrowFastWithUs website is now live on EasyPanel!** 