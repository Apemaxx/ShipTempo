import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const ThemeSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const navigate = useNavigate();

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsSystemTheme(false);
      setIsDarkMode(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      // Use system preference
      setIsSystemTheme(true);
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(systemPrefersDark);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);

    if (!isSystemTheme) {
      localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    }
  };

  // Toggle system theme
  const toggleSystemTheme = () => {
    const newSystemTheme = !isSystemTheme;
    setIsSystemTheme(newSystemTheme);

    if (newSystemTheme) {
      // Remove from localStorage and use system preference
      localStorage.removeItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(systemPrefersDark);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    } else {
      // Store current preference in localStorage
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Customize the appearance of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  {isDarkMode ? (
                    <Moon className="mr-2 h-5 w-5" />
                  ) : (
                    <Sun className="mr-2 h-5 w-5" />
                  )}
                  <h3 className="font-medium">Dark Mode</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                disabled={isSystemTheme}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-medium">Use System Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically match your system's theme settings
                </p>
              </div>
              <Switch
                checked={isSystemTheme}
                onCheckedChange={toggleSystemTheme}
              />
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Sun className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Light Mode</p>
                  </div>
                </div>
                <div className="bg-card border dark:bg-slate-800 rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Moon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Dark Mode</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeSettings;
