import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  MessageSquare, 
  Star, 
  Palette, 
  Upload,
  Mail,
  Monitor,
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Target
} from "lucide-react";
import { ThemeCustomizer, SiteSettingsManager, MediaLibrary } from "@/components/admin/functional-content-manager";

export default function SimpleDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard
  const dashboardStats = {
    totalContacts: 156,
    totalReviews: 23,
    monthlyGrowth: 12.5,
    conversionRate: 7.2,
    pageViews: 4567,
    avgSessionTime: "3m 45s"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GrowFastWithUs Admin</h1>
              <p className="text-gray-600">Complete website management dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                Admin Access
              </Badge>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                View Website
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalContacts}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardStats.monthlyGrowth}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">
                    4.8 average rating
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.pageViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => setActiveTab("content")} className="h-20 flex flex-col space-y-2">
                  <Palette className="h-6 w-6" />
                  <span>Edit Content</span>
                </Button>
                <Button onClick={() => setActiveTab("contacts")} variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>View Contacts</span>
                </Button>
                <Button onClick={() => setActiveTab("reviews")} variant="outline" className="h-20 flex flex-col space-y-2">
                  <Star className="h-6 w-6" />
                  <span>Manage Reviews</span>
                </Button>
                <Button onClick={() => setActiveTab("analytics")} variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <Tabs defaultValue="theme" className="space-y-6">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="theme">
                <ThemeCustomizer />
              </TabsContent>
              
              <TabsContent value="settings">
                <SiteSettingsManager />
              </TabsContent>
              
              <TabsContent value="media">
                <MediaLibrary />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Management</CardTitle>
                <p className="text-gray-600">View and manage customer inquiries</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Contact Management System</h3>
                  <p className="text-gray-600 mb-4">Advanced contact and lead management tools</p>
                  <Button>View All Contacts</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <p className="text-gray-600">Manage customer testimonials and reviews</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Review Management System</h3>
                  <p className="text-gray-600 mb-4">Add, edit, and schedule customer reviews</p>
                  <Button>Manage Reviews</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <p className="text-gray-600">Track performance and visitor behavior</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <p className="text-gray-600">Configure admin panel and preferences</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive alerts for new contacts and reviews</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Backup Settings</h3>
                      <p className="text-sm text-gray-600">Automatic daily backups enabled</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Security Settings</h3>
                      <p className="text-sm text-gray-600">Two-factor authentication</p>
                    </div>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <p className="text-gray-600">Enterprise-level tools and automation</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <BarChart3 className="h-8 w-8 mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">A/B Testing</h3>
                      <p className="text-sm text-gray-600 mb-4">Test different versions of your pages</p>
                      <Button size="sm">Launch Test</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <Mail className="h-8 w-8 mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Email Campaigns</h3>
                      <p className="text-sm text-gray-600 mb-4">Send targeted email marketing</p>
                      <Button size="sm">Create Campaign</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Lead Scoring</h3>
                      <p className="text-sm text-gray-600 mb-4">AI-powered lead qualification</p>
                      <Button size="sm">View Scores</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <Monitor className="h-8 w-8 mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Performance Monitor</h3>
                      <p className="text-sm text-gray-600 mb-4">Real-time performance tracking</p>
                      <Button size="sm">View Metrics</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}