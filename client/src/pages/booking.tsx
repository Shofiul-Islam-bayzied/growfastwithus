import { motion } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  Star, 
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";

export default function Booking() {
  useEffect(() => {
    // Cal.com inline embed initialization
    const script = document.createElement('script');
    script.innerHTML = `
      (function (C, A, L) { 
        let p = function (a, ar) { a.q.push(ar); }; 
        let d = C.document; 
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; 
          let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if(typeof namespace === "string"){
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
          } 
          p(cal, ar); 
        }; 
      })(window, "https://app.cal.com/embed/embed.js", "init");
      
      Cal("init", "30min", {origin:"https://app.cal.com"});
      
      Cal.ns["30min"]("inline", {
        elementOrSelector:"#my-cal-inline",
        config: {
          "layout":"month_view",
          "theme": "dark",
          "branding": {
            "brandColor": "#FF6B35"
          }
        },
        calLink: "grow-fast-with-us/30min",
      });
      
      Cal.ns["30min"]("ui", {
        "hideEventTypeDetails":false,
        "layout":"month_view",
        "theme": "dark",
        "styles": {
          "branding": {
            "brandColor": "#FF6B35"
          }
        }
      });
    `;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="glass-card shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <img 
                  src="/attached_assets/white tect logo_1751164300901.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="tel:+442079460958" className="text-white hover:text-primary transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="mailto:hello@growfastwithus.com" className="text-white hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-300">Book Consultation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Schedule Your Free
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Automation Consultation</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get expert guidance on automating your business processes. Our 30-minute consultation is completely free with no obligation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Calendar */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-white mb-4">Choose Your Preferred Time</CardTitle>
                  <p className="text-gray-400">
                    Select a time that works best for you. All times are shown in your local timezone.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden" style={{minHeight: "600px"}}>
                    <div 
                      id="my-cal-inline" 
                      style={{
                        width: "100%", 
                        height: "600px", 
                        overflow: "scroll",
                        backgroundColor: "#1a1a1a",
                        borderRadius: "8px"
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation Details */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Session Info */}
              <Card className="glass-card p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white mb-4">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="font-semibold text-white">Duration</p>
                      <p className="text-gray-400">30 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="font-semibold text-white">Format</p>
                      <p className="text-gray-400">1-on-1 Video Call</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="font-semibold text-white">Platform</p>
                      <p className="text-gray-400">Google Meet / Zoom</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What We'll Cover */}
              <Card className="glass-card p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white mb-4">What We'll Discuss</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-300">Your current business processes and pain points</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-300">Automation opportunities and potential ROI</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-300">Custom automation strategy for your business</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-300">Implementation timeline and next steps</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <span className="text-gray-300">Q&A about our services and approach</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Booking */}
              <Card className="glass-card p-6">
                <CardHeader>
                  <CardTitle className="text-xl text-white mb-4">Alternative Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm mb-4">
                    Can't find a suitable time? We have other options available.
                  </p>
                  
                  <Button 
                    onClick={() => window.open('https://cal.com/grow-fast-with-us/30min', '_blank')}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Quick Book (New Tab)
                  </Button>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">Need immediate assistance?</p>
                    <div className="space-y-2">
                      <a 
                        href="tel:+442079460958" 
                        className="flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        +44 20 7946 0958
                      </a>
                      <a 
                        href="mailto:hello@growfastwithus.com" 
                        className="flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        hello@growfastwithus.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="glass-card p-6">
                <CardContent className="text-center">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm italic mb-4">
                    "The consultation was incredibly valuable. They identified automation opportunities I hadn't even considered!"
                  </p>
                  <p className="text-gray-400 text-xs">
                    - Sarah M., Tech Startup Founder
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}