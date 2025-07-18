import { 
  users, 
  contacts, 
  templates, 
  siteSettings,
  reviews,
  emailSettings,
  adminUsers,
  trackingCodes,
  roles,
  permissions,
  userSessions,
  auditLogs,
  securityEvents,
  systemConfig,
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact, 
  type Template, 
  type InsertTemplate,
  type SiteSetting,
  type InsertSiteSetting,
  type Review,
  type InsertReview,
  type EmailSetting,
  type InsertEmailSetting,
  type AdminUser,
  type InsertAdminUser,
  type TrackingCode,
  type InsertTrackingCode,
  type Role,
  type InsertRole,
  type Permission,
  type InsertPermission,
  type UserSession,
  type InsertUserSession,
  type AuditLog,
  type InsertAuditLog,
  type SecurityEvent,
  type InsertSecurityEvent,
  type SystemConfig,
  type InsertSystemConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { MariaDBStorage } from './storage-mariadb';

export interface IStorage {
  // Existing methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Admin content management
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;
  
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  
  getEmailSettings(): Promise<EmailSetting | undefined>;
  updateEmailSettings(settings: InsertEmailSetting): Promise<EmailSetting>;
  
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  isAdmin(username: string): Promise<boolean>;
  
  // Advanced Analytics
  createAnalyticsEvent(event: any): Promise<any>;
  getAnalytics(filters?: any): Promise<any[]>;
  getAnalyticsStats(dateRange?: any): Promise<any>;
  
  // Content Scheduling
  createScheduledContent(content: any): Promise<any>;
  getScheduledContent(status?: string): Promise<any[]>;
  executeScheduledContent(id: number): Promise<void>;
  
  // Content Backups
  createBackup(backupData: any): Promise<any>;
  getBackups(): Promise<any[]>;
  restoreBackup(id: number): Promise<void>;
  
  // Activity Logging
  logActivity(activity: any): Promise<any>;
  getActivityLogs(userId?: string): Promise<any[]>;
  
  // Performance Monitoring
  recordPerformanceMetric(metric: any): Promise<any>;
  getPerformanceMetrics(type?: string, timeRange?: any): Promise<any[]>;
  getPerformanceStats(): Promise<any>;

  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  updateAdminUserPassword(id: number, newPasswordHash: string): Promise<void>;
  updateAdminUserFailedAttempts(id: number, failedAttempts: number): Promise<void>;
  updateAdminUserLocked(id: number, isLocked: boolean): Promise<void>;
  updateAdminUserLastLogin(id: number): Promise<void>;
  
  // Tracking Codes Management
  getTrackingCodes(): Promise<TrackingCode[]>;
  getTrackingCode(id: number): Promise<TrackingCode | undefined>;
  createTrackingCode(trackingCode: InsertTrackingCode): Promise<TrackingCode>;
  updateTrackingCode(id: number, trackingCode: Partial<InsertTrackingCode>): Promise<TrackingCode>;
  deleteTrackingCode(id: number): Promise<void>;
  getActiveTrackingCodes(): Promise<TrackingCode[]>;

  // New RBAC Methods
  getRoleById(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<InsertRole>): Promise<Role>;
  deleteRole(id: number): Promise<void>;
  getAllRoles(): Promise<Role[]>;
  getActiveRoles(): Promise<Role[]>;

  // Permission Methods
  getPermissionById(id: number): Promise<Permission | undefined>;
  getPermissionByName(name: string): Promise<Permission | undefined>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  updatePermission(id: number, permission: Partial<InsertPermission>): Promise<Permission>;
  deletePermission(id: number): Promise<void>;
  getAllPermissions(): Promise<Permission[]>;
  getPermissionsByResource(resource: string): Promise<Permission[]>;



  // Session Management
  getSessionByToken(sessionToken: string): Promise<UserSession | undefined>;
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  updateSessionActivity(sessionId: number): Promise<void>;
  updateSessionToken(sessionId: number, sessionToken: string, expiresAt: Date): Promise<void>;
  revokeSession(sessionId: number): Promise<void>;
  revokeSessionByToken(sessionToken: string): Promise<void>;
  revokeAllUserSessions(userId: number): Promise<void>;
  getActiveSessions(userId: number): Promise<UserSession[]>;
  cleanupExpiredSessions(): Promise<void>;

  // Audit Logging
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: any): Promise<AuditLog[]>;
  getAuditLogById(id: number): Promise<AuditLog | undefined>;
  deleteAuditLog(id: number): Promise<void>;
  cleanupOldAuditLogs(daysToKeep: number): Promise<void>;

  // Security Events
  createSecurityEvent(securityEvent: InsertSecurityEvent): Promise<SecurityEvent>;
  getSecurityEvents(filters?: any): Promise<SecurityEvent[]>;
  getSecurityEventById(id: number): Promise<SecurityEvent | undefined>;
  updateSecurityEvent(id: number, updates: Partial<InsertSecurityEvent>): Promise<SecurityEvent>;
  deleteSecurityEvent(id: number): Promise<void>;

  // System Configuration
  getSystemConfig(key: string): Promise<SystemConfig | undefined>;
  getAllSystemConfigs(): Promise<SystemConfig[]>;
  createSystemConfig(config: InsertSystemConfig): Promise<SystemConfig>;
  updateSystemConfig(key: string, value: string, updatedBy?: number): Promise<SystemConfig>;
  deleteSystemConfig(key: string): Promise<void>;
  getSystemConfigsByCategory(category: string): Promise<SystemConfig[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  // Admin content management methods
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteSettings)
        .values({ key, value })
        .returning();
      return created;
    }
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.isActive, true));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review> {
    const [updated] = await db
      .update(reviews)
      .set({ ...reviewData, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return updated;
  }

  async deleteReview(id: number): Promise<void> {
    await db.update(reviews)
      .set({ isActive: false })
      .where(eq(reviews.id, id));
  }

  async getEmailSettings(): Promise<EmailSetting | undefined> {
    const [settings] = await db.select().from(emailSettings).where(eq(emailSettings.isActive, true));
    return settings;
  }

  async updateEmailSettings(settings: InsertEmailSetting): Promise<EmailSetting> {
    const existing = await this.getEmailSettings();
    if (existing) {
      const [updated] = await db
        .update(emailSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(emailSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(emailSettings)
        .values(settings)
        .returning();
      return created;
    }
  }

  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [createdUser] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return createdUser;
  }

  async isAdmin(username: string): Promise<boolean> {
    const user = await this.getAdminUser(username);
    return user?.isActive || false;
  }

  // New RBAC Methods
  async getRoleById(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role || undefined;
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.name, name));
    return role || undefined;
  }

  async createRole(role: InsertRole): Promise<Role> {
    const [createdRole] = await db
      .insert(roles)
      .values(role)
      .returning();
    return createdRole;
  }

  async updateRole(id: number, roleData: Partial<InsertRole>): Promise<Role> {
    const [updated] = await db
      .update(roles)
      .set({ ...roleData, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return updated;
  }

  async deleteRole(id: number): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }

  async getAllRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async getActiveRoles(): Promise<Role[]> {
    return await db.select().from(roles).where(eq(roles.isActive, true));
  }

  // Permission Methods
  async getPermissionById(id: number): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id));
    return permission || undefined;
  }

  async getPermissionByName(name: string): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.name, name));
    return permission || undefined;
  }

  async createPermission(permission: InsertPermission): Promise<Permission> {
    const [createdPermission] = await db
      .insert(permissions)
      .values(permission)
      .returning();
    return createdPermission;
  }

  async updatePermission(id: number, permissionData: Partial<InsertPermission>): Promise<Permission> {
    const [updated] = await db
      .update(permissions)
      .set({ ...permissionData, updatedAt: new Date() })
      .where(eq(permissions.id, id))
      .returning();
    return updated;
  }

  async deletePermission(id: number): Promise<void> {
    await db.delete(permissions).where(eq(permissions.id, id));
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await db.select().from(permissions);
  }

  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    return await db.select().from(permissions).where(eq(permissions.resource, resource));
  }



  // Session Management
  async getSessionByToken(sessionToken: string): Promise<UserSession | undefined> {
    const [session] = await db.select().from(userSessions).where(eq(userSessions.sessionToken, sessionToken));
    return session || undefined;
  }

  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [created] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return created;
  }

  async updateSessionActivity(sessionId: number): Promise<void> {
    await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.id, sessionId));
  }

  async updateSessionToken(sessionId: number, sessionToken: string, expiresAt: Date): Promise<void> {
    await db
      .update(userSessions)
      .set({ sessionToken, expiresAt, updatedAt: new Date() })
      .where(eq(userSessions.id, sessionId));
  }

  async revokeSession(sessionId: number): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(userSessions.id, sessionId));
  }

  async revokeSessionByToken(sessionToken: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(userSessions.sessionToken, sessionToken));
  }

  async revokeAllUserSessions(userId: number): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(userSessions.userId, userId));
  }

  async getActiveSessions(userId: number): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.userId, userId), eq(userSessions.isActive, true)));
  }

  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    await db
      .update(userSessions)
      .set({ isActive: false, updatedAt: now })
      .where(lte(userSessions.expiresAt, now));
  }

  // Audit Logging
  async createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db
      .insert(auditLogs)
      .values(auditLog)
      .returning();
    return created;
  }

  async getAuditLogs(filters?: any): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    if (filters) {
      const conditions = [];
      if (filters.userId) conditions.push(eq(auditLogs.userId, filters.userId));
      if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
      if (filters.resourceType) conditions.push(eq(auditLogs.resourceType, filters.resourceType));
      if (filters.severity) conditions.push(eq(auditLogs.severity, filters.severity));
      if (filters.startDate) conditions.push(gte(auditLogs.createdAt, filters.startDate));
      if (filters.endDate) conditions.push(lte(auditLogs.createdAt, filters.endDate));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(auditLogs.createdAt);
  }

  async getAuditLogById(id: number): Promise<AuditLog | undefined> {
    const [log] = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
    return log || undefined;
  }

  async deleteAuditLog(id: number): Promise<void> {
    await db.delete(auditLogs).where(eq(auditLogs.id, id));
  }

  async cleanupOldAuditLogs(daysToKeep: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    await db.delete(auditLogs).where(lte(auditLogs.createdAt, cutoffDate));
  }

  // Security Events
  async createSecurityEvent(securityEvent: InsertSecurityEvent): Promise<SecurityEvent> {
    const [created] = await db
      .insert(securityEvents)
      .values(securityEvent)
      .returning();
    return created;
  }

  async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
    let query = db.select().from(securityEvents);
    
    if (filters) {
      const conditions = [];
      if (filters.userId) conditions.push(eq(securityEvents.userId, filters.userId));
      if (filters.eventType) conditions.push(eq(securityEvents.eventType, filters.eventType));
      if (filters.riskScore) conditions.push(eq(securityEvents.riskScore, filters.riskScore));
      if (filters.startDate) conditions.push(gte(securityEvents.createdAt, filters.startDate));
      if (filters.endDate) conditions.push(lte(securityEvents.createdAt, filters.endDate));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(securityEvents.createdAt);
  }

  async getSecurityEventById(id: number): Promise<SecurityEvent | undefined> {
    const [event] = await db.select().from(securityEvents).where(eq(securityEvents.id, id));
    return event || undefined;
  }

  async updateSecurityEvent(id: number, updates: Partial<InsertSecurityEvent>): Promise<SecurityEvent> {
    const [updated] = await db
      .update(securityEvents)
      .set(updates)
      .where(eq(securityEvents.id, id))
      .returning();
    return updated;
  }

  async deleteSecurityEvent(id: number): Promise<void> {
    await db.delete(securityEvents).where(eq(securityEvents.id, id));
  }

  // System Configuration
  async getSystemConfig(key: string): Promise<SystemConfig | undefined> {
    const [config] = await db.select().from(systemConfig).where(eq(systemConfig.key, key));
    return config || undefined;
  }

  async getAllSystemConfigs(): Promise<SystemConfig[]> {
    return await db.select().from(systemConfig);
  }

  async createSystemConfig(config: InsertSystemConfig): Promise<SystemConfig> {
    const [created] = await db
      .insert(systemConfig)
      .values(config)
      .returning();
    return created;
  }

  async updateSystemConfig(key: string, value: string, updatedBy?: number): Promise<SystemConfig> {
    const existing = await this.getSystemConfig(key);
    if (existing) {
      const [updated] = await db
        .update(systemConfig)
        .set({ value, updatedBy, updatedAt: new Date() })
        .where(eq(systemConfig.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(systemConfig)
        .values({ key, value, updatedBy })
        .returning();
      return created;
    }
  }

  async deleteSystemConfig(key: string): Promise<void> {
    await db.delete(systemConfig).where(eq(systemConfig.key, key));
  }

  async getSystemConfigsByCategory(category: string): Promise<SystemConfig[]> {
    return await db.select().from(systemConfig).where(eq(systemConfig.category, category));
  }

  // Existing methods (keeping for compatibility)
  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async updateAdminUserPassword(id: number, newPasswordHash: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ 
        password: newPasswordHash, 
        lastPasswordChange: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(adminUsers.id, id));
  }

  async updateAdminUserFailedAttempts(id: number, failedAttempts: number): Promise<void> {
    await db
      .update(adminUsers)
      .set({ 
        failedLoginAttempts: failedAttempts,
        updatedAt: new Date() 
      })
      .where(eq(adminUsers.id, id));
  }

  async updateAdminUserLocked(id: number, isLocked: boolean): Promise<void> {
    await db
      .update(adminUsers)
      .set({ 
        isLocked,
        updatedAt: new Date() 
      })
      .where(eq(adminUsers.id, id));
  }

  async updateAdminUserLastLogin(id: number): Promise<void> {
    await db
      .update(adminUsers)
      .set({ 
        lastLogin: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(adminUsers.id, id));
  }

  async getTrackingCodes(): Promise<TrackingCode[]> {
    return await db.select().from(trackingCodes);
  }

  async getTrackingCode(id: number): Promise<TrackingCode | undefined> {
    const [code] = await db.select().from(trackingCodes).where(eq(trackingCodes.id, id));
    return code || undefined;
  }

  async createTrackingCode(trackingCode: InsertTrackingCode): Promise<TrackingCode> {
      const [created] = await db
        .insert(trackingCodes)
        .values(trackingCode)
        .returning();
      return created;
  }

  async updateTrackingCode(id: number, trackingCodeData: Partial<InsertTrackingCode>): Promise<TrackingCode> {
      const [updated] = await db
        .update(trackingCodes)
        .set({ ...trackingCodeData, updatedAt: new Date() })
        .where(eq(trackingCodes.id, id))
        .returning();
      return updated;
  }

  async deleteTrackingCode(id: number): Promise<void> {
      await db.delete(trackingCodes).where(eq(trackingCodes.id, id));
  }

  async getActiveTrackingCodes(): Promise<TrackingCode[]> {
      return await db.select().from(trackingCodes).where(eq(trackingCodes.isActive, true));
  }

  // Placeholder methods for compatibility
  async createAnalyticsEvent(event: any): Promise<any> {
    // Implementation for analytics events
    return event;
  }

  async getAnalytics(filters?: any): Promise<any[]> {
    // Implementation for analytics
    return [];
  }

  async getAnalyticsStats(dateRange?: any): Promise<any> {
    // Implementation for analytics stats
    return {};
  }

  async createScheduledContent(content: any): Promise<any> {
    // Implementation for scheduled content
    return content;
  }

  async getScheduledContent(status?: string): Promise<any[]> {
    // Implementation for scheduled content
    return [];
  }

  async executeScheduledContent(id: number): Promise<void> {
    // Implementation for executing scheduled content
  }

  async createBackup(backupData: any): Promise<any> {
    // Implementation for backups
    return backupData;
  }

  async getBackups(): Promise<any[]> {
    // Implementation for backups
    return [];
  }

  async restoreBackup(id: number): Promise<void> {
    // Implementation for backup restoration
  }

  async logActivity(activity: any): Promise<any> {
    // Implementation for activity logging
    return activity;
  }

  async getActivityLogs(userId?: string): Promise<any[]> {
    // Implementation for activity logs
    return [];
  }

  async recordPerformanceMetric(metric: any): Promise<any> {
    // Implementation for performance metrics
    return metric;
  }

  async getPerformanceMetrics(type?: string, timeRange?: any): Promise<any[]> {
    // Implementation for performance metrics
    return [];
  }

  async getPerformanceStats(): Promise<any> {
    // Implementation for performance stats
    return {};
  }
}

// Export the storage instance
export const storage = new DatabaseStorage();
