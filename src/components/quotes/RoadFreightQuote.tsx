import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLTLQuotes } from "@/lib/api/quotes";
import { lookupZipCode } from "@/lib/api/zipcode";
import { LTLQuoteCarrierRate, LTLQuoteRequest } from "@/types/api";
import { AlertCircle, Calculator, Calendar, FileText, Filter, Loader2, Package, Search, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";

// Supabase configuration removed
import QuoteResults from "./QuoteResults";

interface LtlDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  pieces: number;
}

const RoadFreightQuote = () => {
  // State for LTL dimensions and freight class
  const [ltlDimensions, setLtlDimensions] = useState<LtlDimensions>({
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    pieces: 1,
  });
  const [calculatedFreightClass, setCalculatedFreightClass] =
    useState<string>("");
  const [calculationMessage, setCalculationMessage] = useState<string>("");

  // Form field states
  const [originZip, setOriginZip] = useState<string>("");
  const [originCountry, setOriginCountry] = useState<string>("1"); // Default to US
  const [originCity, setOriginCity] = useState<string>("");
  const [originState, setOriginState] = useState<string>("");
  const [destinationZip, setDestinationZip] = useState<string>("");
  const [destinationCountry, setDestinationCountry] = useState<string>("1"); // Default to US
  const [destinationCity, setDestinationCity] = useState<string>("");
  const [destinationState, setDestinationState] = useState<string>("");
  const [commodity, setCommodity] = useState<string>("");
  const [pallets, setPallets] = useState<number>(1);
  const [packagingType, setPackagingType] = useState<string>("120"); // Default to pallets
  const [selectedAccessorials, setSelectedAccessorials] = useState<string[]>(
    [],
  );

  // Quote results states
  const [isLoadingQuotes, setIsLoadingQuotes] = useState<boolean>(false);
  const [quoteError, setQuoteError] = useState<string>("");
  const [quoteResults, setQuoteResults] = useState<LTLQuoteCarrierRate[]>([]);
  const [showQuotes, setShowQuotes] = useState<boolean>(false);

  // Xano quote results states
  const [isLoadingXanoQuotes, setIsLoadingXanoQuotes] =
    useState<boolean>(false);
  const [xanoQuoteError, setXanoQuoteError] = useState<string>("");
  const [xanoQuoteResults, setXanoQuoteResults] = useState<
    LTLQuoteCarrierRate[]
  >([]);
  const [showXanoQuotes, setShowXanoQuotes] = useState<boolean>(false);

  // Handle dimension changes
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = parseFloat(value) || 0;

    // Extract the field name from the id (e.g., ltl_length -> length)
    const field = id.replace("ltl_", "");

    setLtlDimensions((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  // Handle accessorial selection
  const handleAccessorialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedAccessorials((prev) => [...prev, value]);
    } else {
      setSelectedAccessorials((prev) => prev.filter((item) => item !== value));
    }
  };

  // Calculate freight class based on density
  const calculateFreightClass = () => {
    const { length, width, height, weight, pieces } = ltlDimensions;

    // Validate inputs
    if (length <= 0 || width <= 0 || height <= 0 || weight <= 0) {
      setCalculationMessage("Please enter valid dimensions and weight.");
      setCalculatedFreightClass(""); // Clear freight class if dimensions are invalid
      return;
    }

    // Calculate cubic inches per piece
    const cubicInchesPerPiece = length * width * height;

    // Convert cubic inches to cubic feet
    const cubicFeetPerPiece = cubicInchesPerPiece / 1728; // 1728 cubic inches = 1 cubic foot

    // Calculate total cubic feet
    const totalCubicFeet = cubicFeetPerPiece * pieces;

    // Calculate density (pounds per cubic foot)
    const density = weight / totalCubicFeet;

    // Determine freight class based on density
    let freightClass = "";
    if (density >= 50) freightClass = "50";
    else if (density >= 35) freightClass = "55";
    else if (density >= 30) freightClass = "60";
    else if (density >= 22.5) freightClass = "65";
    else if (density >= 15) freightClass = "70";
    else if (density >= 13.5) freightClass = "77.5";
    else if (density >= 12) freightClass = "85";
    else if (density >= 10.5) freightClass = "92.5";
    else if (density >= 9) freightClass = "100";
    else if (density >= 8) freightClass = "110";
    else if (density >= 7) freightClass = "125";
    else if (density >= 6) freightClass = "150";
    else if (density >= 5) freightClass = "175";
    else if (density >= 4) freightClass = "200";
    else if (density >= 3) freightClass = "250";
    else if (density >= 2) freightClass = "300";
    else if (density >= 1) freightClass = "400";
    else freightClass = "500";

    setCalculatedFreightClass(freightClass);
    setCalculationMessage(`Calculated density: ${density.toFixed(2)} lbs/ft³`);
  };

  // Recalculate freight class when dimensions or weight change
  useEffect(() => {
    if (
      ltlDimensions.length > 0 &&
      ltlDimensions.width > 0 &&
      ltlDimensions.height > 0 &&
      ltlDimensions.weight > 0
    ) {
      calculateFreightClass();
    }
  }, [ltlDimensions]);

  // Handle getting LTL quotes
  const handleGetQuotes = async (e: React.MouseEvent, type: string) => {
    e.preventDefault();

    if (type !== "ltl") return; // Only handle LTL quotes for now

    // Enhanced validation with specific error messages
    const validationErrors = [];
    if (!originZip) validationErrors.push("Origin ZIP Code");
    if (!destinationZip) validationErrors.push("Destination ZIP Code");
    if (!commodity) validationErrors.push("Cargo Description");
    if (!packagingType) validationErrors.push("Packaging Type");
    if (ltlDimensions.length <= 0) validationErrors.push("Length");
    if (ltlDimensions.width <= 0) validationErrors.push("Width");
    if (ltlDimensions.height <= 0) validationErrors.push("Height");
    if (ltlDimensions.weight <= 0) validationErrors.push("Weight");
    if (!calculatedFreightClass) validationErrors.push("Freight Class");

    if (validationErrors.length > 0) {
      setQuoteError(
        `Please fill in all required fields: ${validationErrors.join(", ")}`,
      );
      return;
    }

    setIsLoadingQuotes(true);
    setQuoteError("Fetching quotes, this may take up to 60 seconds...");

    try {
      if (type === "ltl") {
        // Direct Xano API call for LTL quotes using the new endpoint
        // Prepare the direct Xano payload
        const directXanoPayload = {
          data: {
            AuthenticationKey: "1a53e00c-4ce6-10ae-c3f3-1acc5d2345fd",
            OriginZipCode: originZip,
            OriginCountry: originCountry,
            DestinationZipCode: destinationZip,
            DestinationCountry: destinationCountry,
            Commodities: [
              {
                HandlingQuantity: String(ltlDimensions.pieces),
                PackagingType: parseInt(packagingType) || 120,
                Length: String(ltlDimensions.length),
                Width: String(ltlDimensions.width),
                Height: String(ltlDimensions.height),
                WeightTotal: String(ltlDimensions.weight),
                HazardousMaterial: selectedAccessorials.includes("HAZMAT"),
                PiecesTotal: String(ltlDimensions.pieces),
                FreightClass: calculatedFreightClass || "70",
                Description: commodity,
                AdditionalMarkings: "",
                UNNumber: "",
                PackingGroup: 0,
              },
            ],
            WeightUnits: "lb",
            DimensionUnits: "in",
            AccessorialCodes:
              selectedAccessorials.length > 0 ? selectedAccessorials : null,
            LegacySupport: false,
            CustomerReferenceNumber: "LTL-" + new Date().getTime(),
          },
        };

        console.log(
          "Sending payload to Xano API:",
          JSON.stringify(directXanoPayload, null, 2),
        );

        // Use the new direct API endpoint
        try {
          const apiUrl =
            "https://xceb-j0mf-bxn3.n7d.xano.io/api:_1QpYC_I/GetRate";
          console.log(`Calling direct API at: ${apiUrl}`);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(directXanoPayload),
          });

          console.log(
            `API response status: ${response.status} ${response.statusText}`,
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error response: ${errorText}`);
            throw new Error(
              `API responded with status: ${response.status} - ${errorText || response.statusText}`,
            );
          }

          const data = await response.json();
          console.log(
            "Direct Xano LTL quote response:",
            JSON.stringify(data, null, 2),
          );

          if (
            data &&
            data.quotes &&
            Array.isArray(data.quotes) &&
            data.quotes.length > 0
          ) {
            // Map the Xano response to the LTLQuoteCarrierRate format
            const mappedQuotes = data.quotes.map((quote: any) => ({
              carrier_id: quote.carrier_id || String(quote.id) || "",
              carrier_name: quote.carrier_name || "",
              carrier_scac: quote.carrier_scac || "",
              service_level: quote.service_level || "Standard",
              transit_days: quote.transit_days || 0,
              total_cost: quote.total_cost || 0,
              currency: quote.currency || "USD",
              expiration_date:
                quote.expiration_date ||
                new Date(Date.now() + 86400000).toISOString(),
              quote_id: quote.quote_id || String(quote.id) || "",
              price_breakdown: {
                linehaul: quote.price_breakdown?.base_rate || 0,
                fuel_surcharge: quote.price_breakdown?.fuel_surcharge || 0,
                accessorials: quote.price_breakdown?.accessorials || 0,
              },
            }));

            console.log(`Successfully mapped ${mappedQuotes.length} quotes`);
            setQuoteResults(mappedQuotes);
            setShowQuotes(true);
            setShowXanoQuotes(false);
            setQuoteError(""); // Clear any error message
          } else {
            console.warn("API returned no quotes:", data);
            if (data && data.message) {
              setQuoteError(`No quotes available: ${data.message}`);
            } else if (data && data.error) {
              setQuoteError(`Error: ${data.error}`);
            } else {
              setQuoteError(
                "No quotes available for the provided details. Please check your shipment information and try again.",
              );
            }
          }
        } catch (apiError: any) {
          console.error("Error calling Xano API directly:", apiError);

          // Fall back to the edge function if direct API call fails
          console.log("Falling back to edge function...");
          setQuoteError("Direct API call failed. Trying backup method...");

          try {
            // Supabase edge function call removed
            const data = { quotes: [] }; // Placeholder for removed functionality
            console.log("Edge function fallback removed");

            console.log(
              "Edge function LTL quote response:",
              JSON.stringify(data, null, 2),
            );

            if (
              data &&
              data.quotes &&
              Array.isArray(data.quotes) &&
              data.quotes.length > 0
            ) {
              // Map the response to the LTLQuoteCarrierRate format
              const mappedQuotes = data.quotes.map((quote: any) => ({
                carrier_id: quote.carrier_id || String(quote.id) || "",
                carrier_name: quote.carrier_name || "",
                carrier_scac: quote.carrier_scac || "",
                service_level: quote.service_level || "Standard",
                transit_days: quote.transit_days || 0,
                total_cost: quote.total_cost || 0,
                currency: quote.currency || "USD",
                expiration_date:
                  quote.expiration_date ||
                  new Date(Date.now() + 86400000).toISOString(),
                quote_id: quote.quote_id || String(quote.id) || "",
                price_breakdown: {
                  linehaul: quote.price_breakdown?.base_rate || 0,
                  fuel_surcharge: quote.price_breakdown?.fuel_surcharge || 0,
                  accessorials: quote.price_breakdown?.accessorials || 0,
                },
              }));

              console.log(
                `Successfully mapped ${mappedQuotes.length} quotes from edge function`,
              );
              setQuoteResults(mappedQuotes);
              setShowQuotes(true);
              setShowXanoQuotes(false);
              setQuoteError(""); // Clear any error message
            } else {
              console.warn("Edge function returned no quotes:", data);
              if (data && data.message) {
                setQuoteError(`No quotes available: ${data.message}`);
              } else if (data && data.error) {
                setQuoteError(`Error: ${data.error}`);
              } else {
                setQuoteError(
                  "No quotes available from backup method. Please check your shipment information and try again.",
                );
                
              }
            }
          } catch (edgeFunctionError: any) {
            console.error("Edge function failed:", edgeFunctionError);
            throw new Error(
              `Backup method failed: ${edgeFunctionError.message}`,
            );
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching quotes:", error);
      setQuoteError(
        `An error occurred while fetching quotes: ${error.message || "Please try again."}`,
      );
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  


  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Road Freight Quote</h1>

      <Tabs defaultValue="ltl">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="ltl">LTL</TabsTrigger>
          <TabsTrigger value="ftl">FTL</TabsTrigger>
          <TabsTrigger value="expedited">Expedited</TabsTrigger>
        </TabsList>

        <TabsContent value="ltl" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>LTL Quote Request</CardTitle>
              <CardDescription>
                Request quotes for Less Than Truckload shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_originZipCode"
                      className="text-sm font-medium"
                    >
                      Origin ZIP Code*
                    </label>
                    <Input
                      id="ltl_originZipCode"
                      placeholder="Enter origin ZIP code"
                      required
                      value={originZip}
                      onChange={(e) => {
                        const value = e.target.value;
                        setOriginZip(value);
                        if (value.length === 5) {
                          // Lookup ZIP code when 5 digits are entered
                          lookupZipCode(value).then((response) => {
                            if (response && response.success) {
                              setOriginCity(response.city);
                              setOriginState(response.state);
                            }
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_originCountry"
                      className="text-sm font-medium"
                    >
                      Origin Country*
                    </label>
                    <select
                      id="ltl_originCountry"
                      className="w-full p-2 border rounded-md"
                      value={originCountry}
                      onChange={(e) => setOriginCountry(e.target.value)}
                    >
                      <option value="1">United States</option>
                      <option value="2">Canada</option>
                      <option value="3">Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_originCity"
                      className="text-sm font-medium"
                    >
                      Origin City
                    </label>
                    <Input
                      id="ltl_originCity"
                      placeholder="City name (auto-filled)"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_originState"
                      className="text-sm font-medium"
                    >
                      Origin State
                    </label>
                    <Input
                      id="ltl_originState"
                      placeholder="State code (auto-filled)"
                      value={originState}
                      onChange={(e) => setOriginState(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_destinationZipCode"
                      className="text-sm font-medium"
                    >
                      Destination ZIP Code*
                    </label>
                    <Input
                      id="ltl_destinationZipCode"
                      placeholder="Enter destination ZIP code"
                      required
                      value={destinationZip}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDestinationZip(value);
                        if (value.length === 5) {
                          // Lookup ZIP code when 5 digits are entered
                          lookupZipCode(value).then((response) => {
                            if (response && response.success) {
                              setDestinationCity(response.city);
                              setDestinationState(response.state);
                            }
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_destinationCountry"
                      className="text-sm font-medium"
                    >
                      Destination Country*
                    </label>
                    <select
                      id="ltl_destinationCountry"
                      className="w-full p-2 border rounded-md"
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                    >
                      <option value="1">United States</option>
                      <option value="2">Canada</option>
                      <option value="3">Mexico</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_destinationState"
                      className="text-sm font-medium"
                    >
                      Destination State
                    </label>
                    <Input
                      id="ltl_destinationState"
                      placeholder="State code (auto-filled)"
                      value={destinationState}
                      onChange={(e) => setDestinationState(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_destinationCity"
                      className="text-sm font-medium"
                    >
                      Destination City
                    </label>
                    <Input
                      id="ltl_destinationCity"
                      placeholder="City name (auto-filled)"
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ltl_commodity"
                    className="text-sm font-medium"
                  >
                    Cargo Description*
                  </label>
                  <Input
                    id="ltl_commodity"
                    placeholder="Describe your cargo"
                    required
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ltl_pieces" className="text-sm font-medium">
                      Number of Pieces*
                    </label>
                    <Input
                      id="ltl_pieces"
                      type="number"
                      min="1"
                      placeholder="Enter number of pieces"
                      required
                      value={ltlDimensions.pieces || ""}
                      onChange={handleDimensionChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_pallets"
                      className="text-sm font-medium"
                    >
                      Number of Pallets*
                    </label>
                    <Input
                      id="ltl_pallets"
                      type="number"
                      min="1"
                      placeholder="Enter number of pallets"
                      required
                      value={pallets || ""}
                      onChange={(e) =>
                        setPallets(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ltl_packaging"
                      className="text-sm font-medium"
                    >
                      Packaging Type*
                    </label>
                    <select
                      id="ltl_packaging"
                      className="w-full p-2 border rounded-md"
                      value={packagingType}
                      onChange={(e) => setPackagingType(e.target.value)}
                    >
                      <option value="">Select Packaging Type</option>
                      <option value="120">Pallets</option>
                      <option value="130">Boxes</option>
                      <option value="140">Crates</option>
                      <option value="150">Drums</option>
                      <option value="160">Rolls</option>
                      <option value="170">Bundles</option>
                      <option value="180">Other</option>
                    </select>
                  </div>
                </div>

                {/* Dimensions section - moved before freight class */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ltl_length" className="text-sm font-medium">
                      Length (in)*
                    </label>
                    <Input
                      id="ltl_length"
                      type="number"
                      min="0"
                      placeholder="Enter length"
                      required
                      value={ltlDimensions.length || ""}
                      onChange={handleDimensionChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ltl_width" className="text-sm font-medium">
                      Width (in)*
                    </label>
                    <Input
                      id="ltl_width"
                      type="number"
                      min="0"
                      placeholder="Enter width"
                      required
                      value={ltlDimensions.width || ""}
                      onChange={handleDimensionChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ltl_height" className="text-sm font-medium">
                      Height (in)*
                    </label>
                    <Input
                      id="ltl_height"
                      type="number"
                      min="0"
                      placeholder="Enter height"
                      required
                      value={ltlDimensions.height || ""}
                      onChange={handleDimensionChange}
                    />
                  </div>
                </div>

                {/* Freight class and weight section - moved after dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="ltl_class" className="text-sm font-medium">
                      Freight Class*
                    </label>
                    <div className="flex space-x-2">
                      <select
                        id="ltl_class"
                        className="w-full p-2 border rounded-md"
                        value={calculatedFreightClass}
                        onChange={(e) =>
                          setCalculatedFreightClass(e.target.value)
                        }
                      >
                        <option value="">Select Freight Class</option>
                        <option value="50">Class 50</option>
                        <option value="55">Class 55</option>
                        <option value="60">Class 60</option>
                        <option value="65">Class 65</option>
                        <option value="70">Class 70</option>
                        <option value="77.5">Class 77.5</option>
                        <option value="85">Class 85</option>
                        <option value="92.5">Class 92.5</option>
                        <option value="100">Class 100</option>
                        <option value="110">Class 110</option>
                        <option value="125">Class 125</option>
                        <option value="150">Class 150</option>
                        <option value="175">Class 175</option>
                        <option value="200">Class 200</option>
                        <option value="250">Class 250</option>
                        <option value="300">Class 300</option>
                        <option value="400">Class 400</option>
                        <option value="500">Class 500</option>
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={calculateFreightClass}
                        title="Calculate Freight Class"
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </div>
                    {calculationMessage && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculationMessage}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ltl_weight" className="text-sm font-medium">
                      Total Weight (lbs)*
                    </label>
                    <Input
                      id="ltl_weight"
                      type="number"
                      min="0"
                      placeholder="Enter weight in lbs"
                      required
                      value={ltlDimensions.weight || ""}
                      onChange={handleDimensionChange}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Accessorial Services
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select any additional services you require for this
                    shipment:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        Origin Services
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_liftgate_pickup"
                            value="LIFT_PICKUP"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "LIFT_PICKUP",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_liftgate_pickup">
                            Liftgate at Pickup
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_inside_pickup"
                            value="INSIDE_PICKUP"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "INSIDE_PICKUP",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_inside_pickup">
                            Inside Pickup
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_residential_pickup"
                            value="RES_PICKUP"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "RES_PICKUP",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_residential_pickup">
                            Residential Pickup
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_limited_access_pickup"
                            value="LIMITED_PICKUP"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "LIMITED_PICKUP",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_limited_access_pickup">
                            Limited Access Pickup
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        Destination Services
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_liftgate_delivery"
                            value="LIFT_DELIVERY"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "LIFT_DELIVERY",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_liftgate_delivery">
                            Liftgate at Delivery
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_inside_delivery"
                            value="INSIDE_DELIVERY"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "INSIDE_DELIVERY",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_inside_delivery">
                            Inside Delivery
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_residential_delivery"
                            value="RES_DELIVERY"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "RES_DELIVERY",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_residential_delivery">
                            Residential Delivery
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ltl_limited_access_delivery"
                            value="LIMITED_DELIVERY"
                            className="mr-2"
                            checked={selectedAccessorials.includes(
                              "LIMITED_DELIVERY",
                            )}
                            onChange={handleAccessorialChange}
                          />
                          <label htmlFor="ltl_limited_access_delivery">
                            Limited Access Delivery
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="text-md font-medium mb-2">
                      Additional Services
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_hazmat"
                          value="HAZMAT"
                          className="mr-2"
                          checked={selectedAccessorials.includes("HAZMAT")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_hazmat">Hazardous Materials</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_temp_control"
                          value="TEMP"
                          className="mr-2"
                          checked={selectedAccessorials.includes("TEMP")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_temp_control">
                          Temperature Control
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_sort_segregate"
                          value="SORT"
                          className="mr-2"
                          checked={selectedAccessorials.includes("SORT")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_sort_segregate">
                          Sort and Segregate
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2 mt-8">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_expedited"
                          value="EXPEDITED"
                          className="mr-2"
                          checked={selectedAccessorials.includes("EXPEDITED")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_expedited">Expedited Service</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_guaranteed"
                          value="GUARANTEED"
                          className="mr-2"
                          checked={selectedAccessorials.includes("GUARANTEED")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_guaranteed">
                          Guaranteed Delivery
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ltl_appointment"
                          value="APPOINTMENT"
                          className="mr-2"
                          checked={selectedAccessorials.includes("APPOINTMENT")}
                          onChange={handleAccessorialChange}
                        />
                        <label htmlFor="ltl_appointment">
                          Delivery Appointment
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {quoteError && (
                  <Alert
                    variant={
                      quoteError.includes("Fetching quotes")
                        ? "default"
                        : "destructive"
                    }
                    className="mt-4"
                  >
                    {quoteError.includes("Fetching quotes") ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{quoteError}</AlertDescription>
                  </Alert>
                )}

                <div className="text-center mt-6">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={(e) => handleGetQuotes(e, "ltl")}
                    disabled={isLoadingQuotes}
                  >
                    {isLoadingQuotes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Quotes...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Get LTL Quotes
                      </>
                    )}
                  </Button>
                </div>

                {/* Display quote results when available */}
                {showQuotes && (
                  <div className="mt-8">
                    <QuoteResults
                      quotes={quoteResults}
                      onBookShipment={(quoteId, carrierId) => {
                        alert(
                          `Booking shipment with quote ID: ${quoteId} and carrier ID: ${carrierId}`,
                        );
                      }}
                      isLoading={isLoadingQuotes}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ftl" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>FTL Quote Request</CardTitle>
              <CardDescription>
                Request quotes for Full Truckload shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ftl_originZipCode"
                      className="text-sm font-medium"
                    >
                      Origin ZIP Code*
                    </label>
                    <Input
                      id="ftl_originZipCode"
                      placeholder="Enter origin ZIP code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ftl_originCountry"
                      className="text-sm font-medium"
                    >
                      Origin Country*
                    </label>
                    <select
                      id="ftl_originCountry"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="1">United States</option>
                      <option value="2">Canada</option>
                      <option value="3">Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ftl_destinationZipCode"
                      className="text-sm font-medium"
                    >
                      Destination ZIP Code*
                    </label>
                    <Input
                      id="ftl_destinationZipCode"
                      placeholder="Enter destination ZIP code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ftl_destinationCountry"
                      className="text-sm font-medium"
                    >
                      Destination Country*
                    </label>
                    <select
                      id="ftl_destinationCountry"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="1">United States</option>
                      <option value="2">Canada</option>
                      <option value="3">Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="equipment_type"
                      className="text-sm font-medium"
                    >
                      Equipment Type*
                    </label>
                    <select
                      id="equipment_type"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="VAN">Dry Van (53')</option>
                      <option value="REEFER">Refrigerated</option>
                      <option value="FLATBED">Flatbed</option>
                      <option value="STEPDECK">Step Deck</option>
                      <option value="CONESTOGA">Conestoga</option>
                      <option value="HOTSHOT">Hotshot</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ftl_weight" className="text-sm font-medium">
                      Total Weight (approx.)*
                    </label>
                    <Input
                      id="ftl_weight"
                      type="number"
                      min="0"
                      placeholder="Enter weight in lbs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ftl_commodity"
                    className="text-sm font-medium"
                  >
                    Cargo Description*
                  </label>
                  <Input
                    id="ftl_commodity"
                    placeholder="Describe your cargo"
                    required
                  />
                </div>

                <div className="text-center mt-6">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={(e) => handleGetQuotes(e, "ftl")}
                    disabled={isLoadingQuotes}
                  >
                    {isLoadingQuotes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Quotes...
                      </>
                    ) : (
                      <>
                        <Truck className="mr-2 h-4 w-4" />
                        Get FTL Quotes
                      </>
                    )}
                  </Button>
                </div>

                {/* Display Xano quote results when available */}
                {showXanoQuotes && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                      Available FTL Quotes (Xano API)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {xanoQuoteResults.map((quote) => (
                        <Card
                          key={quote.quote_id}
                          className="flex flex-col h-full"
                        >
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
                                <span className="text-sm font-medium">
                                  Service Level:
                                </span>
                                <span className="text-sm">
                                  {quote.service_level}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                  Transit Days:
                                </span>
                                <span className="text-sm">
                                  {quote.transit_days} days
                                </span>
                              </div>
                              {quote.estimated_delivery_date && (
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">
                                    Est. Delivery:
                                  </span>
                                  <span className="text-sm">
                                    {new Date(
                                      quote.estimated_delivery_date,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {quote.price_breakdown?.base_rate && (
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">
                                    Base Rate:
                                  </span>
                                  <span className="text-sm">
                                    $
                                    {Number(
                                      quote.price_breakdown.base_rate,
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {quote.price_breakdown?.fuel_surcharge && (
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">
                                    Fuel Surcharge:
                                  </span>
                                  <span className="text-sm">
                                    $
                                    {Number(
                                      quote.price_breakdown.fuel_surcharge,
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-sm font-medium">
                                  Total:
                                </span>
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
                                alert(
                                  `Booking shipment with quote ID: ${quote.quote_id} and carrier ID: ${quote.carrier_id}`,
                                )
                              }
                            >
                              Book Shipment
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expedited" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Expedited Quote Request</CardTitle>
              <CardDescription>
                Request quotes for expedited road freight services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Expedited quote form will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadFreightQuote;
