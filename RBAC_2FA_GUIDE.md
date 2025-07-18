# RBAC & 2FA System Implementation Guide

## Overview

This implementation provides a comprehensive Role-Based Access Control (RBAC) and Two-Factor Authentication (2FA) system for the GrowFast admin panel. The system includes:

- **RBAC (Role-Based Access Control)**: Fine-grained permission system with roles and permissions
- **2FA (Two-Factor Authentication)**: TOTP-based authentication with backup codes
- **Session Management**: Secure session handling with concurrent session limits
- **Audit Logging**: Comprehensive security event tracking
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Enhanced security with proper HTTP headers

## Database Schema

### Core Tables

#### `admin_users`
- Enhanced user management with role-based access
- Account locking after failed login attempts
- Password expiration and change tracking

#### `roles`
- Role definitions with permissions
- System roles (cannot be deleted)
- Active/inactive status

#### `permissions`
- Granular permissions for resources and actions
- JSON conditions for fine-grained control
- Resource-based organization

#### `two_factor_auth`
- TOTP secret storage
- Backup codes management
- Enable/disable status

#### `user_sessions`
- Session token management
- IP address and user agent tracking
- Expiration and activity tracking

#### `audit_logs`
- Comprehensive activity logging
- Old/new value tracking
- Severity and status classification

#### `security_events`
- Security incident tracking
- Risk scoring
- IP blocking capabilities

#### `system_config`
- System configuration management
- Sensitive data handling
- Category-based organization

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/login`
- Username/password authentication
- 2FA code verification (if enabled)
- Session creation with secure cookies
- Account locking after failed attempts

**Request:**
```json
{
  "username": "admin",
  "password": "securepassword",
  "totpCode": "123456" // Optional if 2FA enabled
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

#### POST `/api/auth/register`
- User registration (admin only)
- Password policy validation
- Role assignment

#### POST `/api/auth/change-password`
- Password change with current password verification
- 2FA verification (if enabled)
- Session revocation for security

#### POST `/api/auth/2fa/setup`
- Initialize 2FA setup
- Generate TOTP secret and QR code
- Create backup codes

#### POST `/api/auth/2fa/enable`
- Enable 2FA with verification code
- Update user status

#### POST `/api/auth/2fa/disable`
- Disable 2FA with verification code
- Remove 2FA requirement

#### GET `/api/auth/me`
- Get current user information
- Include role and permissions
- 2FA status

### Admin Management (`/api/admin`)

#### Role Management
- `GET /api/admin/roles` - List all roles
- `GET /api/admin/roles/:id` - Get role details
- `POST /api/admin/roles` - Create new role
- `PUT /api/admin/roles/:id` - Update role
- `DELETE /api/admin/roles/:id` - Delete role

#### Permission Management
- `GET /api/admin/permissions` - List all permissions
- `GET /api/admin/permissions/resource/:resource` - Get permissions by resource

#### User Management
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user

#### System Configuration
- `GET /api/admin/config` - Get system configuration
- `PUT /api/admin/config/:key` - Update configuration

#### Audit & Security
- `GET /api/admin/audit-logs` - Get audit logs
- `GET /api/admin/security-events` - Get security events
- `GET /api/admin/sessions` - Get user sessions
- `DELETE /api/admin/sessions/:id` - Revoke session

## RBAC Permissions

### Permission Structure
Permissions follow the format: `resource:action`

### Available Permissions

#### User Management
- `user:create` - Create users
- `user:read` - View user information
- `user:update` - Update user details
- `user:delete` - Delete users
- `user:manage` - Full user management

#### Role Management
- `role:create` - Create roles
- `role:read` - View roles
- `role:update` - Update roles
- `role:delete` - Delete roles
- `role:manage` - Full role management

#### Content Management
- `content:create` - Create content
- `content:read` - View content
- `content:update` - Update content
- `content:delete` - Delete content
- `content:publish` - Publish content

#### System Administration
- `system:config` - Manage system configuration
- `system:backup` - Create backups
- `system:restore` - Restore from backups
- `system:logs` - View system logs

#### Security
- `security:audit` - View audit logs
- `security:2fa` - Manage 2FA
- `security:sessions` - Manage user sessions

#### Analytics
- `analytics:view` - View analytics
- `analytics:export` - Export analytics data

#### Super Admin
- `super:admin` - Full system access

## Default Roles

### Super Administrator
- **Description**: Full system access with all permissions
- **Permissions**: All permissions
- **Use Case**: System administrators

### Administrator
- **Description**: System administration with most permissions
- **Permissions**: User management, content management, system config, analytics, security audit
- **Use Case**: Senior administrators

### Manager
- **Description**: Content and user management
- **Permissions**: User read/update, content management, analytics view
- **Use Case**: Team leads

### Editor
- **Description**: Content creation and editing
- **Permissions**: Content create/read/update, analytics view
- **Use Case**: Content creators

### Viewer
- **Description**: Read-only access to content and analytics
- **Permissions**: Content read, analytics view
- **Use Case**: Stakeholders

## Security Features

### Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Account Protection
- **Failed Login Attempts**: 5 attempts before lockout
- **Account Lockout**: Temporary lock after failed attempts
- **Session Limits**: Configurable concurrent session limit
- **Session Expiration**: 24-hour session timeout

### Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes
- **API Endpoints**: Configurable per endpoint
- **IP-based**: Prevents brute force attacks

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy`: Restrictive CSP

## Audit Logging

### Logged Events
- **Authentication**: Login, logout, failed attempts
- **User Management**: Create, update, delete users
- **Role Management**: Create, update, delete roles
- **Content Management**: Create, update, delete content
- **System Changes**: Configuration updates
- **Security Events**: 2FA changes, session management

### Log Details
- **User ID**: Who performed the action
- **Action**: What was done
- **Resource**: What was affected
- **Old/New Values**: Before and after states
- **IP Address**: Source of the action
- **User Agent**: Browser/client information
- **Severity**: Info, warning, error, critical
- **Status**: Success, failure, pending

## Usage Examples

### Creating a New Role
```javascript
const response = await fetch('/api/admin/roles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({
    name: 'Content Manager',
    description: 'Manages content and reviews',
    permissions: [
      'content:create',
      'content:read',
      'content:update',
      'content:publish',
      'analytics:view'
    ]
  })
});
```

### Setting Up 2FA
```javascript
// 1. Setup 2FA
const setupResponse = await fetch('/api/auth/2fa/setup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionToken}`
  }
});
const { secret, qrCodeUrl, backupCodes } = await setupResponse.json();

