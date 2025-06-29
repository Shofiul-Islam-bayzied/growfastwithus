import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/templates";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Menu,
  X
} from "lucide-react";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ["All Templates", ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "All Templates" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/attached_assets/white tect logo_1751164300901.png" 
                alt="GrowFastWithUs Logo" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 border-t border-white/20 glass-card backdrop-blur-xl bg-black/80"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <Link href="/" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full text-white border-white/30 hover:bg-white/10 text-lg py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Back to Home
                  </Button>
                </Link>
                <div className="px-2 pt-2">
                  <Link href="/" className="block">
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started Today
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ready-to-Go Automation Templates
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our complete library of proven automation solutions. Each template is designed to solve specific business challenges and deliver immediate results.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-400 text-sm">Templates Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-gray-400 text-sm">Implementations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-gray-400 text-sm">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">30 Days</div>
              <div className="text-gray-400 text-sm">Average ROI</div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 
                    "bg-primary text-white" : 
                    "text-gray-300 border-gray-600 hover:bg-gray-800"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-gray-900/50 border-gray-700 hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          {/* Using a dynamic icon based on template category */}
                          {template.category === "Healthcare" && <Users className="w-6 h-6 text-primary" />}
                          {template.category === "Real Estate" && <TrendingUp className="w-6 h-6 text-primary" />}
                          {template.category === "E-commerce" && <Zap className="w-6 h-6 text-primary" />}
                          {template.category === "Professional Services" && <Users className="w-6 h-6 text-primary" />}
                          {template.category === "Food & Beverage" && <Clock className="w-6 h-6 text-primary" />}
                          {!["Healthcare", "Real Estate", "E-commerce", "Professional Services", "Food & Beverage"].includes(template.category) && <Zap className="w-6 h-6 text-primary" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{template.title}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      {template.popular && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-6 flex-grow">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-white mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-gray-400 text-xs">
                            +{template.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-gray-700">
                      <div className="text-center">
                        <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Setup</div>
                        <div className="text-sm font-medium text-white">1-2 Days</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-400">ROI</div>
                        <div className="text-sm font-medium text-white">30 Days</div>
                      </div>
                      <div className="text-center">
                        <Zap className="w-4 h-4 text-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Saves</div>
                        <div className="text-sm font-medium text-white">20+ hrs/week</div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          £{template.price}
                        </span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                      <Link href={`/template/${template.id}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">No templates found matching your criteria</div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Templates");
                }}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Don't See What You Need?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We create custom automation solutions tailored to your specific business needs. 
              Let's discuss how we can build the perfect automation for your workflow.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Request Custom Solution
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}