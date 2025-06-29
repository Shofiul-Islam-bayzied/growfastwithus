import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/templates";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Rocket,
  Settings,
  BarChart3,
  Phone,
  Mail
} from "lucide-react";

// Template details data
const templateDetails = {
  "ai-medical": {
    whatItDoes: [
      "Automates patient appointment scheduling with AI-powered calendar management",
      "Checks insurance eligibility in real-time before appointments",
      "Sends automated reminders via SMS and email to reduce no-shows",
      "Creates personalized post-appointment treatment plans",
      "AI suggests optimal treatment protocols based on patient history"
    ],
    whatYouNeed: [
      "Clinic calendar system (Google Calendar, Outlook, or practice management software)",
      "Patient management system or organized spreadsheet",
      "Email/SMS provider integration (SendGrid, Twilio)",
      "Optional: Insurance verification API access"
    ],
    benefits: [
      "Reduces no-shows by up to 40% with intelligent reminders",
      "Keeps patients engaged throughout their care journey",
      "Saves staff 15+ hours per week on administrative calls",
      "Enables personalized care plans that improve outcomes",
      "Streamlines insurance verification process"
    ],
    idealFor: "Private clinics, dental practices, physiotherapists, aesthetic practices, mental health providers",
    setupTime: "2-3 days",
    roi: "Typically pays for itself within 3 weeks through reduced no-shows and staff efficiency",
    support: "24/7 technical support, monthly optimization reviews"
  },
  "real-estate": {
    whatItDoes: [
      "Captures leads from website forms and property portals (Zillow, Rightmove, etc.)",
      "Scores leads automatically based on engagement and buying signals",
      "Schedules property viewings with automated calendar coordination",
      "Sends personalized follow-up messages based on lead behavior",
      "Updates CRM in real-time with lead activity and status changes"
    ],
    whatYouNeed: [
      "CRM system (HubSpot, Pipedrive, or organized spreadsheet)",
      "Website lead capture forms or portal integrations",
      "Calendar management system",
      "SMS and email communication tools"
    ],
    benefits: [
      "Respond to hot leads within 5 minutes automatically",
      "Increase conversion rates by 25-35% with faster follow-up",
      "Reduce manual lead management by 80%",
      "Never miss a potential buyer or seller again",
      "Scale your business without hiring more admin staff"
    ],
    idealFor: "Real estate agents, property agencies, independent brokers, property developers",
    setupTime: "1-2 days",
    roi: "Average increase of 3-5 additional closings per month",
    support: "Dedicated account manager, weekly performance reviews"
  },
  "ecommerce": {
    whatItDoes: [
      "Syncs orders automatically from multiple e-commerce platforms",
      "Tracks and updates inventory levels across all sales channels",
      "Coordinates supplier orders when stock runs low",
      "Sends proactive customer order updates and shipping notifications",
      "Analyzes sales patterns to predict inventory needs"
    ],
    whatYouNeed: [
      "E-commerce platform (Shopify, WooCommerce, Magento, Amazon)",
      "Inventory management system or detailed spreadsheets",
      "Supplier contact information and ordering systems",
      "Customer communication tools (email/SMS)"
    ],
    benefits: [
      "Eliminate stockouts and lost sales opportunities",
      "Keep customers informed with automatic updates",
      "Reduce manual inventory management by 90%",
      "Optimize cash flow with predictive ordering",
      "Scale operations without proportional staff increases"
    ],
    idealFor: "Online retailers, Shopify stores, Amazon sellers, dropshippers, multi-channel merchants",
    setupTime: "2-4 days",
    roi: "Typical 15-20% increase in sales through better inventory management",
    support: "Real-time monitoring, monthly inventory optimization reports"
  },
  "professional-services": {
    whatItDoes: [
      "Automates complete client onboarding with document collection",
      "Tracks project milestones and sends progress updates",
      "Generates invoices automatically based on project completion",
      "Schedules regular check-in calls and meetings",
      "Creates client portals for secure document sharing"
    ],
    whatYouNeed: [
      "CRM or client management system",
      "Document storage solution (Google Drive, Dropbox, SharePoint)",
      "Calendar and meeting scheduling system",
      "Accounting software or invoicing tools"
    ],
    benefits: [
      "Save 10-15 hours per client on administrative tasks",
      "Speed up client onboarding by 60%",
      "Reduce billing delays and improve cash flow",
      "Enhance client experience with proactive communication",
      "Scale your practice without administrative burden"
    ],
    idealFor: "Legal firms, financial advisors, consultants, accountants, architects, engineering firms",
    setupTime: "3-5 days",
    roi: "Capacity to take on 25-30% more clients with same resources",
    support: "Monthly business reviews, ongoing optimization"
  },
  "restaurant": {
    whatItDoes: [
      "Centralizes orders from all delivery platforms (Uber Eats, DoorDash, etc.)",
      "Creates unified kitchen dashboard for order management",
      "Analyzes customer reviews for actionable insights",
      "Manages inventory alerts and supplier coordination",
      "Tracks sales patterns and popular items"
    ],
    whatYouNeed: [
      "POS system or delivery platform access",
      "Review monitoring tools (Google, Yelp, delivery apps)",
      "Inventory tracking system or spreadsheets",
      "Supplier contact information"
    ],
    benefits: [
      "Streamline kitchen operations by 40%",
      "Improve customer satisfaction through review insights",
      "Reduce food waste with better inventory management",
      "Increase repeat orders through quality improvements",
      "Save 2-3 hours daily on order coordination"
    ],
    idealFor: "Restaurants, cloud kitchens, food chains, catering services, food trucks",
    setupTime: "1-2 days",
    roi: "15-25% improvement in operational efficiency",
    support: "Daily monitoring, weekly performance reports"
  }
};

