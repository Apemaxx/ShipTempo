import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Phone, Save } from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const Notifications = () => {
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: "shipment-updates",
      title: "Shipment Updates",
      description:
        "Receive notifications when there are updates to your shipments",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "quote-responses",
      title: "Quote Responses",
      description:
        "Get notified when you receive responses to your quote requests",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "document-uploads",
      title: "Document Uploads",
      description:
        "Be alerted when new documents are uploaded to your shipments",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "customs-clearance",
      title: "Customs Clearance",
      description: "Notifications about customs clearance status changes",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "delivery-alerts",
      title: "Delivery Alerts",
      description:
        "Get notified about delivery schedule changes and confirmations",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "payment-reminders",
      title: "Payment Reminders",
      description: "Receive reminders about upcoming and overdue payments",
      email: true,
      push: false,
      sms: false,
    },
  ]);

  const [emailSettings, setEmailSettings] = useState({
    email: "jane.doe@example.com",
    digest: "daily",
  });

  const [pushSettings, setPushSettings] = useState({
    enabled: true,
    browser: true,
    mobile: true,
  });

  const [smsSettings, setSmsSettings] = useState({
    phone: "+1 (555) 123-4567",
    enabled: true,
  });

  const handleToggleNotification = (
    id: string,
    channel: "email" | "push" | "sms",
  ) => {
    setNotificationSettings(
      notificationSettings.map((setting) =>
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting,
      ),
    );
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log("Saving notification settings:", {
      notificationSettings,
      emailSettings,
      pushSettings,
      smsSettings,
    });

    // Show success message
    alert("Notification preferences saved successfully!");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <Button onClick={handleSaveChanges}>
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="preferences">
            Notification Preferences
          </TabsTrigger>
          <TabsTrigger value="channels">Delivery Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive and how you want
                to receive them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="grid gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{setting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${setting.id}-email`}
                            checked={setting.email}
                            onCheckedChange={() =>
                              handleToggleNotification(setting.id, "email")
                            }
                          />
                          <Label
                            htmlFor={`${setting.id}-email`}
                            className="text-sm"
                          >
                            <Mail className="h-4 w-4" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${setting.id}-push`}
                            checked={setting.push}
                            onCheckedChange={() =>
                              handleToggleNotification(setting.id, "push")
                            }
                          />
                          <Label
                            htmlFor={`${setting.id}-push`}
                            className="text-sm"
                          >
                            <Bell className="h-4 w-4" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${setting.id}-sms`}
                            checked={setting.sms}
                            onCheckedChange={() =>
                              handleToggleNotification(setting.id, "sms")
                            }
                          />
                          <Label
                            htmlFor={`${setting.id}-sms`}
                            className="text-sm"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure how you receive email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={emailSettings.email}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="digest">Email Digest</Label>
                  <select
                    id="digest"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={emailSettings.digest}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        digest: e.target.value,
                      })
                    }
                  >
                    <option value="instant">Instant</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Configure push notification settings for browser and mobile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-enabled">
                    Enable Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in real-time
                  </p>
                </div>
                <Switch
                  id="push-enabled"
                  checked={pushSettings.enabled}
                  onCheckedChange={(checked) =>
                    setPushSettings({ ...pushSettings, enabled: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-push">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  id="browser-push"
                  checked={pushSettings.browser}
                  onCheckedChange={(checked) =>
                    setPushSettings({ ...pushSettings, browser: checked })
                  }
                  disabled={!pushSettings.enabled}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mobile-push">Mobile App Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your mobile device
                  </p>
                </div>
                <Switch
                  id="mobile-push"
                  checked={pushSettings.mobile}
                  onCheckedChange={(checked) =>
                    setPushSettings({ ...pushSettings, mobile: checked })
                  }
                  disabled={!pushSettings.enabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Configure SMS notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important notifications via SMS
                  </p>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={smsSettings.enabled}
                  onCheckedChange={(checked) =>
                    setSmsSettings({ ...smsSettings, enabled: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={smsSettings.phone}
                    onChange={(e) =>
                      setSmsSettings({ ...smsSettings, phone: e.target.value })
                    }
                    disabled={!smsSettings.enabled}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Standard message rates may apply
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
