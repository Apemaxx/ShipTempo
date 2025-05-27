import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LTLQuoteCarrierRate } from "@/types/api";
import { Loader2 } from "lucide-react";

interface QuoteResultsProps {
  quotes?: LTLQuoteCarrierRate[];
  onBookShipment?: (quoteId: string, carrierId: string) => void;
  isLoading?: boolean;
}

const QuoteResults: React.FC<QuoteResultsProps> = ({
  quotes = [],
  onBookShipment,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">Loading quotes...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we fetch the best rates for your shipment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No quotes available</p>
            <p className="mt-2 text-sm text-muted-foreground">
              No quotes were found for your shipment details. Please adjust your
              criteria and try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Available Quotes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.map((quote) => {
          // Extract price breakdown components
          const linehaul = quote.price_breakdown?.linehaul || 0;
          const fuel = quote.price_breakdown?.fuel_surcharge || 0;
          const accessorials = quote.price_breakdown?.accessorials || 0;

          return (
            <Card key={quote.quote_id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-bold">
                      {quote.carrier_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quote.carrier_scac || "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      ${quote.total_cost.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quote.currency}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service Level:</span>
                    <span className="text-sm">{quote.service_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Transit Days:</span>
                    <span className="text-sm">{quote.transit_days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Linehaul:</span>
                    <span className="text-sm">
                      ${Number(linehaul).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fuel Surcharge:</span>
                    <span className="text-sm">${Number(fuel).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Accessorials:</span>
                    <span className="text-sm">
                      ${Number(accessorials).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-bold">
                      ${quote.total_cost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    onBookShipment &&
                    onBookShipment(quote.quote_id, quote.carrier_id)
                  }
                >
                  Book Shipment
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuoteResults;
