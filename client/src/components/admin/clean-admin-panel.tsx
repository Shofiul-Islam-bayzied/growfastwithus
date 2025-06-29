import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Palette,
  Upload,
  Star,
  BarChart3,
  Mail,
  Shield,
  Database,
  Users,
  RefreshCw,
  Save,
  Eye,
  Trash2,
  Edit,
  Copy,
  Plus,
  Image as ImageIcon,
  Monitor,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

// Theme Customizer Component
function ThemeCustomizer() {
  const { toast } = useToast();
  const [colors, setColors] = useState({
    primary: "#FF6B35",
    secondary: "#FFFFFF",
    accent: "#1F2937"
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const themeMutation = useMutation({
    mutationFn: (themeData: any) => apiRequest("/api/admin/theme", "POST", themeData),
    onSuccess: () => {
      toast({
        title: "Theme Updated",
        description: "Your website theme has been updated successfully.",
      });
    },
  });

  const logoMutation = useMutation({
    mutationFn: (formData: FormData) => apiRequest("/api/admin/logo/upload", "POST", formData),
    onSuccess: (response: any) => {
      toast({
        title: "Logo Updated",
        description: "Your website logo has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
  });

  const handleLogoUpload = () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append('logo', logoFile);
    logoMutation.mutate(formData);
  };

  const handleSaveTheme = () => {
    themeMutation.mutate({
      colors,
      updatedAt: new Date()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div>
          <Label className="text-base font-semibold">Website Logo</Label>
          <div className="mt-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            {siteSettings && (siteSettings as any)?.site_logo ? (
              <div className="flex items-center gap-4">
                <img src={(siteSettings as any).site_logo} alt="Current Logo" className="h-12 w-auto" />
                <div>
                  <p className="text-sm text-gray-600">Current Logo</p>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                    Change Logo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload your website logo</p>
                <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                  Choose Logo
                </Button>
              </div>
            )}
            
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            
            {logoFile && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{logoFile.name}</span>
                  <Button size="sm" onClick={handleLogoUpload} disabled={logoMutation.isPending}>
                    {logoMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Upload"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Color Customization */}
        <div>
          <Label className="text-base font-semibold">Brand Colors</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({...colors, primary: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => setColors({...colors, primary: e.target.value})}
                  className="font-mono text-sm"
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
                  onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  className="font-mono text-sm"
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
                  onChange={(e) => setColors({...colors, accent: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => setColors({...colors, accent: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSaveTheme} disabled={themeMutation.isPending} className="flex items-center gap-2">
          {themeMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Theme
        </Button>
      </CardContent>
    </Card>
  );
}

// Site Settings Manager
function SiteSettingsManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "GrowFastWithUs",
    tagline: "Automate Your Business Growth",
    description: "Professional business automation solutions",
    contactEmail: "hello@growfastwithus.com",
    phone: "+1 (555) 123-4567"
  });

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const settingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/site-settings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your site settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
  });

  const handleSaveSettings = () => {
    settingsMutation.mutate(settings);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><RefreshCw className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Site Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="site-name">Site Name</Label>
          <Input
            id="site-name"
            value={settings.siteName}
            onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            placeholder="Your company name"
          />
        </div>
        
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({...settings, tagline: e.target.value})}
            placeholder="Brief description of your business"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => setSettings({...settings, description: e.target.value})}
            placeholder="Detailed description of your services"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              placeholder="contact@yourcompany.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <Button onClick={handleSaveSettings} disabled={settingsMutation.isPending} className="flex items-center gap-2">
          {settingsMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}

// Media Library
function MediaLibrary() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["/api/admin/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const file = formData.get('file') as File;
      if (!file) throw new Error('No file selected');
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      return apiRequest("/api/admin/media/upload", "POST", formData);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Upload Successful",
        description: `${response.file.name} has been uploaded successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
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

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard.",
      });
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
            <p className="text-gray-600 mb-4">Drag and drop files here, or click to select</p>
            <p className="text-xs text-gray-500 mb-4">Supports: JPG, PNG, GIF, WebP • Max size: 5MB</p>
            
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button onClick={handleFileUpload} disabled={uploadMutation.isPending} size="sm">
                    {uploadMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaFiles?.map((file: any) => (
              <div key={file.id} className="border rounded-lg p-3">
                <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                  {file.url ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => copyToClipboard(file.url)}
                >
                  Copy URL
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Review Management
function ReviewManager() {
  const { toast } = useToast();
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    reviewText: "",
    company: ""
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/reviews", "POST", data),
    onSuccess: () => {
      toast({
        title: "Review Added",
        description: "New review has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      setNewReview({ customerName: "", rating: 5, reviewText: "", company: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/reviews/${id}`, "DELETE"),
    onSuccess: () => {
      toast({
        title: "Review Deleted",
        description: "Review has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
  });

  const handleSubmit = () => {
    if (!newReview.customerName || !newReview.reviewText) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and review text.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(newReview);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Review Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Review */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Add New Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={newReview.customerName}
                onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={newReview.company}
                onChange={(e) => setNewReview({...newReview, company: e.target.value})}
                placeholder="Tech Corp"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="rating">Rating</Label>
            <select
              id="rating"
              className="w-full p-2 border rounded-md"
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="review-text">Review Text</Label>
            <Textarea
              id="review-text"
              value={newReview.reviewText}
              onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})}
              placeholder="Great service and amazing results..."
              rows={3}
            />
          </div>
          
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="mt-4 flex items-center gap-2">
            {createMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Review
          </Button>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(reviews) && reviews.map((review: any) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.customerName}</span>
                      {review.company && <span className="text-gray-500">• {review.company}</span>}
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.reviewText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(review.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Analytics Dashboard
function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Website Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">↑ 23%</div>
              <div className="text-sm text-gray-600">Traffic Growth</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">7.2%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">3m 45s</div>
              <div className="text-sm text-gray-600">Avg. Session</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Settings
function AdminSettings() {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    notifications: true,
    backups: true,
    security: false
  });

  const settingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/settings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Admin settings have been saved successfully.",
      });
    },
  });

  const handleSaveSettings = () => {
    settingsMutation.mutate(emailSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </h3>
              <p className="text-sm text-gray-600">Receive alerts for new contacts and reviews</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Backup Settings
              </h3>
              <p className="text-sm text-gray-600">Automatic daily backups enabled</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Settings
              </h3>
              <p className="text-sm text-gray-600">Two-factor authentication</p>
            </div>
            <Button variant="outline">Setup</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Clean Admin Panel Component
export default function CleanAdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your website content and settings</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThemeCustomizer />
              <SiteSettingsManager />
            </div>
            <MediaLibrary />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Contact management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}