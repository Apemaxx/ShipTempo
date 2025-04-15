import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CFSLayout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/containers")) return "Container Tracking";
    if (path.includes("/outturn-reports")) return "Outturn Reports";
    if (path.includes("/fees")) return "CFS Fees";
    if (path.includes("/customs")) return "Customs Clearance";
    if (path.includes("/freight-release")) return "Freight Release";
    if (path.includes("/lfd")) return "LFD";
    if (path.includes("/warehouse")) return "Warehouse Receipts";
    if (path.includes("/manipulation")) return "Freight Manipulation";
    if (path.includes("/integrations")) return "Integrations";
    if (path.includes("/registration")) return "Registration Management";
    return "CFS Availability";
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path.includes("/containers"))
      return "Track container status, shipments, and related documentation";
    if (path.includes("/outturn-reports"))
      return "View and manage container outturn reports";
    if (path.includes("/fees"))
      return "Manage and track CFS-related fees and charges";
    if (path.includes("/customs"))
      return "Track customs clearance status and documentation";
    if (path.includes("/freight-release"))
      return "Monitor freight release status and requirements";
    if (path.includes("/lfd"))
      return "Track Last Free Day information and deadlines";
    if (path.includes("/warehouse"))
      return "Manage warehouse receipts and inventory";
    if (path.includes("/manipulation"))
      return "Schedule and track freight manipulation services";
    if (path.includes("/integrations"))
      return "Connect with third-party services and manage API access";
    if (path.includes("/registration"))
      return "Register and manage entities in your supply chain network";
    return "Track container status, fees, and services with STG USA integration";
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{getPageTitle()}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {getPageDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default CFSLayout;
