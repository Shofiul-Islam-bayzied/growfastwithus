import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Palette,
  Settings,
  Upload,
  Save,
  RefreshCw,
  Eye
} from "lucide-react";

// Theme Customizer Component
export function ThemeCustomizer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [colors, setColors] = useState({
    primary: "#FF5722",
    secondary: "#FFF3E0",
    accent: "#FF8A65",
    text: "#1A1A1A",
    background: "#FFFFFF"
  });

  const mutation = useMutation({
    mutationFn: (themeData: any) => apiRequest("/api/admin/theme", "POST", themeData),
    onSuccess: () => {
      toast({
        title: "Theme Updated",
        description: "Your website theme has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/theme"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveTheme = () => {
    mutation.mutate({ colors });
  };

  const previewChanges = () => {
    // Apply theme changes temporarily for preview
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    
    toast({
      title: "Preview Applied",
      description: "Theme preview is now active. Save to make permanent.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customizer
        </CardTitle>
        <p className="text-gray-600">Customize your website's visual appearance</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primary-color"
                type="color"
                value={colors.primary}
                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={colors.primary}
                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                placeholder="#FF5722"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={colors.secondary}
                onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={colors.secondary}
                onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                placeholder="#FFF3E0"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="accent-color"
                type="color"
                value={colors.accent}
                onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={colors.accent}
                onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                placeholder="#FF8A65"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="text-color"
                type="color"
                value={colors.text}
                onChange={(e) => setColors({ ...colors, text: e.target.value })}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={colors.text}
                onChange={(e) => setColors({ ...colors, text: e.target.value })}
                placeholder="#1A1A1A"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={previewChanges} variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview Changes
          </Button>
          <Button 
            onClick={handleSaveTheme} 
            disabled={mutation.isPending}
            className="flex items-center gap-2"
          >
            {mutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Site Settings Component
export function SiteSettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const [formData, setFormData] = useState({
    siteName: "GrowFastWithUs",
    tagline: "Automate Your Business Growth",
    contactEmail: "contact@growfastwithus.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, Suite 100, City, State 12345",
    metaDescription: "Leading automation agency helping businesses grow faster with AI-powered workflows and no-code solutions.",
    heroTitle: "Grow Your Business Faster with Automation",
    heroSubtitle: "Transform your operations with AI-powered workflows and no-code automation solutions"
  });

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: (settings as any)?.siteName || "GrowFastWithUs",
        tagline: (settings as any)?.tagline || "Automate Your Business Growth",
        contactEmail: (settings as any)?.contactEmail || "contact@growfastwithus.com",
        phone: (settings as any)?.phone || "+1 (555) 123-4567",
        address: (settings as any)?.address || "123 Business St, Suite 100, City, State 12345",
        metaDescription: (settings as any)?.metaDescription || "Leading automation agency helping businesses grow faster with AI-powered workflows and no-code solutions.",
        heroTitle: (settings as any)?.heroTitle || "Grow Your Business Faster with Automation",
        heroSubtitle: (settings as any)?.heroSubtitle || "Transform your operations with AI-powered workflows and no-code automation solutions"
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/site-settings", "PUT", data),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Site settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading site settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Site Settings
        </CardTitle>
        <p className="text-gray-600">Update your website's basic information and content</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              placeholder="Your site name"
            />
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Your site tagline"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="contact@yoursite.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Business Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Your business address"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            placeholder="Describe your website for search engines"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="heroTitle">Hero Section Title</Label>
          <Input
            id="heroTitle"
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            placeholder="Main headline on your homepage"
          />
        </div>

        <div>
          <Label htmlFor="heroSubtitle">Hero Section Subtitle</Label>
          <Textarea
            id="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            placeholder="Supporting text for your main headline"
            rows={2}
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={mutation.isPending}
          className="flex items-center gap-2"
        >
          {mutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}

// Media Library Component
export function MediaLibrary() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["/api/admin/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => apiRequest("/api/admin/media/upload", "POST", formData),
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setSelectedFile(null);
      setUploadUrl("");
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const urlUploadMutation = useMutation({
    mutationFn: (data: { url: string; name: string }) => apiRequest("/api/admin/media/url", "POST", data),
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Image has been added from URL.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setUploadUrl("");
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload from URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    uploadMutation.mutate(formData);
  };

  const handleUrlUpload = () => {
    if (!uploadUrl) return;
    
    const fileName = uploadUrl.split('/').pop() || 'uploaded-image';
    urlUploadMutation.mutate({ url: uploadUrl, name: fileName });
  };

  const mockMediaFiles = [
    { id: 1, name: "hero-background.jpg", url: "/images/hero-bg.jpg", size: "2.3 MB", type: "image" },
    { id: 2, name: "company-logo.png", url: "/images/logo.png", size: "156 KB", type: "image" },
    { id: 3, name: "team-photo.jpg", url: "/images/team.jpg", size: "1.8 MB", type: "image" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Library
        </CardTitle>
        <p className="text-gray-600">Upload and manage your website images</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to select</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose File
              </Button>
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <p className="text-sm">Selected: {selectedFile.name}</p>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={uploadMutation.isPending}
                  className="mt-2"
                  size="sm"
                >
                  {uploadMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Upload File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* URL Upload Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Upload from URL</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL..."
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleUrlUpload}
              disabled={!uploadUrl || urlUploadMutation.isPending}
            >
              {urlUploadMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>

        {/* Media Gallery */}
        <div>
          <h3 className="font-semibold mb-3">Media Gallery</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading media files...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockMediaFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="max-w-full max-h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-gray-400 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-1" />
                      <p className="text-xs">Image</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Copy URL
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}