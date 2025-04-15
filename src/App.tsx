import { Suspense, lazy, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import routes from "./lib/tempo-routes";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Lazy load landing page and auth components
const LandingPage = lazy(() => import("./components/LandingPage"));
const SignIn = lazy(() => import("./components/auth/SignIn"));
const SignUp = lazy(() => import("./components/auth/SignUp"));

// Lazy load settings components
const ThemeSettings = lazy(() => import("./components/settings/ThemeSettings"));
const Notifications = lazy(() => import("./components/settings/Notifications"));
const Profile = lazy(() => import("./components/settings/Profile"));

// Lazy load CFS components
const CFSLayout = lazy(() => import("./components/cfs/CFSLayout"));
const Containers = lazy(() => import("./components/cfs/Containers"));
const CFSCargoDetails = lazy(() => import("./components/cfs/CFSCargoDetails"));
const OuturnReports = lazy(() => import("./components/cfs/OuturnReports"));
const CFSFees = lazy(() => import("./components/cfs/CFSFees"));
const Integrations = lazy(() => import("./components/cfs/Integrations"));
const Registration = lazy(() => import("./components/cfs/Registration"));

// Lazy load Quotes components
const QuotesPage = lazy(() => import("./components/quotes/QuotesPage"));

// Lazy load Shipment components
const OceanExport = lazy(() => import("./components/shipments/OceanExport"));
const AirImport = lazy(() => import("./components/shipments/AirImport"));
const AirExport = lazy(() => import("./components/shipments/AirExport"));
const RoadFreight = lazy(() => import("./components/shipments/RoadFreight"));

// Lazy load Ocean Import components
const OceanImportModule = lazy(
  () => import("./components/ocean/OceanImportModule"),
);

// Lazy load Shipment components
const ClaimHandling = lazy(() => import("./components/shipment/ClaimHandling"));
const ShipmentTracking = lazy(
  () => import("./components/shipment/ShipmentTracking"),
);

// Lazy load Quote components
const QuoteResponse = lazy(() => import("./components/quotes/QuoteResponse"));

// Lazy load Trucking components
const TruckingShipmentPreparation = lazy(
  () => import("./components/trucking/TruckingShipmentPreparation"),
);

// Lazy load Finance components
const FinanceLayout = lazy(() => import("./components/finance/FinanceLayout"));
const InvoicesPage = lazy(() => import("./components/finance/InvoicesPage"));
const CostsOfSalesPage = lazy(
  () => import("./components/finance/CostsOfSalesPage"),
);
const BillingCodes = lazy(() => import("./components/billing/BillingCodes"));

// Lazy load Reports components
const ReportsLayout = lazy(() => import("./components/reports/ReportsLayout"));
const GrossProfitReport = lazy(
  () => import("./components/reports/GrossProfitReport"),
);
const TopCustomersReport = lazy(
  () => import("./components/reports/TopCustomersReport"),
);
const TopCarriersReport = lazy(
  () => import("./components/reports/TopCarriersReport"),
);
const TotalClaimsReport = lazy(
  () => import("./components/reports/TotalClaimsReport"),
);
const SalesCommissionReport = lazy(
  () => import("./components/reports/SalesCommissionReport"),
);
const AgingReport = lazy(() => import("./components/reports/AgingReport"));
const CashFlowAnalysis = lazy(
  () => import("./components/reports/CashFlowAnalysis"),
);
const TotalQuotesReport = lazy(
  () => import("./components/reports/TotalQuotesReport"),
);
const TotalShipmentsReport = lazy(
  () => import("./components/reports/TotalShipmentsReport"),
);

// Placeholder components for other CFS sections
function CustomsClearance() {
  return <div>Customs Clearance tracking coming soon</div>;
}
function FreightRelease() {
  return <div>Freight Release tracking coming soon</div>;
}
function LFD() {
  return <div>LFD tracking coming soon</div>;
}
function WarehouseReceipts() {
  return <div>Warehouse Receipts tracking coming soon</div>;
}
function FreightManipulation() {
  return <div>Freight Manipulation services tracking coming soon</div>;
}

// Event tracking for shipment lifecycle
export const trackShipmentEvent = (eventType: string, data: any) => {
  // In a real implementation, this would send the event to an analytics service
  // or trigger webhooks based on the event type
  console.log(`[Event Tracked] ${eventType}:`, data);

  // This could also trigger webhooks to external systems
  const webhookUrl = `https://api.amass.com/webhooks/${eventType}`;
  console.log(`Would send webhook to: ${webhookUrl}`);

  // Return true to indicate success (for promise chaining)
  return true;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Redirect to signin page but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App component with routes
export const AppRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add Tempo routes
  const tempoRoutes = useRoutes(routes);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === "/signin" || location.pathname === "/signup") {
        // Redirect to the page they were trying to access or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, location]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        {/* Render Tempo routes first */}
        {tempoRoutes}

        <Routes>
          {/* Public Routes - No MainLayout */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes - With MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />

            {/* Settings Routes */}
            <Route path="/settings/theme" element={<ThemeSettings />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/profile" element={<Profile />} />

            {/* Quote Routes */}
            <Route path="/quotes/list" element={<QuotesPage />} />
            <Route
              path="/quotes/response/:quoteId"
              element={<QuoteResponse />}
            />

            {/* Trucking Routes */}
            <Route
              path="/trucking/preparation"
              element={<TruckingShipmentPreparation />}
            />

            {/* CFS Availability Routes */}
            <Route path="/cfs-availability" element={<CFSLayout />}>
              <Route index element={<Containers />} />
              <Route path="containers" element={<Containers />} />
              <Route
                path="containers/jobjobLot/:jobLotNumber"
                element={<CFSCargoDetails />}
              />
              <Route path="outturn-reports" element={<OuturnReports />} />
              <Route path="fees" element={<CFSFees />} />
              <Route path="customs" element={<CustomsClearance />} />
              <Route path="freight-release" element={<FreightRelease />} />
              <Route path="lfd" element={<LFD />} />
              <Route path="warehouse" element={<WarehouseReceipts />} />
              <Route path="manipulation" element={<FreightManipulation />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="registration" element={<Registration />} />
            </Route>

            {/* Finance/Accounting Routes */}
            <Route path="/finance" element={<FinanceLayout />}>
              <Route index element={<InvoicesPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="costs-of-sales" element={<CostsOfSalesPage />} />
              <Route path="billing-codes" element={<BillingCodes />} />
            </Route>

            {/* Reports Routes */}
            <Route path="/reports" element={<ReportsLayout />}>
              <Route index element={<GrossProfitReport />} />
              <Route path="gross-profit" element={<GrossProfitReport />} />
              <Route path="top-customers" element={<TopCustomersReport />} />
              <Route path="top-carriers" element={<TopCarriersReport />} />
              <Route path="total-claims" element={<TotalClaimsReport />} />
              <Route
                path="sales-commission"
                element={<SalesCommissionReport />}
              />
              <Route path="aging" element={<AgingReport />} />
              <Route path="cash-flow" element={<CashFlowAnalysis />} />
              <Route path="total-quotes" element={<TotalQuotesReport />} />
              <Route
                path="total-shipments"
                element={<TotalShipmentsReport />}
              />
            </Route>

            {/* Shipment Management Routes */}
            <Route path="/claims/:shipmentId" element={<ClaimHandling />} />
            <Route
              path="/tracking/:shipmentId"
              element={<ShipmentTracking />}
            />

            {/* Shipment Routes */}
            <Route path="/shipments/ocean-export" element={<OceanExport />} />
            <Route path="/ocean/import" element={<OceanImportModule />} />
            <Route path="/shipments/air-import" element={<AirImport />} />
            <Route path="/shipments/air-export" element={<AirExport />} />
            <Route path="/shipments/road-freight" element={<RoadFreight />} />

            {/* Integrations Route */}
            <Route path="/integrations" element={<Integrations />} />
          </Route>

          {/* Add tempobook path for Tempo routes */}
          <Route path="/tempobook/*" />

          {/* Catch all route - redirect to signin */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </>
    </Suspense>
  );
};

// Wrap the app with AuthProvider
export const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
