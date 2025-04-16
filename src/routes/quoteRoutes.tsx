import { lazy } from "react";
import { RouteConfig } from "./types";

const QuotesPage = lazy(() => import("../components/quotes/QuotesPage"));
const QuoteResponse = lazy(() => import("../components/quotes/QuoteResponse"));

const quoteRoutes: RouteConfig[] = [
  { path: "/quotes/list", element: <QuotesPage /> },
  { path: "/quotes/response/:quoteId", element: <QuoteResponse /> },
];

export default quoteRoutes;