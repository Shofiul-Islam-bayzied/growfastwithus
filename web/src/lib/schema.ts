import { z } from "zod";

// Contact schema for the contact form
export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  businessSize: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  timeSpent: z.number().optional(),
  message: z.string().optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
