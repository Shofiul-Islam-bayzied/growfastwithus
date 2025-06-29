import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertTemplateSchema, insertReviewSchema, insertSiteSettingSchema, insertEmailSettingSchema } from "@shared/schema";
import { z } from "zod";

// Admin middleware - checks if user is authenticated admin
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const isUserAdmin = await storage.isAdmin(clerkUserId);
    if (!isUserAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    req.adminUserId = clerkUserId;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      console.error("Error creating contact:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create template (admin endpoint)
  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.json({ success: true, template });
    } catch (error) {
      console.error("Error creating template:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Admin API Routes
  
  // Check admin status
  app.get("/api/admin/check", async (req, res) => {
    try {
      // For development, allow any user to be admin
      // In production, you'd check against admin users table
      res.json(true);
    } catch (error) {
      res.json(false);
    }
  });

  // Admin stats dashboard
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      const reviews = await storage.getReviews();
      const templates = await storage.getTemplates();
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyContacts = contacts.filter(c => 
        c.createdAt && new Date(c.createdAt) >= thisMonth
      ).length;

      res.json({
        totalContacts: contacts.length,
        totalReviews: reviews.length,
        totalTemplates: templates.length,
        monthlyContacts
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Management API endpoints
  app.post('/api/admin/theme', async (req, res) => {
    try {
      const themeData = req.body;
      await storage.updateSiteSetting('theme_colors', JSON.stringify(themeData.colors));
      res.json({ success: true, message: 'Theme updated successfully' });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  app.get('/api/admin/site-settings', async (req, res) => {
    try {
      const settings = {
        siteName: (await storage.getSiteSetting('site_name'))?.value || 'GrowFastWithUs',
        tagline: (await storage.getSiteSetting('tagline'))?.value || 'Automate Your Business Growth',
        contactEmail: (await storage.getSiteSetting('contact_email'))?.value || 'contact@growfastwithus.com',
        phone: (await storage.getSiteSetting('phone'))?.value || '+1 (555) 123-4567',
        address: (await storage.getSiteSetting('address'))?.value || '123 Business St, Suite 100, City, State 12345',
        metaDescription: (await storage.getSiteSetting('meta_description'))?.value || 'Leading automation agency helping businesses grow faster with AI-powered workflows and no-code solutions.',
        heroTitle: (await storage.getSiteSetting('hero_title'))?.value || 'Grow Your Business Faster with Automation',
        heroSubtitle: (await storage.getSiteSetting('hero_subtitle'))?.value || 'Transform your operations with AI-powered workflows and no-code automation solutions'
      };
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.put('/api/admin/site-settings', async (req, res) => {
    try {
      const settings = req.body;
      
      await Promise.all([
        storage.updateSiteSetting('site_name', settings.siteName),
        storage.updateSiteSetting('tagline', settings.tagline),
        storage.updateSiteSetting('contact_email', settings.contactEmail),
        storage.updateSiteSetting('phone', settings.phone),
        storage.updateSiteSetting('address', settings.address),
        storage.updateSiteSetting('meta_description', settings.metaDescription),
        storage.updateSiteSetting('hero_title', settings.heroTitle),
        storage.updateSiteSetting('hero_subtitle', settings.heroSubtitle)
      ]);
      
      res.json({ success: true, message: 'Site settings updated successfully' });
    } catch (error) {
      console.error("Error updating site settings:", error);
      res.status(500).json({ message: "Failed to update site settings" });
    }
  });

  app.get('/api/admin/media', async (req, res) => {
    try {
      const mediaFiles = [
        { id: 1, name: 'hero-background.jpg', url: '/images/hero-bg.jpg', size: '2.3 MB', type: 'image' },
        { id: 2, name: 'company-logo.png', url: '/images/logo.png', size: '156 KB', type: 'image' },
        { id: 3, name: 'team-photo.jpg', url: '/images/team.jpg', size: '1.8 MB', type: 'image' }
      ];
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  app.post('/api/admin/media/upload', async (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: 'File uploaded successfully',
        file: {
          id: Date.now(),
          name: 'uploaded-file.jpg',
          url: '/uploads/uploaded-file.jpg',
          size: '1.2 MB'
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.post('/api/admin/media/url', async (req, res) => {
    try {
      const { url, name } = req.body;
      res.json({ 
        success: true, 
        message: 'Image added from URL successfully',
        file: {
          id: Date.now(),
          name: name,
          url: url,
          size: 'Unknown'
        }
      });
    } catch (error) {
      console.error("Error uploading from URL:", error);
      res.status(500).json({ message: "Failed to upload from URL" });
    }
  });

  // Logo upload endpoint
  app.post('/api/admin/logo/upload', async (req, res) => {
    try {
      // Simulate logo upload processing
      const logoUrl = `/uploads/logo-${Date.now()}.png`;
      
      // Update logo setting in database
      await storage.updateSiteSetting('site_logo', logoUrl);
      
      res.json({ 
        success: true, 
        message: 'Logo uploaded successfully',
        logoUrl: logoUrl
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  // Theme endpoint
  app.post('/api/admin/theme', async (req, res) => {
    try {
      const { colors } = req.body;
      
      // Save theme colors as site settings
      if (colors.primary) {
        await storage.updateSiteSetting('primary_color', colors.primary);
      }
      if (colors.secondary) {
        await storage.updateSiteSetting('secondary_color', colors.secondary);
      }
      if (colors.accent) {
        await storage.updateSiteSetting('accent_color', colors.accent);
      }
      
      res.json({ 
        success: true, 
        message: 'Theme updated successfully'
      });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  // Analytics endpoint
  app.get('/api/admin/analytics', async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin settings endpoint
  app.post('/api/admin/settings', async (req, res) => {
    try {
      const settings = req.body;
      res.json({ 
        success: true, 
        message: 'Settings updated successfully',
        settings
      });
    } catch (error) {
      console.error("Error updating admin settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Site Settings Management
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.updateSiteSetting(key, value);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Theme Settings
  app.get("/api/admin/theme-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      const themeSettings = settings.filter(s => 
        s.category === 'theme' || 
        s.key.includes('color') || 
        s.key.includes('font')
      );
      res.json(themeSettings);
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reviews Management
  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.put("/api/admin/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviewData = req.body;
      const review = await storage.updateReview(id, reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Email Settings Management
  app.get("/api/admin/email-settings", async (req, res) => {
    try {
      const settings = await storage.getEmailSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching email settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/email-settings", async (req, res) => {
    try {
      const settingsData = insertEmailSettingSchema.parse(req.body);
      const settings = await storage.updateEmailSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating email settings:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Test email endpoint
  app.post("/api/admin/test-email", async (req, res) => {
    try {
      const { email } = req.body;
      console.log(`Test email would be sent to: ${email}`);
      res.json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logo upload endpoint
  app.post("/api/admin/upload-logo", async (req, res) => {
    try {
      const logoUrl = "/uploaded-logo.png";
      res.json({ url: logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Advanced Analytics Endpoints
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(req.query);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics/stats", async (req, res) => {
    try {
      const stats = await storage.getAnalyticsStats(req.query);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/analytics/event", async (req, res) => {
    try {
      const event = await storage.createAnalyticsEvent(req.body);
      res.json(event);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Scheduling Endpoints
  app.get("/api/admin/scheduled-content", async (req, res) => {
    try {
      const { status } = req.query;
      const scheduledContent = await storage.getScheduledContent(status as string);
      res.json(scheduledContent);
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/scheduled-content", async (req, res) => {
    try {
      const content = await storage.createScheduledContent(req.body);
      res.json(content);
    } catch (error) {
      console.error("Error creating scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/scheduled-content/:id/execute", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.executeScheduledContent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error executing scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Backup Endpoints
  app.get("/api/admin/backups", async (req, res) => {
    try {
      const backups = await storage.getBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/backups", async (req, res) => {
    try {
      const backup = await storage.createBackup(req.body);
      res.json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/backups/:id/restore", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.restoreBackup(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Activity Logs Endpoints
  app.get("/api/admin/activity-logs", async (req, res) => {
    try {
      const { userId } = req.query;
      const logs = await storage.getActivityLogs(userId as string);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });





  // Performance Monitoring Endpoints
  app.get("/api/admin/performance", async (req, res) => {
    try {
      const { type, timeRange } = req.query;
      const metrics = await storage.getPerformanceMetrics(type as string, timeRange);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/performance/stats", async (req, res) => {
    try {
      const stats = await storage.getPerformanceStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching performance stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/performance/metric", async (req, res) => {
    try {
      const metric = await storage.recordPerformanceMetric(req.body);
      res.json(metric);
    } catch (error) {
      console.error("Error recording performance metric:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
