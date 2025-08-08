import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, AlertTriangle, CreditCard, Users, Mail } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-card shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="GrowFastWithUs Logo" 
                  className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            
            <Link href="/">
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-400">
              Last updated: January 1, 2025
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Scale className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      By accessing and using GrowFastWithUs services, you accept and agree to be bound by the terms 
                      and provision of this agreement. These Terms of Service ("Terms") govern your use of our 
                      automation solutions, website, and related services.
                    </p>
                    <p>
                      If you do not agree to abide by the above, please do not use this service. We reserve the right 
                      to change these terms at any time with reasonable notice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Service Description</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      GrowFastWithUs provides business automation solutions including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Custom workflow automation design and implementation</li>
                      <li>AI-powered business process optimization</li>
                      <li>Integration services for existing business systems</li>
                      <li>Training and support for automation solutions</li>
                      <li>Ongoing maintenance and optimization services</li>
                    </ul>
                    <p>
                      All services are provided "as is" and we reserve the right to modify, suspend, or discontinue 
                      any part of our services with reasonable notice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Payment Terms</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Payment terms and conditions:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Monthly Subscriptions:</strong> Billed monthly in advance, auto-renewal unless cancelled</li>
                      <li><strong>Setup Fees:</strong> One-time implementation fees as quoted, payable before project start</li>
                      <li><strong>Refunds:</strong> 30-day money-back guarantee for new customers on monthly plans</li>
                      <li><strong>Late Payments:</strong> Services may be suspended for accounts 15+ days overdue</li>
                      <li><strong>Price Changes:</strong> 30 days notice for subscription price changes</li>
                      <li><strong>Cancellation:</strong> Can be done anytime with services continuing until end of billing period</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Limitations of Liability</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      To the maximum extent permitted by applicable law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Our liability is limited to the amount paid for services in the 12 months preceding the claim</li>
                      <li>We are not liable for indirect, incidental, special, or consequential damages</li>
                      <li>We do not guarantee uninterrupted or error-free service operation</li>
                      <li>Business results and ROI estimates are projections, not guarantees</li>
                      <li>You are responsible for backing up your data and systems</li>
                      <li>Force majeure events excuse performance delays or failures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">User Responsibilities</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      As a user of our services, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and complete information when requested</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Use our services only for lawful business purposes</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Not attempt to reverse engineer or copy our automation solutions</li>
                      <li>Report any security vulnerabilities or service issues promptly</li>
                      <li>Respect intellectual property rights of GrowFastWithUs and third parties</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Contact & Disputes</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      For questions about these Terms of Service or to resolve disputes:
                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                      <p><strong>Email:</strong> legal@growfastwithus.com</p>
                      <p><strong>Governing Law:</strong> These terms are governed by UK law</p>
                      <p><strong>Dispute Resolution:</strong> Disputes resolved through binding arbitration</p>
                      <p><strong>Jurisdiction:</strong> UK courts have exclusive jurisdiction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Need Clarification on Our Terms?</h3>
            <p className="text-gray-300 mb-6">
              Our team is available to explain any aspect of our Terms of Service and how they apply to your business.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}