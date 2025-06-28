import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { templates } from "@/lib/templates";
import {
  Sun,
  Moon,
  Phone,
  Mail,
  Clock,
  MapPin,
  Stethoscope,
  Home,
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
  home: Home,
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
  const [showContactForm, setShowContactForm] = useState(false);

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
  const caseStudiesRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true });
  const templatesInView = useInView(templatesRef, { once: true });
  const pricingInView = useInView(pricingRef, { once: true });
  const caseStudiesInView = useInView(caseStudiesRef, { once: true });

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
    
    const baseMonthly = painPoints.length * 150 + 299;
    const timeSavings = timeSpent[0] * 4; // 4 weeks per month
    const costSavings = timeSavings * 40; // £40 per hour saved
    const roi = ((costSavings * 12 - baseSetup - baseMonthly * 12) / (baseSetup + baseMonthly * 12)) * 100;
    
    return {
      setupFee: baseSetup,
      monthlyFee: baseMonthly,
      timeSaved: timeSavings,
      costSavings,
      roi: Math.round(roi),
    };
  };

  const pricing = calculatePricing();

  const handleContactFormSubmit = (data: any) => {
    console.log("Contact form submitted:", data);
    // TODO: Submit to API
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
              <a href="#case-studies" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection('case-studies'); }}>Case Studies</a>
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
      <section id="home" ref={heroRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
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
      <section id="services" ref={servicesRef} className="py-20 bg-cream-primary/50 dark:bg-gray-900">
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
                <Card className="glass-card h-full hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/80 transition-colors">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Powered by Cutting-Edge Technology</h2>
            <p className="text-xl text-muted-foreground">We use the best tools in the industry to deliver exceptional results</p>
          </div>
          
          <div className="overflow-hidden">
            <motion.div
              className="flex justify-center items-center flex-wrap gap-8"
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {["n8n", "Make.com", "Langflow", "OpenAI", "ElevenLabs", "Pinecone", "Stripe", "Shopify"].map((tech) => (
                <Card key={tech} className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-110">
                  <CardContent className="p-0 text-center">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold">{tech}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" ref={templatesRef} className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={templatesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ready-to-Go Templates</h2>
            <p className="text-xl text-muted-foreground mb-8">Launch in days, not months</p>
            
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
                  <Card className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-primary" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">£{template.price}</div>
                          <div className="text-sm text-muted-foreground">/month</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{template.title}</h3>
                      <p className="text-muted-foreground mb-4">{template.description}</p>
                      {template.popular && (
                        <Badge className="mb-3 bg-primary/10 text-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      <Button className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
              View All Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" ref={pricingRef} className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Calculate Your Automation Investment</h2>
            <p className="text-xl text-muted-foreground">Get a personalized quote based on your business needs</p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="glass-card shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Calculator Inputs */}
                  <div className="space-y-8">
                    {/* Business Size */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Business Size</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {businessSizes.map((size) => (
                          <Button
                            key={size}
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
                      <h3 className="text-lg font-semibold mb-4">Current Pain Points</h3>
                      <div className="space-y-3">
                        {painPointOptions.map((painPoint) => (
                          <div key={painPoint} className="flex items-center space-x-2">
                            <Checkbox
                              id={painPoint}
                              checked={painPoints.includes(painPoint)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPainPoints([...painPoints, painPoint]);
                                } else {
                                  setPainPoints(painPoints.filter(p => p !== painPoint));
                                }
                              }}
                            />
                            <label htmlFor={painPoint} className="text-sm cursor-pointer">
                              {painPoint}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Time Investment */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Hours spent on manual tasks per week: {timeSpent[0]}
                      </h3>
                      <Slider
                        value={timeSpent}
                        onValueChange={setTimeSpent}
                        max={40}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>1 hour</span>
                        <span>40+ hours</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results */}
                  <motion.div
                    className="glass-card p-6 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <h3 className="text-2xl font-bold mb-6">Your Investment Breakdown</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Setup Fee:</span>
                        <span className="font-semibold">£{pricing.setupFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Monthly Cost:</span>
                        <span className="font-semibold">£{pricing.monthlyFee}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Time Saved (per month):</span>
                        <span className="font-semibold text-primary">{pricing.timeSaved} hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cost Savings (per month):</span>
                        <span className="font-semibold text-green-500">£{pricing.costSavings.toLocaleString()}</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ROI (12 months):</span>
                        <span className="text-2xl font-bold text-green-500">{pricing.roi}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-300 font-semibold flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Break-even in {Math.ceil((pricing.setupFee + pricing.monthlyFee) / (pricing.costSavings - pricing.monthlyFee))} months
                      </p>
                    </div>
                    
                    <Button className="w-full mt-6 bg-primary hover:bg-primary/90" size="lg">
                      Get Custom Quote
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" ref={caseStudiesRef} className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={caseStudiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Real Results, Real Impact</h2>
            <p className="text-xl text-muted-foreground">See how our automation solutions transform businesses</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              { metric: "40%", title: "Increase in Lead Conversion", client: "Real Estate Client", detail: "60 hours/month saved" },
              { metric: "25%", title: "Increase in Recovery Sales", client: "E-Commerce Client", detail: "£15K additional monthly revenue" },
              { metric: "35%", title: "Reduction in No-Show Rates", client: "Medical Clinic", detail: "95% appointment efficiency" },
            ].map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                animate={caseStudiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card text-center hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-6 flex items-center justify-center">
                      <Award className="w-16 h-16 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{study.metric}</div>
                    <div className="text-lg font-semibold mb-2">{study.title}</div>
                    <div className="text-muted-foreground mb-4">{study.client}</div>
                    <div className="text-2xl font-bold text-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {study.detail}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Statistics */}
          <Card className="glass-card shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "250+", label: "Happy Clients" },
                  { value: "50,000+", label: "Hours Saved" },
                  { value: "£2.5M+", label: "Revenue Generated" },
                  { value: "500+", label: "Automations Deployed" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={caseStudiesInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Success stories from businesses just like yours</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <blockquote className="text-2xl font-medium mb-6 italic">
                  "The automation system saved us 40 hours per week and increased our lead conversion by 60%. The ROI was immediate and the support team is exceptional."
                </blockquote>
                <div className="text-lg font-semibold text-primary">Sarah Johnson</div>
                <div className="text-muted-foreground">CEO, Johnson Real Estate Group</div>
                
                <div className="flex justify-center mt-6 space-x-2">
                  {[0, 1, 2].map((i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      className={`w-3 h-3 rounded-full p-0 ${i === 0 ? 'bg-primary' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            style={{
              top: `${30 + i * 20}%`,
              left: `${20 + i * 30}%`,
            }}
            animate={{
              y: [-10, 10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Automate Your Success?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Get started with a free consultation and see how automation can transform your business</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card shadow-2xl">
              <CardContent className="p-8">
                {!showContactForm ? (
                  <div className="text-center">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setShowContactForm(true)}
                    >
                      Start Your Free Consultation
                    </Button>
                  </div>
                ) : (
                  <MultiStepForm onSubmit={handleContactFormSubmit} />
                )}
              </CardContent>
            </Card>
            
            {/* Contact Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card text-center text-white">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-300">+44 20 7000 0000</p>
                </CardContent>
              </Card>
              <Card className="glass-card text-center text-white">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-300">hello@growfastwithus.com</p>
                </CardContent>
              </Card>
              <Card className="glass-card text-center text-white">
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                  <p className="text-gray-300">Mon-Fri: 9AM-6PM GMT</p>
                </CardContent>
              </Card>
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
                <span className="text-xl font-bold">Digital Empire Grow Fast</span>
              </div>
              <p className="text-gray-400 mb-6">Automating success for businesses worldwide through cutting-edge workflow automation and AI integration.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Workflow Automation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">AI Integration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Custom SaaS</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Regions Served</h3>
              <ul className="space-y-3">
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
