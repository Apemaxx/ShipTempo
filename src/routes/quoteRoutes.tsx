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
const QuoteApiExample = lazy(
  () => import("../tempobook/storyboards/36380c19-d880-430c-a76a-338e631fff85"),
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
  { path: "/quotes/xano-rate-example", element: <QuoteApiExample /> },
];

export default quoteRoutes;
