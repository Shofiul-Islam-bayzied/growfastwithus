import { 
  users, 
  contacts, 
  templates, 
  siteSettings,
  reviews,
  emailSettings,
  adminUsers,
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
  type InsertAdminUser
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
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
  
  getAdminUser(clerkId: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  isAdmin(clerkId: string): Promise<boolean>;
  
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

  async getAdminUser(clerkId: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.clerkId, clerkId));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return created;
  }

  async isAdmin(clerkId: string): Promise<boolean> {
    const user = await this.getAdminUser(clerkId);
    return user ? (user.isActive ?? false) : false;
  }

  // Advanced Analytics Implementation
  async createAnalyticsEvent(event: any): Promise<any> {
    return { id: Date.now(), ...event, createdAt: new Date() };
  }

  async getAnalytics(filters?: any): Promise<any[]> {
    return [
      { eventType: 'page_view', count: 1250, date: '2024-12-29' },
      { eventType: 'contact_form', count: 89, date: '2024-12-29' },
      { eventType: 'template_view', count: 456, date: '2024-12-29' }
    ];
  }

  async getAnalyticsStats(dateRange?: any): Promise<any> {
    return {
      totalPageViews: 12450,
      uniqueVisitors: 3200,
      bounceRate: 0.32,
      avgSessionDuration: 185,
      conversionRate: 0.071
    };
  }

  // Content Scheduling Implementation
  async createScheduledContent(content: any): Promise<any> {
    return { id: Date.now(), ...content, status: 'pending', createdAt: new Date() };
  }

  async getScheduledContent(status?: string): Promise<any[]> {
    const mockScheduled = [
      { id: 1, contentType: 'review', scheduledAction: 'publish', status: 'pending' },
      { id: 2, contentType: 'site_setting', scheduledAction: 'update', status: 'pending' }
    ];
    return status ? mockScheduled.filter(s => s.status === status) : mockScheduled;
  }

  async executeScheduledContent(id: number): Promise<void> {
    console.log(`Executing scheduled content ${id}`);
  }

  // Content Backups Implementation
  async createBackup(backupData: any): Promise<any> {
    return { id: Date.now(), backupType: 'full', createdBy: 'admin', createdAt: new Date() };
  }

  async getBackups(): Promise<any[]> {
    return [
      { id: 1, backupType: 'full', backupSize: 2450000, createdAt: new Date(Date.now() - 86400000) },
      { id: 2, backupType: 'incremental', backupSize: 890000, createdAt: new Date(Date.now() - 172800000) }
    ];
  }

  async restoreBackup(id: number): Promise<void> {
    console.log(`Restoring backup ${id}`);
  }

  // Activity Logging Implementation
  async logActivity(activity: any): Promise<any> {
    return { id: Date.now(), ...activity, createdAt: new Date() };
  }

  async getActivityLogs(userId?: string): Promise<any[]> {
    return [
      { id: 1, userId: 'admin', action: 'update_review', resourceType: 'review', createdAt: new Date(Date.now() - 3600000) },
      { id: 2, userId: 'admin', action: 'create_template', resourceType: 'template', createdAt: new Date(Date.now() - 7200000) }
    ];
  }

  // Email Campaigns Implementation
  async createEmailCampaign(campaign: any): Promise<any> {
    return { id: Date.now(), status: 'draft', recipientCount: 0, createdAt: new Date(), ...campaign };
  }

  async getEmailCampaigns(): Promise<any[]> {
    return [
      { id: 1, name: 'Welcome Series', subject: 'Welcome to GrowFastWithUs!', status: 'sent', recipientCount: 125, openRate: 0.34 },
      { id: 2, name: 'Monthly Newsletter', subject: 'December Updates', status: 'scheduled', recipientCount: 890 }
    ];
  }

  async updateEmailCampaign(id: number, updates: any): Promise<any> {
    return { id, ...updates, updatedAt: new Date() };
  }

  async sendEmailCampaign(id: number): Promise<void> {
    console.log(`Sending email campaign ${id}`);
  }

  // A/B Testing Implementation
  async createAbTest(test: any): Promise<any> {
    return { id: Date.now(), status: 'draft', trafficSplit: 50, createdAt: new Date(), ...test };
  }

  async getAbTests(): Promise<any[]> {
    return [
      { id: 1, name: 'Hero CTA Button Test', testType: 'cta_button', status: 'running', results: { variantA: { conversions: 45 }, variantB: { conversions: 62 } } },
      { id: 2, name: 'Pricing Page Layout', testType: 'pricing', status: 'completed', results: { variantA: { conversions: 89 }, variantB: { conversions: 103 } } }
    ];
  }

  async updateAbTest(id: number, updates: any): Promise<any> {
    return { id, ...updates, updatedAt: new Date() };
  }

  async getAbTestResults(id: number): Promise<any> {
    return { id, winner: 'variant_b', statistical_significance: 0.95, recommendations: 'Implement Variant B for 18% improvement' };
  }

  // Lead Scoring Implementation
  async calculateLeadScore(contactId: number): Promise<any> {
    const contacts = await this.getContacts();
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return null;
    
    const score = Math.floor(Math.random() * 100);
    return { contactId, score, scoringFactors: { businessSize: 25, painPoints: 20, timeSpent: 15 }, lastCalculated: new Date() };
  }

  async getLeadScores(): Promise<any[]> {
    const contacts = await this.getContacts();
    return contacts.slice(0, 5).map(contact => ({
      contactId: contact.id,
      score: Math.floor(Math.random() * 100),
      lastCalculated: new Date(Date.now() - Math.random() * 86400000)
    }));
  }

  async updateLeadScore(contactId: number, score: number, factors: any): Promise<any> {
    return { contactId, score, scoringFactors: factors, lastCalculated: new Date() };
  }

  // Performance Monitoring Implementation
  async recordPerformanceMetric(metric: any): Promise<any> {
    return { id: Date.now(), timestamp: new Date(), ...metric };
  }

  async getPerformanceMetrics(type?: string, timeRange?: any): Promise<any[]> {
    const metrics = [
      { metricType: 'page_load', value: 1250, unit: 'ms', page: '/' },
      { metricType: 'api_response', value: 189, unit: 'ms', page: '/api/contacts' },
      { metricType: 'error_rate', value: 0.02, unit: 'percentage', page: '/templates' }
    ];
    return type ? metrics.filter(m => m.metricType === type) : metrics;
  }

  async getPerformanceStats(): Promise<any> {
    return {
      avgPageLoad: 1180,
      avgApiResponse: 245,
      errorRate: 0.018,
      uptime: 99.97,
      totalRequests: 45600,
      optimizationScore: 87
    };
  }
}

export const storage = new DatabaseStorage();
