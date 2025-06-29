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
  
  // Email Campaigns
  createEmailCampaign(campaign: any): Promise<any>;
  getEmailCampaigns(): Promise<any[]>;
  updateEmailCampaign(id: number, updates: any): Promise<any>;
  sendEmailCampaign(id: number): Promise<void>;
  
  // A/B Testing
  createAbTest(test: any): Promise<any>;
  getAbTests(): Promise<any[]>;
  updateAbTest(id: number, updates: any): Promise<any>;
  getAbTestResults(id: number): Promise<any>;
  
  // Lead Scoring
  calculateLeadScore(contactId: number): Promise<any>;
  getLeadScores(): Promise<any[]>;
  updateLeadScore(contactId: number, score: number, factors: any): Promise<any>;
  
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
}

export const storage = new DatabaseStorage();
