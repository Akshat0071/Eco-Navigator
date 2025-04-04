import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Appearance */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Appearance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle dark mode theme
                      </p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={preferences.isDarkMode}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("isDarkMode", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email updates about your wellness journey
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get weekly summaries of your wellness progress
                      </p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("weeklyReports", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dailyReminders">Daily Reminders</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive daily reminders for wellness activities
                      </p>
                    </div>
                    <Switch
                      id="dailyReminders"
                      checked={preferences.dailyReminders}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("dailyReminders", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Language & Region */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Language & Region
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) =>
                        handlePreferenceChange("language", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-eco-500 focus:ring-eco-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={preferences.timezone}
                      onChange={(e) =>
                        handlePreferenceChange("timezone", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-eco-500 focus:ring-eco-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="CST">Central Time</option>
                      <option value="MST">Mountain Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement account deletion
                      toast.error("Account deletion coming soon");
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 