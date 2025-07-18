# Deploy GrowFast Website to EasyPanel

This guide will help you deploy your GrowFast website to EasyPanel easily.

## Prerequisites

1. **EasyPanel Server**: Make sure you have EasyPanel installed on your server
2. **Domain**: Have a domain name ready to point to your application
3. **GitHub Repository**: Your code should be in a GitHub repository for auto-deployment

## Method 1: Using Docker Compose (Recommended)

### Step 1: Create New Project in EasyPanel

1. Log into your EasyPanel dashboard
2. Click **"Create New Project"**
3. Name your project: `growfast-website`
4. Select **"Docker Compose"** as the service type

### Step 2: Configure Docker Compose

1. In the Docker Compose section, paste the contents of `docker-compose.easypanel.yml`
2. Or upload the `docker-compose.easypanel.yml` file directly

### Step 3: Set Environment Variables

In EasyPanel, configure these environment variables:

**Required Variables:**
```bash
# Database
DB_PASSWORD=your_secure_database_password_here

# Session Security
SESSION_SECRET=your_32_character_session_secret_here

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Email Configuration (choose one)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_email@example.com
SMTP_PASS=your_brevo_smtp_key

# Domain (will be auto-filled by EasyPanel)
PRIMARY_DOMAIN=your-domain.com
```

**Optional Variables:**
```bash
DEBUG=false
NODE_ENV=production
```

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for the build and deployment process (usually 2-5 minutes)
3. Monitor the logs for any issues

### Step 5: Configure Domain

1. Go to **"Domains"** section in your project
2. Add your domain name
3. Point it to the `app` service on port `3000`
4. EasyPanel will automatically configure SSL certificates

## Method 2: Using App Service + Database Service

### Step 1: Create Database Service

1. Create a new **PostgreSQL Service**
2. Configure:
   - **Name**: `growfast-db`
   - **Database**: `growfastwithus`
   - **Username**: `growfast`
   - **Password**: Use a secure password

### Step 2: Create App Service

1. Create a new **App Service**
2. Configure source:
   - **GitHub Repository**: Your repository URL
   - **Branch**: `main` (or your preferred branch)
   - **Build Path**: `/` (root directory)
   - **Dockerfile**: Use `Dockerfile.easypanel`

### Step 3: Configure App Environment

Set these environment variables in the App service:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://growfast:YOUR_DB_PASSWORD@growfast-db:5432/growfastwithus
SESSION_SECRET=your_32_character_session_secret
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
FRONTEND_URL=https://your-domain.com
PGHOST=growfast-db
PGPORT=5432
PGUSER=growfast
PGPASSWORD=YOUR_DB_PASSWORD
PGDATABASE=growfastwithus
```

### Step 4: Configure Domain & Proxy

1. Add your domain in the **"Domains"** section
2. Set **Proxy Port**: `3000`
3. Enable **HTTPS** (EasyPanel handles SSL automatically)

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_PASSWORD` | PostgreSQL database password | `SecurePass123!` |
| `SESSION_SECRET` | 32-character secret for sessions | `your_32_char_secret_here_12345678` |
| `CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk authentication secret key | `sk_test_...` |
| `SMTP_HOST` | Email server hostname | `smtp-relay.brevo.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@domain.com` |
| `SMTP_PASS` | Email password/API key | `your-smtp-key` |

## Post-Deployment Setup

### 1. Database Migration

After first deployment, run database migrations:

1. Go to **"Console"** in your app service
2. Run: `npm run db:push`

### 2. Test Your Application

1. Visit your domain
2. Test user registration/login
3. Verify email functionality
4. Check all major features

### 3. Enable Auto-Deploy (Optional)

1. In your App service, go to **"Auto Deploy"**
2. Enable it to automatically deploy when you push to GitHub

## Troubleshooting

### Common Issues:

**Database Connection Issues:**
- Verify database service is running
- Check environment variables are correct
- Ensure services can communicate

**Build Failures:**
- Check if all dependencies are in `package.json`
- Verify Dockerfile syntax
- Check build logs for specific errors

**Email Not Working:**
- Verify SMTP credentials
- Check if SMTP provider allows your server IP
- Test with a different SMTP provider

**Application Won't Start:**
- Check health check endpoint `/api/health`
- Verify PORT environment variable is set to 3000
- Check application logs for errors

### Getting Help:

1. Check EasyPanel logs in the dashboard
2. Use the console to debug inside containers
3. Review this project's GitHub issues
4. Contact EasyPanel support if needed

## Updating Your Application

To update your deployed application:

1. **With Auto-Deploy**: Just push to your GitHub repository
2. **Manual Deploy**: Click the deploy button in EasyPanel
3. **Environment Changes**: Update variables and redeploy

## Backup Strategy

EasyPanel provides automatic backups for:
- Database volumes
- Application logs
- Configuration

Configure backup schedules in the EasyPanel dashboard under **"Backups"**.

---

**Need help?** Check the [EasyPanel Documentation](https://easypanel.io/docs) or create an issue in this repository. 