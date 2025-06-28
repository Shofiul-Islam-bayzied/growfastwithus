import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AdvancedContactForm } from "@/components/advanced-contact-form";
import { templates } from "@/lib/templates";
import {
  Sun,
  Moon,
  Phone,
  Mail,
  Clock,
  MapPin,
  Stethoscope,
  Home as HomeIcon,
  ShoppingCart,
  Briefcase,
  Utensils,
  Wrench,
  ChartLine,
  Dumbbell,
  Calendar,
  UserCheck,
  MessageCircle,
  Target,
  ShoppingBag,
  Users,
  Cog,
  Bot,
  BarChart3,
  Puzzle,
  Server,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

const iconMap = {
  stethoscope: Stethoscope,
  home: HomeIcon,
  "shopping-cart": ShoppingCart,
  briefcase: Briefcase,
  utensils: Utensils,
  wrench: Wrench,
  "chart-line": ChartLine,
  dumbbell: Dumbbell,
  calendar: Calendar,
  "user-check": UserCheck,
  "message-circle": MessageCircle,
  phone: Phone,
  target: Target,
  "shopping-bag": ShoppingBag,
  users: Users,
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [businessSize, setBusinessSize] = useState("Small Business (1-10 employees)");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState([20]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const templatesRef = useRef(null);
  const pricingRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });
  const templatesInView = useInView(templatesRef, { once: true });
  const pricingInView = useInView(pricingRef, { once: true });

  const categories = ["All Templates", ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "All Templates" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const businessSizes = [
    "Small Business (1-10 employees)",
    "Medium Business (11-50 employees)", 
    "Large Business (51-200 employees)",
    "Enterprise (200+ employees)",
  ];

  const painPointOptions = [
    "Manual data entry",
    "Customer support overload",
    "Inventory management",
    "Lead follow-up", 
    "Appointment scheduling",
    "Invoice processing",
    "Report generation",
    "Email marketing",
  ];

  const calculatePricing = () => {
    const baseSetup = businessSize.includes("Small") ? 2499 : 
                     businessSize.includes("Medium") ? 4999 :
                     businessSize.includes("Large") ? 7499 : 9999;
    
    const templateCosts = selectedTemplates.reduce((total, templateId) => {
      const template = templates.find(t => t.id === templateId);
      return total + (template ? template.price : 0);
    }, 0);
    
    const baseMonthly = painPoints.length * 150 + 299 + templateCosts;
    const timeSavings = timeSpent[0] * 4; // 4 weeks per month
    const costSavings = timeSavings * 40; // £40 per hour saved
    const roi = ((costSavings * 12 - baseSetup - baseMonthly * 12) / (baseSetup + baseMonthly * 12)) * 100;
    
    return {
      setupFee: baseSetup,
      monthlyFee: baseMonthly,
      timeSaved: timeSavings,
      costSavings,
      roi: Math.round(roi),
      breakEven: Math.ceil((baseSetup + baseMonthly * 12) / costSavings),
    };
  };

  const pricing = calculatePricing();

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    setPainPoints(prev => 
      checked ? [...prev, painPoint] : prev.filter(p => p !== painPoint)
    );
  };

  const handleTemplateSelect = (templateId: string, checked: boolean) => {
    setSelectedTemplates(prev =>
      checked ? [...prev, templateId] : prev.filter(t => t !== templateId)
    );
  };

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="glass-button shadow-lg animate-pulse-glow px-6 py-3 rounded-full font-semibold"
          onClick={() => scrollToSection('contact')}
        >
          <Phone className="w-4 h-4 mr-2" />
          Book Discovery Call
        </Button>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="glass-card rounded-full"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerScrolled ? 'glass-card shadow-lg' : ''}`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Digital Empire Grow Fast</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              <a href="#services" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
              <a href="#templates" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('templates'); }}>Templates</a>
              <a href="#pricing" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a>
              <a href="#contact" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </div>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
              onClick={() => scrollToSection('contact')}
            >
              Book Discovery Call
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh"></div>
        
        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Automate the Boring. <span className="text-primary">Accelerate the Brilliant.</span>
            </motion.h1>
            <motion.p
              className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We design, deploy, and host business automation workflows that eliminate repetitive tasks and boost efficiency for businesses worldwide.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-2xl">
                Start Your Automation Journey
              </Button>
              <Button size="lg" variant="ghost" className="glass-button text-white px-8 py-4 text-lg">
                View Templates
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-white rotate-90" />
        </motion.div>
      </section>

      {/* Services Overview */}
      <section id="services" ref={servicesRef} className="py-20 bg-black tech-grid">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">What We Automate</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your business operations with our comprehensive automation solutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cog, title: "Workflow Automation", description: "Streamline your business processes with intelligent workflow automation that works 24/7." },
              { icon: Bot, title: "AI Agent Integration", description: "Deploy intelligent AI agents that handle customer support, lead qualification, and more." },
              { icon: Briefcase, title: "Custom SaaS Automation", description: "Build custom automation solutions tailored to your specific business needs." },
              { icon: BarChart3, title: "Business Intelligence", description: "Create powerful dashboards and reports that provide actionable business insights." },
              { icon: Puzzle, title: "Pre-Built Templates", description: "Launch faster with our library of proven automation templates for every industry." },
              { icon: Server, title: "Hosting & API Management", description: "Reliable hosting and API management to keep your automations running smoothly." },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="service-card h-full">
                  <CardContent className="p-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Your tools, seamlessly connected</h2>
            <p className="text-xl text-gray-400">We integrate with the platforms you already use</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
            {["n8n", "Zapier", "Make", "Slack", "HubSpot", "Shopify", "Gmail", "Trello"].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="glass-card p-6 hover:border-primary/30 transition-all duration-300 aspect-square flex items-center justify-center">
                  <CardContent className="p-0 text-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                    </div>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{tech}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">+ 5000 more integrations</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">How It <span className="text-primary">Works</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From consultation to implementation, we make automation simple and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                number: "01",
                title: "Free Discovery Call",
                description: "Tell us your goals and challenges. We'll map the best automation path for your business in just 30 minutes.",
                icon: Phone,
                duration: "30 min"
              },
              {
                number: "02", 
                title: "Custom Automation Setup",
                description: "We build and connect automations tailored to your business, testing everything before you go live.",
                icon: Cog,
                duration: "1-2 weeks"
              },
              {
                number: "03",
                title: "Launch & Ongoing Support", 
                description: "Go live with peace of mind. We provide monitoring, optimization, and continuous support as you scale.",
                icon: TrendingUp,
                duration: "Ongoing"
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto group-hover:bg-gray-700 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{step.description}</p>
                <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-primary text-sm font-medium">{step.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" ref={templatesRef} className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={templatesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Ready-to-Go Templates</h2>
            <p className="text-xl text-gray-400 mb-8">Launch in days, not months</p>
            
            {/* Template Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.slice(0, 6).map((template, index) => {
              const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Cog;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={templatesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="service-card h-full relative overflow-hidden">
                    {template.popular && (
                      <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/30 z-20">
                        Popular
                      </Badge>
                    )}
                    <CardContent className="p-8 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white">{template.title}</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">{template.description}</p>
                      <div className="space-y-2 mb-6">
                        {template.features.slice(0, 3).map((feature) => (
                          <div key={feature} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-primary">£{template.price}/mo</div>
                        <Button variant="outline" className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all border-gray-600 text-gray-300">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4">
              View All Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Advanced Pricing Calculator */}
      <section id="pricing" ref={pricingRef} className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Calculate Your Automation Investment</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See your potential ROI and cost savings with our interactive calculator
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Calculator Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={pricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card p-8">
                <CardContent className="p-0 space-y-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">Business Details</h3>
                  
                  {/* Business Size */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Business Size</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {businessSizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={businessSize === size ? "default" : "outline"}
                          className="h-auto p-4 text-left justify-start"
                          onClick={() => setBusinessSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Current Pain Points (Select all that apply)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {painPointOptions.map((painPoint) => (
                        <div key={painPoint} className="flex items-center space-x-2">
                          <Checkbox
                            id={painPoint}
                            checked={painPoints.includes(painPoint)}
                            onCheckedChange={(checked) =>
                              handlePainPointChange(painPoint, checked as boolean)
                            }
                          />
                          <label htmlFor={painPoint} className="text-sm cursor-pointer text-gray-300">
                            {painPoint}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Investment */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Hours spent on manual tasks per week: {timeSpent[0]}</h4>
                    <div className="space-y-4">
                      <Slider
                        value={timeSpent}
                        onValueChange={setTimeSpent}
                        max={40}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 hour</span>
                        <span>40+ hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Templates Selection */}
                  <div>
                    <h4 className="font-semibold mb-4 text-white">Select Templates (Optional)</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {templates.slice(0, 8).map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-800/50">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={template.id}
                              checked={selectedTemplates.includes(template.id)}
                              onCheckedChange={(checked) =>
                                handleTemplateSelect(template.id, checked as boolean)
                              }
                            />
                            <div>
                              <label htmlFor={template.id} className="text-sm font-medium cursor-pointer text-white">
                                {template.title}
                              </label>
                              <p className="text-xs text-gray-400">{template.category}</p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            £{template.price}/mo
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={pricingInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="glass-card p-8 sticky top-24">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6 text-white">Your Investment Breakdown</h3>
                  
                  <div className="space-y-6">
                    {/* Cost Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="font-medium text-gray-300">Setup Fee</span>
                        <span className="text-xl font-bold text-white">£{pricing.setupFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="font-medium text-gray-300">Monthly Fee</span>
                        <span className="text-xl font-bold text-white">£{pricing.monthlyFee.toLocaleString()}/mo</span>
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-primary">Your Savings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Saved Monthly</span>
                          <span className="font-semibold text-white">{pricing.timeSaved} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Cost Savings Monthly</span>
                          <span className="font-semibold text-primary">£{pricing.costSavings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Annual Savings</span>
                          <span className="font-semibold text-primary">£{(pricing.costSavings * 12).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="border-t pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {pricing.roi > 0 ? '+' : ''}{pricing.roi}%
                        </div>
                        <p className="text-sm text-gray-400 mb-4">12-Month ROI</p>
                        {pricing.roi > 0 && (
                          <p className="text-sm text-green-600">
                            Break-even in {pricing.breakEven} months
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Visual ROI Chart */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-white">ROI Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Investment</span>
                          <span className="text-gray-300">Savings</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className="bg-red-500 h-full absolute left-0"
                            style={{ width: '40%' }}
                          ></div>
                          <div 
                            className="bg-green-500 h-full absolute"
                            style={{ left: '40%', width: '60%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>£{(pricing.setupFee + pricing.monthlyFee * 12).toLocaleString()}</span>
                          <span>£{(pricing.costSavings * 12).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="border-t pt-6">
                      <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={() => scrollToSection('contact')}
                      >
                        Get Custom Quote
                      </Button>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        No obligation • Free consultation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Ready to Automate Your Success?</h2>
              <p className="text-xl text-gray-400">
                Get started with a free discovery call to explore how automation can transform your business
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-white">Start Your Automation Journey</h3>
                    <AdvancedContactForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span>30-minute consultation with automation expert</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span>Custom automation strategy for your business</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span>ROI projections and timeline estimates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3" />
                        <span>No obligation, completely free</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <Mail className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold">Email</p>
                          <p className="text-muted-foreground">hello@growfastwithus.com</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold">Phone</p>
                          <p className="text-muted-foreground">+44 20 7946 0958</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-6 h-6 text-primary mr-4" />
                        <div>
                          <p className="font-semibold">Business Hours</p>
                          <p className="text-muted-foreground">Mon-Fri: 9AM-6PM GMT</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                        <div>
                          <p className="font-semibold">Regions Served</p>
                          <div className="text-muted-foreground space-y-1">
                            <div>🇬🇧 United Kingdom</div>
                            <div>🇺🇸 United States</div>
                            <div>🇦🇺 Australia</div>
                            <div>🇪🇺 Europe</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">GrowFastWithUs</span>
              </div>
              <p className="text-gray-400 mb-4">
                Automating business success through intelligent workflow solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Workflow Automation</li>
                <li>AI Agent Integration</li>
                <li>Custom SaaS Solutions</li>
                <li>Business Intelligence</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Templates</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Healthcare Automation</li>
                <li>E-commerce Solutions</li>
                <li>Real Estate Tools</li>
                <li>Professional Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Regions</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> United Kingdom</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> United States</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Australia</li>
                <li className="text-gray-400 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Europe</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2024 GrowFastWithUs. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">GDPR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}