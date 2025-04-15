import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Brain,
  Bot,
  Code,
  Webhook,
  Workflow,
  FileJson,
  ArrowRight,
  FileText,
  Truck,
  Package,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

const Integrations = () => {
  const apiKey = "sk_test_example_key_12345";
  const [activeTab, setActiveTab] = useState("services");

  const integrations = [
    {
      id: "google",
      name: "Google Workspace",
      description:
        "Connect with Google Calendar, Gmail, and other Google services",
      icon: <div className="w-6 h-6 bg-primary/20 rounded-sm"></div>,
      connected: false,
      category: "productivity",
    },
    {
      id: "microsoft",
      name: "Microsoft 365",
      description: "Connect with Outlook, Teams, and other Microsoft services",
      icon: <div className="w-6 h-6 bg-primary/20 rounded-sm"></div>,
      connected: true,
      category: "productivity",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect with thousands of apps through Zapier",
      icon: <div className="w-6 h-6 bg-primary/20 rounded-sm"></div>,
      connected: false,
      category: "automation",
    },
    {
      id: "make",
      name: "Make (Integromat)",
      description: "Create complex automation workflows",
      icon: <div className="w-6 h-6 bg-primary/20 rounded-sm"></div>,
      connected: false,
      category: "automation",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Integrate AI capabilities with GPT models",
      icon: <Brain className="h-6 w-6 text-green-600" />,
      connected: false,
      category: "ai",
    },
    {
      id: "claude",
      name: "Claude AI",
      description: "Add Anthropic's Claude AI capabilities to your workflow",
      icon: <Bot className="h-6 w-6 text-purple-600" />,
      connected: false,
      category: "ai",
    },
    {
      id: "opensource",
      name: "Open Source AI",
      description: "Connect with open source AI models like Llama and Mistral",
      icon: <Code className="h-6 w-6 text-blue-600" />,
      connected: false,
      category: "ai",
    },
    {
      id: "restful",
      name: "RESTful API",
      description: "Custom RESTful API integration for your specific needs",
      icon: <FileJson className="h-6 w-6 text-orange-600" />,
      connected: false,
      category: "api",
    },
    {
      id: "n8n",
      name: "n8n",
      description: "Fair-code licensed workflow automation tool",
      icon: <Workflow className="h-6 w-6 text-cyan-600" />,
      connected: false,
      category: "automation",
    },
  ];

  const webhookEndpoints = [
    {
      id: "quote-created",
      name: "Quote Created",
      url: "https://api.amass.com/webhooks/quote-created",
      description: "Triggered when a new quote is created",
      category: "quote",
    },
    {
      id: "quote-approved",
      name: "Quote Approved",
      url: "https://api.amass.com/webhooks/quote-approved",
      description: "Triggered when a quote is approved",
      category: "quote",
    },
    {
      id: "shipment-created",
      name: "Shipment Created",
      url: "https://api.amass.com/webhooks/shipment-created",
      description: "Triggered when a new shipment is created from a quote",
      category: "shipment",
    },
    {
      id: "booking-confirmed",
      name: "Booking Confirmed",
      url: "https://api.amass.com/webhooks/booking-confirmed",
      description: "Triggered when a booking is confirmed",
      category: "shipment",
    },
    {
      id: "document-uploaded",
      name: "Document Uploaded",
      url: "https://api.amass.com/webhooks/document-uploaded",
      description: "Triggered when a document is uploaded",
      category: "documentation",
    },
    {
      id: "document-approved",
      name: "Document Approved",
      url: "https://api.amass.com/webhooks/document-approved",
      description: "Triggered when a document is approved",
      category: "documentation",
    },
    {
      id: "container-status-changed",
      name: "Container Status Changed",
      url: "https://api.amass.com/webhooks/container-status-changed",
      description: "Triggered when a container's status is updated",
      category: "cargo",
    },
    {
      id: "customs-cleared",
      name: "Customs Cleared",
      url: "https://api.amass.com/webhooks/customs-cleared",
      description: "Triggered when customs clearance is completed",
      category: "cargo",
    },
    {
      id: "cargo-in-transit",
      name: "Cargo In Transit",
      url: "https://api.amass.com/webhooks/cargo-in-transit",
      description: "Triggered when cargo begins transit",
      category: "cargo",
    },
    {
      id: "cargo-delivered",
      name: "Cargo Delivered",
      url: "https://api.amass.com/webhooks/cargo-delivered",
      description: "Triggered when cargo is delivered",
      category: "cargo",
    },
    {
      id: "claim-created",
      name: "Claim Created",
      url: "https://api.amass.com/webhooks/claim-created",
      description: "Triggered when a new claim is created",
      category: "claims",
    },
    {
      id: "claim-status-changed",
      name: "Claim Status Changed",
      url: "https://api.amass.com/webhooks/claim-status-changed",
      description: "Triggered when a claim's status is updated",
      category: "claims",
    },
    {
      id: "claim-document-uploaded",
      name: "Claim Document Uploaded",
      url: "https://api.amass.com/webhooks/claim-document-uploaded",
      description: "Triggered when a document is uploaded to a claim",
      category: "claims",
    },
    {
      id: "claim-resolved",
      name: "Claim Resolved",
      url: "https://api.amass.com/webhooks/claim-resolved",
      description: "Triggered when a claim is approved or rejected",
      category: "claims",
    },
  ];

  const flowSteps = [
    {
      id: "quote",
      name: "Quote Management",
      description: "Create and manage quotes for customers",
      icon: <FileText className="h-5 w-5" />,
      events: ["quote-created", "quote-approved"],
    },
    {
      id: "shipment",
      name: "Shipment Creation",
      description: "Convert quotes to shipments and confirm bookings",
      icon: <Truck className="h-5 w-5" />,
      events: ["shipment-created", "booking-confirmed"],
    },
    {
      id: "documentation",
      name: "Documentation Flow",
      description: "Manage all required shipping documents",
      icon: <FileCheck className="h-5 w-5" />,
      events: ["document-uploaded", "document-approved"],
    },
    {
      id: "cargo",
      name: "Cargo Flow",
      description: "Track cargo from origin to destination",
      icon: <Package className="h-5 w-5" />,
      events: [
        "container-status-changed",
        "customs-cleared",
        "cargo-in-transit",
        "cargo-delivered",
      ],
    },
    {
      id: "claims",
      name: "Claims Management",
      description: "Handle cargo claims and resolution process",
      icon: <ShieldAlert className="h-5 w-5" />,
      events: [
        "claim-created",
        "claim-status-changed",
        "claim-document-uploaded",
        "claim-resolved",
      ],
    },
  ];

  const getWebhooksByCategory = (category) => {
    return webhookEndpoints.filter(
      (endpoint) => endpoint.category === category,
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect your AMASS account with other services to automate your
            workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="services">Third-Party Services</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="flow">Shipment Flow</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    All
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    AI
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Automation
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Productivity
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    API
                  </Badge>
                </div>
              </div>
              <div className="grid gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        {integration.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{integration.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="api-key">Your API Key</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="api-key"
                      value={apiKey}
                      readOnly
                      className="font-mono text-sm rounded-r-none"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-l-none border-l-0"
                      onClick={() => navigator.clipboard.writeText(apiKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Keep this key secret. Do not share it in client-side code.
                  </p>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">API Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Refer to our API documentation for detailed information on
                    available endpoints and request formats.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Documentation
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <FileJson className="h-3.5 w-3.5" />
                      RESTful API Explorer
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">API Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Rate Limiting</h4>
                        <p className="text-xs text-muted-foreground">
                          Limit API requests to prevent abuse
                        </p>
                      </div>
                      <Switch id="rate-limit" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">API Logging</h4>
                        <p className="text-xs text-muted-foreground">
                          Log all API requests for debugging
                        </p>
                      </div>
                      <Switch id="api-logging" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">CORS Settings</h4>
                        <p className="text-xs text-muted-foreground">
                          Allow cross-origin requests
                        </p>
                      </div>
                      <Switch id="cors-settings" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="webhooks">
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-md flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Webhook Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Always verify webhook signatures to ensure requests are
                      coming from AMASS.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    All Events
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Quote
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Shipment
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Documentation
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                  >
                    Cargo
                  </Badge>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Available Webhook Endpoints</h3>
                    <Button size="sm" className="gap-1">
                      <Webhook className="h-4 w-4" />
                      Add Custom Webhook
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {webhookEndpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className="border rounded-lg p-3 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{endpoint.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {endpoint.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 h-7"
                            onClick={() =>
                              navigator.clipboard.writeText(endpoint.url)
                            }
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy URL
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {endpoint.description}
                        </p>
                        <div className="mt-2 pt-2 border-t">
                          <code className="text-xs font-mono bg-muted/50 p-1.5 rounded block overflow-x-auto">
                            {endpoint.url}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="flow">
              <div className="space-y-6">
                <div className="bg-muted/50 p-3 rounded-md flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">
                      Shipment Lifecycle Flow
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Track events throughout the entire shipment lifecycle from
                      quote to delivery. Enable webhooks for each stage to
                      integrate with your systems.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {flowSteps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{step.name}</h3>
                            <Badge variant="outline">
                              {step.events.length} events
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {step.description}
                          </p>

                          <div className="space-y-2">
                            {getWebhooksByCategory(step.id).map((webhook) => (
                              <div
                                key={webhook.id}
                                className="flex items-center justify-between bg-muted/30 p-2 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <Webhook className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {webhook.name}
                                  </span>
                                </div>
                                <Switch
                                  id={`enable-${webhook.id}`}
                                  defaultChecked={
                                    webhook.id === "quote-created" ||
                                    webhook.id === "shipment-created" ||
                                    webhook.id === "document-uploaded" ||
                                    webhook.id === "cargo-in-transit"
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {index < flowSteps.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button className="gap-1.5">
                    <Check className="h-4 w-4" />
                    Save Flow Configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
