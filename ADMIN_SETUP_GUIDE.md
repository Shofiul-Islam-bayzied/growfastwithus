# Admin Panel Setup Guide

## 🔐 Admin Access

### Login Credentials
- **Username:** `growfast_admin`
- **Password:** `GrowFast2025!Admin`
- **Login URL:** `http://localhost:5000/admin-login`

### Admin Panel Features
- Content Management
- Contact Form Submissions
- Email Settings Configuration
- Theme Customization
- Analytics Dashboard
- Tracking Codes Management

## 📧 Email Configuration (SMTP)

### Option 1: Brevo (Recommended - Free Tier)

Brevo offers 300 emails/day for free with excellent deliverability.

**Setup Steps:**
1. Sign up at [brevo.com](https://brevo.com)
2. Go to **SMTP & API** → **SMTP keys**
3. Create a new SMTP key
4. Update your `.env` file:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_login_email@example.com
SMTP_PASS=your_smtp_key_here
```

### Option 2: Gmail SMTP

**Setup Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_digit_app_password
```

### Option 3: Other SMTP Providers

**Popular Free Options:**
- **SendGrid:** 100 emails/day free
- **Mailgun:** 5,000 emails/month free for 3 months
- **Amazon SES:** Pay-as-you-go, very cheap

## 🛠️ Configuration Files

### Environment Variables (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_EvMIlCrL47Yx@ep-little-voice-aeekmg7d-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your_32_character_session_secret_here_for_development

# SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password_or_key

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

## 🚀 Quick Start

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```

2. **Access Admin Panel:**
   - Open: `http://localhost:5000/admin-login`
   - Login with: `growfast_admin` / `GrowFast2025!Admin`

3. **Configure Email Settings:**
   - Go to Admin Panel → Email Settings
   - Test your SMTP configuration
   - Set up email templates

## 📊 Admin Panel Sections

### 📝 Content Management
- Edit homepage content
- Manage service descriptions
- Update pricing information
- Configure call-to-action buttons

### 📬 Contact Management
- View all contact form submissions
- Export contact data
- Respond to inquiries
- Manage customer database

### 🎨 Theme Customization
- Change colors and branding
- Upload custom logos
- Modify layout settings
- Preview changes in real-time

### 📈 Analytics & Tracking
- View website statistics
- Configure Google Analytics
- Add custom tracking codes
- Monitor user engagement

### ⚙️ Email Settings
- Configure SMTP server
- Set up email templates
- Test email delivery
- Manage automated responses

## 🔒 Security Features

- **Session-based Authentication:** Secure login sessions
- **Password Protection:** Strong password requirements
- **Admin-only Access:** Role-based access control
- **Secure Database:** Encrypted data storage

## 🆘 Troubleshooting

### Login Issues
- Clear browser cookies
- Ensure correct username/password
- Check server logs for errors

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Test with different email provider
- Review server logs

### Database Connection
- Verify DATABASE_URL is correct
- Check Neon database status
- Run `npm run db:push` to sync schema

## 📞 Support

For technical support or questions:
- Check the server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure database connection is active
- Test SMTP configuration with a simple email

---

**Note:** Keep your admin credentials secure and consider changing them for production use. 