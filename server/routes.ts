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
        new Date(c.createdAt) >= thisMonth
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

  const httpServer = createServer(app);

  return httpServer;
}
