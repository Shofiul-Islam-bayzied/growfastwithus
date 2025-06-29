import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Image, Type, Link } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function ContentEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiRequest("/api/admin/settings", "PUT", { key, value }),
    onSuccess: () => {
      toast({ title: "Settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: () => {
      toast({ title: "Failed to update settings", variant: "destructive" });
    },
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        updateSettingMutation.mutate({ key: 'logo_url', value: result.url });
        toast({ title: "Logo uploaded successfully" });
      }
    } catch (error) {
      toast({ title: "Failed to upload logo", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const contentSections = [
    {
      title: "Hero Section",
      key: "hero",
      fields: [
        { key: "hero_title", label: "Main Headline", type: "text" },
        { key: "hero_subtitle", label: "Subtitle", type: "textarea" },
        { key: "hero_cta_text", label: "Call-to-Action Button Text", type: "text" },
        { key: "hero_cta_url", label: "Call-to-Action URL", type: "url" },
      ]
    },
    {
      title: "Company Information",
      key: "company",
      fields: [
        { key: "company_name", label: "Company Name", type: "text" },
        { key: "company_tagline", label: "Tagline", type: "text" },
        { key: "company_description", label: "Description", type: "textarea" },
        { key: "contact_email", label: "Contact Email", type: "email" },
        { key: "contact_phone", label: "Contact Phone", type: "text" },
        { key: "contact_address", label: "Address", type: "textarea" },
      ]
    },
    {
      title: "Services Section",
      key: "services",
      fields: [
        { key: "services_title", label: "Services Section Title", type: "text" },
        { key: "services_description", label: "Services Description", type: "textarea" },
      ]
    },
    {
      title: "About Section",
      key: "about",
      fields: [
        { key: "about_title", label: "About Section Title", type: "text" },
        { key: "about_content", label: "About Content", type: "textarea" },
        { key: "about_mission", label: "Mission Statement", type: "textarea" },
      ]
    }
  ];

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
      {/* Logo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Logo & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Upload New Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              {isUploading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Upload PNG, JPG, or SVG. Recommended size: 200x80px
            </p>
          </div>
          
          {settings?.find((s: any) => s.key === 'logo_url')?.value && (
            <div>
              <Label>Current Logo Preview</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <img 
                  src={settings.find((s: any) => s.key === 'logo_url')?.value} 
                  alt="Current Logo" 
                  className="max-h-20 object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sections */}
      {contentSections.map((section) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => {
              const currentValue = settings?.find((s: any) => s.key === field.key)?.value || '';
              
              return (
                <div key={field.key}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      defaultValue={currentValue}
                      onBlur={(e) => {
                        if (e.target.value !== currentValue) {
                          updateSettingMutation.mutate({
                            key: field.key,
                            value: e.target.value
                          });
                        }
                      }}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type}
                      defaultValue={currentValue}
                      onBlur={(e) => {
                        if (e.target.value !== currentValue) {
                          updateSettingMutation.mutate({
                            key: field.key,
                            value: e.target.value
                          });
                        }
                      }}
                      className="mt-1"
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const newUrl = prompt("Enter new Call-to-Action URL:");
                if (newUrl) {
                  updateSettingMutation.mutate({ key: 'hero_cta_url', value: newUrl });
                }
              }}
            >
              Update CTA Link
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newEmail = prompt("Enter new contact email:");
                if (newEmail) {
                  updateSettingMutation.mutate({ key: 'contact_email', value: newEmail });
                }
              }}
            >
              Update Contact Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}