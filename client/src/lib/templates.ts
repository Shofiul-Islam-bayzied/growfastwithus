import { LucideIcon, Stethoscope, Home, ShoppingCart, Users, UtensilsCrossed, Briefcase, TrendingUp, Calendar, UserCheck, Bot, Phone, Target, ShoppingBag, Dumbbell } from "lucide-react";

export interface VoiceAIAddon {
  id: string;
  name: string;
  monthlyPrice: number;
  setupFee: number;
  includedMinutes: number;
  perMinuteRate: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  setupFee: number;
  category: string;
  icon: LucideIcon;
  features: string[];
  voiceAIAddons: VoiceAIAddon[];
  popular?: boolean;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to GBP
}

export const currencies: Currency[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.27 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1.16 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.71 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.89 }
];

export const voiceAIAddons: VoiceAIAddon[] = [
  {
    id: 'voice-lite',
    name: 'Voice AI Lite',
    monthlyPrice: 99,
    setupFee: 199,
    includedMinutes: 500,
    perMinuteRate: 0.10
  },
  {
    id: 'voice-standard',
    name: 'Voice AI Standard',
    monthlyPrice: 249,
    setupFee: 499,
    includedMinutes: 1500,
    perMinuteRate: 0.08
  },
  {
    id: 'voice-enterprise',
    name: 'Voice AI Enterprise',
    monthlyPrice: 0, // Custom quote
    setupFee: 0, // Custom quote
    includedMinutes: 5000,
    perMinuteRate: 0.05
  }
];

export function convertPrice(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
  return Math.round((amount / fromRate) * toRate);
}

export function formatPrice(amount: number, currency: string): string {
  const currencyData = currencies.find(c => c.code === currency);
  if (!currencyData) return `${amount}`;
  
  return `${currencyData.symbol}${amount.toLocaleString()}`;
}

export const templates: Template[] = [
  {
    id: "ai-medical-practice",
    title: "AI Medical Practice Automation",
    description: "Automate appointment scheduling, patient reminders, and follow-up communications with AI-powered workflows.",
    basePrice: 449,
    setupFee: 899,
    category: "Healthcare",
    icon: Stethoscope,
    features: ["Appointment scheduling", "Patient reminders", "Follow-up automation", "AI chat support"],
    voiceAIAddons: voiceAIAddons,
    popular: true,
  },
  {
    id: "real-estate-sales-funnel",
    title: "Real Estate Sales Funnel",
    description: "Lead capture, nurturing, and conversion automation for real estate professionals.",
    basePrice: 399,
    setupFee: 799,
    category: "Real Estate",
    icon: Home,
    features: ["Lead capture", "Automated nurturing", "CRM integration", "Performance tracking"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "ecommerce-smart-ops",
    title: "E-Commerce Smart Ops",
    description: "Inventory management, order processing, and customer service automation.",
    basePrice: 349,
    setupFee: 699,
    category: "E-commerce",
    icon: ShoppingCart,
    features: ["Inventory management", "Order processing", "Customer service", "Analytics"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "professional-services-crm",
    title: "Professional Services CRM Flow",
    description: "Client management, project tracking, and billing automation for service businesses.",
    basePrice: 399,
    setupFee: 799,
    category: "Professional Services",
    icon: Briefcase,
    features: ["Client management", "Project tracking", "Billing automation", "Time tracking"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "restaurant-automation",
    title: "Restaurant Order + Feedback Automation",
    description: "Online ordering, kitchen management, and customer feedback collection.",
    basePrice: 299,
    setupFee: 599,
    category: "Restaurant",
    icon: UtensilsCrossed,
    features: ["Online ordering", "Kitchen management", "Feedback collection", "Loyalty programs"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "home-services-scheduler",
    title: "Home Services Technician Scheduler",
    description: "Appointment booking, technician dispatch, and customer communication automation.",
    basePrice: 249,
    setupFee: 499,
    category: "Home Services",
    icon: Users,
    features: ["Appointment booking", "Technician dispatch", "Customer updates", "Invoice automation"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "digital-marketing-system",
    title: "Digital Marketing Campaign System",
    description: "Multi-channel campaign management, lead scoring, and performance tracking.",
    basePrice: 399,
    setupFee: 799,
    category: "Marketing",
    icon: TrendingUp,
    features: ["Campaign management", "Lead scoring", "Performance tracking", "Multi-channel"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "fitness-member-system",
    title: "Fitness & Wellness Member System",
    description: "Member management, class booking, and health tracking automation.",
    basePrice: 279,
    setupFee: 559,
    category: "Fitness",
    icon: Dumbbell,
    features: ["Member management", "Class booking", "Health tracking", "Payment processing"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "event-planning-bot",
    title: "Event Planning Bot",
    description: "Event coordination, vendor management, and guest communication automation.",
    basePrice: 349,
    setupFee: 699,
    category: "Events",
    icon: Calendar,
    features: ["Event coordination", "Vendor management", "Guest communication", "Budget tracking"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "coaching-client-portal",
    title: "Coaching & Client Portal",
    description: "Client onboarding, session scheduling, and progress tracking automation.",
    basePrice: 299,
    setupFee: 599,
    category: "Coaching",
    icon: UserCheck,
    features: ["Client onboarding", "Session scheduling", "Progress tracking", "Resource delivery"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "whatsapp-support-agent",
    title: "AI-Powered WhatsApp Support Agent",
    description: "24/7 customer support via WhatsApp with AI-powered responses and escalation.",
    basePrice: 399,
    setupFee: 799,
    category: "Customer Support",
    icon: Bot,
    features: ["24/7 availability", "AI responses", "Escalation management", "Multi-language"],
    voiceAIAddons: voiceAIAddons,
    popular: true,
  },
  {
    id: "voice-reminder-bot",
    title: "AI Voice Reminder Bot",
    description: "Automated voice calls for appointments, payments, and important notifications.",
    basePrice: 299,
    setupFee: 599,
    category: "Communication",
    icon: Phone,
    features: ["Voice calls", "Appointment reminders", "Payment reminders", "Custom messages"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "lead-qualifier-crm",
    title: "Auto Lead Qualifier & CRM Sync",
    description: "Intelligent lead qualification and automatic CRM synchronization.",
    basePrice: 249,
    setupFee: 499,
    category: "Sales",
    icon: Target,
    features: ["Lead qualification", "CRM sync", "Scoring system", "Follow-up automation"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "cart-recovery-system",
    title: "Abandoned Cart Recovery + Coupons",
    description: "Recover abandoned carts with personalized offers and discount automation.",
    basePrice: 199,
    setupFee: 399,
    category: "E-commerce",
    icon: ShoppingBag,
    features: ["Cart recovery", "Personalized offers", "Discount automation", "Performance analytics"],
    voiceAIAddons: voiceAIAddons,
  },
  {
    id: "recruitment-flow",
    title: "Recruitment Flow + AI Resume Screener",
    description: "Automated recruitment process with AI-powered resume screening and candidate management.",
    basePrice: 349,
    setupFee: 699,
    category: "HR",
    icon: Users,
    features: ["Resume screening", "Candidate management", "Interview scheduling", "Automated communications"],
    voiceAIAddons: voiceAIAddons,
  },
];
