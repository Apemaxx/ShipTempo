import { lazy } from "react";

import { RouteConfig } from "./types";

const QuotesPage = lazy(() => import("../components/quotes/QuotesPage"));
const QuoteResponse = lazy(() => import("../components/quotes/QuoteResponse"));
const RoadFreightQuote = lazy(
  () => import("../components/quotes/RoadFreightQuote"),
);
const FreightRateQuoteForm = lazy(
  () => import("../components/quotes/FreightRateQuoteForm"),
);
const FreightQuoteResults = lazy(
  () => import("../components/quotes/FreightQuoteResults"),
);

const quoteRoutes: RouteConfig[] = [
  { path: "/quotes/list", element: <QuotesPage /> },
  { path: "/quotes/response/:quoteId", element: <QuoteResponse /> },
  { path: "/quotes/road-freight", element: <RoadFreightQuote /> },
  { path: "/quotes/freight-rate", element: <FreightRateQuoteForm /> },
  {
    path: "/quotes/freight-results/:quoteId",
    element: <FreightQuoteResults />,
  },
];

export default quoteRoutes;
