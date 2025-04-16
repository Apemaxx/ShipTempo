import { lazy } from "react";
import { RouteConfig } from "./types";

const ReportsLayout = lazy(() => import("../components/reports/ReportsLayout"));
const GrossProfitReport = lazy(() => import("../components/reports/GrossProfitReport"));
const TopCustomersReport = lazy(() => import("../components/reports/TopCustomersReport"));
const TopCarriersReport = lazy(() => import("../components/reports/TopCarriersReport"));
const TotalClaimsReport = lazy(() => import("../components/reports/TotalClaimsReport"));
const SalesCommissionReport = lazy(() => import("../components/reports/SalesCommissionReport"));
const AgingReport = lazy(() => import("../components/reports/AgingReport"));
const CashFlowAnalysis = lazy(() => import("../components/reports/CashFlowAnalysis"));
const TotalQuotesReport = lazy(() => import("../components/reports/TotalQuotesReport"));
const TotalShipmentsReport = lazy(() => import("../components/reports/TotalShipmentsReport"));

const reportsRoutes: RouteConfig[] = [
  {
    path: "/reports",
    element: <ReportsLayout />,
    children: [
      { path: undefined, element: <GrossProfitReport /> }, // index route
      { path: "gross-profit", element: <GrossProfitReport /> },
      { path: "top-customers", element: <TopCustomersReport /> },
      { path: "top-carriers", element: <TopCarriersReport /> },
      { path: "total-claims", element: <TotalClaimsReport /> },
      { path: "sales-commission", element: <SalesCommissionReport /> },
      { path: "aging", element: <AgingReport /> },
      { path: "cash-flow", element: <CashFlowAnalysis /> },
      { path: "total-quotes", element: <TotalQuotesReport /> },
      { path: "total-shipments", element: <TotalShipmentsReport /> },
    ],
  },
];

export default reportsRoutes;