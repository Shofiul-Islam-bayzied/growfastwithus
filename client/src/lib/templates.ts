import { LucideIcon, Stethoscope, Home, ShoppingCart, Users, UtensilsCrossed, Briefcase, TrendingUp, Calendar, UserCheck, Bot, Phone, Target, ShoppingBag, Dumbbell } from "lucide-react";

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: LucideIcon;
  features: string[];
  popular?: boolean;
}

export const templates: Template[] = [
  {
    id: "ai-medical-practice",
    title: "AI Medical Practice Automation",
    description: "Automate appointment scheduling, patient reminders, and follow-up communications with AI-powered workflows.",
    price: 449,
    category: "Healthcare",
    icon: Stethoscope,
    features: ["Appointment scheduling", "Patient reminders", "Follow-up automation", "AI chat support"],
    popular: true,
  },
  {
    id: "real-estate-sales-funnel",
    title: "Real Estate Sales Funnel",
    description: "Lead capture, nurturing, and conversion automation for real estate professionals.",
    price: 399,
    category: "Real Estate",
    icon: Home,
    features: ["Lead capture", "Automated nurturing", "CRM integration", "Performance tracking"],
  },
  {
    id: "ecommerce-smart-ops",
    title: "E-Commerce Smart Ops",
    description: "Inventory management, order processing, and customer service automation.",
    price: 349,
    category: "E-commerce",
    icon: ShoppingCart,
    features: ["Inventory management", "Order processing", "Customer service", "Analytics"],
  },
  {
    id: "professional-services-crm",
    title: "Professional Services CRM Flow",
    description: "Client management, project tracking, and billing automation for service businesses.",
    price: 399,
    category: "Professional Services",
    icon: Briefcase,
    features: ["Client management", "Project tracking", "Billing automation", "Time tracking"],
  },
  {
    id: "restaurant-automation",
    title: "Restaurant Order + Feedback Automation",
    description: "Online ordering, kitchen management, and customer feedback collection.",
    price: 299,
    category: "Restaurant",
    icon: UtensilsCrossed,
    features: ["Online ordering", "Kitchen management", "Feedback collection", "Loyalty programs"],
  },
  {
    id: "home-services-scheduler",
    title: "Home Services Technician Scheduler",
    description: "Appointment booking, technician dispatch, and customer communication automation.",
    price: 249,
    category: "Home Services",
    icon: Users,
    features: ["Appointment booking", "Technician dispatch", "Customer updates", "Invoice automation"],
  },
  {
    id: "digital-marketing-system",
    title: "Digital Marketing Campaign System",
    description: "Multi-channel campaign management, lead scoring, and performance tracking.",
    price: 399,
    category: "Marketing",
    icon: TrendingUp,
    features: ["Campaign management", "Lead scoring", "Performance tracking", "Multi-channel"],
  },
  {
    id: "fitness-member-system",
    title: "Fitness & Wellness Member System",
    description: "Member management, class booking, and health tracking automation.",
    price: 279,
    category: "Fitness",
    icon: Dumbbell,
    features: ["Member management", "Class booking", "Health tracking", "Payment processing"],
  },
  {
    id: "event-planning-bot",
    title: "Event Planning Bot",
    description: "Event coordination, vendor management, and guest communication automation.",
    price: 349,
    category: "Events",
    icon: Calendar,
    features: ["Event coordination", "Vendor management", "Guest communication", "Budget tracking"],
  },
  {
    id: "coaching-client-portal",
    title: "Coaching & Client Portal",
    description: "Client onboarding, session scheduling, and progress tracking automation.",
    price: 299,
    category: "Coaching",
    icon: UserCheck,
    features: ["Client onboarding", "Session scheduling", "Progress tracking", "Resource delivery"],
  },
  {
    id: "whatsapp-support-agent",
    title: "AI-Powered WhatsApp Support Agent",
    description: "24/7 customer support via WhatsApp with AI-powered responses and escalation.",
    price: 399,
    category: "Customer Support",
    icon: Bot,
    features: ["24/7 availability", "AI responses", "Escalation management", "Multi-language"],
    popular: true,
  },
  {
    id: "voice-reminder-bot",
    title: "AI Voice Reminder Bot",
    description: "Automated voice calls for appointments, payments, and important notifications.",
    price: 299,
    category: "Communication",
    icon: Phone,
    features: ["Voice calls", "Appointment reminders", "Payment reminders", "Custom messages"],
  },
  {
    id: "lead-qualifier-crm",
    title: "Auto Lead Qualifier & CRM Sync",
    description: "Intelligent lead qualification and automatic CRM synchronization.",
    price: 249,
    category: "Sales",
    icon: Target,
    features: ["Lead qualification", "CRM sync", "Scoring system", "Follow-up automation"],
  },
  {
    id: "cart-recovery-system",
    title: "Abandoned Cart Recovery + Coupons",
    description: "Recover abandoned carts with personalized offers and discount automation.",
    price: 199,
    category: "E-commerce",
    icon: ShoppingBag,
    features: ["Cart recovery", "Personalized offers", "Discount automation", "Performance analytics"],
  },
  {
    id: "recruitment-flow",
    title: "Recruitment Flow + AI Resume Screener",
    description: "Automated recruitment process with AI-powered resume screening and candidate management.",
    price: 349,
    category: "HR",
    icon: Users,
    features: ["Resume screening", "Candidate management", "Interview scheduling", "Background checks"],
  },
];
