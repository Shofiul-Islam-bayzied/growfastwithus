#!/bin/bash

# EasyPanel Deployment Script for GrowFastWithUs
# This script handles the initial setup and database migrations

set -e

echo "🚀 Starting EasyPanel deployment for GrowFastWithUs..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to generate random string
generate_random_string() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to wait for database to be ready
wait_for_database() {
    echo "⏳ Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if node -e "
            const { Client } = require('pg');
            const client = new Client({
                host: process.env.PGHOST || 'growfastwithus-db',
                port: process.env.PGPORT || 5432,
                user: process.env.PGUSER || 'growfast',
                password: process.env.PGPASSWORD,
                database: process.env.PGDATABASE || 'growfastwithus'
            });
            
            client.connect()
                .then(() => {
                    console.log('Database connection successful');
                    process.exit(0);
                })
                .catch(err => {
                    console.log('Database connection failed:', err.message);
                    process.exit(1);
                });
        " 2>/dev/null; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - Database not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Database connection failed after $max_attempts attempts"
    return 1
}

# Function to run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    
    if npm run db:push; then
        echo "✅ Database migrations completed successfully"
    else
        echo "❌ Database migrations failed"
        return 1
    fi
}

# Function to create initial admin user
create_initial_admin() {
    echo "👤 Setting up initial admin user..."
    
    # Create admin user with default credentials
    node -e "
        const bcrypt = require('bcryptjs');
        const { db } = require('./server/db');
        const { adminUsers } = require('./shared/schema');
        
        async function createAdmin() {
            try {
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
                
                console.log('Admin user created successfully');
                process.exit(0);
            } catch (error) {
                if (error.code === '23505') {
                    console.log('Admin user already exists');
                    process.exit(0);
                } else {
                    console.error('Error creating admin user:', error);
                    process.exit(1);
                }
            }
        }
        
        createAdmin();
    " 2>/dev/null || echo "⚠️ Admin user setup completed (may already exist)"
}

# Function to create initial site settings
create_initial_settings() {
    echo "⚙️ Setting up initial site settings..."
    
    node -e "
        const { db } = require('./server/db');
        const { siteSettings } = require('./shared/schema');
        
        async function createSettings() {
            try {
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
                
                console.log('Site settings created successfully');
                process.exit(0);
            } catch (error) {
                console.error('Error creating site settings:', error);
                process.exit(1);
            }
        }
        
        createSettings();
    " 2>/dev/null || echo "⚠️ Site settings setup completed"
}

# Function to verify application health
verify_health() {
    echo "🏥 Verifying application health..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            echo "✅ Application is healthy and running!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - Application not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "❌ Application health check failed after $max_attempts attempts"
    return 1
}

# Main deployment process
main() {
    echo "🔧 Starting deployment process..."
    
    # Wait for database
    if ! wait_for_database; then
        echo "❌ Database connection failed"
        exit 1
    fi
    
    # Run migrations
    if ! run_migrations; then
        echo "❌ Database migrations failed"
        exit 1
    fi
    
    # Create initial admin user
    create_initial_admin
    
    # Create initial site settings
    create_initial_settings
    
    # Verify application health
    if verify_health; then
        echo "🎉 Deployment completed successfully!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Visit your domain to see the website"
        echo "2. Go to /admin-login to access admin panel"
        echo "3. Login with: admin / growfast2025"
        echo "4. Change the default password immediately"
        echo "5. Configure your email settings"
        echo ""
        echo "🔗 Admin Panel: https://yourdomain.com/admin-login"
        echo "🔗 Website: https://yourdomain.com"
    else
        echo "❌ Application health check failed"
        exit 1
    fi
}

# Run main function
main "$@" 