// 2. User scans QR code and gets TOTP code
const enableResponse = await fetch('/api/auth/2fa/enable', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({
    totpCode: '123456' // From authenticator app
  })
});
```

### Checking Permissions
```javascript
// Middleware automatically checks permissions
const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${sessionToken}`
  }
});
// Returns 403 if user doesn't have user:read permission
```

## Configuration

### Environment Variables
```bash
# JWT Secret for session tokens
JWT_SECRET=your-secure-jwt-secret

# Session configuration
SESSION_SECRET=your-session-secret

# Database configuration
DATABASE_URL=your-database-url

# Security settings
MAX_CONCURRENT_SESSIONS=3
LOGIN_ATTEMPT_LIMIT=5
SESSION_TIMEOUT=86400000 # 24 hours
```

### System Configuration
```javascript
// Set system configuration
await fetch('/api/admin/config/max_concurrent_sessions', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify({ value: '5' })
});
```

## Best Practices

### Security
1. **Use HTTPS**: Always use HTTPS in production
2. **Strong Passwords**: Enforce password policy
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Logs**: Regularly review audit logs
5. **Backup Codes**: Store backup codes securely

### RBAC Design
1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Role Hierarchy**: Design logical role progression
3. **Regular Reviews**: Audit user permissions regularly
4. **Documentation**: Document role purposes and permissions

### 2FA Implementation
1. **User Education**: Train users on 2FA usage
2. **Backup Strategy**: Ensure backup codes are available
3. **Grace Period**: Allow time for 2FA setup
4. **Recovery Process**: Have account recovery procedures

## Troubleshooting

### Common Issues

#### 2FA Setup Fails
- Check TOTP secret generation
- Verify QR code format
- Ensure authenticator app compatibility

#### Permission Denied
- Check user role assignment
- Verify permission configuration
- Review role permissions

#### Session Issues
- Check session token validity
- Verify cookie settings
- Review session expiration

#### Database Errors
- Check database connection
- Verify schema migrations
- Review table structure

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=rbac:*
```

## Migration Guide

### From Simple Auth to RBAC
1. **Backup Data**: Export existing user data
2. **Run Migrations**: Apply new database schema
3. **Create Default Roles**: Initialize RBAC system
4. **Assign Roles**: Map existing users to roles
5. **Test Permissions**: Verify access control
6. **Enable 2FA**: Gradually enable 2FA for users

### Schema Updates
```sql
-- Add new tables for RBAC
CREATE TABLE roles (...);
CREATE TABLE permissions (...);
CREATE TABLE two_factor_auth (...);
CREATE TABLE user_sessions (...);
CREATE TABLE audit_logs (...);
CREATE TABLE security_events (...);
CREATE TABLE system_config (...);
```

## Performance Considerations

### Database Optimization
- Index frequently queried columns
- Use connection pooling
- Implement query caching
- Regular database maintenance

### Session Management
- Implement session cleanup jobs
- Use Redis for session storage (optional)
- Monitor session table size

### Audit Logging
- Implement log rotation
- Archive old logs
- Monitor log table size
- Use separate database for logs (optional)

## Monitoring and Alerting

### Key Metrics
- **Login Success Rate**: Monitor authentication success
- **Failed Login Attempts**: Track security incidents
- **Session Activity**: Monitor user activity
- **Permission Denials**: Track access control effectiveness

### Alerts
- **Multiple Failed Logins**: Alert on potential attacks
- **Unusual Access Patterns**: Detect anomalies
- **System Configuration Changes**: Monitor admin actions
- **2FA Disable Events**: Track security changes

## Conclusion

This RBAC and 2FA system provides enterprise-grade security for the GrowFast admin panel. The implementation includes comprehensive audit logging, flexible permission management, and robust 2FA support. The system is designed to be scalable, maintainable, and secure.

For additional support or customization, refer to the codebase documentation or contact the development team. 