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
  Mail,
  Target,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

// Complete template details with all 15 templates
const templateDetails = {
  "ai-medical-practice": {
    overview: "Modern medical practices need seamless patient management. Our AI Medical Practice Automation system streamlines appointment scheduling, reminders, and follow-ups — freeing your staff from hours of phone calls and manual updates.",
    keyFeatures: [
      "Appointment Scheduling: AI books appointments based on provider availability",
      "Patient Reminders: Sends SMS/email reminders, reducing no-shows",
      "Follow-Up Automation: Post-visit messages for care plans, feedback, or next steps", 
      "Insurance Checks: Optional integration to verify patient coverage"
    ],
    benefits: [
      "Fewer missed appointments",
      "Higher patient satisfaction",
      "Lower admin costs", 
      "Ready for HIPAA and data compliance"
    ],
    idealFor: "Clinics, dental practices, physiotherapists, aesthetic medicine",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Healthcare",
    popular: true,
    price: 449
  },
  "real-estate-sales-funnel": {
    overview: "Convert more buyers and tenants with automated lead capture, follow-up, and CRM updates. Our Real Estate Sales Funnel keeps agents organized and proactive.",
    keyFeatures: [
      "Lead Capture: Collects leads from website forms, listing portals",
      "Automated Nurturing: AI sends property info, reminders, and updates",
      "CRM Integration: Updates pipelines automatically",
      "Viewing Scheduler: Clients book viewings directly online"
    ],
    benefits: [
      "Faster response to hot leads",
      "Increased property viewings",
      "Less manual CRM work",
      "Higher closure rates"
    ],
    idealFor: "Realtors, agencies, property developers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days", 
    saves: "20+ hours/week",
    industry: "Real Estate",
    popular: false,
    price: 399
  },
  "ecommerce-smart-ops": {
    overview: "Running an online store is chaos without automation. E-Commerce Smart Ops syncs your inventory, manages orders, and helps your team focus on growth instead of spreadsheets.",
    keyFeatures: [
      "Inventory Management: Tracks stock levels, syncs across platforms",
      "Order Processing: Automatically fulfills orders, updates status",
      "Customer Service Automation: Sends shipment updates, handles FAQs",
      "Supplier Coordination: Notifies suppliers when stock runs low"
    ],
    benefits: [
      "Lower fulfillment errors",
      "Happier customers", 
      "More time for marketing",
      "Scalable operations"
    ],
    idealFor: "Shopify stores, online retailers, drop shippers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "E-commerce",
    popular: false,
    price: 349
  },
  "professional-services-crm": {
    overview: "Client-facing businesses juggle tons of manual tasks. Professional Services CRM Flow automates onboarding, document collection, project tracking, and billing.",
    keyFeatures: [
      "Client Management: Captures new client data seamlessly",
      "Project Tracking: Visualizes milestones and deliverables",
      "Billing Automation: Sends invoices automatically",
      "Document Collection: Secure portals for file uploads"
    ],
    benefits: [
      "Faster client onboarding",
      "Fewer admin errors",
      "Improved cash flow",
      "Higher client satisfaction"
    ],
    idealFor: "Legal firms, financial advisors, consulting agencies",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week", 
    industry: "Professional Services",
    popular: false,
    price: 399
  },
  "restaurant-automation": {
    overview: "Your kitchen should focus on great food — not chaos. Our automation system consolidates orders, manages kitchen workflows, and turns customer feedback into actionable insights.",
    keyFeatures: [
      "Online Ordering Integration: Centralizes delivery platform orders",
      "Kitchen Management: Streamlines ticket handling",
      "Feedback Analysis: Uses AI to analyze customer reviews",
      "Inventory Alerts: Monitors ingredient stock levels"
    ],
    benefits: [
      "Faster order processing",
      "Improved service consistency",
      "Data-driven menu decisions",
      "Reduced staff workload"
    ],
    idealFor: "Restaurants, cloud kitchens, cafes",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Restaurant",
    popular: false,
    price: 299
  },
  "home-services-scheduler": {
    overview: "Stop drowning in phone calls. This automation schedules technicians, assigns jobs, and keeps customers informed.",
    keyFeatures: [
      "Appointment Booking: Accepts online service requests", 
      "Technician Dispatch: Assigns jobs based on skills and location",
      "Customer Updates: Sends arrival times and job completions",
      "Job Tracking: Keeps detailed records for invoices and reporting"
    ],
    benefits: [
      "More efficient dispatching",
      "Higher first-time fix rates",
      "Happier customers",
      "Streamlined operations"
    ],
    idealFor: "Electricians, plumbers, HVAC, appliance repair",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Home Services",
    popular: false,
    price: 249
  },
  "digital-marketing-system": {
    overview: "Marketing should be creative — not repetitive. Our system automates client onboarding, campaign setups, reporting, and ROI tracking.",
    keyFeatures: [
      "Campaign Management: Launch multi-channel ads quickly",
      "Lead Scoring: Ranks prospects based on engagement",
      "Performance Tracking: Sends automated reports",
      "Client Portal: Clients check campaign status 24/7"
    ],
    benefits: [
      "Less time on reporting",
      "Higher client retention",
      "Scalable operations",
      "More upsell opportunities"
    ],
    idealFor: "Digital marketing agencies, freelancers, in-house teams",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Marketing",
    popular: false,
    price: 399
  },
  "fitness-member-system": {
    overview: "Keep your studio full and your members happy. This system automates bookings, tracks progress, and simplifies communication.",
    keyFeatures: [
      "Member Management: Maintains profiles and memberships",
      "Class Booking: Online scheduling for group or private sessions",
      "Health Tracking: Customizes workouts and progress metrics",
      "Billing Automation: Collects payments and renewals"
    ],
    benefits: [
      "Reduces missed classes",
      "Builds loyalty",
      "Simplifies admin tasks",
      "Enables personalized coaching"
    ],
    idealFor: "Gyms, yoga studios, personal trainers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Fitness",
    popular: false,
    price: 279
  },
  "event-planning-bot": {
    overview: "Event planning is stressful — our bot handles vendors, timelines, and guest communication so you stay organized and proactive.",
    keyFeatures: [
      "Event Coordination: Builds event timelines automatically",
      "Vendor Management: Tracks tasks and reminders",
      "Guest Communication: Sends invites, RSVPs, and updates",
      "Post-Event Follow-Up: Gathers feedback and photos"
    ],
    benefits: [
      "Fewer planning mistakes",
      "Happier vendors and guests",
      "Streamlined communication",
      "Greater professionalism"
    ],
    idealFor: "Corporate event planners, wedding coordinators, festival organizers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Events",
    popular: false,
    price: 349
  },
  "coaching-client-portal": {
    overview: "Give clients a premium coaching experience with automated onboarding, resource sharing, and progress tracking.",
    keyFeatures: [
      "Client Onboarding: Smooth intake process",
      "Session Scheduling: Syncs with calendars for easy bookings",
      "Progress Tracking: Logs goals and milestones",
      "Resource Sharing: Share documents, videos, and notes securely"
    ],
    benefits: [
      "Less admin work",
      "Higher client satisfaction",
      "Professional appearance",
      "Easy upselling of new services"
    ],
    idealFor: "Business coaches, wellness coaches, consultants",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Coaching",
    popular: false,
    price: 299
  },
  "whatsapp-support-agent": {
    overview: "Serve customers 24/7 without hiring more agents. Our WhatsApp AI answers FAQs, handles simple queries, and escalates complex issues to your human team.",
    keyFeatures: [
      "24/7 Availability: Never miss a customer message",
      "AI Responses: Smart answers pulled from your knowledge base",
      "Escalation Management: Transfers complex cases to humans",
      "Multilingual Support: Speak your customers' languages"
    ],
    benefits: [
      "Faster responses",
      "Lower support costs",
      "Happier customers",
      "Scalable to thousands of chats"
    ],
    idealFor: "Any business with high support volume",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Customer Support",
    popular: true,
    price: 399
  },
  "voice-reminder-bot": {
    overview: "Ensure clients never miss an appointment or payment. This bot calls clients with natural-sounding AI voices and logs every interaction.",
    keyFeatures: [
      "Voice Calls: Personalized reminders for clients",
      "Appointment Notifications: Reduce no-shows",
      "Payment Reminders: Gentle nudges to settle invoices",
      "Call Logging: Keep track of conversations and statuses"
    ],
    benefits: [
      "Boosts attendance",
      "Saves staff time",
      "Professional customer experience",
      "Works 24/7"
    ],
    idealFor: "Clinics, service businesses, sales teams",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Communication",
    popular: false,
    price: 299
  },
  "lead-qualifier-crm": {
    overview: "Stop wasting time on bad leads. This workflow automatically filters, scores, and pushes only qualified leads into your CRM.",
    keyFeatures: [
      "Lead Qualification: AI analyzes submitted info",
      "CRM Sync: Instant updates to your sales pipeline",
      "Scoring System: Prioritizes hottest leads",
      "Notifications: Alerts your team about top prospects"
    ],
    benefits: [
      "Higher sales efficiency",
      "Shorter sales cycles",
      "More revenue from fewer leads",
      "Lower manual work"
    ],
    idealFor: "B2B companies, sales teams, agencies",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "Sales",
    popular: false,
    price: 249
  },
  "cart-recovery-system": {
    overview: "Turn almost-customers into real buyers. This workflow triggers personalized emails/SMS with discounts to recover lost carts.",
    keyFeatures: [
      "Cart Recovery: Identifies abandoned carts in real-time",
      "Personalized Offers: Creates unique coupon codes",
      "Multi-Channel Messaging: Emails, SMS, or WhatsApp",
      "ROI Tracking: Measures revenue recovered"
    ],
    benefits: [
      "Recovers lost revenue",
      "Increases conversion rates",
      "Fully automated follow-up",
      "ROI in days"
    ],
    idealFor: "Shopify stores, WooCommerce stores, online sellers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "E-commerce",
    popular: false,
    price: 199
  },
  "recruitment-flow": {
    overview: "Streamline hiring with AI. Automatically collect applications, score resumes, and schedule interviews so your HR team can focus on people — not paperwork.",
    keyFeatures: [
      "Resume Screening: AI scans and ranks candidates",
      "Candidate Management: Centralizes communication",
      "Interview Scheduling: Automates calendar invites",
      "Custom Scorecards: Evaluate key candidate criteria"
    ],
    benefits: [
      "Faster hiring decisions",
      "Lower recruitment costs",
      "Better talent matches",
      "Higher candidate experience"
    ],
    idealFor: "HR teams, recruitment agencies, hiring managers",
    setupTime: "1-2 Days",
    roi: "Achievable in 30 Days",
    saves: "20+ hours/week",
    industry: "HR",
    popular: false,
    price: 349
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
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/attached_assets/white tect logo_1751155829782.png" 
                alt="GrowFastWithUs Logo" 
                className="h-6 sm:h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/templates">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">All Templates</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Template Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-xl flex items-center justify-center">
                {template.category === "Healthcare" && <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Real Estate" && <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "E-commerce" && <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Professional Services" && <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Food & Beverage" && <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Restaurant" && <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Home Services" && <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Marketing" && <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Fitness" && <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Events" && <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Coaching" && <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Customer Support" && <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Communication" && <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "Sales" && <Target className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {template.category === "HR" && <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
                {!["Healthcare", "Real Estate", "E-commerce", "Professional Services", "Food & Beverage", "Restaurant", "Home Services", "Marketing", "Fitness", "Events", "Coaching", "Customer Support", "Communication", "Sales", "HR"].includes(template.category) && <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{template.title}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <Badge variant="outline" className="text-xs sm:text-sm">{template.category}</Badge>
                  {details.popular && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs sm:text-sm">
                      <Star className="w-3 h-3 mr-1" />
                      Popular Choice
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto px-4">
              {details.overview}
            </p>
          </motion.div>

          {/* Key Metrics - Responsive Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
          >
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-3 sm:p-6 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-white">{details.setupTime}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Setup Time</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-3 sm:p-6 text-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-white">{details.roi}</div>
                <div className="text-gray-400 text-xs sm:text-sm">ROI Timeline</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-3 sm:p-6 text-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-white">{details.saves}</div>
                <div className="text-gray-400 text-xs sm:text-sm">Time Saved</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-3 sm:p-6 text-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-xs sm:text-sm">Support</div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <h2 className="text-xl sm:text-2xl font-bold">Key Features</h2>
                    </div>
                    <div className="space-y-4">
                      {details.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm sm:text-base">{feature}</p>
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
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <h2 className="text-xl sm:text-2xl font-bold">Benefits for Your Business</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {details.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm sm:text-base">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Responsive Design Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      <h2 className="text-xl sm:text-2xl font-bold">Works on All Devices</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
                        <Monitor className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-white mb-2">Desktop</h3>
                        <p className="text-gray-300 text-xs sm:text-sm">Full dashboard access with complete functionality</p>
                      </div>
                      <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
                        <Tablet className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-white mb-2">Tablet</h3>
                        <p className="text-gray-300 text-xs sm:text-sm">Optimized interface for touch navigation</p>
                      </div>
                      <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
                        <Smartphone className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-white mb-2">Mobile</h3>
                        <p className="text-gray-300 text-xs sm:text-sm">Native-like experience on smartphones</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Sticky on desktop */}
            <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              {/* Pricing Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Get Started Today</h3>
                    <div className="mb-6">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">£{details.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <div className="space-y-3 mb-6 text-xs sm:text-sm text-gray-300">
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
                      <h3 className="font-bold">Perfect For</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{details.idealFor}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Support Included</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Priority phone support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Email support 24/7</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-gray-300">Dedicated account manager</span>
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12 sm:mt-16 p-6 sm:p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of businesses that have automated their operations and seen immediate results. 
              Our team will handle the complete setup and ensure everything works perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 w-full sm:w-auto">
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