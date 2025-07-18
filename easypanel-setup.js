#!/usr/bin/env node

/**
 * EasyPanel Setup Script for GrowFastWithUs
 * Run this script from EasyPanel console after deployment
 */

const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

console.log('🚀 Starting EasyPanel setup for GrowFastWithUs...');

// Function to run database migrations
async function runMigrations() {
    try {
        console.log('🗄️ Running database migrations...');
        execSync('npm run db:push', { stdio: 'inherit' });
        console.log('✅ Database migrations completed');
        return true;
    } catch (error) {
        console.error('❌ Database migrations failed:', error.message);
        return false;
    }
}

// Function to create initial admin user
async function createAdminUser() {
    try {
        console.log('👤 Creating initial admin user...');
        
        const { db } = require('./server/db');
        const { adminUsers } = require('./shared/schema');
        
        const hashedPassword = await bcrypt.hash('growfast2025', 10);
        
        await db.insert(adminUsers).values({
            username: 'admin',
            email: 'admin@growfastwithus.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            roleId: 1,
            isActive: true
        });
        
        console.log('✅ Admin user created successfully');
        console.log('📋 Default login: admin / growfast2025');
        console.log('⚠️  IMPORTANT: Change password immediately!');
        return true;
    } catch (error) {
        if (error.code === '23505') {
            console.log('ℹ️  Admin user already exists');
            return true;
        } else {
            console.error('❌ Error creating admin user:', error.message);
            return false;
        }
    }
}

// Function to create initial site settings
async function createSiteSettings() {
    try {
        console.log('⚙️  Creating initial site settings...');
        
        const { db } = require('./server/db');
        const { siteSettings } = require('./shared/schema');
        
        const defaultSettings = [
            { key: 'site_name', value: 'GrowFastWithUs', type: 'text', category: 'general' },
            { key: 'tagline', value: 'Automate Your Business Growth', type: 'text', category: 'general' },
            { key: 'contact_email', value: 'contact@growfastwithus.com', type: 'text', category: 'contact' },
            { key: 'phone', value: '+1 (555) 123-4567', type: 'text', category: 'contact' },
            { key: 'address', value: '123 Business St, Suite 100, City, State 12345', type: 'text', category: 'contact' },
            { key: 'meta_description', value: 'Leading automation agency helping businesses grow faster with AI-powered workflows and no-code solutions.', type: 'text', category: 'seo' },
            { key: 'hero_title', value: 'Grow Your Business Faster with Automation', type: 'text', category: 'content' },
            { key: 'hero_subtitle', value: 'Transform your operations with AI-powered workflows and no-code automation solutions', type: 'text', category: 'content' },
            { key: 'primary_color', value: '#3B82F6', type: 'color', category: 'theme' },
            { key: 'secondary_color', value: '#1E40AF', type: 'color', category: 'theme' },
            { key: 'accent_color', value: '#F59E0B', type: 'color', category: 'theme' }
        ];
        
        for (const setting of defaultSettings) {
            await db.insert(siteSettings).values(setting)
                .onConflictDoNothing();
        }
        
        console.log('✅ Site settings created successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating site settings:', error.message);
        return false;
    }
}

// Function to verify application health
async function verifyHealth() {
    try {
        console.log('🏥 Verifying application health...');
        
        const http = require('http');
        
        return new Promise((resolve) => {
            const req = http.get('http://localhost:3000/api/health', (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ Application is healthy and running!');
                    resolve(true);
                } else {
                    console.log(`❌ Application health check failed: ${res.statusCode}`);
                    resolve(false);
                }
            });
            
            req.on('error', (error) => {
                console.log(`❌ Application health check failed: ${error.message}`);
                resolve(false);
            });
            
            req.setTimeout(5000, () => {
                console.log('❌ Application health check timeout');
                resolve(false);
            });
        });
    } catch (error) {
        console.error('❌ Health check error:', error.message);
        return false;
    }
}

// Main setup function
async function setup() {
    console.log('🔧 Starting EasyPanel setup...');
    
    // Run migrations
    if (!(await runMigrations())) {
        console.error('❌ Setup failed at migrations step');
        process.exit(1);
    }
    
    // Create admin user
    if (!(await createAdminUser())) {
        console.error('❌ Setup failed at admin user creation');
        process.exit(1);
    }
    
    // Create site settings
    if (!(await createSiteSettings())) {
        console.error('❌ Setup failed at site settings creation');
        process.exit(1);
    }
    
    // Wait a moment for application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify health
    if (await verifyHealth()) {
        console.log('');
        console.log('🎉 EasyPanel setup completed successfully!');
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. Visit your domain to see the website');
        console.log('2. Go to /admin-login to access admin panel');
        console.log('3. Login with: admin / growfast2025');
        console.log('4. Change the default password immediately');
        console.log('5. Configure your email settings');
        console.log('');
        console.log('🔗 Admin Panel: https://yourdomain.com/admin-login');
        console.log('🔗 Website: https://yourdomain.com');
    } else {
        console.log('⚠️  Setup completed but health check failed');
        console.log('💡 The application may need more time to start');
        console.log('💡 Check EasyPanel logs for more details');
    }
}

// Run setup
setup().catch((error) => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
}); 