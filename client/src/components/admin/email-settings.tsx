import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Settings, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function EmailSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);

  const { data: emailSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/email-settings"],
  });

  const updateEmailSettingsMutation = useMutation({
    mutationFn: (settings: any) =>
      apiRequest("/api/admin/email-settings", "PUT", settings),
    onSuccess: () => {
      toast({ title: "Email settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-settings"] });
    },
    onError: () => {
      toast({ title: "Failed to update email settings", variant: "destructive" });
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: (testEmail: string) =>
      apiRequest("/api/admin/test-email", "POST", { email: testEmail }),
    onSuccess: () => {
      toast({ title: "Test email sent successfully" });
      setIsTesting(false);
    },
    onError: () => {
      toast({ title: "Failed to send test email", variant: "destructive" });
      setIsTesting(false);
    },
  });

  const [formData, setFormData] = useState({
    contactEmail: emailSettings?.contactEmail || '',
    notificationEmail: emailSettings?.notificationEmail || '',
    emailProvider: emailSettings?.emailProvider || 'smtp',
    smtpHost: emailSettings?.smtpHost || '',
    smtpPort: emailSettings?.smtpPort || 587,
    smtpUser: emailSettings?.smtpUser || '',
    smtpPassword: emailSettings?.smtpPassword || '',
    isActive: emailSettings?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailSettingsMutation.mutate(formData);
  };

  const handleTestEmail = () => {
    const testEmail = prompt("Enter email address to send test to:");
    if (testEmail) {
      setIsTesting(true);
      testEmailMutation.mutate(testEmail);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Settings</h2>
        <p className="text-gray-600">Configure how contact form submissions are handled</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Public Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="hello@yourcompany.com"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email displayed on your website for customer contact
                </p>
              </div>

              <div>
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={formData.notificationEmail}
                  onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                  placeholder="notifications@yourcompany.com"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Where contact form submissions will be sent
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Enable email notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* Email Provider Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Email Provider Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select 
                value={formData.emailProvider} 
                onValueChange={(value) => setFormData({ ...formData, emailProvider: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.emailProvider === 'smtp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={formData.smtpUser}
                      onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={formData.smtpPassword}
                      onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                      placeholder="Your app password"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      For Gmail, use an App Password, not your regular password
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.emailProvider === 'gmail' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Gmail Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Enable 2-factor authentication on your Gmail account</li>
                  <li>Generate an App Password in your Google Account settings</li>
                  <li>Use your Gmail address as SMTP username</li>
                  <li>Use the App Password as SMTP password</li>
                  <li>SMTP Host: smtp.gmail.com, Port: 587</li>
                </ol>
              </div>
            )}

            {formData.emailProvider === 'sendgrid' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sendgridKey">SendGrid API Key</Label>
                  <Input
                    id="sendgridKey"
                    type="password"
                    value={formData.smtpPassword}
                    onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                    placeholder="SG.xxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Notification Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input
                id="emailSubject"
                defaultValue="New Contact Form Submission"
                placeholder="New Contact Form Submission"
              />
            </div>

            <div>
              <Label htmlFor="emailTemplate">Email Template</Label>
              <Textarea
                id="emailTemplate"
                rows={8}
                defaultValue={`New contact form submission received:

Name: {{name}}
Email: {{email}}
Company: {{company}}
Phone: {{phone}}
Industry: {{industry}}
Business Size: {{businessSize}}

Pain Points:
{{painPoints}}

Time Spent on Manual Tasks: {{timeSpent}} hours/week

Message:
{{message}}

Submitted: {{date}}`}
                placeholder="Customize your email template..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Use {{fieldName}} to insert form data. Available fields: name, email, company, phone, industry, businessSize, painPoints, timeSpent, message, date
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={updateEmailSettingsMutation.isPending}>
            {updateEmailSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleTestEmail}
            disabled={isTesting || !formData.isActive}
            className="flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            {isTesting ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
      </form>

      {/* Quick Setup Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Gmail</h4>
              <p className="text-sm text-gray-600 mb-2">Free and reliable for small businesses</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Easy setup with App Passwords</li>
                <li>• 500 emails/day limit</li>
                <li>• Built-in spam protection</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">SendGrid</h4>
              <p className="text-sm text-gray-600 mb-2">Professional email service</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 100 emails/day free</li>
                <li>• Advanced analytics</li>
                <li>• Better deliverability</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Custom SMTP</h4>
              <p className="text-sm text-gray-600 mb-2">Use your hosting provider</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Check with your host</li>
                <li>• Usually includes email</li>
                <li>• Domain-based sending</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}