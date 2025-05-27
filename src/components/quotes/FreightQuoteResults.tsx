import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ArrowLeft,
  Download,
  Check,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface QuoteStage {
  required: boolean;
  vendor: {
    name: string;
    code: string;
  };
  price: number;
  transitTime: {
    min: number;
    max: number;
    unit: string;
  };
  conditions: string[];
  route?: {
    origin: string;
    destination: string;
  };
}

interface AdditionalCharge {
  name: string;
  amount: number;
  type: "percentage" | "fixed";
  value?: number;
}

interface QuoteTerms {
  paymentTerms: string;
  incoterms: string;
  insurance: string;
}

interface Quote {
  quoteId: string;
  totalPrice: number;
  currency: string;
  totalTransitTime: {
    min: number;
    max: number;
    unit: string;
  };
  validUntil: string;
  stages: {
    pickup?: QuoteStage;
    international: QuoteStage;
    delivery?: QuoteStage;
  };
  additionalCharges: AdditionalCharge[];
  terms: QuoteTerms;
}

const FreightQuoteResults = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);

        // In a real implementation, you would fetch quotes from your API
        // For now, we'll simulate a response with mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock quotes data
        const mockQuotes: Quote[] = [
          {
            quoteId: "QT-2024-001",
            totalPrice: 2500,
            currency: "USD",
            totalTransitTime: {
              min: 12,
              max: 15,
              unit: "days",
            },
            validUntil: "2024-12-31",
            stages: {
              pickup: {
                required: true,
                vendor: {
                  name: "Local Carrier ABC",
                  code: "LCA001",
                },
                price: 200,
                transitTime: { min: 1, max: 2, unit: "days" },
                conditions: ["Pickup window: 8AM-5PM", "Loading dock required"],
              },
              international: {
                required: true,
                vendor: {
                  name: "Ocean Line XYZ",
                  code: "OLX001",
                },
                price: 1800,
                transitTime: { min: 8, max: 10, unit: "days" },
                route: {
                  origin: "Port of Los Angeles",
                  destination: "Port of Hamburg",
                },
                conditions: [
                  "Weekly sailing schedule",
                  "Container weight limit: 28,000 kg",
                ],
              },
              delivery: {
                required: true,
                vendor: {
                  name: "European Logistics",
                  code: "EL001",
                },
                price: 500,
                transitTime: { min: 2, max: 3, unit: "days" },
                conditions: ["Appointment required", "Tail lift available"],
              },
            },
            additionalCharges: [
              {
                name: "Fuel Surcharge",
                amount: 150,
                type: "percentage",
                value: 6,
              },
              {
                name: "Documentation Fee",
                amount: 75,
                type: "fixed",
              },
            ],
            terms: {
              paymentTerms: "Net 30",
              incoterms: "CIF",
              insurance: "Available upon request",
            },
          },
          {
            quoteId: "QT-2024-002",
            totalPrice: 2850,
            currency: "USD",
            totalTransitTime: {
              min: 10,
              max: 12,
              unit: "days",
            },
            validUntil: "2024-12-31",
            stages: {
              pickup: {
                required: true,
                vendor: {
                  name: "Express Pickup Services",
                  code: "EPS001",
                },
                price: 250,
                transitTime: { min: 1, max: 1, unit: "days" },
                conditions: [
                  "Same day pickup available",
                  "Liftgate service included",
                ],
              },
              international: {
                required: true,
                vendor: {
                  name: "Fast Maritime",
                  code: "FM001",
                },
                price: 2100,
                transitTime: { min: 7, max: 9, unit: "days" },
                route: {
                  origin: "Port of Los Angeles",
                  destination: "Port of Hamburg",
                },
                conditions: ["Premium routing", "Priority handling"],
              },
              delivery: {
                required: true,
                vendor: {
                  name: "Continental Delivery",
                  code: "CD001",
                },
                price: 500,
                transitTime: { min: 1, max: 2, unit: "days" },
                conditions: [
                  "Delivery appointment scheduling included",
                  "Indoor delivery available",
                ],
              },
            },
            additionalCharges: [
              {
                name: "Fuel Surcharge",
                amount: 171,
                type: "percentage",
                value: 6,
              },
              {
                name: "Documentation Fee",
                amount: 95,
                type: "fixed",
              },
              {
                name: "Express Service Fee",
                amount: 150,
                type: "fixed",
              },
            ],
            terms: {
              paymentTerms: "Net 15",
              incoterms: "CIF",
              insurance: "Included up to $10,000",
            },
          },
          {
            quoteId: "QT-2024-003",
            totalPrice: 2250,
            currency: "USD",
            totalTransitTime: {
              min: 14,
              max: 18,
              unit: "days",
            },
            validUntil: "2024-12-31",
            stages: {
              pickup: {
                required: true,
                vendor: {
                  name: "Budget Carriers",
                  code: "BC001",
                },
                price: 180,
                transitTime: { min: 1, max: 3, unit: "days" },
                conditions: [
                  "48-hour advance notice required",
                  "Curbside pickup only",
                ],
              },
              international: {
                required: true,
                vendor: {
                  name: "Value Ocean Lines",
                  code: "VOL001",
                },
                price: 1600,
                transitTime: { min: 10, max: 12, unit: "days" },
                route: {
                  origin: "Port of Los Angeles",
                  destination: "Port of Hamburg",
                },
                conditions: ["Standard service", "Consolidation may apply"],
              },
              delivery: {
                required: true,
                vendor: {
                  name: "Local Delivery Co",
                  code: "LDC001",
                },
                price: 470,
                transitTime: { min: 2, max: 3, unit: "days" },
                conditions: [
                  "Business hours delivery only",
                  "Curbside delivery",
                ],
              },
            },
            additionalCharges: [
              {
                name: "Fuel Surcharge",
                amount: 135,
                type: "percentage",
                value: 6,
              },
              {
                name: "Documentation Fee",
                amount: 65,
                type: "fixed",
              },
            ],
            terms: {
              paymentTerms: "Net 30",
              incoterms: "FOB",
              insurance: "Available at additional cost",
            },
          },
        ];

        setQuotes(mockQuotes);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError("Failed to load quotes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [quoteId]);

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuote(quoteId);
  };

  const handleRequestBooking = async () => {
    if (!selectedQuote) return;

    try {
      setBookingInProgress(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would call your API to create a booking
      alert(`Booking requested for quote ${selectedQuote}`);

      // Navigate to booking confirmation or shipment page
      // navigate(`/shipments/new/${selectedQuote}`);
    } catch (err) {
      console.error("Error requesting booking:", err);
      alert("Failed to request booking. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleExportPDF = () => {
    // In a real implementation, you would generate and download a PDF
    alert("PDF export functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Link
          to="/quotes/road-freight"
          className="flex items-center text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quote Form
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Quotes</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Link
          to="/quotes/road-freight"
          className="flex items-center text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quote Form
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Quotes Available</h2>
            <p className="text-muted-foreground mb-4">
              No quotes are available for the provided details. Please try
              adjusting your shipment parameters.
            </p>
            <Button asChild>
              <Link to="/quotes/road-freight">Modify Quote Request</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/quotes/road-freight"
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quote Form
        </Link>
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" /> Export Quotes
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-2">Freight Quote Results</h1>
      <p className="text-muted-foreground mb-6">
        Quote ID: {quoteId} • {quotes.length} quotes available • Valid until{" "}
        {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6">
        {quotes.map((quote) => (
          <Card
            key={quote.quoteId}
            className={`border-2 ${selectedQuote === quote.quoteId ? "border-primary" : "border-border"}`}
          >
            <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {quote.stages.international.vendor.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Quote #{quote.quoteId} • Valid until{" "}
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {quote.currency} {quote.totalPrice.toLocaleString()}
                  </div>
                  <div className="text-sm">
                    {quote.totalTransitTime.min}-{quote.totalTransitTime.max}{" "}
                    {quote.totalTransitTime.unit}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Pickup Stage */}
                {quote.stages.pickup && quote.stages.pickup.required && (
                  <div className="stage pickup">
                    <h4 className="font-medium text-lg mb-2">Pickup Service</h4>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">
                          {quote.stages.pickup.vendor.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {quote.currency}{" "}
                          {quote.stages.pickup.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.stages.pickup.transitTime.min}-
                          {quote.stages.pickup.transitTime.max}{" "}
                          {quote.stages.pickup.transitTime.unit}
                        </div>
                      </div>
                    </div>
                    {quote.stages.pickup.conditions.length > 0 && (
                      <div className="bg-muted/30 p-3 rounded-md mt-2">
                        <h5 className="text-sm font-medium mb-1">
                          Conditions:
                        </h5>
                        <ul className="text-sm space-y-1">
                          {quote.stages.pickup.conditions.map(
                            (condition, idx) => (
                              <li key={idx}>• {condition}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* International Stage */}
                <div className="stage international">
                  <h4 className="font-medium text-lg mb-2">
                    Ocean/Air Freight
                  </h4>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">
                        {quote.stages.international.vendor.name}
                      </span>
                      {quote.stages.international.route && (
                        <div className="text-sm mt-1">
                          {quote.stages.international.route.origin} →{" "}
                          {quote.stages.international.route.destination}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {quote.currency}{" "}
                        {quote.stages.international.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {quote.stages.international.transitTime.min}-
                        {quote.stages.international.transitTime.max}{" "}
                        {quote.stages.international.transitTime.unit}
                      </div>
                    </div>
                  </div>
                  {quote.stages.international.conditions.length > 0 && (
                    <div className="bg-muted/30 p-3 rounded-md mt-2">
                      <h5 className="text-sm font-medium mb-1">Conditions:</h5>
                      <ul className="text-sm space-y-1">
                        {quote.stages.international.conditions.map(
                          (condition, idx) => (
                            <li key={idx}>• {condition}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Delivery Stage */}
                {quote.stages.delivery && quote.stages.delivery.required && (
                  <div className="stage delivery">
                    <h4 className="font-medium text-lg mb-2">Final Delivery</h4>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">
                          {quote.stages.delivery.vendor.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {quote.currency}{" "}
                          {quote.stages.delivery.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.stages.delivery.transitTime.min}-
                          {quote.stages.delivery.transitTime.max}{" "}
                          {quote.stages.delivery.transitTime.unit}
                        </div>
                      </div>
                    </div>
                    {quote.stages.delivery.conditions.length > 0 && (
                      <div className="bg-muted/30 p-3 rounded-md mt-2">
                        <h5 className="text-sm font-medium mb-1">
                          Conditions:
                        </h5>
                        <ul className="text-sm space-y-1">
                          {quote.stages.delivery.conditions.map(
                            (condition, idx) => (
                              <li key={idx}>• {condition}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Charges */}
                {quote.additionalCharges.length > 0 && (
                  <div className="mt-4">
                    <Separator className="my-4" />
                    <h4 className="font-medium text-lg mb-2">
                      Additional Charges
                    </h4>
                    <div className="space-y-2">
                      {quote.additionalCharges.map((charge, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {charge.name}
                            {charge.type === "percentage" && charge.value && (
                              <span className="text-sm text-muted-foreground ml-1">
                                ({charge.value}%)
                              </span>
                            )}
                          </span>
                          <span>
                            {quote.currency} {charge.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="mt-4">
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium block">Payment Terms</span>
                      <span>{quote.terms.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="font-medium block">Incoterms</span>
                      <span>{quote.terms.incoterms}</span>
                    </div>
                    <div>
                      <span className="font-medium block">Insurance</span>
                      <span>{quote.terms.insurance}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant={
                      selectedQuote === quote.quoteId ? "default" : "outline"
                    }
                    onClick={() => handleSelectQuote(quote.quoteId)}
                    className="min-w-[120px]"
                  >
                    {selectedQuote === quote.quoteId && (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {selectedQuote === quote.quoteId ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-background border-t p-4 mt-8 -mx-4 flex justify-between items-center">
        <div>
          {selectedQuote && (
            <div className="flex items-center">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                Quote Selected
              </Badge>
              <span className="ml-2 font-medium">
                {
                  quotes.find((q) => q.quoteId === selectedQuote)?.stages
                    .international.vendor.name
                }
              </span>
              <span className="ml-2 text-muted-foreground">
                {quotes.find((q) => q.quoteId === selectedQuote)?.currency}
                {quotes
                  .find((q) => q.quoteId === selectedQuote)
                  ?.totalPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link to="/quotes/road-freight">Modify Quote</Link>
          </Button>
          <Button
            onClick={handleRequestBooking}
            disabled={!selectedQuote || bookingInProgress}
          >
            {bookingInProgress && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreightQuoteResults;
