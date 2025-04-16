import { lazy } from "react";
import { RouteConfig } from "./types";

const FinanceLayout = lazy(() => import("../components/finance/FinanceLayout"));
const InvoicesPage = lazy(() => import("../components/finance/InvoicesPage"));
const CostsOfSalesPage = lazy(() => import("../components/finance/CostsOfSalesPage"));
const BillingCodes = lazy(() => import("../components/billing/BillingCodes"));

const financeRoutes: RouteConfig[] = [
  {
    path: "/finance",
    element: <FinanceLayout />,
    children: [
      { path: undefined, element: <InvoicesPage /> }, // index route
      { path: "invoices", element: <InvoicesPage /> },
      { path: "costs-of-sales", element: <CostsOfSalesPage /> },
      { path: "billing-codes", element: <BillingCodes /> },
    ],
  },
];

export default financeRoutes;