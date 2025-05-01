import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";

interface UserPreferences {
  isDarkMode: boolean;
  emailNotifications: boolean;
  weeklyReports: boolean;
  dailyReminders: boolean;
  language: string;
  timezone: string;
}

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    isDarkMode: false,
    emailNotifications: true,
    weeklyReports: true,
    dailyReminders: true,
    language: "en",
    timezone: "UTC",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences as UserPreferences);
    }
  }, [user]);

  const handlePreferenceChange = async (
    key: keyof UserPreferences,
    value: boolean | string
  ) => {
    setIsLoading(true);
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: value,
      };
      await updateProfile({ preferences: updatedPreferences });
      setPreferences(updatedPreferences);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 