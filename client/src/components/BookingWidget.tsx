import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

interface BookingWidgetProps {
  calLink?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function BookingWidget({ 
  calLink = "growfastwithus/consultation", 
  title = "Schedule a Consultation",
  description = "Book a free 30-minute consultation to discuss your automation needs",
  className = "" 
}: BookingWidgetProps) {
  
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const openCalModal = () => {
    // @ts-ignore - Cal.com global function
    if (typeof window !== 'undefined' && window.Cal) {
      // @ts-ignore
      window.Cal("ui", {
        styles: { branding: { brandColor: "#FF6B35" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
      // @ts-ignore
      window.Cal("preload", { calLink });
      // @ts-ignore
      window.Cal("ui", { "modal": { "height": "700px" } });
      // @ts-ignore
      window.Cal("openmodal", { calLink });
    } else {
      // Fallback to direct Cal.com link
      window.open(`https://cal.com/${calLink}`, '_blank');
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">30 Minutes</span>
            <span className="text-xs text-gray-500">Duration</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">1-on-1</span>
            <span className="text-xs text-gray-500">Session</span>
          </div>
        </div>
        
        <Button 
          onClick={openCalModal}
          className="w-full bg-primary hover:bg-primary/90 text-white"
          size="lg"
        >
          Schedule Now
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          Free consultation • No commitment required
        </p>
      </CardContent>
    </Card>
  );
}

// Inline booking component for embedding directly in pages
export function InlineBooking({ 
  calLink = "growfastwithus/consultation",
  className = "" 
}: { calLink?: string; className?: string }) {
  
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize inline embed
    const initEmbed = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.Cal) {
        // @ts-ignore
        window.Cal("inline", {
          elementOrSelector: "#cal-inline",
          calLink,
          layout: "month_view",
          theme: "light",
          styles: {
            branding: {
              brandColor: "#FF6B35"
            }
          }
        });
      }
    };

    // Wait for script to load then initialize
    script.onload = initEmbed;
    
    // If script already loaded
    if (script.readyState === 'complete') {
      initEmbed();
    }

    return () => {
      const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [calLink]);

  return (
    <div className={className}>
      <div 
        id="cal-inline" 
        style={{ 
          width: "100%", 
          height: "630px", 
          overflow: "scroll" 
        }}
      />
    </div>
  );
}

// Simple booking button component
export function BookingButton({ 
  calLink = "growfastwithus/consultation",
  children = "Book Consultation",
  variant = "default",
  size = "default",
  className = ""
}: {
  calLink?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleClick = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Cal) {
      // @ts-ignore
      window.Cal("ui", {
        styles: { branding: { brandColor: "#FF6B35" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
      // @ts-ignore
      window.Cal("preload", { calLink });
      // @ts-ignore
      window.Cal("openmodal", { calLink });
    } else {
      window.open(`https://cal.com/${calLink}`, '_blank');
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}