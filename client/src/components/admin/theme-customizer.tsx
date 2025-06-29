import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Palette, Eye, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function ThemeCustomizer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState(false);

  const { data: themeSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/theme-settings"],
  });

  const updateThemeMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiRequest("/api/admin/settings", "PUT", { key, value, category: "theme" }),
    onSuccess: () => {
      toast({ title: "Theme updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/theme-settings"] });
    },
    onError: () => {
      toast({ title: "Failed to update theme", variant: "destructive" });
    },
  });

  const colorPresets = [
    { name: "Orange (Current)", primary: "#FF5722", secondary: "#FF8A50" },
    { name: "Blue", primary: "#2196F3", secondary: "#64B5F6" },
    { name: "Green", primary: "#4CAF50", secondary: "#81C784" },
    { name: "Purple", primary: "#9C27B0", secondary: "#BA68C8" },
    { name: "Red", primary: "#F44336", secondary: "#EF5350" },
    { name: "Teal", primary: "#009688", secondary: "#4DB6AC" },
  ];

  const fontOptions = [
    { name: "Inter (Current)", value: "Inter, system-ui, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
  ];

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateThemeMutation.mutate({ key: "primary_color", value: preset.primary });
    updateThemeMutation.mutate({ key: "secondary_color", value: preset.secondary });
    
    // Apply CSS custom properties immediately for preview
    document.documentElement.style.setProperty('--primary', preset.primary);
    document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
  };

  const getCurrentSetting = (key: string) => {
    return themeSettings?.find((s: any) => s.key === key)?.value || '';
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
      {/* Preview Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Theme Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Exit Preview" : "Enable Preview"}
            </Button>
            <p className="text-sm text-gray-600">
              {previewMode ? "Changes are applied immediately" : "Enable preview to see changes in real-time"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Presets */}
          <div>
            <Label className="text-base font-medium">Quick Color Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-center gap-2"
                  onClick={() => applyColorPreset(preset)}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primary-color"
                  type="color"
                  defaultValue={getCurrentSetting("primary_color") || "#FF5722"}
                  onChange={(e) => {
                    if (previewMode) {
                      document.documentElement.style.setProperty('--primary', e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    updateThemeMutation.mutate({ key: "primary_color", value: e.target.value });
                  }}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  defaultValue={getCurrentSetting("primary_color") || "#FF5722"}
                  onBlur={(e) => {
                    updateThemeMutation.mutate({ key: "primary_color", value: e.target.value });
                  }}
                  placeholder="#FF5722"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secondary-color"
                  type="color"
                  defaultValue={getCurrentSetting("secondary_color") || "#FF8A50"}
                  onChange={(e) => {
                    if (previewMode) {
                      document.documentElement.style.setProperty('--secondary', e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    updateThemeMutation.mutate({ key: "secondary_color", value: e.target.value });
                  }}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  defaultValue={getCurrentSetting("secondary_color") || "#FF8A50"}
                  onBlur={(e) => {
                    updateThemeMutation.mutate({ key: "secondary_color", value: e.target.value });
                  }}
                  placeholder="#FF8A50"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select
              defaultValue={getCurrentSetting("font_family") || "Inter, system-ui, sans-serif"}
              onValueChange={(value) => {
                updateThemeMutation.mutate({ key: "font_family", value });
                if (previewMode) {
                  document.documentElement.style.setProperty('--font-family', value);
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heading-size">Heading Size Scale</Label>
              <Select
                defaultValue={getCurrentSetting("heading_scale") || "1.2"}
                onValueChange={(value) => {
                  updateThemeMutation.mutate({ key: "heading_scale", value });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.1">Small</SelectItem>
                  <SelectItem value="1.2">Medium (Current)</SelectItem>
                  <SelectItem value="1.3">Large</SelectItem>
                  <SelectItem value="1.4">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="line-height">Line Height</Label>
              <Select
                defaultValue={getCurrentSetting("line_height") || "1.6"}
                onValueChange={(value) => {
                  updateThemeMutation.mutate({ key: "line_height", value });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.4">Tight</SelectItem>
                  <SelectItem value="1.6">Normal (Current)</SelectItem>
                  <SelectItem value="1.8">Relaxed</SelectItem>
                  <SelectItem value="2.0">Loose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout & Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Layout & Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
              <Select
                defaultValue={getCurrentSetting("border_radius") || "0.5rem"}
                onValueChange={(value) => {
                  updateThemeMutation.mutate({ key: "border_radius", value });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sharp</SelectItem>
                  <SelectItem value="0.25rem">Small</SelectItem>
                  <SelectItem value="0.5rem">Medium (Current)</SelectItem>
                  <SelectItem value="0.75rem">Large</SelectItem>
                  <SelectItem value="1rem">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="animation-speed">Animation Speed</Label>
              <Select
                defaultValue={getCurrentSetting("animation_speed") || "normal"}
                onValueChange={(value) => {
                  updateThemeMutation.mutate({ key: "animation_speed", value });
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal (Current)</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="none">No Animations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Theme Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Reset to default theme
                applyColorPreset(colorPresets[0]);
                updateThemeMutation.mutate({ key: "font_family", value: "Inter, system-ui, sans-serif" });
                toast({ title: "Theme reset to default" });
              }}
            >
              Reset to Default
            </Button>
            <Button
              onClick={() => {
                // Apply all current settings
                if (previewMode) {
                  toast({ title: "Theme changes applied" });
                  setPreviewMode(false);
                }
              }}
            >
              Apply Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}