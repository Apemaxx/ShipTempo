import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase-client";
import axios from "axios";

interface QuoteFormData {
  customerCompany: string;
  customerContact: string;
  customerEmail: string;
  customerPhone: string;
  shipmentType: "door-to-door" | "door-to-port" | "port-to-door";
  originAddress: string;
  originCity: string;
  originState: string;
  originZip: string;
  originCountry: string;
  originLat?: number;
  originLng?: number;
  originPortCode?: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  destinationCountry: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationPortCode?: string;
  packageType: string;
  weight: number;
  weightUnit: "kg" | "lbs";
  length: number;
  width: number;
  height: number;
  dimensionUnit: "cm" | "in";
  volume?: number;
  volumeUnit: "cbm" | "cft";
  commodityDescription: string;
  hsCode?: string;
  cargoValue?: number;
  valueCurrency: string;
  specialRequirements?: string[];
  pickupDate: Date;
  deliveryDate?: Date;
  insuranceRequired: boolean;
  additionalServices: string[];
}

interface XanoRateRequest {
  origin_address: string;
  destination_address: string;
  origin_zip: string;
  destination_zip: string;
  origin_country: string;
  destination_country: string;
  service_type: string;
  package_type: string;
  weight: number;
  weight_unit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  commodity_description: string;
  hs_code?: string;
  special_requirements: string[];
  insurance_required: boolean;
  additional_services: string[];
  pickup_date: string;
  delivery_date?: string;
  reference_number: string;
}

interface XanoRateResponse {
  vendor: string;
  price: number;
  currency: string;
  transit_time_days: number;
  conditions: string;
  quote_id: string;
}

const FreightRateQuoteForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("shipment-info");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [quoteId, setQuoteId] = useState(
    `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [rateQuotes, setRateQuotes] = useState<XanoRateResponse[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>({
    defaultValues: {
      shipmentType: "door-to-door",
      weightUnit: "kg",
      dimensionUnit: "cm",
      volumeUnit: "cbm",
      valueCurrency: "USD",
      specialRequirements: [],
      additionalServices: [],
      insuranceRequired: false,
      pickupDate: new Date(),
    },
  });

  const shipmentType = watch("shipmentType");
  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const height = watch("height") || 0;
  const dimensionUnit = watch("dimensionUnit");

  // Calculate volume when dimensions change
  useEffect(() => {
    if (length && width && height) {
      const volumeValue = length * width * height;
      const convertedVolume =
        dimensionUnit === "cm"
          ? volumeValue / 1000000 // Convert cubic cm to cbm
          : volumeValue / 1728; // Convert cubic inches to cubic feet

      setValue("volume", parseFloat(convertedVolume.toFixed(3)));
    }
  }, [length, width, height, dimensionUnit, setValue]);

  // Load Google Maps API
  useEffect(() => {
    if (!googleMapsLoaded && typeof window !== "undefined") {
      // In a real implementation, you would use your actual API key
      const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
        initializeAutocomplete();
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else if (googleMapsLoaded) {
      initializeAutocomplete();
    }
  }, [googleMapsLoaded]);

  const initializeAutocomplete = () => {
    if (typeof google !== "undefined") {
      // Origin address autocomplete
      const originInput = document.getElementById("origin-address");
      if (originInput) {
        const originAutocomplete = new google.maps.places.Autocomplete(
          originInput as HTMLInputElement,
        );
        originAutocomplete.addListener("place_changed", function () {
          const place = originAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            setValue("originLat", place.geometry.location.lat());
            setValue("originLng", place.geometry.location.lng());

            // Extract address components
            place.address_components?.forEach((component) => {
              const types = component.types;
              if (types.includes("locality")) {
                setValue("originCity", component.long_name);
              } else if (types.includes("administrative_area_level_1")) {
                setValue("originState", component.short_name);
              } else if (types.includes("postal_code")) {
                setValue("originZip", component.long_name);
              } else if (types.includes("country")) {
                setValue("originCountry", component.long_name);
              }
            });
          }
        });
      }

      // Destination address autocomplete
      const destInput = document.getElementById("destination-address");
      if (destInput) {
        const destAutocomplete = new google.maps.places.Autocomplete(
          destInput as HTMLInputElement,
        );
        destAutocomplete.addListener("place_changed", function () {
          const place = destAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            setValue("destinationLat", place.geometry.location.lat());
            setValue("destinationLng", place.geometry.location.lng());

            // Extract address components
            place.address_components?.forEach((component) => {
              const types = component.types;
              if (types.includes("locality")) {
                setValue("destinationCity", component.long_name);
              } else if (types.includes("administrative_area_level_1")) {
                setValue("destinationState", component.short_name);
              } else if (types.includes("postal_code")) {
                setValue("destinationZip", component.long_name);
              } else if (types.includes("country")) {
                setValue("destinationCountry", component.long_name);
              }
            });
          }
        });
      }
    }
  };

  const calculateDistance = () => {
    if (
      typeof google !== "undefined" &&
      watch("originLat") &&
      watch("originLng") &&
      watch("destinationLat") &&
      watch("destinationLng")
    ) {
      const service = new google.maps.DistanceMatrixService();
      const originCoords = new google.maps.LatLng(
        watch("originLat"),
        watch("originLng"),
      );
      const destCoords = new google.maps.LatLng(
        watch("destinationLat"),
        watch("destinationLng"),
      );

      service.getDistanceMatrix(
        {
          origins: [originCoords],
          destinations: [destCoords],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        function (response, status) {
          if (status === "OK" && response) {
            const distance = response.rows[0].elements[0].distance.value;
            console.log(`Distance: ${distance / 1000} km`);
            // You can use this distance for local delivery pricing
          }
        },
      );
    }
  };

  const getXanoRates = async (data: QuoteFormData) => {
    setApiError(null);
    try {
      // Prepare the Xano API request payload
      const xanoRequest: XanoRateRequest = {
        origin_address: `${data.originAddress}, ${data.originCity}, ${data.originState}, ${data.originZip}`,
        destination_address: `${data.destinationAddress}, ${data.destinationCity}, ${data.destinationState}, ${data.destinationZip}`,
        origin_zip: data.originZip,
        destination_zip: data.destinationZip,
        origin_country: data.originCountry,
        destination_country: data.destinationCountry,
        service_type: data.shipmentType,
        package_type: data.packageType,
        weight: data.weight,
        weight_unit: data.weightUnit,
        dimensions: {
          length: data.length,
          width: data.width,
          height: data.height,
          unit: data.dimensionUnit,
        },
        commodity_description: data.commodityDescription,
        hs_code: data.hsCode,
        special_requirements: data.specialRequirements || [],
        insurance_required: data.insuranceRequired,
        additional_services: data.additionalServices,
        pickup_date: data.pickupDate.toISOString(),
        delivery_date: data.deliveryDate
          ? data.deliveryDate.toISOString()
          : undefined,
        reference_number: quoteId,
      };

      console.log(
        "Sending request to Xano API:",
        JSON.stringify(xanoRequest, null, 2),
      );

      // Make the POST request to Xano API
      const response = await axios.post(
        "https://xceb-j0mf-bxn3.n7d.xano.io/api:_1QpYC_I/freight_rates",
        xanoRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Key": "1a53e00c-4ce6-10ae-c3f3-1acc5d2345fd",
          },
        },
      );

      // Handle successful response
      console.log("Xano API response:", response.data);
      if (Array.isArray(response.data)) {
        setRateQuotes(response.data);
      } else if (response.data) {
        setRateQuotes([response.data]);
      } else {
        setRateQuotes([]);
        setApiError("No quotes available for the provided details");
      }

      return response.data;
    } catch (error) {
      console.error("Xano API error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = `Xano API error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`;
        setApiError(errorMessage);
      } else {
        setApiError("Failed to fetch rates. Please try again.");
      }
      return null;
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    try {
      // Calculate distance if not already done
      calculateDistance();

      // Get rates from Xano API
      const ratesResponse = await getXanoRates(data);

      // Prepare the quote request data
      const quoteRequest = {
        quoteId,
        customer: {
          company: data.customerCompany,
          contact: data.customerContact,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        origin: {
          address: data.originAddress,
          city: data.originCity,
          state: data.originState,
          zip: data.originZip,
          country: data.originCountry,
          coordinates:
            data.originLat && data.originLng
              ? {
                  lat: data.originLat,
                  lng: data.originLng,
                }
              : undefined,
          portCode: data.originPortCode,
        },
        destination: {
          address: data.destinationAddress,
          city: data.destinationCity,
          state: data.destinationState,
          zip: data.destinationZip,
          country: data.destinationCountry,
          coordinates:
            data.destinationLat && data.destinationLng
              ? {
                  lat: data.destinationLat,
                  lng: data.destinationLng,
                }
              : undefined,
          portCode: data.destinationPortCode,
        },
        cargo: {
          packageType: data.packageType,
          weight: data.weight,
          weightUnit: data.weightUnit,
          dimensions: {
            length: data.length,
            width: data.width,
            height: data.height,
            unit: data.dimensionUnit,
          },
          volume: data.volume,
          volumeUnit: data.volumeUnit,
          commodity: data.commodityDescription,
          hsCode: data.hsCode,
          value: data.cargoValue,
          valueCurrency: data.valueCurrency,
          specialRequirements: data.specialRequirements,
        },
        service: {
          type: data.shipmentType,
          pickupDate: data.pickupDate.toISOString(),
          deliveryDate: data.deliveryDate
            ? data.deliveryDate.toISOString()
            : undefined,
          insurance: data.insuranceRequired,
          additionalServices: data.additionalServices,
        },
        rates: ratesResponse || [],
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      // Store the quote in Supabase
      const { data: savedQuote, error } = await supabase
        .from("freight_quotes")
        .insert([quoteRequest])
        .select();

      if (error) throw error;

      // Navigate to the quote results page
      navigate(`/quotes/response/${quoteId}`);
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Failed to submit quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextTab = () => {
    if (activeTab === "shipment-info") setActiveTab("locations");
    else if (activeTab === "locations") setActiveTab("cargo");
    else if (activeTab === "cargo") setActiveTab("services");
  };

  const prevTab = () => {
    if (activeTab === "services") setActiveTab("cargo");
    else if (activeTab === "cargo") setActiveTab("locations");
    else if (activeTab === "locations") setActiveTab("shipment-info");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Freight Rate Quote</h1>
        <div className="text-sm text-muted-foreground">
          Quote ID: <span className="font-medium">{quoteId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shipment-info">Shipment Info</TabsTrigger>
            <TabsTrigger value="locations">Origin & Destination</TabsTrigger>
            <TabsTrigger value="cargo">Cargo Details</TabsTrigger>
            <TabsTrigger value="services">Service Requirements</TabsTrigger>
          </TabsList>

          {/* Shipment Info Tab */}
          <TabsContent value="shipment-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerCompany">Company Name</Label>
                    <Input
                      id="customerCompany"
                      {...register("customerCompany", {
                        required: "Company name is required",
                      })}
                      placeholder="Enter company name"
                    />
                    {errors.customerCompany && (
                      <p className="text-sm text-red-500">
                        {errors.customerCompany.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerContact">Contact Person</Label>
                    <Input
                      id="customerContact"
                      {...register("customerContact", {
                        required: "Contact person is required",
                      })}
                      placeholder="Enter contact name"
                    />
                    {errors.customerContact && (
                      <p className="text-sm text-red-500">
                        {errors.customerContact.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      {...register("customerEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Enter email address"
                    />
                    {errors.customerEmail && (
                      <p className="text-sm text-red-500">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      {...register("customerPhone", {
                        required: "Phone number is required",
                      })}
                      placeholder="Enter phone number"
                    />
                    {errors.customerPhone && (
                      <p className="text-sm text-red-500">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipment Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="shipmentType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="door-to-door"
                          id="door-to-door"
                        />
                        <Label htmlFor="door-to-door">Door to Door</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="door-to-port"
                          id="door-to-port"
                        />
                        <Label htmlFor="door-to-port">Door to Port</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="port-to-door"
                          id="port-to-door"
                        />
                        <Label htmlFor="port-to-door">Port to Door</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="button" onClick={nextTab}>
                Next: Origin & Destination
              </Button>
            </div>
          </TabsContent>

          {/* Origin & Destination Tab */}
          <TabsContent value="locations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <Card>
                <CardHeader>
                  <CardTitle>Origin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin-address">Address</Label>
                    <div className="relative">
                      <Input
                        id="origin-address"
                        {...register("originAddress", {
                          required: "Origin address is required",
                        })}
                        placeholder="Enter origin address"
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    {errors.originAddress && (
                      <p className="text-sm text-red-500">
                        {errors.originAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originCity">City</Label>
                      <Input
                        id="originCity"
                        {...register("originCity", {
                          required: "City is required",
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originState">State/Province</Label>
                      <Input
                        id="originState"
                        {...register("originState", {
                          required: "State is required",
                        })}
                        placeholder="State/Province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originZip">ZIP/Postal Code</Label>
                      <Input
                        id="originZip"
                        {...register("originZip", {
                          required: "ZIP code is required",
                        })}
                        placeholder="ZIP/Postal Code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originCountry">Country</Label>
                      <Input
                        id="originCountry"
                        {...register("originCountry", {
                          required: "Country is required",
                        })}
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  {shipmentType === "port-to-door" && (
                    <div className="space-y-2">
                      <Label htmlFor="originPortCode">Port Code</Label>
                      <Input
                        id="originPortCode"
                        {...register("originPortCode", {
                          required:
                            shipmentType === "port-to-door"
                              ? "Port code is required"
                              : false,
                        })}
                        placeholder="Enter port code"
                      />
                      {errors.originPortCode && (
                        <p className="text-sm text-red-500">
                          {errors.originPortCode.message}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Destination */}
              <Card>
                <CardHeader>
                  <CardTitle>Destination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination-address">Address</Label>
                    <div className="relative">
                      <Input
                        id="destination-address"
                        {...register("destinationAddress", {
                          required: "Destination address is required",
                        })}
                        placeholder="Enter destination address"
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    {errors.destinationAddress && (
                      <p className="text-sm text-red-500">
                        {errors.destinationAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destinationCity">City</Label>
                      <Input
                        id="destinationCity"
                        {...register("destinationCity", {
                          required: "City is required",
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destinationState">State/Province</Label>
                      <Input
                        id="destinationState"
                        {...register("destinationState", {
                          required: "State is required",
                        })}
                        placeholder="State/Province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destinationZip">ZIP/Postal Code</Label>
                      <Input
                        id="destinationZip"
                        {...register("destinationZip", {
                          required: "ZIP code is required",
                        })}
                        placeholder="ZIP/Postal Code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destinationCountry">Country</Label>
                      <Input
                        id="destinationCountry"
                        {...register("destinationCountry", {
                          required: "Country is required",
                        })}
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  {shipmentType === "door-to-port" && (
                    <div className="space-y-2">
                      <Label htmlFor="destinationPortCode">Port Code</Label>
                      <Input
                        id="destinationPortCode"
                        {...register("destinationPortCode", {
                          required:
                            shipmentType === "door-to-port"
                              ? "Port code is required"
                              : false,
                        })}
                        placeholder="Enter port code"
                      />
                      {errors.destinationPortCode && (
                        <p className="text-sm text-red-500">
                          {errors.destinationPortCode.message}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Shipment Info
              </Button>
              <Button type="button" onClick={nextTab}>
                Next: Cargo Details
              </Button>
            </div>
          </TabsContent>

          {/* Cargo Details Tab */}
          <TabsContent value="cargo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageType">Package Type</Label>
                  <Controller
                    name="packageType"
                    control={control}
                    rules={{ required: "Package type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="packageType">
                          <SelectValue placeholder="Select package type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="container-20ft">
                            Container 20ft
                          </SelectItem>
                          <SelectItem value="container-40ft">
                            Container 40ft
                          </SelectItem>
                          <SelectItem value="container-40ft-hc">
                            Container 40ft High Cube
                          </SelectItem>
                          <SelectItem value="lcl">
                            LCL (Less than Container Load)
                          </SelectItem>
                          <SelectItem value="pallets">Pallets</SelectItem>
                          <SelectItem value="boxes">Boxes/Cartons</SelectItem>
                          <SelectItem value="loose">Loose Cargo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.packageType && (
                    <p className="text-sm text-red-500">
                      {errors.packageType.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cargo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        {...register("weight", {
                          required: "Weight is required",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Weight must be greater than 0",
                          },
                        })}
                        placeholder="Enter weight"
                        className="flex-1"
                      />
                      <Controller
                        name="weightUnit"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="lbs">lbs</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    {errors.weight && (
                      <p className="text-sm text-red-500">
                        {errors.weight.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="L"
                        {...register("length", {
                          required: "Length is required",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Length must be greater than 0",
                          },
                        })}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="W"
                        {...register("width", {
                          required: "Width is required",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Width must be greater than 0",
                          },
                        })}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="H"
                        {...register("height", {
                          required: "Height is required",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Height must be greater than 0",
                          },
                        })}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Controller
                        name="dimensionUnit"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="in">in</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.length && (
                        <p className="text-sm text-red-500">
                          {errors.length.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (calculated)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="volume"
                        readOnly
                        {...register("volume")}
                        placeholder="Auto-calculated"
                        className="flex-1 bg-muted"
                      />
                      <Controller
                        name="volumeUnit"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbm">CBM</SelectItem>
                              <SelectItem value="cft">CFT</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cargoValue">
                      Cargo Value (for insurance)
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cargoValue"
                        type="number"
                        step="0.01"
                        {...register("cargoValue", { valueAsNumber: true })}
                        placeholder="Enter cargo value"
                        className="flex-1"
                      />
                      <Controller
                        name="valueCurrency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commodityDescription">
                    Commodity Description
                  </Label>
                  <Textarea
                    id="commodityDescription"
                    {...register("commodityDescription", {
                      required: "Commodity description is required",
                    })}
                    placeholder="Describe the cargo contents"
                  />
                  {errors.commodityDescription && (
                    <p className="text-sm text-red-500">
                      {errors.commodityDescription.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsCode">HS Code (optional)</Label>
                    <Input
                      id="hsCode"
                      {...register("hsCode")}
                      placeholder="Enter HS code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Special Requirements</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="specialRequirements"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="hazardous"
                              checked={field.value?.includes("hazardous")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), "hazardous"]
                                  : (field.value || []).filter(
                                      (value) => value !== "hazardous",
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor="hazardous">Hazardous</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="specialRequirements"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="refrigerated"
                              checked={field.value?.includes("refrigerated")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), "refrigerated"]
                                  : (field.value || []).filter(
                                      (value) => value !== "refrigerated",
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor="refrigerated">Refrigerated</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="specialRequirements"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="fragile"
                              checked={field.value?.includes("fragile")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), "fragile"]
                                  : (field.value || []).filter(
                                      (value) => value !== "fragile",
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor="fragile">Fragile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="specialRequirements"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="oversized"
                              checked={field.value?.includes("oversized")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), "oversized"]
                                  : (field.value || []).filter(
                                      (value) => value !== "oversized",
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          )}
                        />
                        <Label htmlFor="oversized">Oversized</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Origin & Destination
              </Button>
              <Button type="button" onClick={nextTab}>
                Next: Service Requirements
              </Button>
            </div>
          </TabsContent>

          {/* Service Requirements Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Controller
                      control={control}
                      name="pickupDate"
                      rules={{ required: "Pickup date is required" }}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full justify-start text-left font-normal"
                              }
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.pickupDate && (
                      <p className="text-sm text-red-500">
                        {errors.pickupDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">
                      Delivery Date Required (optional)
                    </Label>
                    <Controller
                      control={control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full justify-start text-left font-normal"
                              }
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <= (watch("pickupDate") || new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="insuranceRequired"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="insuranceRequired"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="insuranceRequired">
                      Insurance Required
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Additional Services</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="additionalServices"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="customs-clearance"
                            checked={field.value?.includes("customs-clearance")}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), "customs-clearance"]
                                : (field.value || []).filter(
                                    (value) => value !== "customs-clearance",
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="customs-clearance">
                        Customs Clearance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="additionalServices"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="documentation"
                            checked={field.value?.includes("documentation")}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), "documentation"]
                                : (field.value || []).filter(
                                    (value) => value !== "documentation",
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="documentation">Documentation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="additionalServices"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="packaging"
                            checked={field.value?.includes("packaging")}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), "packaging"]
                                : (field.value || []).filter(
                                    (value) => value !== "packaging",
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="packaging">Packaging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="additionalServices"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="storage"
                            checked={field.value?.includes("storage")}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), "storage"]
                                : (field.value || []).filter(
                                    (value) => value !== "storage",
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="storage">Storage/Warehousing</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              )}

              {rateQuotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rateQuotes.map((quote, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{quote.vendor}</p>
                              <p className="text-sm text-muted-foreground">
                                Transit time: {quote.transit_time_days} days
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {quote.price} {quote.currency}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{quote.conditions}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevTab}>
                  Previous: Cargo Details
                </Button>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => getXanoRates(watch())}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Get Rates
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Quote
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default FreightRateQuoteForm;
