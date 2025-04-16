import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import AuthService from "@/services/auth";
import {
  BarChart,
  BarChart2,
  Calendar,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Settings,
  Ship,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// Type definitions
type SubItem = {
  label: string;
  path: string;
};

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  subItems?: SubItem[];
};

type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();

  // State to track which submenus are open
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    email: "",
    avatarUrl: "",
  });

  // Define navigation items with appropriate types
  const navItems: NavItem[] = useMemo(
    () => [
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
          {
            label: "Freight Release",
            path: "/cfs-availability/freight-release",
          },
          { label: "Customs Clearance", path: "/cfs-availability/customs" },
          { label: "CFS Fees", path: "/cfs-availability/fees" },
          {
            label: "Outturn Reports",
            path: "/cfs-availability/outturn-reports",
          },
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
    ],
    []
  );

  // Toggle submenu visibility
  const toggleSubmenu = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Get user profile from localStorage using the TokenService
  useEffect(() => {
    // Try to get user from localStorage (TokenService.getUser would be better)
    const getUserFromStorage = () => {
      try {
        const user = AuthService.getCurrentUser();
        if (user) {
          return user.then((userData) => {
            if (userData) {
              const fullName =
                userData.first_name && userData.last_name
                  ? `${userData.first_name} ${userData.last_name}`
                  : "Jhon Doe";

              setUserProfile({
                name: fullName,
                email: userData.email || "user@example.com",
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  fullName
                )}`,
              });
            } else {
              setDefaultProfile();
            }
          });
        } else {
          setDefaultProfile();
        }
      } catch (e) {
        console.error("Error getting user data:", e);
        setDefaultProfile();
      }
    };

    const setDefaultProfile = () => {
      setUserProfile({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      });
    };

    getUserFromStorage();
  }, []);

  // Auto-open submenu based on current route
  useEffect(() => {
    const currentPath = location.pathname;

    // Find which menu should be open based on the current path
    navItems.forEach((item) => {
      if (item.subItems) {
        const shouldBeOpen = item.subItems.some(
          (subItem) =>
            currentPath === subItem.path ||
            currentPath.startsWith(subItem.path + "/")
        );

        if (shouldBeOpen) {
          setOpenSubmenus((prev) => ({
            ...prev,
            [item.label]: true,
          }));
        }
      }
    });
  }, [location.pathname, navItems]);

  // Navigation item component
  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");
    const hasSubItems = !!item.subItems?.length;
    const isOpen = openSubmenus[item.label];

    return (
      <li key={item.label}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {hasSubItems ? (
                <button
                  onClick={(e) => toggleSubmenu(item.label, e)}
                  className={cn(
                    "flex items-center w-full p-3 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && !isOpen && "bg-accent/50 text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent/50 text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {hasSubItems && isOpen && (
          <ul className="ml-6 mt-1 space-y-1 animate-in fade-in-50 slide-in-from-top-5 duration-200">
            {item.subItems.map((subItem) => {
              const isSubItemActive =
                location.pathname === subItem.path ||
                location.pathname.startsWith(subItem.path + "/");

              return (
                <li key={subItem.label}>
                  <Link
                    to={subItem.path}
                    className={cn(
                      "flex items-center p-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSubItemActive &&
                        "bg-accent/30 text-accent-foreground font-medium"
                    )}
                  >
                    <span className="ml-2">{subItem.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[280px] bg-background border-r border-border p-4",
        className
      )}
    >
      <div className="flex items-center mb-8 pl-2">
        <img
          src="/amass_logo_new.svg"
          alt="AMASS Logo"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
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
          onClick={() => AuthService.logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
