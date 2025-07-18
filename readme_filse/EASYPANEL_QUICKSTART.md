# EasyPanel Quick Start Guide

Deploy your GrowFast website to EasyPanel in under 10 minutes!

## 🚀 One-Click Deployment

### Step 1: Prepare Your EasyPanel
- Ensure EasyPanel is installed on your server
- Have your domain name ready
- Log into EasyPanel dashboard

### Step 2: Create Project
1. Click **"Create New Project"**
2. Name: `growfast-website`
3. Choose **"Docker Compose"**

### Step 3: Upload Configuration
Copy and paste the contents of `docker-compose.easypanel.yml` into the compose editor.

### Step 4: Set Environment Variables
```bash
# Required - Set these in EasyPanel Environment section:
DB_PASSWORD=YourSecurePassword123!
SESSION_SECRET=your_32_character_session_secret_here_
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here

# Email (choose your provider):
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_api_key
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes for build completion
3. Check logs for any errors

### Step 6: Configure Domain
1. Go to **"Domains"** tab
2. Add your domain name
3. Point to `app` service, port `3000`
4. Save (SSL is automatic!)

### Step 7: Initialize Database
1. Open **"Console"** for the app service
2. Run: `npm run db:push`
3. Your database is now ready!

## ✅ Verification Checklist

- [ ] All services are running (green status)
- [ ] Domain points to your app
- [ ] SSL certificate is active (https://)
- [ ] Health check passes: `https://yourdomain.com/api/health`
- [ ] Admin panel accessible: `https://yourdomain.com/admin`
- [ ] Test user registration/login
- [ ] Email functionality works

## 🎯 Next Steps

1. **Admin Setup**: Create your first admin user
2. **Customize**: Update site settings and templates
3. **Test**: Verify all features work as expected
4. **Monitor**: Check EasyPanel logs and metrics

## 🆘 Need Help?

- Check [EASYPANEL_DEPLOY.md](EASYPANEL_DEPLOY.md) for detailed instructions
- Review EasyPanel logs in the dashboard
- Verify environment variables are set correctly
- Ensure database service is healthy

**Deployment Time**: 5-10 minutes  
**Difficulty**: Beginner-friendly  
**Requirements**: EasyPanel server + domain name 