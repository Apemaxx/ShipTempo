import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "@/services/auth";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Ship,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Bell,
  PieChart,
  LineChart,
  BarChart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  // State to track which submenus are open
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Shipments: false,
    "CFS Availability": false,
    Settings: false,
    Reports: false,
    "Finance/Accounting": false,
  });

  // Toggle submenu visibility
  const toggleSubmenu = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Quotes", path: "/quotes/list" },
    {
      icon: Ship,
      label: "Shipments",
      path: "/shipments",
      subItems: [
        { label: "Ocean Export", path: "/shipments/ocean-export" },
        { label: "Ocean Import", path: "/ocean/import" },
        { label: "Air Export", path: "/shipments/air-export" },
        { label: "Air Import", path: "/shipments/air-import" },
        { label: "Road Freight", path: "/shipments/road-freight" },
        { label: "Tracking", path: "/tracking/latest" },
        { label: "Claims", path: "/claims/latest" },
        { label: "Trucking", path: "/trucking/preparation" },
      ],
    },
    {
      icon: Calendar,
      label: "CFS Availability",
      path: "/cfs-availability",
      subItems: [
        { label: "Containers", path: "/cfs-availability/containers" },
        { label: "LFD", path: "/cfs-availability/lfd" },
        { label: "Freight Release", path: "/cfs-availability/freight-release" },
        { label: "Customs Clearance", path: "/cfs-availability/customs" },
        { label: "CFS Fees", path: "/cfs-availability/fees" },
        { label: "Outturn Reports", path: "/cfs-availability/outturn-reports" },
        { label: "Warehouse Receipts", path: "/cfs-availability/warehouse" },
        {
          label: "Freight Manipulation",
          path: "/cfs-availability/manipulation",
        },
        { label: "Registration", path: "/cfs-availability/registration" },
      ],
    },
    { icon: BarChart2, label: "Integrations", path: "/integrations" },
    {
      icon: BarChart,
      label: "Reports",
      path: "/reports",
      subItems: [
        { label: "Gross Profit per File", path: "/reports/gross-profit" },
        { label: "Top Customers", path: "/reports/top-customers" },
        { label: "Top Carriers", path: "/reports/top-carriers" },
        { label: "Total Claims", path: "/reports/total-claims" },
        { label: "Sales Commission", path: "/reports/sales-commission" },
        { label: "Aging Report", path: "/reports/aging" },
        { label: "Cash Flow Analysis", path: "/reports/cash-flow" },
        { label: "Total Quotes", path: "/reports/total-quotes" },
        { label: "Total Shipments", path: "/reports/total-shipments" },
      ],
    },
    {
      icon: DollarSign,
      label: "Finance/Accounting",
      path: "/finance",
      subItems: [
        { label: "Invoices", path: "/finance/invoices" },
        { label: "Costs of Sales", path: "/finance/costs-of-sales" },
        { label: "Billing Codes", path: "/finance/billing-codes" },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      subItems: [
        { label: "Profile", path: "/settings/profile" },
        { label: "Theme", path: "/settings/theme" },
        { label: "Notifications", path: "/settings/notifications" },
      ],
    },
  ];

  // Get user profile from sessionStorage or use default values
  const getUserFromSession = () => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        const fullName =
          userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : userData.name || "User";
        return {
          name: fullName,
          email: userData.email || "user@example.com",
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        };
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    return {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    };
  };

  const userProfile = getUserFromSession();

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[280px] bg-background border-r border-border p-4",
        className,
      )}
    >
      <div className="flex items-center mb-8 pl-2">
        <img
          src="/amass_logo_new.svg"
          alt="AMASS Logo"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {item.subItems ? (
                      <button
                        onClick={(e) => toggleSubmenu(item.label, e)}
                        className="flex items-center w-full p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                        {openSubmenus[item.label] ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {item.subItems && openSubmenus[item.label] && (
                <ul className="ml-6 mt-1 space-y-1 animate-in fade-in-50 slide-in-from-top-5 duration-200">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label}>
                      <Link
                        to={subItem.path}
                        className="flex items-center p-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <span className="ml-2">{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center p-2 mb-2">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {userProfile.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          size="sm"
          onClick={() => {
            // Use the logout function from auth service
            logout();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
