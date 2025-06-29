import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  industry: text("industry"),
  businessSize: text("business_size"),
  painPoints: text("pain_points").array(),
  timeSpent: integer("time_spent"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  features: text("features").array(),
  image: text("image"),
  popular: boolean("popular").default(false),
});

// Admin content management tables
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).notNull().default('text'), // text, json, url, color, boolean
  category: varchar("category", { length: 100 }).notNull().default('general'),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  image: varchar("image", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emailSettings = pgTable("email_settings", {
  id: serial("id").primaryKey(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  notificationEmail: varchar("notification_email", { length: 255 }).notNull(),
  emailProvider: varchar("email_provider", { length: 100 }).notNull().default('smtp'),
  smtpHost: varchar("smtp_host", { length: 255 }),
  smtpPort: integer("smtp_port"),
  smtpUser: varchar("smtp_user", { length: 255 }),
  smtpPassword: varchar("smtp_password", { length: 255 }),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default('admin'),
  permissions: text("permissions").array().default([]),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics tracking
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type").notNull(),
  eventData: jsonb("event_data"),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  referrer: varchar("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content scheduling
export const scheduledContent = pgTable("scheduled_content", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type").notNull(),
  contentId: integer("content_id"),
  scheduledAction: varchar("scheduled_action").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  contentData: jsonb("content_data"),
  status: varchar("status").default("pending"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  executedAt: timestamp("executed_at"),
});

// Content backups
export const contentBackups = pgTable("content_backups", {
  id: serial("id").primaryKey(),
  backupType: varchar("backup_type").notNull(),
  backupData: jsonb("backup_data").notNull(),
  backupSize: integer("backup_size"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  restoredAt: timestamp("restored_at"),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  action: varchar("action").notNull(),
  resourceType: varchar("resource_type"),
  resourceId: varchar("resource_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email campaigns
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  targetAudience: jsonb("target_audience"),
  status: varchar("status").default("draft"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openRate: decimal("open_rate").default("0"),
  clickRate: decimal("click_rate").default("0"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// A/B testing
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  testType: varchar("test_type").notNull(),
  variantA: jsonb("variant_a").notNull(),
  variantB: jsonb("variant_b").notNull(),
  status: varchar("status").default("draft"),
  trafficSplit: integer("traffic_split").default(50),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  conversionGoal: varchar("conversion_goal"),
  results: jsonb("results"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead scoring
export const leadScoring = pgTable("lead_scoring", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  score: integer("score").default(0),
  scoringFactors: jsonb("scoring_factors"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type").notNull(),
  value: decimal("value").notNull(),
  unit: varchar("unit"),
  page: varchar("page"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailSettingSchema = createInsertSchema(emailSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertScheduledContentSchema = createInsertSchema(scheduledContent).omit({
  id: true,
  createdAt: true,
  executedAt: true,
});

export const insertContentBackupSchema = createInsertSchema(contentBackups).omit({
  id: true,
  createdAt: true,
  restoredAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadScoringSchema = createInsertSchema(leadScoring).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastCalculated: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertEmailSetting = z.infer<typeof insertEmailSettingSchema>;
export type EmailSetting = typeof emailSettings.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
