import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, Check, X } from "lucide-react";

interface QuoteResponseProps {
  quoteId?: string;
  origin?: string;
  destination?: string;
}

const QuoteResponse = ({
  quoteId = "QT-2023-0042",
  origin = "Los Angeles, CA",
  destination = "New York, NY",
}: QuoteResponseProps) => {
  const [showMap, setShowMap] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const { toast } = useToast();

  // Mock quote data
  const quoteData = {
    quoteId,
    origin,
    destination,
    distance: "2,790 miles",
    estimatedTime: "5-7 days",
    price: "$3,450.00",
    services: [
      { name: "Basic Transport", price: "$2,800.00" },
      { name: "Insurance", price: "$350.00" },
      { name: "Express Processing", price: "$300.00" },
    ],
    originCoordinates: { lat: 34.0522, lng: -118.2437 },
    destinationCoordinates: { lat: 40.7128, lng: -74.006 },
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quote Response</h1>
        <Button variant="outline" onClick={() => setShowMap(!showMap)}>
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quote #{quoteData.quoteId}</CardTitle>
              <CardDescription>
                From {quoteData.origin} to {quoteData.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-medium">{quoteData.distance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Time
                    </p>
                    <p className="font-medium">{quoteData.estimatedTime}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Services</h3>
                  <div className="space-y-2">
                    {quoteData.services.map((service, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{service.name}</span>
                        <span>{service.price}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{quoteData.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between space-x-2">
              <Button
                variant="outline"
                onClick={() => handleDownloadPdf()}
                disabled={isGeneratingPdf}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDeclineQuote()}
                  disabled={isDeclining || isAccepting}
                >
                  <X className="h-4 w-4 mr-2" />
                  {isDeclining ? "Declining..." : "Decline"}
                </Button>
                <Button
                  onClick={() => handleAcceptQuote()}
                  disabled={isAccepting || isDeclining}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isAccepting ? "Accepting..." : "Accept Quote"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Route Information</CardTitle>
            </CardHeader>
            <CardContent>
              {showMap ? (
                <div className="map-container rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${encodeURIComponent(quoteData.origin)}&destination=${encodeURIComponent(quoteData.destination)}&mode=driving`}
                    allowFullScreen
                  ></iframe>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Note: Replace YOUR_API_KEY with an actual Google Maps API
                    key in production
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium">{quoteData.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{quoteData.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Click "Show Map" to view the route
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Function to handle PDF generation and download
const handleDownloadPdf = async () => {
  try {
    setIsGeneratingPdf(true);

    // In a real implementation, this would call an API endpoint to generate the PDF
    // For now, we'll simulate a delay and then show a success message
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create a mock PDF download (in a real app, this would be a blob from the API)
    const mockPdfBlob = new Blob(["PDF content would be here"], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(mockPdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quote-${quoteData.quoteId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "PDF Generated Successfully",
      description: `Quote ${quoteData.quoteId} has been downloaded as a PDF.`,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({
      title: "PDF Generation Failed",
      description: "There was an error generating the PDF. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsGeneratingPdf(false);
  }
};

// Function to handle quote acceptance
const handleAcceptQuote = async () => {
  try {
    setIsAccepting(true);

    // In a real implementation, this would call an API endpoint to accept the quote
    // For now, we'll simulate a delay and then show a success message
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Quote Accepted",
      description: `Quote ${quoteData.quoteId} has been accepted and converted to a booking.`,
    });

    // In a real implementation, this would redirect to the booking page or show a confirmation
  } catch (error) {
    console.error("Error accepting quote:", error);
    toast({
      title: "Quote Acceptance Failed",
      description: "There was an error accepting the quote. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsAccepting(false);
  }
};

// Function to handle quote declination
const handleDeclineQuote = async () => {
  try {
    setIsDeclining(true);

    // In a real implementation, this would call an API endpoint to decline the quote
    // For now, we'll simulate a delay and then show a success message
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Quote Declined",
      description: `Quote ${quoteData.quoteId} has been declined.`,
    });

    // In a real implementation, this would redirect back to the quotes list or show a confirmation
  } catch (error) {
    console.error("Error declining quote:", error);
    toast({
      title: "Quote Declination Failed",
      description: "There was an error declining the quote. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsDeclining(false);
  }
};

export default QuoteResponse;