export default function TemplateDetail() {
  const { id } = useParams();
  const template = templates.find(t => t.id === id);
  const details = templateDetails[id as keyof typeof templateDetails];

  if (!template || !details) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
          <Link href="/templates">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/attached_assets/white tect logo_1751155829782.png" 
                alt="GrowFastWithUs Logo" 
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/templates">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Templates
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Template Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                {template.category === "Healthcare" && <Users className="w-8 h-8 text-primary" />}
                {template.category === "Real Estate" && <TrendingUp className="w-8 h-8 text-primary" />}
                {template.category === "E-commerce" && <Zap className="w-8 h-8 text-primary" />}
                {template.category === "Professional Services" && <Users className="w-8 h-8 text-primary" />}
                {template.category === "Food & Beverage" && <Clock className="w-8 h-8 text-primary" />}
                {!["Healthcare", "Real Estate", "E-commerce", "Professional Services", "Food & Beverage"].includes(template.category) && <Zap className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-left">{template.title}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant="outline">{template.category}</Badge>
                  {template.popular && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Popular Choice
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {template.description}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{details.setupTime}</div>
                <div className="text-gray-400 text-sm">Setup Time</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">30 Days</div>
                <div className="text-gray-400 text-sm">Average ROI</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">20+ hrs</div>
                <div className="text-gray-400 text-sm">Weekly Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What It Does */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Settings className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">What This Automation Does</h2>
                    </div>
                    <div className="space-y-4">
                      {details.whatItDoes.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What You Need */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Rocket className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">What You Need to Get Started</h2>
                    </div>
                    <div className="space-y-4">
                      {details.whatYouNeed.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-primary text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <BarChart3 className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">How It Benefits Your Business</h2>
                    </div>
                    <div className="space-y-4">
                      {details.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 sticky top-32">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">£{template.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <div className="space-y-3 mb-6 text-sm text-gray-300">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Setup in {details.setupTime}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>24/7 support included</span>
                      </div>
                    </div>
                    <Link href="/#contact">
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white mb-4">
                        Start Implementation
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-400">
                      No setup fees • Cancel anytime
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Ideal For */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Ideal For</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{details.idealFor}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ROI Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Expected ROI</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{details.roi}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Support Included</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{details.support}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Priority phone support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Email support 24/7</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses that have automated their operations and seen immediate results. 
              Our team will handle the complete setup and ensure everything works perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  View All Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}